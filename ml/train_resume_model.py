import os
import re
import json
import datetime
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics.pairwise import cosine_similarity

SKILL_TAXONOMY = {
    "frontend": [
        "react", "react.js", "vue", "vue.js", "angular", "next.js", "nuxt.js", "typescript",
        "javascript", "html5", "css3", "sass", "tailwind", "tailwind css", "bootstrap",
        "redux", "zustand", "webpack", "vite", "graphql", "responsive design", "ui/ux"
    ],
    "backend": [
        "node.js", "express", "express.js", "python", "django", "flask", "fastapi",
        "java", "spring boot", "c#", ".net", "golang", "go", "ruby", "rails", "php",
        "microservices", "rest api", "restful api", "grpc", "websockets", "socket.io"
    ],
    "database": [
        "mongodb", "postgresql", "postgres", "mysql", "redis", "elasticsearch",
        "dynamodb", "cassandra", "sqlite", "oracle", "prisma", "mongoose", "sql"
    ],
    "cloud_devops": [
        "aws", "amazon web services", "azure", "gcp", "google cloud", "docker",
        "kubernetes", "k8s", "terraform", "ci/cd", "github actions", "jenkins",
        "linux", "nginx", "helm", "serverless", "cloudformation", "ansible"
    ],
    "ai_ml_data": [
        "machine learning", "deep learning", "nlp", "computer vision", "llm",
        "pytorch", "tensorflow", "keras", "scikit-learn", "sklearn", "pandas",
        "numpy", "opencv", "huggingface", "transformers", "xgboost", "spark", "hadoop"
    ],
    "core_cs": [
        "data structures", "algorithms", "dsa", "system design", "object oriented programming",
        "oop", "operating systems", "computer networks", "database management", "dbms"
    ],
    "tools_testing": [
        "git", "github", "gitlab", "postman", "jest", "cypress", "mocha", "selenium",
        "pytest", "junit", "jira", "agile", "scrum", "swagger"
    ]
}

ACTION_VERBS = [
    "accelerated", "achieved", "analyzed", "architected", "automated", "boosted", "built",
    "collaborated", "configured", "created", "decreased", "delivered", "designed", "developed",
    "engineered", "enhanced", "executed", "generated", "implemented", "improved", "increased",
    "initiated", "integrated", "launched", "led", "managed", "migrated", "modernized",
    "optimized", "orchestrated", "overhauled", "refactored", "reduced", "resolved", "scaled",
    "secured", "spearheaded", "standardized", "streamlined", "transformed", "upgraded"
]

ROLE_BENCHMARKS = {
    "Software Engineer (SDE / Full Stack)": """
    Proficient in JavaScript, TypeScript, React, Node.js, Express, HTML5, CSS3, Tailwind.
    Experience with MongoDB, PostgreSQL, SQL, REST APIs, Git, Docker, CI/CD.
    Solid understanding of Data Structures, Algorithms (DSA), System Design, and Agile development.
    Built and deployed scalable web applications with state management using Redux or Zustand.
    """,
    "Backend Engineer (Distributed Systems)": """
    Strong expertise in Java Spring Boot, Python FastAPI, Go, Node.js, Microservices architecture.
    Proficiency in PostgreSQL, MongoDB, Redis caching, message brokers, Kafka, RabbitMQ, gRPC.
    Deep knowledge of Cloud computing on AWS or Azure, Docker, Kubernetes, Linux, Nginx.
    Experience in database indexing, query optimization, high-throughput systems, and Unit testing.
    """,
    "Data Scientist & Machine Learning Engineer": """
    Extensive experience in Python, Pandas, NumPy, Scikit-learn, PyTorch, TensorFlow.
    Hands-on knowledge of Machine Learning, Deep Learning, NLP, Computer Vision, XGBoost.
    Proficient in SQL, Data cleaning, Feature engineering, Model evaluation, and Statistics.
    Experience deploying models via FastAPI, Docker, and MLflow or cloud ML platforms.
    """,
    "DevOps & Cloud Infrastructure Engineer": """
    Expertise in AWS, Azure, GCP, Linux administration, Bash scripting, Python.
    Production experience with Docker containerization, Kubernetes orchestration, Helm, Terraform (IaC).
    CI/CD pipeline implementation using GitHub Actions, Jenkins, Git.
    Monitoring and observability with Prometheus, Grafana, ELK stack, Nginx configuration, Security best practices.
    """
}

def clean_resume_text(text):
    if not isinstance(text, str):
        return ""
    # remove URLs
    text = re.sub(r'http\S+\s*', ' ', text)
    # remove RT and cc
    text = re.sub(r'\b(RT|cc)\b', ' ', text)
    # remove hashtags
    text = re.sub(r'#\S+', ' ', text)
    # remove mentions
    text = re.sub(r'@\S+', ' ', text)
    # remove punctuations
    text = re.sub(r'[!\"#$%&\'()*+,\-./:;<=>?@\[\\\]^_`{|}~]', ' ', text)
    # remove non-ASCII
    text = re.sub(r'[^\x00-\x7f]', ' ', text)
    # normalize spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()

def train_resume_nlp_pipeline():
    print("================================================================")
    print(" Training NLP Resume Intelligence Engine on UpdatedResumeDataSet")
    print("================================================================")

    data_path = os.path.join(os.path.dirname(__file__), 'dataset', 'UpdatedResumeDataSet.csv')
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    df = pd.read_csv(data_path)
    print(f"Loaded dataset: {df.shape[0]} resumes across {df['Category'].nunique()} categories.")

    df['CleanedResume'] = df['Resume'].apply(clean_resume_text)

    # 1. Stratified Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        df['CleanedResume'],
        df['Category'],
        test_size=0.2,
        random_state=42,
        stratify=df['Category']
    )
    print(f"Training set: {len(X_train)} samples, Test set: {len(X_test)} samples.")

    # 2. Fit TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        stop_words='english',
        sublinear_tf=True,
        max_features=4000
    )

    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    vocab_size = len(vectorizer.vocabulary_)
    print(f"TF-IDF Vectorizer fitted with {vocab_size} feature terms.")

    # 3. Train Classifier for Resume Domain Prediction
    classifier = LogisticRegression(max_iter=1000, C=1.0)
    classifier.fit(X_train_vec, y_train)

    y_pred = classifier.predict(X_test_vec)
    test_acc = accuracy_score(y_test, y_pred)
    test_prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    test_rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    test_f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    print("----------------------------------------------------------------")
    print(f"Test Accuracy  : {test_acc * 100:.2f}%")
    print(f"Test Precision : {test_prec * 100:.2f}%")
    print(f"Test Recall    : {test_rec * 100:.2f}%")
    print(f"Test F1 Score  : {test_f1 * 100:.2f}%")
    print("----------------------------------------------------------------")

    # 4. Compute Empirical Category Centroid Vectors
    all_cleaned = df['CleanedResume'].tolist()
    all_vecs = vectorizer.transform(all_cleaned)
    feature_names = np.array(vectorizer.get_feature_names_out())

    category_centroids = {}
    category_top_keywords = {}
    categories = sorted(df['Category'].unique().tolist())

    for cat in categories:
        cat_indices = df.index[df['Category'] == cat].tolist()
        cat_matrix = all_vecs[cat_indices]
        centroid = np.asarray(cat_matrix.mean(axis=0)).flatten()
        norm = np.linalg.norm(centroid)
        if norm > 0:
            centroid = centroid / norm
        category_centroids[cat] = centroid

        # Top 10 characteristic terms for this category
        top_indices = np.argsort(centroid)[-10:][::-1]
        category_top_keywords[cat] = feature_names[top_indices].tolist()

    # 5. Pre-vectorize Synthetic Role Benchmarks for fallback
    role_vectors = {}
    for role, text in ROLE_BENCHMARKS.items():
        role_vectors[role] = vectorizer.transform([clean_resume_text(text)])

    # 6. Save Artifacts
    saved_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
    os.makedirs(saved_dir, exist_ok=True)

    metrics_data = {
        "dataset_name": "UpdatedResumeDataSet.csv",
        "samples_count": int(df.shape[0]),
        "categories_count": int(len(categories)),
        "categories": categories,
        "accuracy": round(float(test_acc * 100), 2),
        "precision": round(float(test_prec * 100), 2),
        "recall": round(float(test_rec * 100), 2),
        "f1_score": round(float(test_f1 * 100), 2),
        "trained_at": datetime.datetime.now().isoformat()
    }

    metrics_path = os.path.join(saved_dir, 'resume_metrics.json')
    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"[OK] Saved Resume Metrics to: {metrics_path}")

    model_artifact = {
        'classifier': classifier,
        'vectorizer': vectorizer,
        'categories': categories,
        'category_centroids': category_centroids,
        'category_top_keywords': category_top_keywords,
        'role_vectors': role_vectors,
        'role_benchmarks': ROLE_BENCHMARKS,
        'skill_taxonomy': SKILL_TAXONOMY,
        'action_verbs': ACTION_VERBS,
        'metrics': metrics_data,
        'trained_at': datetime.datetime.now().isoformat()
    }

    model_path = os.path.join(saved_dir, 'resume_nlp_model.joblib')
    joblib.dump(model_artifact, model_path)
    print(f"[OK] Saved Trained Model Artifact to: {model_path}")

    taxonomy_path = os.path.join(saved_dir, 'skill_taxonomy.json')
    with open(taxonomy_path, 'w', encoding='utf-8') as f:
        json.dump(SKILL_TAXONOMY, f, indent=2)
    print(f"[OK] Saved Skill Taxonomy to: {taxonomy_path}")

    print("================================================================")
    print(" NLP Resume Intelligence Model Training Successfully Complete!")
    print("================================================================")
    return model_artifact

if __name__ == '__main__':
    train_resume_nlp_pipeline()
