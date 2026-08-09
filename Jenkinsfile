// Define a custom function
def greet(name) {
    echo "Hello, ${name}!"
}

def getEnvironmentValue() {
    if (env.BRANCH_NAME == 'develop') {
        return Environment.DEV
    } else if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
        return Environment.PRODUCTION
    }
    throw new IllegalArgumentException("Unknown branch")
}

enum Environment {
    DEV("kube-repo", "kubeconfig-dev", "dev", "dev"),
    PRODUCTION("kube-repo", "prod-kube-config", "prod", "dev");

    final String dockerRepo
    final String k8sCredentialsId
    final String cdk8sEnv
    final String namespace

    Environment(String dockerRepo, String k8sCredentialsId, String cdk8sEnv, String namespace) {
        this.dockerRepo = dockerRepo
        this.k8sCredentialsId = k8sCredentialsId
        this.cdk8sEnv = cdk8sEnv
        this.namespace = namespace
    }
}

pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '5', daysToKeepStr: '', numToKeepStr: '5')
    }

    environment {
        // Create a custom build number variable
        CUSTOM_BUILD_NUMBER = "${getEnvironmentValue().cdk8sEnv}-${BUILD_NUMBER}"
        REPOSITORY = 'fybros-kutumb-web'
        CI = 'true'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                script {
                    def BUILD_PROFILE = 'dev'
                    if (getEnvironmentValue() == Environment.DEV) {
                        BUILD_PROFILE = 'dev'
                    } else if (getEnvironmentValue() == Environment.PRODUCTION) {
                        BUILD_PROFILE = 'prod'
                    }
                    echo "Running Docker image with BUILD_PROFILE: ${BUILD_PROFILE}, REPO: ${REPOSITORY}, CUSTOM_BUILD_NUMBER: ${CUSTOM_BUILD_NUMBER}"
                    sh "docker build --build-arg BUILD_ENV=${BUILD_PROFILE} . -t docker.carvia.tech/kube-repo/${REPOSITORY}:${CUSTOM_BUILD_NUMBER}"
                }
            }
        }

        stage('Push image to Nexus') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-git-credentials', passwordVariable: 'DOCKER_REGISTRY_PWD', usernameVariable: 'DOCKER_REGISTRY_USER')]) {
                        sh "docker login docker.carvia.tech -u ${DOCKER_REGISTRY_USER} -p ${DOCKER_REGISTRY_PWD}"
                    }
                    sh "docker push docker.carvia.tech/${getEnvironmentValue().dockerRepo}/${REPOSITORY}:${CUSTOM_BUILD_NUMBER}"
                }
            }
        }

        /*stage('Push image to Docker Hub'){
            steps{
                script{
                    withCredentials([string(credentialsId: 'dockerhub-pwd', variable: 'dockerhubpwd')]) {
                    sh 'docker login -u vinaysingh123 -p ${dockerhubpwd}'
                    }
                    sh 'docker push vinaysingh123/kube-service:${CUSTOM_BUILD_NUMBER}'
                }
            }
        }*/

        /*stage('Push image to Kubernetes Internal Registry') {
            steps {
                script {
                    sh 'docker build . -t localhost:32000/diamond-service:${CUSTOM_BUILD_NUMBER}'
                    sh 'docker push localhost:32000/diamond-service:${CUSTOM_BUILD_NUMBER}'
                }
            }
        }*/

        /*stage('Helm Deploy'){
            steps{
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    script{
                        env.KUBECONFIG=readFile(env.KUBECONFIG).trim()
                    }
                    // Upgrade the Helm release with the new image tag
                    sh """
                    helm upgrade --install  ${HELM_CHART_NAME} helm-chart --namespace ${HELM_NAMESPACE} --set image.repository=vinaysingh123/kube-service:${CUSTOM_BUILD_NUMBER}
                    """
                }
            }
        }*/

        stage('Deploy to k8s-dev') {
            when {
                expression { getEnvironmentValue() == Environment.DEV }
//                branch 'develop'
            }
            tools {
                jdk "Java26"
            }
            steps {
                withCredentials([file(credentialsId: "${Environment.DEV.k8sCredentialsId}", variable: 'KUBECONFIG')]) {
                    script {
                        env.KUBECONFIG = readFile(env.KUBECONFIG).trim()
                    }
                    sh "cd cdk8s && export env=${Environment.DEV.cdk8sEnv} && export version=${CUSTOM_BUILD_NUMBER} && mvn compile && cdk8s synth"
                    sh "kubectl --kubeconfig=${KUBECONFIG} apply -f cdk8s/dist/ -n ${Environment.DEV.namespace}"
                }
            }
        }

        stage('Deploy to k8s-prod') {
            when {
                expression { getEnvironmentValue() == Environment.PRODUCTION }
//                anyOf {
//                    branch 'main'; branch 'master'
//                }
            }
            tools {
                jdk "Java26"
            }
            steps {
                withCredentials([file(credentialsId: "${Environment.PRODUCTION.k8sCredentialsId}", variable: 'KUBECONFIG')]) {
                    script {
                        env.KUBECONFIG = readFile(env.KUBECONFIG).trim()
                    }
                    sh "cd cdk8s && export env=${Environment.PRODUCTION.cdk8sEnv} && export version=${CUSTOM_BUILD_NUMBER} && mvn compile && cdk8s synth"
                    sh "kubectl --kubeconfig=${KUBECONFIG} apply -f cdk8s/dist/ -n ${Environment.PRODUCTION.namespace}"
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace'
            cleanWs()

            echo 'Sending build data to AlertSense Server'
            script {
                def buildCause = currentBuild.getBuildCauses()[0]
                def buildPrincipal = [type:"unknown", name:""]
                def buildUserCause =
                        currentBuild.getRawBuild().getCause(hudson.model.Cause.UserIdCause)
                buildPrincipal = [type:"user", name:buildCause.userId]
                print "Prining.."
                print buildCause.userId
                print "Checking the env var"
                print env.UserLoggedIn
                echo "[*] Starting build (id: ${env.UserLoggedIn}) on ${env.UserLoggedIn}"
                loggedInUser = buildCause.userId
                echo "Loggedin user"
                print loggedInUser
                echo loggedInUser
            }

            alertSensePublisher(
                    sourceEventId: "carvia-candidates-web-build",
                    project: 'Carvia Chat Web',
                    env: "${getEnvironmentValue().name()}",
                    channelId: '156e93f4-bcef-4bcd-b110-71107cfd81dc',
                    dashboardId: 'default')

            /*script {
                step([$class     : 'AlertSensePublisher', sourceEventId: 'techshorts-service-dev-build',
                      project    : 'Techshorts-service',
                      channelId  : '156e93f4-bcef-4bcd-b110-71107cfd81dc',
                      dashboardId: 'default'])
            }*/

        }
    }
}
