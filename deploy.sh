#!/usr/bin/env bash
set -e

ENV_TYPE=prod
BUILD_TAG=hitman-$ENV_TYPE-$BUILD_NUMBER
REGISTRY=ghcr.io/john-doherty01

echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

docker build -f ./docker/webapp/Dockerfile . -t hitman/webapp --build-arg REACT_ENV_PROD="$REACT_ENV_PROD"
docker tag hitman/webapp $REGISTRY/hitman-webapp:$BUILD_TAG
docker push $REGISTRY/hitman-webapp:$BUILD_TAG

docker build -f ./docker/rest-api/Dockerfile . -t hitman/rest-api
docker tag hitman/rest-api $REGISTRY/hitman-rest-api:$BUILD_TAG
docker push $REGISTRY/hitman-rest-api:$BUILD_TAG

docker build -f ./docker/celery-worker/Dockerfile . -t hitman/celery-worker
docker tag hitman/celery-worker $REGISTRY/hitman-celery-worker:$BUILD_TAG
docker push $REGISTRY/hitman-celery-worker:$BUILD_TAG

docker build -f ./docker/celery-flower/Dockerfile . -t hitman/celery-flower
docker tag hitman/celery-flower $REGISTRY/hitman-celery-flower:$BUILD_TAG
docker push $REGISTRY/hitman-celery-flower:$BUILD_TAG
