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
                timeout(time: 15, unit: 'MINUTES') {
                    sh 'docker compose build'
                }
            }
        }

        stage('Verify') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    sh 'docker compose up -d --wait backend'
                }
                echo 'Backend health check passed!'
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
                    sh '''#!/bin/bash
                        echo "Waiting for deployed application to become healthy..."
                        for i in {1..20}; do
                          echo "Deployment verification attempt $i of 20..."
                          if curl -f http://localhost:8003/health; then
                            echo "Deployment successful! Application is healthy on attempt $i"
                            exit 0
                          fi
                          echo "Application not ready yet, waiting 3 seconds..."
                          sleep 3
                        done
                        echo "Deployment verification failed after 20 attempts (60 seconds)"
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
