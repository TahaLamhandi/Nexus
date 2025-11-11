# 🚀 Nexus App Deployment Guide

## Complete Free Deployment Steps

### 📋 Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)

---

## Part 1: Prepare Your Project

### 1.1 Initialize Git Repository (if not done)
```bash
cd "c:\Users\lamha\Nexus App"
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Name: `nexus-app`
3. Make it Public
4. Don't initialize with README (you already have files)
5. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/nexus-app.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend on Render

### 2.1 Sign Up / Login to Render
- Go to https://render.com
- Sign up with GitHub (recommended for easy deployment)

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository `nexus-app`
3. Configure:
   - **Name**: `nexus-backend`
   - **Region**: Choose closest to you
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

### 2.3 Environment Variables (if needed)
- Click "Environment" tab
- Add any API keys if you have them

### 2.4 Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for first deployment
- You'll get a URL like: `https://nexus-backend.onrender.com`

⚠️ **Important**: Copy your backend URL!

---

## Part 3: Deploy Frontend on Vercel

### 3.1 Update Backend URL in Frontend

Before deploying, update your frontend to use the production backend URL:

**File: `src/pages/Upload.jsx` and other files that call the backend**

Replace:
```javascript
const response = await fetch('http://localhost:8000/api/predict-jobs', {
```

With:
```javascript
const response = await fetch('https://YOUR-BACKEND-URL.onrender.com/api/predict-jobs', {
```

**Or better - use environment variables:**

Create `.env` file in root:
```env
VITE_API_URL=https://nexus-backend.onrender.com
```

Update code to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const response = await fetch(`${API_URL}/api/predict-jobs`, {
```

### 3.2 Update Backend CORS

**File: `backend/app.py`**

Update CORS origins to include your Vercel domain:
```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "https://nexus-app.vercel.app",  # Add your Vercel URL
    "https://*.vercel.app"  # Allow all preview deployments
]
```

### 3.3 Commit Changes
```bash
git add .
git commit -m "Update for production deployment"
git push
```

### 3.4 Deploy on Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
cd "c:\Users\lamha\Nexus App"
vercel
```

**Option B: Using Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Import your GitHub repository `nexus-app`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com`
5. Click "Deploy"

⏱️ Deployment takes 1-2 minutes

---

## Part 4: Final Configuration

### 4.1 Update Backend CORS with Final URL
After Vercel deployment, you'll get a URL like: `https://nexus-app.vercel.app`

Go back to Render:
1. Open your backend service
2. Go to "Environment" tab
3. Add variable `FRONTEND_URL` = `https://nexus-app.vercel.app`
4. Update `app.py` to use it (or manually update CORS list)
5. Save and redeploy

### 4.2 Test Your Deployment
1. Visit your Vercel URL
2. Try uploading a CV
3. Check if predictions work
4. Test CV builder

---

## Part 5: Custom Domain (Optional)

### 5.1 Frontend Custom Domain
1. In Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `nexus-app.com`)
3. Follow DNS instructions from your domain provider

### 5.2 Backend Custom Domain
1. In Render Dashboard → Settings → Custom Domain
2. Add subdomain (e.g., `api.nexus-app.com`)
3. Update DNS records

---

## 🔧 Troubleshooting

### Backend Issues
- **500 Error**: Check Render logs in Dashboard → Logs
- **CORS Error**: Ensure frontend URL is in `allow_origins`
- **Timeout**: Free tier sleeps after 15min inactivity (first request takes ~30s)

### Frontend Issues
- **API Connection Failed**: Check `VITE_API_URL` environment variable
- **Build Failed**: Run `npm run build` locally to test
- **404 on Refresh**: Vercel handles this automatically for SPA

---

## 📊 Free Tier Limits

### Render (Backend)
- ✅ 750 hours/month (enough for 1 service)
- ✅ Sleeps after 15min inactivity
- ✅ 512MB RAM
- ⚠️ Cold starts (~30s on first request)

### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ 100GB bandwidth/month
- ✅ Instant edge deployment
- ✅ Automatic SSL certificates
- ✅ Preview deployments for branches

---

## 🎯 Post-Deployment Checklist

- [ ] Backend is live and responding
- [ ] Frontend is live and loads correctly
- [ ] CV upload works
- [ ] Job predictions work
- [ ] Cover letter generation works
- [ ] CV builder and PDF download work
- [ ] All pages navigate correctly
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic)

---

## 🔄 Continuous Deployment

Once set up:
- Push to GitHub → Vercel auto-deploys frontend
- Push to GitHub → Render auto-deploys backend
- Preview deployments for pull requests

---

## 💡 Tips

1. **Keep backend awake**: Use a service like UptimeRobot to ping your backend every 5 minutes
2. **Monitor**: Check Render and Vercel dashboards for errors
3. **Logs**: Always check logs if something breaks
4. **Environment Variables**: Never commit API keys - use environment variables

---

## 🆘 Need Help?

Common commands:
```bash
# View Vercel logs
vercel logs

# Redeploy frontend
git push

# Check backend health
curl https://your-backend.onrender.com/
```

---

## 🎉 Your URLs

After deployment:
- Frontend: `https://nexus-app.vercel.app`
- Backend: `https://nexus-backend.onrender.com`

Share your live app! 🚀
