# 🚀 Jenkins CI/CD Pipeline Setup for Nexus AI

## 📋 Prerequisites

- Jenkins installed (Docker or Windows)
- GitHub account
- Vercel account
- Koyeb account
- Docker Hub account

---

## 🔧 Step-by-Step Setup

### 1️⃣ **Install Jenkins**

#### Using Docker (Recommended):
```bash
docker pull jenkins/jenkins:lts
docker run -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins \
  jenkins/jenkins:lts
```

#### Using Windows:
1. Download: https://www.jenkins.io/download/
2. Install and access: http://localhost:8080
3. Get password: `C:\Program Files\Jenkins\secrets\initialAdminPassword`

---

### 2️⃣ **Install Required Plugins**

Go to **Manage Jenkins → Manage Plugins → Available**

Install these plugins:
- ✅ Git Plugin
- ✅ GitHub Integration Plugin
- ✅ Pipeline Plugin
- ✅ Docker Plugin
- ✅ Docker Pipeline Plugin
- ✅ NodeJS Plugin
- ✅ Credentials Plugin
- ✅ Email Extension Plugin
- ✅ Workspace Cleanup Plugin

---

### 3️⃣ **Configure Global Tools**

Go to **Manage Jenkins → Global Tool Configuration**

#### NodeJS:
- Name: `NodeJS-20`
- Install automatically: ✅
- Version: NodeJS 20.x

#### Docker:
- Name: `Docker`
- Install automatically: ✅

---

### 4️⃣ **Add Credentials**

Go to **Manage Jenkins → Manage Credentials → Global → Add Credentials**

#### GitHub Credentials:
- **Kind**: Username with password
- **ID**: `github-credentials`
- **Username**: Your GitHub username
- **Password**: GitHub Personal Access Token
  - Generate at: https://github.com/settings/tokens
  - Scopes needed: `repo`, `admin:repo_hook`

#### Vercel Token:
- **Kind**: Secret text
- **ID**: `vercel-token`
- **Secret**: Your Vercel token
  - Get from: https://vercel.com/account/tokens
  
#### Vercel Organization ID:
- **Kind**: Secret text
- **ID**: `vercel-org-id`
- **Secret**: Your Vercel org ID
  - Run: `vercel whoami` to get it

#### Vercel Project ID:
- **Kind**: Secret text
- **ID**: `vercel-project-id`
- **Secret**: Your Vercel project ID
  - Get from Vercel dashboard → Settings → General

#### Koyeb Token:
- **Kind**: Secret text
- **ID**: `koyeb-token`
- **Secret**: Your Koyeb API token
  - Get from: https://app.koyeb.com/account/api

#### Gemini API Key:
- **Kind**: Secret text
- **ID**: `gemini-api-key`
- **Secret**: `AIzaSyBHgEtd4yuCcnXxRAH9flPsZrtZSRgSdrc`

#### Docker Hub Credentials:
- **Kind**: Username with password
- **ID**: `docker-hub-credentials`
- **Username**: Your Docker Hub username
- **Password**: Your Docker Hub password/token

---

### 5️⃣ **Create Jenkins Pipeline Job**

1. **Dashboard → New Item**
2. **Name**: `Nexus-CI-CD-Pipeline`
3. **Type**: Pipeline
4. Click **OK**

#### Configure the Pipeline:

**General Section:**
- ✅ GitHub project
- Project URL: `https://github.com/TahaLamhandi/Nexus/`

**Build Triggers:**
- ✅ GitHub hook trigger for GITScm polling
- ✅ Poll SCM (for backup): `H/5 * * * *`

**Pipeline Section:**
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: `https://github.com/TahaLamhandi/Nexus.git`
- **Credentials**: Select `github-credentials`
- **Branch**: `*/main`
- **Script Path**: `Jenkinsfile`

Click **Save**

---

### 6️⃣ **Setup GitHub Webhook**

1. Go to: https://github.com/TahaLamhandi/Nexus/settings/hooks
2. Click **Add webhook**
3. **Payload URL**: `http://YOUR_JENKINS_URL:8080/github-webhook/`
   - If local: Use ngrok: `ngrok http 8080`
4. **Content type**: `application/json`
5. **Which events**: 
   - ✅ Just the push event
6. ✅ Active
7. Click **Add webhook**

---

### 7️⃣ **Configure Email Notifications**

Go to **Manage Jenkins → Configure System → Extended E-mail Notification**

**SMTP server**: `smtp.gmail.com`
**SMTP port**: `587`
**Use SSL**: ✅
**Credentials**: Add Gmail app password
- Gmail: Enable 2FA → App passwords → Generate

**Default recipients**: `tahalamhandi11@gmail.com`

---

### 8️⃣ **Update Dockerfile (Backend)**

The Dockerfile is already created at project root. Update if needed:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
EXPOSE 8000
ENV PORT=8000
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### 9️⃣ **Update Backend for Koyeb Deployment**

The backend is already configured. Verify `backend/Procfile`:

```
web: uvicorn app:app --host 0.0.0.0 --port $PORT
```

---

### 🔟 **Test the Pipeline**

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test Jenkins pipeline"
   git push origin main
   ```
3. Jenkins should automatically:
   - ✅ Pull code from GitHub
   - ✅ Run linting
   - ✅ Run tests
   - ✅ Build frontend
   - ✅ Build Docker image
   - ✅ Deploy to Vercel
   - ✅ Deploy to Koyeb
   - ✅ Run health checks
   - ✅ Send email notification

---

## 📊 Pipeline Stages Explained

| Stage | Description | Duration |
|-------|-------------|----------|
| **Checkout** | Pull latest code from GitHub | ~10s |
| **Code Quality** | ESLint (frontend) + Flake8 (backend) | ~30s |
| **Tests** | Jest (React) + Pytest (Python) | ~1min |
| **Build Frontend** | `npm run build` creates dist/ | ~2min |
| **Build Docker** | Creates backend Docker image | ~1min |
| **Deploy** | Vercel (frontend) + Koyeb (backend) | ~3min |
| **Health Check** | Verify both services are up | ~10s |

**Total**: ~7-8 minutes per deployment

---

## 🔍 Monitoring & Logs

### Jenkins Dashboard:
- **Build History**: See all builds
- **Console Output**: View detailed logs
- **Test Results**: See test pass/fail
- **Artifacts**: Download build artifacts

### Access Logs:
```bash
# Jenkins logs (Docker)
docker logs -f jenkins

# View specific build log
http://localhost:8080/job/Nexus-CI-CD-Pipeline/BUILD_NUMBER/console
```

---

## 🚨 Troubleshooting

### Issue: "Permission denied" for Docker
**Solution**:
```bash
# Add Jenkins user to docker group
docker exec -u root jenkins usermod -aG docker jenkins
docker restart jenkins
```

### Issue: GitHub webhook not triggering
**Solution**:
1. Check webhook deliveries in GitHub
2. Verify Jenkins URL is accessible
3. Use ngrok for local testing:
   ```bash
   ngrok http 8080
   # Use ngrok URL in GitHub webhook
   ```

### Issue: Vercel deployment fails
**Solution**:
1. Verify Vercel token is valid
2. Check project ID is correct
3. Run manually: `vercel --token YOUR_TOKEN --prod`

### Issue: Koyeb deployment fails
**Solution**:
1. Verify Koyeb API token
2. Check service ID in Jenkinsfile
3. Manually trigger: 
   ```bash
   curl -X POST https://app.koyeb.com/v1/services/SERVICE_ID/redeploy \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## 📧 Email Notification Examples

### Success Email:
```
Subject: ✅ Jenkins Build #42 - SUCCESS

Build Successful! 🎉
Project: Nexus AI
Build: #42
Frontend: https://nexusai-iota.vercel.app/
Backend: https://hissing-pierette-1tahaaaaa1-fff858c6.koyeb.app/
Duration: 7 min 23 sec
```

### Failure Email:
```
Subject: ❌ Jenkins Build #42 - FAILED

Build Failed! ❌
Project: Nexus AI
Build: #42
Stage Failed: Tests
Error: 3 tests failed in backend
View Build: http://jenkins:8080/job/Nexus-CI-CD-Pipeline/42
```

---

## 🎯 Next Steps

1. ✅ Add code coverage reports
2. ✅ Implement blue-green deployments
3. ✅ Add security scanning (OWASP, Snyk)
4. ✅ Setup staging environment
5. ✅ Add performance monitoring
6. ✅ Implement rollback strategy
7. ✅ Add Slack/Discord notifications

---

## 📚 Resources

- Jenkins Documentation: https://www.jenkins.io/doc/
- Pipeline Syntax: https://www.jenkins.io/doc/book/pipeline/syntax/
- Docker Integration: https://docs.docker.com/ci-cd/jenkins/
- Vercel CLI: https://vercel.com/docs/cli
- Koyeb API: https://www.koyeb.com/docs/api

---

## 🆘 Support

If you encounter issues:
1. Check Jenkins console output
2. Review GitHub webhook deliveries
3. Verify all credentials are correct
4. Test each deployment step manually
5. Check service status pages (Vercel, Koyeb)

**Contact**: tahalamhandi11@gmail.com
