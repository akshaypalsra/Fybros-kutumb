## Microk8s deployment

Create Prod build and tag the image

```shell
export CUSTOM_BUILD_NUMBER=0.0.1
docker build --build-arg BUILD_ENV=uat . -t docker.carvia.tech/kube-repo/soi-web:${CUSTOM_BUILD_NUMBER}
docker push docker.carvia.tech/kube-repo/soi-web:${CUSTOM_BUILD_NUMBER}
```

Docker run
```shell
docker run --name aws-scheduler-web -p 80:80 docker.carvia.tech/kube-repo/aws-scheduler-web:1
```

Run cdk8s synthesis and deploy

```shell
export version=${CUSTOM_BUILD_NUMBER} && export env=dev && cdk8s synth
microk8s kubectl apply -f dist/ -n dev
```
