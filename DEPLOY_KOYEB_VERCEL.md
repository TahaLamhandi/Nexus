# 🚀 Deploy Nexus to Koyeb + Vercel (10 Minutes)

## ✅ Prerequisites
- [x] Code pushed to GitHub (TahaLamhandi/Nexus) ✓
- [ ] Koyeb account (sign up at koyeb.com)
- [ ] Vercel account (sign up at vercel.com)

---

## 📦 Part 1: Deploy Backend to Koyeb (5 min)

### Step 1: Sign Up & Connect GitHub
1. Go to [koyeb.com](https://koyeb.com)
2. Click **"Sign Up"** → Use GitHub to sign up
3. Authorize Koyeb to access your GitHub repos

### Step 2: Create New App
1. Click **"Create App"**
2. Select **"GitHub"** as deployment method
3. Choose repository: **TahaLamhandi/Nexus**
4. Click **"Next"**

### Step 3: Configure Backend
Fill in these settings:

**Builder:**
- Type: **Buildpack**
- Select: **Python**

**Root Directory:**
```
backend
```

**Build Command:**
```
pip install -r requirements.txt
```

**Run Command:**
```
uvicorn app:app --host 0.0.0.0 --port 8000
```

**Port:**
```
8000
```

**Important:** Make sure to expose port 8000 in the networking settings

**Environment Variables:**
- Name: `PORT`
- Value: `8000`

**App Name:**
```
nexus-backend
```

**Region:** Choose closest to you (e.g., Frankfurt, Washington)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 3-4 minutes ⏳
3. Copy your backend URL (looks like: `https://nexus-backend-XXXXX.koyeb.app`)

---

## 🎨 Part 2: Update CORS Settings (2 min)

### Step 1: Open backend/app.py
Find line ~24 with CORS settings

### Step 2: Update CORS origins
Replace with:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://nexus-backend-XXXXX.koyeb.app",  # Your Koyeb URL
        "https://*.vercel.app",
        "https://nexus.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Push Changes
```powershell
cd "c:\Users\lamha\Nexus App"
git add .
git commit -m "Update CORS for Koyeb"
git push origin main
```

Koyeb will auto-deploy the update! (1-2 minutes)

---

## 🌐 Part 3: Deploy Frontend to Vercel (3 min)

### Step 1: Sign Up & Import
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → Use GitHub
3. Click **"Add New Project"**
4. Click **"Import"** next to **TahaLamhandi/Nexus**

### Step 2: Configure Project
**Framework Preset:**
```
Vite
```

**Root Directory:**
```
./
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

### Step 3: Add Environment Variable
Click **"Environment Variables"** section:

**Name:**
```
VITE_API_URL
```

**Value:**
```
https://nexus-backend-XXXXX.koyeb.app
```
(Use your Koyeb backend URL from Part 1, Step 4)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes ⏳
3. Done! 🎉

Your app will be live at: `https://nexus-XXXXX.vercel.app`

---

## ✅ Testing Your App

Visit your Vercel URL and test:
- [ ] Homepage loads properly
- [ ] Upload a CV → Check job predictions work
- [ ] Generate cover letter → Check PDF downloads
- [ ] CV Builder → Check all sections work
- [ ] CV Builder → Generate PDF

---

## 🐛 Troubleshooting

### Backend Issues (Koyeb)

**App won't start?**
1. Go to Koyeb Dashboard → Your App → **Logs**
2. Check for errors
3. Common fixes:
   - Ensure `requirements.txt` is in `backend/` folder
   - Check Port is set to `8000`
   - Verify run command: `uvicorn app:app --host 0.0.0.0 --port 8000`

**Backend URL not working?**
- Wait 5 minutes for DNS propagation
- Check app status in Koyeb dashboard (should be green/healthy)

### Frontend Issues (Vercel)

**Can't connect to backend?**
1. Open browser console (F12)
2. Check for CORS errors
3. Fixes:
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Check CORS settings in `backend/app.py`
   - Redeploy Vercel (Dashboard → Deployments → Redeploy)

**Environment variable not working?**
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify `VITE_API_URL` exists
3. Click **Redeploy** to apply changes

**Build fails?**
- Check Vercel build logs for errors
- Common fix: Ensure `package.json` has correct scripts:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```

---

## 🎯 URLs Summary

After deployment, you'll have:

**Backend (Koyeb):**
```
https://nexus-backend-XXXXX.koyeb.app
```

**Frontend (Vercel):**
```
https://nexus-XXXXX.vercel.app
```

**GitHub Repo:**
```
https://github.com/TahaLamhandi/Nexus
```

---

## 🔄 Future Updates

**To update your app:**
```powershell
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

Both Koyeb and Vercel will **automatically deploy** your changes! ✨

---

## 💡 Free Tier Limits

**Koyeb:**
- ✅ 100% Free Forever
- ✅ No credit card needed
- ✅ Always running (no sleep mode)
- ✅ Auto-scaling

**Vercel:**
- ✅ Free for personal projects
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS

---

## 🎉 You're Done!

Your Nexus app is now live on the internet! Share your Vercel URL with others to showcase your project.

**Questions?**
- Koyeb Docs: [docs.koyeb.com](https://docs.koyeb.com)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
