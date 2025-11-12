"""
Test script to debug the API endpoint
"""
import requests
import json

# Test CV data (simplified)
cv_data = {
    "skills": ["Python", "Java", "React", "Spring Boot", "Docker"],
    "experience": [],
    "projects": [
        {"name": "Test Project", "description": ["Some description"]}
    ],
    "education": [
        {"degree": "Bachelor", "institution": "University", "year": "2023"}
    ]
}

# Test the API
url = "http://localhost:8000/api/predict-jobs"
payload = {
    "cvData": cv_data,
    "topK": 5
}

print("🔍 Testing API endpoint...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")
print("\n" + "="*60)

try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"✅ Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ SUCCESS! Received {len(data['matches'])} matches")
        print(f"Algorithm: {data['algorithm']}")
        print(f"Model: {data.get('model_used', 'N/A')}")
        print(f"\nTop 3 matches:")
        for i, match in enumerate(data['matches'][:3], 1):
            print(f"  {i}. {match['Job_Title']} at {match['Company']} ({match['matchScore']:.1f}%)")
    else:
        print(f"❌ ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
    import traceback
    traceback.print_exc()
