"""
FastAPI Backend API for CV Analysis and Job Matching
Uses scikit-learn for Locally Weighted Regression predictions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
import os
import uvicorn

app = FastAPI(
    title="Nexus CV Analysis API",
    description="AI-powered career analytics with scikit-learn",
    version="1.0.0"
)

# Enable CORS for React frontend
# Temporarily allow all origins for testing, then lock down to specific domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=False,  # Must be False when allow_origins is "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 📦 REQUEST/RESPONSE MODELS
# ==========================================

class PredictJobsRequest(BaseModel):
    cvData: Dict[str, Any]
    topK: Optional[int] = 10

class CVAnalysisRequest(BaseModel):
    cvData: Dict[str, Any]

class JobMatch(BaseModel):
    Job_Title: str
    Company: str
    Company_Logo: str  # Company logo URL from Clearbit
    Location: str
    Work_Type: str  # Full-time, Part-time, Remote, etc.
    Experience_Level: str
    LinkedIn_URL: str
    matchScore: float

class PredictJobsResponse(BaseModel):
    success: bool
    matches: List[JobMatch]
    totalJobs: int
    algorithm: str

class CVAnalysisResponse(BaseModel):
    success: bool
    skillCoverage: float
    careerScore: int
    insights: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str
    version: str
    ml_library: str

# ==========================================
# 🔧 DATA & CONFIGURATION
# ==========================================

# Try to load large CSV first, fallback to sample data
CSV_PATH_LARGE = os.path.join(os.path.dirname(__file__), '..', 'public', 'job_descriptions.csv')
CSV_PATH_SAMPLE = os.path.join(os.path.dirname(__file__), 'jobs_sample.csv')

def load_jobs_dataset():
    """Load and return the jobs dataset"""
    # Try large CSV first
    if os.path.exists(CSV_PATH_LARGE):
        try:
            df = pd.read_csv(CSV_PATH_LARGE, encoding='utf-8', on_bad_lines='skip')
            print(f"✅ Loaded {len(df)} jobs from large CSV")
            return df
        except Exception as e:
            print(f"⚠️ Could not load large CSV: {e}")
    
    # Fallback to sample CSV
    try:
        df = pd.read_csv(CSV_PATH_SAMPLE, encoding='utf-8')
        print(f"✅ Loaded {len(df)} jobs from sample CSV (demo mode)")
        return df
    except Exception as e:
        print(f"❌ Error loading sample CSV: {e}")
        return pd.DataFrame()

# Skills taxonomy
SKILLS_LIST = [
    'JavaScript', 'Python', 'Java', 'PHP', 'C', 'C++', 'C#',
    'React', 'Vue', 'Angular', 'Laravel', 'Django', 'Flask',
    'Node.js', 'Express', 'MongoDB', 'MySQL', 'PostgreSQL',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'HTML', 'CSS', 'TypeScript', 'Git', 'Linux',
    'Spring', 'Hibernate', 'Redis', 'Elasticsearch',
    'GraphQL', 'REST API', 'Microservices'
]

def extract_cv_features(cv_data):
    """Extract feature vector from CV data"""
    features = {}
    
    # Extract skills (binary features)
    skills = cv_data.get('skills', [])
    skills_lower = [s.lower() for s in skills]
    
    for skill in SKILLS_LIST:
        features[f'skill_{skill.lower().replace(" ", "_")}'] = 1 if skill.lower() in skills_lower else 0
    
    # Education level
    education = cv_data.get('education', [])
    education_text = ' '.join([str(e) for e in education]).lower()
    
    features['education_bachelor'] = 1 if any(word in education_text for word in ['bachelor', 'licence', 'bsc']) else 0
    features['education_master'] = 1 if any(word in education_text for word in ['master', 'msc', 'engineering']) else 0
    features['education_phd'] = 1 if any(word in education_text for word in ['phd', 'doctorate']) else 0
    
    # Experience and projects
    features['num_experience'] = len(cv_data.get('experience', []))
    features['num_projects'] = len(cv_data.get('projects', []))
    features['num_languages'] = len(cv_data.get('languages', []))
    
    return features

def extract_job_features(job_description):
    """Extract feature vector from job description"""
    features = {}
    
    job_text = str(job_description).lower()
    
    # Skills matching
    for skill in SKILLS_LIST:
        skill_lower = skill.lower()
        features[f'skill_{skill_lower.replace(" ", "_")}'] = 1 if skill_lower in job_text else 0
    
    # Education requirements
    features['education_bachelor'] = 1 if any(word in job_text for word in ['bachelor', 'bs', 'undergraduate']) else 0
    features['education_master'] = 1 if any(word in job_text for word in ['master', 'ms', 'graduate']) else 0
    features['education_phd'] = 1 if any(word in job_text for word in ['phd', 'doctorate', 'research']) else 0
    
    # General features
    features['num_experience'] = 3  # Default assumption
    features['num_projects'] = 2
    features['num_languages'] = 1
    
    return features

# ==========================================
# 🌐 API ENDPOINTS
# ==========================================

@app.get('/api/health', response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'version': '1.0.0',
        'ml_library': 'scikit-learn + FastAPI'
    }

@app.post('/api/predict-jobs', response_model=PredictJobsResponse)
async def predict_jobs(request: PredictJobsRequest):
    """
    Predict job matches using scikit-learn KNN with FAST optimization
    """
    try:
        cv_data = request.cvData
        top_k = request.topK
        
        print(f"\n{'='*60}")
        print(f"🔍 Received CV prediction request")
        print(f"{'='*60}")
        print(f"User: {cv_data.get('name', 'Unknown')}")
        print(f"Skills: {len(cv_data.get('skills', []))} detected")
        print(f"Projects: {len(cv_data.get('projects', []))} detected")
        print(f"Requesting top {top_k} matches")
        
        # Extract country from CV (check contact info, location, etc.)
        cv_country = None
        contact = cv_data.get('contact', {})
        if isinstance(contact, dict):
            cv_country = contact.get('country') or contact.get('location')
        if not cv_country:
            # Try to extract from address or location in CV
            address = cv_data.get('address', '')
            if 'morocco' in address.lower() or 'maroc' in address.lower():
                cv_country = 'Morocco'
            elif 'france' in address.lower():
                cv_country = 'France'
            elif 'canada' in address.lower():
                cv_country = 'Canada'
        
        print(f"🌍 Detected country: {cv_country or 'Not specified (showing all countries)'}")
        
        # Load jobs dataset
        print("📂 Loading jobs dataset...")
        jobs_df = load_jobs_dataset()
        
        if jobs_df.empty:
            raise HTTPException(status_code=404, detail="Job descriptions dataset is empty")
        
        # Filter by country FIRST (huge speed boost!)
        if cv_country:
            country_mask = jobs_df['Country'].str.contains(cv_country, case=False, na=False)
            jobs_df = jobs_df[country_mask]
            print(f"🎯 Filtered to {len(jobs_df)} jobs in {cv_country}")
        
        # SPEED OPTIMIZATION: Sample only 5000 jobs instead of 1.6M
        if len(jobs_df) > 5000:
            jobs_df = jobs_df.sample(n=5000, random_state=42)
            print(f"⚡ Sampled 5000 jobs for fast processing")
        
        # Filter valid jobs (check actual column names)
        # Columns in CSV: Job Description (with space), Company, Job Title, location, Salary Range
        valid_jobs = jobs_df[
            jobs_df['Job Description'].notna() & 
            jobs_df['Company'].notna() &
            jobs_df['Job Title'].notna()
        ].copy()
        
        print(f"✅ Found {len(valid_jobs)} valid jobs")
        
        # Extract CV features
        print("🧠 Extracting CV features...")
        cv_features = extract_cv_features(cv_data)
        cv_vector = np.array([list(cv_features.values())])
        
        # Extract job features
        print("🔍 Extracting job features...")
        job_vectors = []
        for _, job in valid_jobs.iterrows():
            # Combine Job Description and skills for better matching
            job_text = str(job.get('Job Description', '')) + ' ' + str(job.get('skills', ''))
            job_features = extract_job_features(job_text)
            job_vectors.append(list(job_features.values()))
        
        job_vectors = np.array(job_vectors)
        
        # Use KNN as LWR approximation
        print("🤖 Training K-Nearest Neighbors model...")
        n_neighbors = min(50, len(valid_jobs))
        knn = KNeighborsRegressor(
            n_neighbors=n_neighbors,
            weights='distance',
            metric='euclidean'
        )
        
        # Fit with dummy targets (we only care about distances)
        dummy_targets = np.zeros(len(valid_jobs))
        knn.fit(job_vectors, dummy_targets)
        
        # Find nearest neighbors
        print("📊 Computing match scores...")
        distances, indices = knn.kneighbors(cv_vector, n_neighbors=len(valid_jobs))
        
        # Convert distances to match scores (0-100%)
        # Gaussian kernel: score = exp(-distance^2)
        normalized_distances = distances[0] / (distances[0].max() + 1e-10)
        match_scores = 100 * np.exp(-normalized_distances ** 2)
        
        # Create results
        matches = []
        for idx, score in zip(indices[0][:top_k], match_scores[:top_k]):
            job = valid_jobs.iloc[idx]
            # Map CSV columns to our response format
            company = str(job.get('Company', 'N/A'))
            job_title = str(job.get('Job Title', 'N/A'))
            
            # Generate company logo URL using Clearbit API (free, no auth needed)
            # Format: https://logo.clearbit.com/{domain}
            company_domain = company.lower().replace(' ', '').replace(',', '').replace('.', '')
            if company_domain and company_domain != 'n/a':
                company_logo = f"https://logo.clearbit.com/{company_domain}.com"
            else:
                # Fallback to a placeholder
                company_logo = f"https://ui-avatars.com/api/?name={company.replace(' ', '+')}&background=6366f1&color=fff&size=128"
            
            # Create LinkedIn search URL if not available
            linkedin_url = f"https://www.linkedin.com/jobs/search/?keywords={job_title.replace(' ', '%20')}%20{company.replace(' ', '%20')}"
            
            matches.append({
                'Job_Title': job_title,
                'Company': company,
                'Company_Logo': company_logo,
                'Location': str(job.get('location', job.get('Country', 'N/A'))),
                'Work_Type': str(job.get('Work Type', 'Not specified')),
                'Experience_Level': str(job.get('Experience', 'N/A')),
                'LinkedIn_URL': linkedin_url,
                'matchScore': float(score)
            })
        
        print(f"✅ Returning top {len(matches)} matches")
        print(f"{'='*60}\n")
        
        return {
            'success': True,
            'matches': matches,
            'totalJobs': len(valid_jobs),
            'algorithm': 'K-Nearest Neighbors (sklearn) with distance weighting - FastAPI'
        }
        
    except FileNotFoundError:
        print("❌ Error: job_descriptions.csv not found!")
        raise HTTPException(status_code=404, detail="Job descriptions dataset not found")
        
    except Exception as e:
        print(f"❌ Error in predict_jobs: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/cv-analysis', response_model=CVAnalysisResponse)
async def analyze_cv(request: CVAnalysisRequest):
    """
    Analyze CV and provide insights
    """
    try:
        cv_data = request.cvData
        
        # Extract basic info
        skills = cv_data.get('skills', [])
        projects = cv_data.get('projects', [])
        experience = cv_data.get('experience', [])
        education = cv_data.get('education', [])
        
        # Calculate skill coverage
        cv_skills_set = set([s.lower() for s in skills])
        in_demand_skills = cv_skills_set & set([s.lower() for s in SKILLS_LIST])
        skill_coverage = len(in_demand_skills) / len(SKILLS_LIST) if SKILLS_LIST else 0
        
        # Determine education level
        education_text = ' '.join([str(e) for e in education]).lower()
        education_level = 'bachelor'
        education_bonus = 10
        
        if 'phd' in education_text or 'doctorate' in education_text:
            education_level = 'phd'
            education_bonus = 30
        elif 'master' in education_text or 'engineering' in education_text:
            education_level = 'master'
            education_bonus = 20
        
        # Calculate career score
        career_score = min(100, int(
            skill_coverage * 40 +
            len(projects) * 15 +
            len(experience) * 20 +
            education_bonus
        ))
        
        return {
            'success': True,
            'skillCoverage': skill_coverage,
            'careerScore': career_score,
            'insights': {
                'totalSkills': len(skills),
                'inDemandSkills': len(in_demand_skills),
                'projectCount': len(projects),
                'experienceYears': len(experience),
                'educationLevel': education_level
            }
        }
        
    except Exception as e:
        print(f"❌ Error in analyze_cv: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 🚀 START SERVER
# ==========================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Starting FastAPI Backend Server")
    print("="*60)
    print("📊 Machine Learning: scikit-learn KNN for job matching")
    print("🌐 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("📝 API Endpoints:")
    print("   - GET  /api/health")
    print("   - POST /api/predict-jobs")
    print("   - POST /api/cv-analysis")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
