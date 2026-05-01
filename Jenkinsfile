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

        stage('Deploy') {
            steps {
                script {
                    echo 'Stopping verification containers...'
                    sh 'docker compose down || true'

                    echo 'Deploying application to EC2...'
                    sh 'docker compose up -d'

                    echo 'Verifying deployment...'
                    sh '''
                        for i in {1..10}; do
                          if curl -f http://localhost:8003/health >/dev/null 2>&1; then
                            echo 'Deployment successful - application is healthy'
                            exit 0
                          fi
                          echo 'Waiting for application to start...'
                          sleep 2
                        done
                        echo 'Deployment verification failed'
                        exit 1
                    '''
                }
            }
        }
    }

    post {
        failure {
            sh 'docker compose down || true'
        }
    }
}
