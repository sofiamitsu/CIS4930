pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Verify') {
            steps {
                script {
                    sh 'docker compose up -d backend'
                    sh '''
                        for i in {1..10}; do
                          if curl -f http://localhost:8003/health >/dev/null 2>&1; then
                            echo 'Health check passed'
                            exit 0
                          fi
                          echo 'Waiting for backend to become healthy...'
                          sleep 2
                        done
                        echo 'Backend failed to start in time'
                        exit 1
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker compose down || true'
        }
    }
}
