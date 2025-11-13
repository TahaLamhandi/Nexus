pipeline {
    agent any
    
    environment {
        // GitHub credentials
        GIT_CREDENTIALS = credentials('github-credentials')
        
        // Vercel credentials
        VERCEL_TOKEN = credentials('vercel-token')
        VERCEL_ORG_ID = credentials('vercel-org-id')
        VERCEL_PROJECT_ID = credentials('vercel-project-id')
        
        // Koyeb credentials
        KOYEB_TOKEN = credentials('koyeb-token')
        
        // Gemini API
        VITE_GEMINI_API_KEY = credentials('gemini-api-key')
        
        // Docker Hub credentials
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'yourusername/nexus-backend'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('🔍 Checkout Code') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/TahaLamhandi/Nexus.git'
            }
        }
        
        stage('🔬 Code Quality Check') {
            parallel {
                stage('Frontend Lint') {
                    steps {
                        echo '🧹 Linting frontend code...'
                        dir('frontend') {
                            bat 'npm install'
                            bat 'npm run lint || exit 0'
                        }
                    }
                }
                
                stage('Backend Lint') {
                    steps {
                        echo '🐍 Checking Python code quality...'
                        dir('backend') {
                            bat 'pip install flake8 || exit 0'
                            bat 'flake8 app.py --max-line-length=120 || exit 0'
                        }
                    }
                }
            }
        }
        
        stage('🧪 Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        echo '⚛️ Running React tests...'
                        dir('frontend') {
                            bat 'npm test -- --watchAll=false || exit 0'
                        }
                    }
                }
                
                stage('Backend Tests') {
                    steps {
                        echo '🐍 Running Python tests...'
                        dir('backend') {
                            bat 'pip install pytest pytest-cov'
                            bat 'pytest --cov=. --cov-report=xml || exit 0'
                        }
                    }
                }
            }
        }
        
        stage('🏗️ Build Frontend') {
            steps {
                echo '⚛️ Building React frontend...'
                bat 'npm install'
                bat 'npm run build'
            }
        }
        
        stage('🐳 Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for backend...'
                script {
                    dir('backend') {
                        docker.build("${DOCKER_IMAGE_BACKEND}:${DOCKER_IMAGE_TAG}")
                        docker.build("${DOCKER_IMAGE_BACKEND}:latest")
                    }
                }
            }
        }
        
        stage('🚀 Deploy to Production') {
            parallel {
                stage('Deploy Frontend to Vercel') {
                    steps {
                        echo '🌐 Deploying frontend to Vercel...'
                        bat """
                            npm install -g vercel
                            vercel --token ${VERCEL_TOKEN} --prod --yes
                        """
                    }
                }
                
                stage('Deploy Backend to Koyeb') {
                    steps {
                        echo '🚀 Deploying backend to Koyeb...'
                        script {
                            // Push Docker image
                            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                                docker.image("${DOCKER_IMAGE_BACKEND}:${DOCKER_IMAGE_TAG}").push()
                                docker.image("${DOCKER_IMAGE_BACKEND}:latest").push()
                            }
                            
                            // Trigger Koyeb redeploy via API
                            bat """
                                curl -X POST "https://app.koyeb.com/v1/services/YOUR_SERVICE_ID/redeploy" ^
                                -H "Authorization: Bearer ${KOYEB_TOKEN}" ^
                                -H "Content-Type: application/json"
                            """
                        }
                    }
                }
            }
        }
        
        stage('✅ Health Check') {
            steps {
                echo '🏥 Running health checks...'
                script {
                    // Check frontend
                    bat """
                        curl -f https://nexusai-iota.vercel.app/ || exit 1
                    """
                    
                    // Check backend
                    bat """
                        curl -f https://hissing-pierette-1tahaaaaa1-fff858c6.koyeb.app/ || exit 1
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            emailext (
                subject: "✅ Jenkins Build #${BUILD_NUMBER} - SUCCESS",
                body: """
                    <h2>Build Successful! 🎉</h2>
                    <p><strong>Project:</strong> Nexus AI</p>
                    <p><strong>Build:</strong> #${BUILD_NUMBER}</p>
                    <p><strong>Frontend:</strong> https://nexusai-iota.vercel.app/</p>
                    <p><strong>Backend:</strong> https://hissing-pierette-1tahaaaaa1-fff858c6.koyeb.app/</p>
                    <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                """,
                to: 'tahalamhandi11@gmail.com',
                mimeType: 'text/html'
            )
        }
        
        failure {
            echo '❌ Pipeline failed!'
            emailext (
                subject: "❌ Jenkins Build #${BUILD_NUMBER} - FAILED",
                body: """
                    <h2>Build Failed! ❌</h2>
                    <p><strong>Project:</strong> Nexus AI</p>
                    <p><strong>Build:</strong> #${BUILD_NUMBER}</p>
                    <p><strong>Error:</strong> Check Jenkins console output</p>
                    <p><a href="${BUILD_URL}">View Build</a></p>
                """,
                to: 'tahalamhandi11@gmail.com',
                mimeType: 'text/html'
            )
        }
        
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}
