import os
import numpy as np
import pandas as pd

def generate_dataset(n_samples=2000, output_path=None):
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), 'placement_dataset.csv')

    np.random.seed(42)
    departments = [
        'Computer Science', 'Information Science', 'Electronics & Communication',
        'Mechanical Engineering', 'Civil Engineering', 'Artificial Intelligence & Machine Learning'
    ]
    dept_weights = [0.35, 0.20, 0.20, 0.10, 0.05, 0.10]
    dept_chosen = np.random.choice(departments, size=n_samples, p=dept_weights)

    cgpa = np.clip(np.random.normal(loc=7.6, scale=1.1, size=n_samples), 5.0, 9.9)
    cgpa = np.round(cgpa, 2)

    aptitude_score = np.clip(np.random.normal(loc=72, scale=14, size=n_samples), 35, 100).astype(int)
    technical_score = np.clip((cgpa * 8) + np.random.normal(loc=12, scale=10, size=n_samples), 30, 100).astype(int)

    projects_count = np.random.poisson(lam=2.2, size=n_samples)
    projects_count = np.clip(projects_count, 0, 7)

    internships_count = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.45, 0.35, 0.15, 0.05])
    dsa_problems = np.clip(np.random.exponential(scale=110, size=n_samples), 0, 480).astype(int)

    backlogs_prob = [0.70, 0.18, 0.08, 0.03, 0.01]
    backlogs_count = np.random.choice([0, 1, 2, 3, 4], size=n_samples, p=backlogs_prob)

    certifications_count = np.random.poisson(lam=1.5, size=n_samples)
    certifications_count = np.clip(certifications_count, 0, 5)

    soft_skills_score = np.clip(np.random.normal(loc=74, scale=12, size=n_samples), 45, 100).astype(int)

    score = (
        (cgpa / 10.0) * 28 +
        (aptitude_score / 100.0) * 24 +
        (technical_score / 100.0) * 20 +
        (np.minimum(projects_count, 4) / 4.0) * 12 +
        (np.minimum(internships_count, 2) / 2.0) * 12 +
        (np.minimum(dsa_problems, 300) / 300.0) * 10 +
        (np.minimum(certifications_count, 3) / 3.0) * 4 +
        (soft_skills_score / 100.0) * 8 -
        (backlogs_count * 15)
    )

    dept_bonus = np.array([3 if d in ['Computer Science', 'Information Science', 'Artificial Intelligence & Machine Learning'] else 0 for d in dept_chosen])
    score += dept_bonus

    synergy = np.where((cgpa >= 8.5) & (internships_count >= 1) & (projects_count >= 2), 6, 0)
    score += synergy
    score += np.random.normal(loc=0, scale=3.5, size=n_samples)
    prob = 1.0 / (1.0 + np.exp(-(score - 55.0) / 8.5))

    is_placed = (prob > 0.50).astype(int)
    is_placed = np.where(backlogs_count >= 3, 0, is_placed)

    hiring_tier = []
    ctc_lpa = []

    for i in range(n_samples):
        if is_placed[i] == 0:
            hiring_tier.append('Unplaced')
            ctc_lpa.append(0.0)
        elif score[i] >= 82 and dsa_problems[i] >= 180 and cgpa[i] >= 8.0:
            hiring_tier.append('Tier 1 Product')
            ctc_lpa.append(round(np.random.uniform(18.0, 42.0), 2))
        elif score[i] >= 67:
            hiring_tier.append('Tier 2 Tech')
            ctc_lpa.append(round(np.random.uniform(8.0, 18.0), 2))
        else:
            hiring_tier.append('Tier 3 Enterprise')
            ctc_lpa.append(round(np.random.uniform(4.0, 8.0), 2))

    df = pd.DataFrame({
        'student_id': [f'STU-{1000 + i}' for i in range(n_samples)],
        'department': dept_chosen,
        'cgpa': cgpa,
        'aptitude_score': aptitude_score,
        'technical_score': technical_score,
        'projects_count': projects_count,
        'internships_count': internships_count,
        'dsa_problems_solved': dsa_problems,
        'backlogs_count': backlogs_count,
        'certifications_count': certifications_count,
        'soft_skills_score': soft_skills_score,
        'placement_score': np.round(score, 2),
        'is_placed': is_placed,
        'hiring_tier': hiring_tier,
        'ctc_lpa': ctc_lpa
    })

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} placement records at {output_path}")
    return df

if __name__ == '__main__':
    generate_dataset()
