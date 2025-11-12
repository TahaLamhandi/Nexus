import requests
import json

# Nabila's CV data from the console logs
cv_data = {
    "skills": ["JavaScript", "Python", "C++", "PHP", "C", "HTML", "CSS", "MySQL", "Git", "GitHub", "Qt", "SQLite", "phpMyAdmin", "MySQL Workbench"],
    "experience": [],
    "projects": [
        {
            "name": "Application de Gestion des Étudiants de l'ENSAH",
            "description": [
                "Application en C (mode console) pour gérer les notes, absences et",
                "infos étudiantes avec stockage sur fichiers."
            ]
        },
        {
            "name": "Memory Match Game",
            "description": [
                "Jeu de mémoire développé en C++ avec Qt, incluant interface",
                "graphique, chronomètre, score et base de données SQLite."
            ]
        },
        {
            "name": "Application de Gestion des Affectations des Enseignements",
            "description": ["2025", "phpMyAdmin, MySQL"]
        },
        {
            "name": "Workbench",
            "description": [
                "Version Control: Git, GitHub",
                "Operating Systems: Windows,",
                "Other Competencies: Data",
                "Structures, Algorithms, Object-",
                "Oriented Programming",
                "A C T I V I T É P A R A S C O L A I R E"
            ]
        }
    ],
    "education": [
        {"degree": "École Nationale des Sciences Appliquées d'Al Hoceima (ENSAH)", "institution": "", "year": ""},
        {"degree": "Baccalauréat", "institution": "", "year": ""}
    ]
}

print("🧪 Testing Nabila's CV with backend...")
print(f"📊 CV Skills: {cv_data['skills']}")
print(f"📂 CV Projects: {len(cv_data['projects'])} projects")
print(f"🎓 CV Education: {len(cv_data['education'])} entries\n")

try:
    # Wrap CV data in the correct format
    payload = {
        "cvData": cv_data,
        "topK": 10
    }
    
    response = requests.post(
        "http://localhost:8000/api/predict-jobs",
        json=payload,
        timeout=30
    )
    
    print(f"✅ Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        matches = data.get('predictions', data.get('matches', []))
        print(f"✅ Success! Received {len(matches)} job matches")
        print(f"📊 Algorithm: {data.get('algorithm', 'N/A')}")
        print(f"📈 Total jobs: {data.get('totalJobs', data.get('total_jobs_in_dataset', 'N/A'))}")
        
        if len(matches) > 0:
            print(f"\n🏆 Top 3 Matches:")
            for i, match in enumerate(matches[:3], 1):
                print(f"   {i}. {match.get('Job_Title', 'N/A')} at {match.get('Company', 'N/A')}")
                print(f"      Score: {match.get('matchScore', 0):.2f}%")
                print(f"      LinkedIn: {match.get('LinkedIn_URL', 'N/A')}")
        else:
            print(f"\n⚠️ No matches found. This might be due to:")
            print(f"   - Skills mismatch (CV has: {cv_data['skills'][:5]}...)")
            print(f"   - Dataset doesn't have jobs matching this profile")
    else:
        print(f"❌ Error {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
