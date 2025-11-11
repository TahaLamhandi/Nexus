# 🚀 Nexus CV Analysis - Setup Guide

Your application now uses **scikit-learn** (Python) for machine learning predictions!

## 📋 Quick Start

### 1. Start the Python Backend (sklearn)

**Windows:**
```bash
start-backend.bat
```

**Or manually:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will start on **http://localhost:8000**
- API Documentation: **http://localhost:8000/docs** (Swagger UI)
- Alternative Docs: **http://localhost:8000/redoc** (ReDoc)

### 2. Start the React Frontend

In a **new terminal**:
```bash
npm run dev
```

The frontend will run on **http://localhost:5173**

## 🧠 Machine Learning Stack

- **Backend:** Python + FastAPI (modern, fast, async)
- **ML Library:** scikit-learn (KNN with distance weighting)
- **Algorithm:** K-Nearest Neighbors approximates Locally Weighted Regression
- **Features:** 40+ skill features + education + experience
- **Dataset:** job_descriptions.csv (processed in batches)
- **Bonus:** Automatic API documentation with Swagger UI!

## 📊 API Endpoints

### Health Check
```
GET http://localhost:8000/api/health
```

### Predict Job Matches
```
POST http://localhost:8000/api/predict-jobs
{
  "cvData": { ... },
  "topK": 10
}
```

### Analyze CV
```
POST http://localhost:8000/api/cv-analysis
{
  "cvData": { ... }
}
```

**Interactive API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## ✨ Features

✅ Real scikit-learn machine learning
✅ K-Nearest Neighbors (KNN) for job matching
✅ Distance-weighted predictions (like LWR)
✅ 40+ technical skills detection
✅ Education level analysis
✅ Experience and projects weighting
✅ Top 10 job matches with scores
✅ LinkedIn URLs for applications

## 🐛 Troubleshooting

**"Backend server not running" error?**
- Make sure you started the Python backend first
- Check that FastAPI is running on port 8000
- Look for errors in the Python terminal
- Try accessing http://localhost:8000/docs to verify

**Python not found?**
- Install Python 3.8+ from python.org
- Make sure Python is in your PATH

**sklearn import error?**
- Make sure you activated the virtual environment
- Run: `pip install -r requirements.txt`

## 🎯 How It Works

1. **CV Upload** → Frontend parses CV (PDF/Word)
2. **Feature Extraction** → Backend extracts 40+ features
3. **Job Matching** → sklearn KNN computes similarity scores
4. **Results** → Top matches displayed with LinkedIn links

Enjoy your AI-powered career matching! 🚀
