import os
import json
import datetime
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from xgboost import XGBClassifier

def train_college_placement_model():
    csv_path = os.path.join(os.path.dirname(__file__), 'dataset', 'collegePlace.csv')
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Missing dataset at {csv_path}")

    print(f"================================================================")
    print(f" Training on Real Dataset: {csv_path}")
    print(f"================================================================")
    df = pd.read_csv(csv_path)
    print(f"Dataset Size: {df.shape[0]} rows, {df.shape[1]} columns")

    # Features present in real collegePlace.csv
    numeric_features = ['Age', 'Internships', 'CGPA', 'Hostel', 'HistoryOfBacklogs']
    categorical_features = ['Gender', 'Stream']
    target_col = 'PlacedOrNot'

    X = df[numeric_features + categorical_features]
    y = df[target_col]

    # Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Training split: {len(X_train)} samples | Test split: {len(X_test)} samples")
    print(f"Class distribution: Placed={sum(y==1)} ({sum(y==1)/len(y)*100:.1f}%), Not Placed={sum(y==0)} ({sum(y==0)/len(y)*100:.1f}%)")

    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )

    # 1. Random Forest Classifier
    rf_clf = RandomForestClassifier(
        n_estimators=160,
        max_depth=7,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )

    # 2. XGBoost Classifier
    xgb_clf = XGBClassifier(
        n_estimators=120,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        eval_metric='logloss',
        random_state=42,
        n_jobs=-1
    )

    # 3. Soft Voting Ensemble
    ensemble = VotingClassifier(
        estimators=[('rf', rf_clf), ('xgb', xgb_clf)],
        voting='soft'
    )

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', ensemble)
    ])

    print("\nTraining Ensemble (XGBoost + Random Forest)...")
    pipeline.fit(X_train, y_train)

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring='accuracy')
    print(f"5-Fold Cross Validation Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")

    # Test set evaluation
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_prob)

    print("\n=================== TEST SET EVALUATION ===================")
    print(f"Test Accuracy:  {acc * 100:.2f}%")
    print(f"Precision:      {prec * 100:.2f}%")
    print(f"Recall:         {rec * 100:.2f}%")
    print(f"F1-Score:       {f1 * 100:.2f}%")
    print(f"ROC-AUC:        {roc_auc:.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Feature Importances from Random Forest component
    transformed_X = preprocessor.fit_transform(X_train)
    rf_feat = RandomForestClassifier(n_estimators=160, max_depth=7, random_state=42)
    rf_feat.fit(transformed_X, y_train)

    cat_encoder = preprocessor.named_transformers_['cat']
    encoded_cat_names = cat_encoder.get_feature_names_out(categorical_features).tolist()
    all_feature_names = numeric_features + encoded_cat_names

    importances = rf_feat.feature_importances_
    feat_dict = {
        name: round(float(imp) * 100, 2)
        for name, imp in sorted(zip(all_feature_names, importances), key=lambda x: x[1], reverse=True)
    }

    print("\nTop Feature Importances (Weight %):")
    for name, weight in list(feat_dict.items())[:8]:
        print(f"  * {name}: {weight}%")

    # Tier Classifier for estimating package / placement tier
    # Derive tier heuristics for student records
    tier_labels = []
    for idx, row in df.iterrows():
        if row['PlacedOrNot'] == 0:
            tier_labels.append('Unplaced')
        elif row['CGPA'] >= 8 and row['Internships'] >= 1:
            tier_labels.append('Tier 1 Product')
        elif row['CGPA'] >= 7:
            tier_labels.append('Tier 2 Tech')
        else:
            tier_labels.append('Tier 3 Enterprise')

    tier_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=120, max_depth=7, random_state=42))
    ])
    tier_pipeline.fit(X, tier_labels)

    # Save artifacts
    saved_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
    os.makedirs(saved_dir, exist_ok=True)

    artifact = {
        'pipeline': pipeline,
        'tier_pipeline': tier_pipeline,
        'dataset_source': 'collegePlace.csv (Real College Placement Dataset)',
        'samples_count': len(df),
        'numeric_features': numeric_features,
        'categorical_features': categorical_features,
        'all_feature_names': all_feature_names,
        'feature_importances': feat_dict,
        'trained_at': datetime.datetime.now().isoformat(),
        'metrics': {
            'accuracy': round(acc * 100, 2),
            'cv_mean': round(cv_scores.mean() * 100, 2),
            'precision': round(prec * 100, 2),
            'recall': round(rec * 100, 2),
            'f1_score': round(f1 * 100, 2),
            'roc_auc': round(roc_auc, 4)
        }
    }

    joblib_path = os.path.join(saved_dir, 'placement_model.joblib')
    joblib.dump(artifact, joblib_path)
    print(f"\n[OK] Model successfully saved to {joblib_path}")

    metrics_json_path = os.path.join(saved_dir, 'placement_metrics.json')
    with open(metrics_json_path, 'w', encoding='utf-8') as f:
        json.dump(artifact['metrics'], f, indent=2)
    print(f"[OK] Metrics successfully saved to {metrics_json_path}")

    return artifact

if __name__ == '__main__':
    train_college_placement_model()
