# ⚡ Quick Start: Jenkins CI/CD for Nexus

## 🚀 5-Minute Setup

### 1️⃣ Install Jenkins (Docker)
```bash
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name jenkins jenkins/jenkins:lts
```

### 2️⃣ Get Initial Password
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### 3️⃣ Open Jenkins
Open: http://localhost:8080
- Paste initial password
- Install suggested plugins
- Create admin user

### 4️⃣ Install Required Plugins
**Manage Jenkins → Manage Plugins → Available**
- Git Plugin
- GitHub Integration
- Pipeline
- Docker Pipeline
- NodeJS Plugin

### 5️⃣ Add Credentials
**Manage Jenkins → Credentials → Global → Add**

| ID | Type | Secret | Get From |
|----|------|--------|----------|
| `github-credentials` | Username/Password | GitHub PAT | https://github.com/settings/tokens |
| `vercel-token` | Secret text | Vercel token | https://vercel.com/account/tokens |
| `koyeb-token` | Secret text | Koyeb token | https://app.koyeb.com/account/api |
| `docker-hub-credentials` | Username/Password | Docker creds | https://hub.docker.com |

### 6️⃣ Create Pipeline Job
1. **New Item** → Name: `Nexus-CI-CD`
2. **Type**: Pipeline
3. **Pipeline from SCM**: Git
4. **Repository**: `https://github.com/TahaLamhandi/Nexus.git`
5. **Credentials**: `github-credentials`
6. **Branch**: `main`
7. **Script Path**: `Jenkinsfile`
8. **Save**

### 7️⃣ Setup GitHub Webhook
1. Go to: https://github.com/TahaLamhandi/Nexus/settings/hooks
2. **Add webhook**
3. **URL**: `http://YOUR_JENKINS:8080/github-webhook/`
4. **Content type**: `application/json`
5. **Save**

### 8️⃣ Test It!
```bash
git add .
git commit -m "Test Jenkins"
git push origin main
```

Watch Jenkins automatically:
✅ Build → ✅ Test → ✅ Deploy → ✅ Notify

---

## 📊 What Happens Automatically

```
Your Push → GitHub → Jenkins → Tests → Build → Deploy → Email ✅
```

- **Frontend** deploys to Vercel
- **Backend** deploys to Koyeb
- **Email** notifies you of success/failure

---

## 🔍 Check Status

- **Jenkins Dashboard**: http://localhost:8080
- **Frontend**: https://nexusai-iota.vercel.app
- **Backend**: https://hissing-pierette-1tahaaaaa1-fff858c6.koyeb.app

---

## 🆘 Common Issues

### Jenkins not accessible?
```bash
docker ps  # Check if running
docker logs jenkins  # Check logs
```

### GitHub webhook not working?
Use ngrok for local testing:
```bash
ngrok http 8080
# Use ngrok URL in GitHub webhook
```

### Build failing?
Check console output:
http://localhost:8080/job/Nexus-CI-CD/lastBuild/console

---

## 📚 Full Documentation

- **Complete Setup**: `JENKINS_SETUP.md`
- **Pipeline Architecture**: `PIPELINE_ARCHITECTURE.md`
- **Jenkinsfile**: In project root

---

## 🎯 Next Steps

1. ✅ Setup email notifications
2. ✅ Add more tests
3. ✅ Configure Slack/Discord alerts
4. ✅ Add staging environment
5. ✅ Implement blue-green deployments

**You're ready! Every push to `main` now triggers the full CI/CD pipeline! 🚀**
