# 🚀 Deploy to Railway (5 Minutes)

## Option 1: Via Website (Easiest)

### Step 1: Deploy Backend
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Login with GitHub
4. Click "Deploy from GitHub repo"
5. Select **TahaLamhandi/Nexus**
6. Railway will detect your backend automatically
7. Wait 2-3 minutes for deployment
8. Copy your backend URL (looks like: `https://nexus-backend-production-XXXX.up.railway.app`)

### Step 2: Update Environment Variable
1. In Railway dashboard, go to **Variables** tab
2. Add: `PORT = 8000`
3. Click **Deploy** to apply changes

### Step 3: Update CORS in Backend
Open `backend/app.py` and update line 24:
```python
allow_origins=[
    "http://localhost:5173",
    "https://nexus.vercel.app",
    "https://*.vercel.app",
    "https://nexus-backend-production-XXXX.up.railway.app"  # Add your Railway URL
]
```

### Step 4: Commit & Push
```powershell
cd "c:\Users\lamha\Nexus App"
git add .
git commit -m "Update CORS for Railway"
git push origin main
```

Railway will auto-deploy the update!

### Step 5: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import **TahaLamhandi/Nexus**
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://nexus-backend-production-XXXX.up.railway.app` (your Railway URL)
6. Click **Deploy**
7. Wait 2 minutes ⏳
8. Done! 🎉

---

## ✅ Testing Your Deployed App

Visit your Vercel URL (e.g., `https://nexus-taha.vercel.app`) and test:
- [ ] Homepage loads
- [ ] CV upload works
- [ ] Job predictions show
- [ ] Cover letter generates
- [ ] CV builder works
- [ ] PDF downloads

---

## 🆓 Free Tier Limits
- Railway: $5 credit/month (enough for small projects)
- Vercel: Unlimited for personal projects

---

## 🐛 Common Issues

**Backend not responding?**
- Check Railway logs: Dashboard → Deployments → View Logs
- Ensure PORT environment variable = 8000

**Frontend can't connect to backend?**
- Check CORS settings in `backend/app.py`
- Verify VITE_API_URL in Vercel environment variables
- Check browser console for errors (F12)

**Railway out of free credits?**
- Use Koyeb instead (100% free forever) - see DEPLOY_KOYEB.md

---

## 📊 Monitoring

**Railway Dashboard:**
- View logs, metrics, deployment history
- Monitor usage and remaining credits

**Vercel Dashboard:**
- View deployment logs
- Monitor bandwidth and function invocations

---

## 🎯 Next Steps After Deployment

1. **Custom Domain (Optional):**
   - Buy domain from Namecheap (~$8/year)
   - Add to Vercel: Settings → Domains
   - Add to Railway: Settings → Domains

2. **Add Analytics:**
   - Vercel Analytics (free)
   - Google Analytics

3. **Monitor Performance:**
   - Check Railway logs regularly
   - Monitor Vercel function usage

---

## 💡 Pro Tips

- Railway auto-deploys on every GitHub push
- Vercel auto-deploys on every GitHub push
- Keep an eye on Railway credit usage
- Railway sleeps apps after 500 hours/month on free tier

---

**Need help? Railway has great docs at [docs.railway.app](https://docs.railway.app)**
