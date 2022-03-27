#!/usr/bin/env bash
set -e

ENV_TYPE=prod
BUILD_TAG=hitman-$ENV_TYPE-$BUILD_NUMBER
REGISTRY=ghcr.io/john-doherty01

sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
mkdir ~/.kube/
touch ~/.kube/config
echo $KUBECTL_CONFIG | tee ~/.kube/config

sed -i "s/VERSION/${BUILD_TAG}/g" ./docker/rest-api/rest-api.yaml
sed -i "s/VERSION/${BUILD_TAG}/g" ./docker/celery-worker/celery-worker.yaml
sed -i "s/VERSION/${BUILD_TAG}/g" ./docker/celery-flower/celery-flower.yaml

echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

docker build -f ./docker/rest-api/Dockerfile . -t hitman/rest-api
docker tag hitman/rest-api $REGISTRY/hitman-rest-api:$BUILD_TAG
docker push $REGISTRY/hitman-rest-api:$BUILD_TAG

docker build -f ./docker/celery-worker/Dockerfile . -t hitman/celery-worker
docker tag hitman/celery-worker $REGISTRY/hitman-celery-worker:$BUILD_TAG
docker push $REGISTRY/hitman-celery-worker:$BUILD_TAG

docker build -f ./docker/celery-flower/Dockerfile . -t hitman/celery-flower
docker tag hitman/celery-flower $REGISTRY/hitman-celery-flower:$BUILD_TAG
docker push $REGISTRY/hitman-celery-flower:$BUILD_TAG

kubectl apply -f ./docker/rest-api/rest-api.yaml
kubectl apply -f ./docker/celery-worker/celery-worker.yaml
kubectl apply -f ./docker/celery-flower/celery-flower.yaml