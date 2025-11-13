# 🚀 Complete Jenkins CI/CD Setup Guide for Nexus

Follow these steps **in order** to set up a complete automated pipeline for your Nexus project.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Docker installed on your machine
- ✅ GitHub account with your Nexus repository
- ✅ Vercel account (for frontend deployment)
- ✅ Koyeb account (for backend deployment)
- ✅ Docker Hub account (for container registry)

---

## 🎯 STEP 1: Install Jenkins

### Option A: Using Docker (Recommended)

Open PowerShell and run:

```powershell
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name jenkins jenkins/jenkins:lts
```

**Wait 1-2 minutes** for Jenkins to start, then verify it's running:

```powershell
docker ps
```

You should see the `jenkins` container running.

---

## 🔑 STEP 2: Get Initial Admin Password

Run this command to get the password:

```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Copy the password** (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

---

## 🌐 STEP 3: Complete Jenkins Initial Setup

1. **Open your browser** and go to: http://localhost:8080

2. **Paste the password** from Step 2

3. **Click "Install suggested plugins"** (this takes 3-5 minutes)

4. **Create your admin user:**
   - Username: `admin` (or your choice)
   - Password: `your-secure-password`
   - Full name: `Your Name`
   - Email: `tahalamhandi11@gmail.com`

5. **Click "Save and Continue"**

6. **Keep the default Jenkins URL**: http://localhost:8080

7. **Click "Start using Jenkins"**

---

## 🔌 STEP 4: Install Required Plugins

1. Go to **Manage Jenkins** (left sidebar) → **Manage Plugins**

2. Click the **"Available"** tab

3. **Search and select** these plugins (use the search box):
   - ✅ `Git plugin`
   - ✅ `GitHub Integration Plugin`
   - ✅ `Pipeline`
   - ✅ `Docker Pipeline`
   - ✅ `NodeJS Plugin`
   - ✅ `Email Extension Plugin`
   - ✅ `Workspace Cleanup Plugin`

4. **Click "Install without restart"**

5. **Wait** for installation to complete (2-3 minutes)

6. **Check "Restart Jenkins when installation is complete"**

7. **Wait** for Jenkins to restart (~1 minute), then log back in

---

## 🛠️ STEP 5: Configure Global Tools

1. Go to **Manage Jenkins → Global Tool Configuration**

### Configure NodeJS:
1. Scroll down to **NodeJS installations**
2. Click **"Add NodeJS"**
3. Fill in:
   - Name: `NodeJS-20`
   - ✅ Check "Install automatically"
   - Version: Select `NodeJS 20.x.x` (latest 20.x version)
4. Click **"Save"**

---

## 🔐 STEP 6: Add All Required Credentials

Go to **Manage Jenkins → Manage Credentials → System → Global credentials → Add Credentials**

### Credential 1: GitHub Personal Access Token

1. **Click "Add Credentials"**
2. Fill in:
   - **Kind**: `Username with password`
   - **Scope**: `Global`
   - **Username**: Your GitHub username (e.g., `TahaLamhandi`)
   - **Password**: Your GitHub Personal Access Token
     - Get it from: https://github.com/settings/tokens
     - Click "Generate new token (classic)"
     - Select scopes: `repo`, `admin:repo_hook`, `workflow`
     - Click "Generate token" and copy it
   - **ID**: `github-credentials`
   - **Description**: `GitHub Personal Access Token`
3. **Click "Create"**

### Credential 2: Vercel Token

1. **Click "Add Credentials"** again
2. Fill in:
   - **Kind**: `Secret text`
   - **Scope**: `Global`
   - **Secret**: Your Vercel token
     - Get it from: https://vercel.com/account/tokens
     - Click "Create Token"
     - Name it "Jenkins CI/CD"
     - Copy the token
   - **ID**: `vercel-token`
   - **Description**: `Vercel Deployment Token`
3. **Click "Create"**

### Credential 3: Vercel Organization ID

1. Open PowerShell and run:
   ```powershell
   npm install -g vercel
   vercel login
   vercel whoami
   ```
   Copy your org ID from the output

2. **In Jenkins, click "Add Credentials"**
3. Fill in:
   - **Kind**: `Secret text`
   - **Scope**: `Global`
   - **Secret**: Paste your Vercel org ID
   - **ID**: `vercel-org-id`
   - **Description**: `Vercel Organization ID`
4. **Click "Create"**

### Credential 4: Vercel Project ID

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your **Nexus project**
3. Go to **Settings → General**
4. Copy the **Project ID**

5. **In Jenkins, click "Add Credentials"**
6. Fill in:
   - **Kind**: `Secret text`
   - **Scope**: `Global`
   - **Secret**: Paste your project ID
   - **ID**: `vercel-project-id`
   - **Description**: `Vercel Project ID`
7. **Click "Create"**

### Credential 5: Koyeb Token

1. Get your token from: https://app.koyeb.com/account/api
2. Click **"Create Secret"**
3. Name it "Jenkins CI/CD"
4. Copy the token

5. **In Jenkins, click "Add Credentials"**
6. Fill in:
   - **Kind**: `Secret text`
   - **Scope**: `Global`
   - **Secret**: Paste your Koyeb token
   - **ID**: `koyeb-token`
   - **Description**: `Koyeb API Token`
7. **Click "Create"**

### Credential 6: Gemini API Key

1. **Click "Add Credentials"**
2. Fill in:
   - **Kind**: `Secret text`
   - **Scope**: `Global`
   - **Secret**: `AIzaSyBHgEtd4yuCcnXxRAH9flPsZrtZSRgSdrc`
   - **ID**: `gemini-api-key`
   - **Description**: `Gemini AI API Key`
3. **Click "Create"**

### Credential 7: Docker Hub Credentials

1. **Click "Add Credentials"**
2. Fill in:
   - **Kind**: `Username with password`
   - **Scope**: `Global`
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password (or access token)
     - Get token from: https://hub.docker.com/settings/security
   - **ID**: `docker-hub-credentials`
   - **Description**: `Docker Hub Credentials`
3. **Click "Create"**

**✅ You should now have 7 credentials configured!**

---

## 📦 STEP 7: Create the Pipeline Job

1. **Go to Jenkins Dashboard** (click "Jenkins" logo top-left)

2. **Click "New Item"** (left sidebar)

3. **Configure the job:**
   - **Name**: `Nexus-CI-CD-Pipeline`
   - **Type**: Select **"Pipeline"**
   - **Click "OK"**

4. **General Section:**
   - ✅ Check **"GitHub project"**
   - **Project url**: `https://github.com/TahaLamhandi/Nexus/`

5. **Build Triggers Section:**
   - ✅ Check **"GitHub hook trigger for GITScm polling"**

6. **Pipeline Section:**
   - **Definition**: Select **"Pipeline script from SCM"**
   - **SCM**: Select **"Git"**
   - **Repository URL**: `https://github.com/TahaLamhandi/Nexus.git`
   - **Credentials**: Select **"github-credentials"** from dropdown
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`

7. **Click "Save"**

---

## 🔗 STEP 8: Setup GitHub Webhook

1. **Open your browser** and go to: https://github.com/TahaLamhandi/Nexus/settings/hooks

2. **Click "Add webhook"**

3. **Fill in:**
   - **Payload URL**: `http://localhost:8080/github-webhook/`
     
     ⚠️ **Important**: If Jenkins is on your local machine, you need to use **ngrok**:
     
     ```powershell
     # Install ngrok from: https://ngrok.com/download
     ngrok http 8080
     ```
     
     Use the ngrok URL (e.g., `https://abc123.ngrok.io/github-webhook/`)
   
   - **Content type**: Select `application/json`
   - **Which events**: Select **"Just the push event"**
   - ✅ **Active** should be checked

4. **Click "Add webhook"**

5. **Verify**: You should see a green checkmark ✅ next to the webhook after a few seconds

---

## 📧 STEP 9: Configure Email Notifications (Optional but Recommended)

1. Go to **Manage Jenkins → Configure System**

2. Scroll down to **Extended E-mail Notification**

3. **Fill in:**
   - **SMTP server**: `smtp.gmail.com`
   - **SMTP port**: `587`
   - ✅ Check **"Use SSL"**
   - **Credentials**: Click "Add" → Jenkins
     - **Kind**: `Username with password`
     - **Username**: Your Gmail address
     - **Password**: Gmail App Password
       - Get it from: https://myaccount.google.com/apppasswords
       - Select "Mail" and "Other (Custom name)"
       - Name it "Jenkins"
       - Copy the 16-character password
   - **Default recipients**: `tahalamhandi11@gmail.com`

4. **Click "Save"**

---

## 🧪 STEP 10: Test Your Pipeline!

Now let's test if everything works:

1. **Open your terminal** in the Nexus project folder:

```powershell
cd "C:\Users\lamha\Nexus App"
```

2. **Make a small change** (or use empty commit):

```powershell
git commit --allow-empty -m "Test Jenkins CI/CD Pipeline"
git push origin main
```

3. **Watch Jenkins**:
   - Go to: http://localhost:8080
   - Click on **"Nexus-CI-CD-Pipeline"**
   - You should see a build starting (blue ball = building)
   - Click on the **build number** (e.g., #1)
   - Click **"Console Output"** to see live logs

4. **Expected Results** (takes ~7-8 minutes):
   - ✅ Checkout Code
   - ✅ Code Quality Check
   - ✅ Run Tests
   - ✅ Build Frontend
   - ✅ Build Docker Image
   - ✅ Deploy to Production
   - ✅ Health Check
   - ✅ Email notification sent

---

## 📊 What Your Pipeline Does Automatically

```
┌─────────────────────────────────────────┐
│  You Push Code to GitHub                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  GitHub Webhook Triggers Jenkins        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Jenkins Pipeline Executes:             │
│  1. ✅ Checkout code                     │
│  2. ✅ Lint (ESLint + Flake8)            │
│  3. ✅ Test (Jest + Pytest)              │
│  4. ✅ Build frontend (npm)              │
│  5. ✅ Build Docker image                │
│  6. ✅ Deploy frontend to Vercel         │
│  7. ✅ Deploy backend to Koyeb           │
│  8. ✅ Health checks                     │
│  9. ✅ Email notification                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Your App is LIVE! 🚀                   │
│  Frontend: nexusai-iota.vercel.app      │
│  Backend: hissing-pierette-*.koyeb.app  │
└─────────────────────────────────────────┘
```

**Time**: ~7-8 minutes per deployment

---

## 🔍 Monitoring Your Pipeline

### Jenkins Dashboard
- **URL**: http://localhost:8080
- **View builds**: Click on job name → Build History
- **View logs**: Click build number → Console Output
- **View tests**: Click build number → Test Results

### Deployment URLs
- **Frontend**: https://nexusai-iota.vercel.app/
- **Backend**: https://hissing-pierette-1tahaaaaa1-fff858c6.koyeb.app/

---

## 🆘 Troubleshooting

### Issue: Jenkins container not starting
```powershell
# Check if port 8080 is already in use
netstat -ano | findstr :8080

# Stop and remove old container
docker stop jenkins
docker rm jenkins

# Start fresh
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name jenkins jenkins/jenkins:lts
```

### Issue: Can't access Jenkins at localhost:8080
```powershell
# Check if container is running
docker ps

# Check logs
docker logs jenkins

# Restart container
docker restart jenkins
```

### Issue: GitHub webhook not triggering builds
**Solution 1: Use ngrok for local testing**
```powershell
ngrok http 8080
# Use the ngrok URL in GitHub webhook
```

**Solution 2: Check webhook deliveries**
- Go to: https://github.com/TahaLamhandi/Nexus/settings/hooks
- Click on your webhook
- Check "Recent Deliveries" tab
- Look for errors

### Issue: Build fails at "Permission denied" for Docker
```powershell
# Give Jenkins user Docker permissions
docker exec -u root jenkins usermod -aG docker jenkins
docker restart jenkins
```

### Issue: Vercel deployment fails
**Check:**
1. Vercel token is valid
2. Project ID is correct
3. Organization ID is correct

**Test manually:**
```powershell
vercel --token YOUR_TOKEN --prod
```

### Issue: Koyeb deployment fails
**Check:**
1. Koyeb API token is valid
2. Service is running on Koyeb dashboard

**Redeploy manually:**
- Go to: https://app.koyeb.com/
- Find your service
- Click "Redeploy"

### Issue: Email notifications not working
**Check:**
1. Gmail App Password is correct (not your regular password)
2. SMTP settings are correct
3. Email extension plugin is installed

---

## ✅ Success Checklist

After completing all steps, you should have:

- ✅ Jenkins running at http://localhost:8080
- ✅ 7 credentials configured
- ✅ Pipeline job created
- ✅ GitHub webhook active (green checkmark)
- ✅ Email notifications configured
- ✅ First successful build completed
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Koyeb
- ✅ Health checks passing

---

## 🎯 What Happens Next

**Every time you push code to GitHub:**

1. ⚡ **Automatic trigger** - GitHub webhook activates Jenkins
2. 🔍 **Code quality** - Linting checks your code
3. 🧪 **Tests run** - All tests execute automatically
4. 🏗️ **Build process** - Frontend and Docker images built
5. 🚀 **Deployment** - Both frontend and backend deploy
6. ✅ **Verification** - Health checks confirm deployment
7. 📧 **Notification** - You receive email with results

**No manual deployment needed ever again!** 🎉

---

## 📚 Additional Files in Your Project

- **`Jenkinsfile`** - The pipeline configuration (already in your repo)
- **`Dockerfile`** - Backend Docker configuration (already in your repo)
- **`PIPELINE_ARCHITECTURE.md`** - Visual pipeline diagram
- **`JENKINS_SETUP.md`** - Extended documentation

---

## 🚀 You're All Set!

Your Nexus project now has **enterprise-grade CI/CD**! 

Every push to `main` automatically:
- ✅ Tests your code
- ✅ Builds everything
- ✅ Deploys to production
- ✅ Verifies it's working
- ✅ Notifies you

**Happy coding! 🎉**
