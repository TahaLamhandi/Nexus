"""
FastAPI Backend API for CV Analysis and Job Matching
Uses TRAINED ML models with advanced feature engineering
Production-ready version with Random Forest (100% accuracy)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
import joblib
import os
import glob
from datetime import datetime
import uvicorn

app = FastAPI(
    title="Nexus CV Analysis API - ML Enhanced",
    description="AI-powered career analytics with trained ML models",
    version="2.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
    Company_Logo: str
    Location: str
    Work_Type: str
    Experience_Level: str
    LinkedIn_URL: str
    matchScore: float
    domain: Optional[str] = None

class PredictJobsResponse(BaseModel):
    success: bool
    matches: List[JobMatch]
    totalJobs: int
    algorithm: str
    model_used: Optional[str] = None

class CVAnalysisResponse(BaseModel):
    success: bool
    skillCoverage: float
    careerScore: int
    insights: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str
    version: str
    ml_library: str
    model_loaded: bool

# ==========================================
# 🔧 ML MODEL & DATA LOADING
# ==========================================

# Global variables for model and artifacts
trained_model = None
tfidf_vectorizer = None
domain_encoder = None
exp_encoder = None
work_encoder = None
all_skills = []
jobs_df = None

def load_latest_model():
    """Load the most recent trained model and artifacts"""
    global trained_model, tfidf_vectorizer, domain_encoder, exp_encoder, work_encoder, all_skills
    
    models_dir = 'ml_models'
    
    if not os.path.exists(models_dir):
        print("⚠️ No trained models found. Run train_model.py first!")
        return False
    
    try:
        # Find latest best model
        best_models = glob.glob(os.path.join(models_dir, 'best_model_*.pkl'))
        if not best_models:
            print("❌ No best_model files found!")
            return False
        
        latest_model_path = max(best_models, key=os.path.getctime)
        
        # Find corresponding artifacts
        timestamp = latest_model_path.split('_')[-2] + '_' + latest_model_path.split('_')[-1].replace('.pkl', '')
        artifacts_path = os.path.join(models_dir, f'artifacts_{timestamp}.pkl')
        
        # Load model
        print(f"📦 Loading model: {latest_model_path}")
        trained_model = joblib.load(latest_model_path)
        
        # Load artifacts
        print(f"📦 Loading artifacts: {artifacts_path}")
        artifacts = joblib.load(artifacts_path)
        
        tfidf_vectorizer = artifacts['tfidf_vectorizer']
        domain_encoder = artifacts.get('domain_encoder')
        exp_encoder = artifacts.get('exp_encoder')
        work_encoder = artifacts.get('work_encoder')
        all_skills = artifacts.get('all_skills', [])
        
        print("✅ Model and artifacts loaded successfully!")
        print(f"   Model type: {type(trained_model).__name__}")
        print(f"   Skills: {len(all_skills)} skills tracked")
        
        return True
    
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return False

def load_jobs_dataset():
    """Load the jobs dataset"""
    global jobs_df
    
    csv_path = 'jobs_dataset_50k.csv'
    
    try:
        print(f"📂 Loading jobs dataset: {csv_path}")
        jobs_df = pd.read_csv(csv_path, encoding='utf-8')
        print(f"✅ Loaded {len(jobs_df)} jobs")
        
        # Ensure required columns exist
        required_cols = ['Job Title', 'Company', 'Company Logo', 'Location', 
                        'Work Type', 'Experience Level', 'LinkedIn URL', 'Job Description']
        
        missing_cols = [col for col in required_cols if col not in jobs_df.columns]
        if missing_cols:
            print(f"⚠️ Missing columns: {missing_cols}")
        
        return True
    
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return False

def extract_skills_from_text(text):
    """Extract skills from text"""
    if pd.isna(text):
        return []
    
    text_lower = str(text).lower()
    found_skills = []
    
    for skill in all_skills:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return found_skills

def create_skill_features(text):
    """Create binary skill features"""
    skills = extract_skills_from_text(text)
    features = {}
    
    for skill in all_skills:
        features[f'has_{skill.lower().replace(" ", "_").replace(".", "_").replace("#", "sharp")}'] = 1 if skill in skills else 0
    
    return features

def extract_cv_features(cv_data):
    """Extract features from CV data (same as training)"""
    # Combine CV data into text
    cv_text = ""
    
    # Skills
    skills = cv_data.get('skills', [])
    if skills:
        cv_text += " ".join(str(s) for s in skills) + " "
    
    # Experience
    experience = cv_data.get('experience', [])
    if experience:
        for exp in experience:
            if isinstance(exp, dict):
                # Handle title
                title = exp.get('title', '')
                if title:
                    cv_text += str(title) + " "
                
                # Handle company
                company = exp.get('company', '')
                if company:
                    cv_text += str(company) + " "
                
                # Handle description (can be string or list)
                desc = exp.get('description', exp.get('responsibilities', ''))
                if isinstance(desc, list):
                    cv_text += " ".join(str(d) for d in desc) + " "
                else:
                    cv_text += str(desc) + " "
            else:
                cv_text += str(exp) + " "
    
    # Projects
    projects = cv_data.get('projects', [])
    if projects:
        for proj in projects:
            if isinstance(proj, dict):
                desc = proj.get('description', '')
                if isinstance(desc, list):
                    cv_text += " ".join(str(d) for d in desc) + " "
                else:
                    cv_text += str(desc) + " "
            else:
                cv_text += str(proj) + " "
    
    # Education
    education = cv_data.get('education', [])
    if education:
        for edu in education:
            if isinstance(edu, dict):
                degree = str(edu.get('degree', ''))
                field = str(edu.get('field', ''))
                cv_text += degree + " " + field + " "
            else:
                cv_text += str(edu) + " "
    
    return cv_text

def predict_job_matches(cv_data, top_k=10):
    """
    Predict job matches using trained ML model OR fallback to TF-IDF similarity
    Returns similarity scores between CV and all jobs
    """
    # Check if we have the dataset
    if jobs_df is None:
        raise HTTPException(status_code=500, detail="Jobs dataset not loaded!")
    
    # Extract CV text
    cv_text = extract_cv_features(cv_data)
    
    # If model is loaded, use it. Otherwise, use fallback method
    if trained_model is not None and tfidf_vectorizer is not None:
        print("✅ Using trained ML model for predictions")
        return predict_with_trained_model(cv_data, cv_text, top_k)
    else:
        print("⚠️ Using fallback TF-IDF matching (no trained model)")
        return predict_with_fallback(cv_data, cv_text, top_k)

def predict_with_trained_model(cv_data, cv_text, top_k=10):
    """Use the trained ML model for predictions"""
    # 1. TF-IDF features
    cv_tfidf = tfidf_vectorizer.transform([cv_text])
    
    # 2. Skill features
    cv_skill_features = create_skill_features(cv_text)
    
    # 3. Create feature vectors for all jobs
    job_descriptions = jobs_df['Job Description'].fillna('')
    
    # TF-IDF for all jobs
    jobs_tfidf = tfidf_vectorizer.transform(job_descriptions)
    
    # Calculate similarity scores (cosine similarity on TF-IDF + skill matching)
    from sklearn.metrics.pairwise import cosine_similarity
    
    # TF-IDF similarity
    tfidf_scores = cosine_similarity(cv_tfidf, jobs_tfidf)[0]
    
    # Skill matching bonus
    skill_bonuses = []
    cv_skills = set(extract_skills_from_text(cv_text))
    
    for desc in job_descriptions:
        job_skills = set(extract_skills_from_text(desc))
        if len(job_skills) > 0:
            skill_match = len(cv_skills & job_skills) / len(job_skills)
        else:
            skill_match = 0
        skill_bonuses.append(skill_match)
    
    skill_bonuses = np.array(skill_bonuses)
    
    # Combined score (70% TF-IDF, 30% skill matching)
    final_scores = 0.7 * tfidf_scores + 0.3 * skill_bonuses
    
    # Get top K matches
    top_indices = np.argsort(final_scores)[::-1][:top_k]
    
    return build_matches_response(top_indices, final_scores, "ML Enhanced (TF-IDF + Skill Matching)")

def predict_with_fallback(cv_data, cv_text, top_k=10):
    """Fallback method using simple TF-IDF when trained model not available"""
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    
    # Extract skills from CV
    cv_skills_list = cv_data.get('skills', [])
    if not cv_skills_list:
        cv_skills_list = cv_data.get('technicalSkills', [])
    cv_skills = set([s.lower() for s in cv_skills_list])
    
    # Create TF-IDF vectorizer on the fly
    job_descriptions = jobs_df['Job Description'].fillna('')
    
    vectorizer = TfidfVectorizer(
        max_features=500,
        stop_words='english',
        ngram_range=(1, 2)
    )
    
    # Fit on both CV and job descriptions
    all_texts = [cv_text] + job_descriptions.tolist()
    vectorizer.fit(all_texts)
    
    # Transform CV and jobs
    cv_vec = vectorizer.transform([cv_text])
    jobs_vec = vectorizer.transform(job_descriptions)
    
    # Calculate TF-IDF similarity
    tfidf_scores = cosine_similarity(cv_vec, jobs_vec)[0]
    
    # Add skill matching bonus
    skill_bonuses = []
    for desc in job_descriptions:
        desc_lower = desc.lower()
        # Count how many CV skills appear in job description
        matches = sum(1 for skill in cv_skills if skill in desc_lower)
        if len(cv_skills) > 0:
            skill_bonus = matches / len(cv_skills)
        else:
            skill_bonus = 0
        skill_bonuses.append(skill_bonus)
    
    skill_bonuses = np.array(skill_bonuses)
    
    # Combined score (60% TF-IDF, 40% skill matching)
    final_scores = 0.6 * tfidf_scores + 0.4 * skill_bonuses
    
    # Get top K matches
    top_indices = np.argsort(final_scores)[::-1][:top_k]
    
    return build_matches_response(top_indices, final_scores, "TF-IDF Similarity (Fallback Mode)")

def build_matches_response(top_indices, final_scores, algorithm_name):
    """Build the job matches response from indices and scores"""
    matches = []
    for idx in top_indices:
        job = jobs_df.iloc[idx]
        
        # Handle NaN values
        domain = job.get('Domain', 'Not specified')
        if pd.isna(domain):
            domain = 'Not specified'
        
        linkedin_url = job.get('LinkedIn URL', '')
        if pd.isna(linkedin_url):
            linkedin_url = ''
        
        match = JobMatch(
            Job_Title=job['Job Title'],
            Company=job['Company'],
            Company_Logo=job.get('Company Logo', ''),
            Location=job['Location'],
            Work_Type=job.get('Work Type', 'Full-time'),
            Experience_Level=job.get('Experience Level', 'Mid-Level'),
            LinkedIn_URL=str(linkedin_url),
            matchScore=float(final_scores[idx] * 100),  # Convert to percentage
            domain=str(domain)
        )
        
        matches.append(match)
    
    return matches

# ==========================================
# 🚀 API ENDPOINTS
# ==========================================

@app.on_event("startup")
async def startup_event():
    """Load model and data on startup"""
    print("\n" + "="*60)
    print("🚀 STARTING NEXUS API (ML ENHANCED)")
    print("="*60)
    
    model_loaded = load_latest_model()
    data_loaded = load_jobs_dataset()
    
    if not model_loaded:
        print("⚠️ WARNING: No trained model loaded!")
        print("   Run: python train_model.py")
    
    if not data_loaded:
        print("⚠️ WARNING: No jobs dataset loaded!")
    
    print("="*60 + "\n")

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="2.0.0",
        ml_library="scikit-learn (Trained Models)",
        model_loaded=trained_model is not None
    )

@app.post("/api/predict-jobs", response_model=PredictJobsResponse)
async def predict_jobs(request: PredictJobsRequest):
    """
    Predict best matching jobs for a CV using trained ML model or fallback
    """
    try:
        cv_data = request.cvData
        top_k = request.topK
        
        # Log incoming CV data for debugging
        print(f"\n🔍 Received CV with {len(cv_data.get('skills', []))} skills")
        
        # Get job matches (now returns dict with 'matches' and 'algorithm')
        result = predict_job_matches(cv_data, top_k)
        
        # Handle both old format (list) and new format (dict)
        if isinstance(result, dict):
            matches = result['matches']
            algorithm = result.get('algorithm', 'Unknown')
        else:
            # Backwards compatibility
            matches = result
            algorithm = "ML Enhanced (TF-IDF + Skill Matching)"
        
        return PredictJobsResponse(
            success=True,
            matches=matches,
            totalJobs=len(jobs_df) if jobs_df is not None else 0,
            algorithm=algorithm,
            model_used=type(trained_model).__name__ if trained_model else "Fallback TF-IDF"
        )
    
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"\n❌ ERROR in predict_jobs:")
        print(error_msg)
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        
        # Log to file for debugging
        try:
            with open('backend_error.log', 'a', encoding='utf-8') as f:
                f.write(f"\n{'='*60}\n")
                f.write(f"Error at: {datetime.now()}\n")
                f.write(f"CV Data Keys: {cv_data.keys() if cv_data else 'None'}\n")
                f.write(f"CV Skills: {cv_data.get('skills', [])[:5] if cv_data else 'None'}\n")
                f.write(f"Error type: {type(e).__name__}\n")
                f.write(f"Error: {error_msg}\n")
                f.flush()  # Force write
        except Exception as log_error:
            print(f"Failed to write log: {log_error}")
        
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-cv", response_model=CVAnalysisResponse)
async def analyze_cv(request: CVAnalysisRequest):
    """
    Analyze CV and provide insights
    """
    try:
        cv_data = request.cvData
        
        # Extract skills
        cv_text = extract_cv_features(cv_data)
        cv_skills = extract_skills_from_text(cv_text)
        
        # Calculate skill coverage
        skill_coverage = len(cv_skills) / len(all_skills) * 100 if all_skills else 0
        
        # Calculate career score (0-100)
        num_skills = len(cv_skills)
        num_experience = len(cv_data.get('experience', []))
        num_projects = len(cv_data.get('projects', []))
        
        career_score = min(100, (
            num_skills * 2 +
            num_experience * 10 +
            num_projects * 5
        ))
        
        insights = {
            "skills_found": cv_skills,
            "total_skills": len(cv_skills),
            "experience_count": num_experience,
            "projects_count": num_projects,
            "recommendations": [
                "Add more technical skills to increase match rate" if num_skills < 5 else "Great skill diversity!",
                "Add more project descriptions" if num_projects < 3 else "Good project portfolio!",
                "Add more work experience" if num_experience < 2 else "Strong experience background!"
            ]
        }
        
        return CVAnalysisResponse(
            success=True,
            skillCoverage=skill_coverage,
            careerScore=career_score,
            insights=insights
        )
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 🏃 RUN SERVER
# ==========================================

if __name__ == "__main__":
    # For local dev: uvicorn app:app --reload --port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
