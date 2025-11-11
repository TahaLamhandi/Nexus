# Python Backend for CV Analysis

This backend uses **scikit-learn** for machine learning predictions.

## Setup

1. **Create virtual environment:**
```bash
python -m venv venv
```

2. **Activate virtual environment:**

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the server:**
```bash
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### 1. Health Check
```
GET /api/health
```

### 2. Predict Job Matches
```
POST /api/predict-jobs
Body: {
  "cvData": { ... },
  "topK": 10
}
```

### 3. Analyze CV
```
POST /api/cv-analysis
Body: {
  "cvData": { ... }
}
```

## Machine Learning

Uses **K-Nearest Neighbors (KNN)** with distance weighting as an approximation of Locally Weighted Regression (LWR). This provides similar results to LWR while being more efficient with scikit-learn's optimized implementation.
