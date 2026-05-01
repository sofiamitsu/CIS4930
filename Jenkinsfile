pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

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
                sh 'docker compose down || true'
                timeout(time: 3, unit: 'MINUTES') {
                    sh 'docker compose up -d --wait'
                }
                echo 'Deployment successful!'
            }
        }
    }

    post {
        failure {
            sh 'docker compose down || true'
        }
    }
}
