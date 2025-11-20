# 🚀 Deploy Nexus Backend to Render.com (FREE)

## Why Render?
- ✅ **Free forever** - 750 hours/month
- ✅ Auto-deploy from GitHub (like Koyeb)
- ✅ Custom domains supported
- ✅ Automatic HTTPS
- ✅ Health checks included
- ⚠️ Cold starts after 15 min inactivity (~30s to wake up)

---

## 📋 Step-by-Step Deployment

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (instant authorization)
3. No credit card required

### 2. Deploy Backend

#### Option A: Using Blueprint (Recommended)
1. Click **"New"** → **"Blueprint"**
2. Connect your GitHub repository: `TahaLamhandi/Nexus`
3. Render will auto-detect `render.yaml`
4. Click **"Apply"** → Deployment starts automatically
5. Wait 3-5 minutes for build

#### Option B: Manual Setup
1. Click **"New"** → **"Web Service"**
2. Connect GitHub repository: `TahaLamhandi/Nexus`
3. Configure:
   - **Name**: `nexus-backend`
   - **Region**: Frankfurt (EU) or Oregon (US)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Click **"Create Web Service"**

### 3. Get Your Backend URL
After deployment completes:
- Your URL will be: `https://nexus-backend-XXXX.onrender.com`
- Test it: Open URL in browser → Should see: `{"status":"healthy"}`

### 4. Update Frontend API URL

**Option 1: Environment Variable (Recommended)**
```bash
# In Vercel Dashboard → Settings → Environment Variables
VITE_API_URL=https://nexus-backend-XXXX.onrender.com
```

**Option 2: Update src/config/api.js**
```javascript
const API_URL = 'https://nexus-backend-XXXX.onrender.com';
```

### 5. Redeploy Frontend
```bash
git add .
git commit -m "Update API URL to Render"
git push origin main
```

Vercel will auto-deploy with new backend URL.

---

## 🔧 Important Configuration

### Add ML Model Files
Your backend needs `knn_model.pkl` and `tfidf_vectorizer.pkl`. 

**Option 1: Add to Repository**
```bash
# Add models to backend/ml_models/
git add backend/ml_models/*.pkl
git commit -m "Add ML models"
git push
```

**Option 2: Download on Startup (Better for large files)**
Update `app.py` startup to download from cloud storage.

### Environment Variables on Render
If you use Google Gemini API:
1. Go to Render Dashboard → Your Service → **Environment**
2. Add: `GEMINI_API_KEY=your_key_here`

---

## ⚡ Handling Cold Starts

Render free tier sleeps after 15 minutes of inactivity. Solutions:

### Option 1: Keep-Alive Ping Service
Use [cron-job.org](https://cron-job.org) (free):
1. Create account
2. Add cron job: `GET https://nexus-backend-XXXX.onrender.com/`
3. Schedule: Every 10 minutes

### Option 2: Frontend Auto-Ping
Add to your React app:
```javascript
// Keep backend alive
setInterval(() => {
  fetch(API_URL).catch(() => {});
}, 10 * 60 * 1000); // Every 10 minutes
```

---

## 📊 Monitoring

### View Logs
Render Dashboard → Your Service → **Logs**

### Check Health
```bash
curl https://nexus-backend-XXXX.onrender.com/
```

Should return:
```json
{
  "status": "healthy",
  "version": "2.1.0",
  "ml_library": "scikit-learn (Trained Models)",
  "model_loaded": true
}
```

---

## 🆚 Comparison with Koyeb

| Feature | Koyeb | Render Free |
|---------|-------|-------------|
| Price | Trial ended | FREE forever |
| Cold Starts | No | Yes (15 min) |
| Build Time | ~2 min | ~3-5 min |
| Custom Domain | Yes | Yes |
| Auto-Deploy | Yes | Yes |
| Region | EU/US | EU/US/Asia |

---

## 🐛 Troubleshooting

### Build Fails
- Check `backend/requirements.txt` is correct
- Ensure Python version is 3.11
- Check logs for missing dependencies

### Model Not Loading
- Verify `jobs_dataset_50k.csv` exists in `backend/`
- Check ML model files are in `backend/ml_models/`

### 502 Bad Gateway
- Backend is sleeping (cold start)
- Wait 30 seconds and retry
- Implement keep-alive ping

### CORS Errors
Already configured in `app.py`:
```python
allow_origins=["*"]
```

---

## 🔄 Alternative Free Hosts

If Render doesn't work:

### Railway.app
- $5/month credit (free)
- Similar setup to Render
- Faster cold starts

### Fly.io  
- 3 free VMs
- No cold starts (always-on)
- Requires credit card verification

### PythonAnywhere
- Free tier forever
- No GitHub auto-deploy
- Good for stable, low-traffic apps

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] Backend deployed and healthy
- [ ] Backend URL obtained
- [ ] Frontend updated with new API URL
- [ ] Frontend redeployed to Vercel
- [ ] Test CV upload works
- [ ] Test job matching works
- [ ] (Optional) Keep-alive ping configured

---

## 🎉 You're Done!

Your backend is now hosted for FREE on Render.com with auto-deployment from GitHub!

**New Stack:**
- Frontend: Vercel (Edge Network)
- Backend: Render.com (Free tier)
- CI/CD: Jenkins + GitHub webhooks
