#!/usr/bin/env bash

# Variables
IMAGE_NAME=sdvx-score-rader-api
IMAGE_VERSION=1.0.0

# Run
# 8080 is the default port of Cloud Run. See Terraform script (infra/terraform/api/main.tf) for more information.
docker run -it -d -p 4000:8080 $IMAGE_NAME:$IMAGE_VERSION
# If use the image in GCP Container Registory
# ref: https://cloud.google.com/container-registry/docs/advanced-authentication#gcloud-helper
# docker pull gcr.io/sdvx-score-rader/api-server:latest

# Log
# docker logs -f --tail=500 <Container Id>
