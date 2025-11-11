# 🚀 Quick Deployment Checklist

## Before You Start
- [ ] All code is working locally
- [ ] You have a GitHub account
- [ ] You have Git installed

---

## Step-by-Step Deployment

### 1️⃣ Setup GitHub Repository (5 minutes)

```powershell
# In PowerShell, navigate to your project
cd "c:\Users\lamha\Nexus App"

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"
```

Then:
1. Go to https://github.com/new
2. Repository name: `nexus-app`
3. Public repository
4. Click "Create repository"
5. Copy the commands shown and run:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/nexus-app.git
git branch -M main
git push -u origin main
```

✅ Checkpoint: Your code is now on GitHub!

---

### 2️⃣ Deploy Backend on Render (10 minutes)

1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Find and select your `nexus-app` repository
4. Fill in:
   - **Name**: `nexus-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Wait ~5-10 minutes for deployment
7. **COPY YOUR BACKEND URL** (looks like: `https://nexus-backend-xxxx.onrender.com`)

✅ Checkpoint: Backend is deployed!

---

### 3️⃣ Update Frontend for Production (5 minutes)

Create a `.env` file in your project root:

```env
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
```

Replace `YOUR-BACKEND-URL` with the URL from step 2.

Now update your backend CORS:

**File: `backend/app.py`**

Find the CORS section and update:
```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "http://localhost:3000",
    "https://nexus-app.vercel.app",  # Add this
    "https://*.vercel.app"            # Add this
]
```

Commit and push:
```powershell
git add .
git commit -m "Add production URLs"
git push
```

✅ Checkpoint: Code updated for production!

---

### 4️⃣ Deploy Frontend on Vercel (5 minutes)

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New" → "Project"
3. Import your `nexus-app` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - Click "Environment Variables"
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com`
6. Click "Deploy"
7. Wait ~2 minutes

✅ Checkpoint: Frontend is deployed!

---

### 5️⃣ Final Test (2 minutes)

Your app is now live at: `https://nexus-app.vercel.app` (or similar)

Test:
- [ ] Homepage loads
- [ ] Upload CV works
- [ ] Job predictions show
- [ ] Cover letter generates
- [ ] CV builder works
- [ ] PDF downloads work

---

## ⚠️ Important Notes

### Backend Cold Starts
The free tier backend sleeps after 15 minutes of inactivity. The first request will take ~30 seconds. This is normal!

### Keep Backend Awake (Optional)
Use a free service like UptimeRobot:
1. Go to https://uptimerobot.com
2. Add monitor for your backend URL
3. Set interval to 5 minutes
4. Your backend stays warm!

---

## 🔄 Future Updates

To update your app:
```powershell
# Make changes to your code
# Then:
git add .
git commit -m "Description of changes"
git push
```

Both Vercel and Render will automatically deploy your changes!

---

## 📱 Share Your App

Your app is live! Share these URLs:
- **App**: `https://nexus-app.vercel.app`
- **API**: `https://nexus-backend.onrender.com`

---

## 🆘 Troubleshooting

### "API connection failed"
- Check if backend URL in `.env` is correct
- Verify backend is running on Render dashboard
- Check Render logs for errors

### "CORS error"
- Ensure Vercel URL is in backend CORS list
- Redeploy backend after updating CORS

### "Build failed on Vercel"
- Check build logs
- Try running `npm run build` locally first
- Ensure all dependencies in `package.json`

### "Backend is slow"
- First request after sleep takes ~30s (normal)
- Consider keeping it awake with UptimeRobot

---

## 🎉 Success!

Your Nexus App is now live and accessible worldwide! 🌍

**Free tier includes:**
- ✅ Unlimited frontend bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto deployments
- ✅ 750hrs backend/month
