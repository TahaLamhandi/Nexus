import requests
import json

# Chloé's CV data from console logs
cv_data = {
    "skills": ["Docker", "Kubernetes", "GitHub", "Microservices", "CI/CD"],
    "experience": [
        {
            "title": "Ingénieur Cloud",
            "company": "DevOps, je suis passionnée par la création de",
            "duration": "",
            "responsibilities": []
        },
        {
            "title": "DevOps, je suis passionnée par la création de",
            "company": "Scalian",
            "duration": "05/2019   -   06/2023   Toulon, France",
            "responsibilities": [
                "Mise en place et gestion de pipelines CI/CD",
                "Déploiement et gestion de clusters Kubernetes"
            ]
        }
    ],
    "projects": [
        {
            "name": "Optimisation du Pipeline CI/CD",
            "description": ["améliorant l'efficacité de 25%."]
        }
    ],
    "education": [
        {"degree": "Ingénieur Cloud", "institution": "", "year": ""},
        {"degree": "Master en Informatique", "institution": "Université de la Méditerranée", "year": "2012"}
    ]
}

print("🧪 Testing Chloé's CV with backend...")
print(f"📊 CV Skills: {cv_data['skills']}")
print(f"💼 CV Experience: {len(cv_data['experience'])} entries")
print(f"📂 CV Projects: {len(cv_data['projects'])} projects\n")

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
        print(f"❌ Error {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
