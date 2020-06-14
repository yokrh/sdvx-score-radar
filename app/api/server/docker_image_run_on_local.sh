#!/usr/bin/env bash

# Variables
IMAGE_NAME=sdvx-score-rader-api
IMAGE_VERSION=1.0.0

# Run
# 8080 is the default port of Cloud Run. See Terraform script (infra/terraform/api/main.tf) for more information.
docker run -it -d -p 4000:8080 $IMAGE_NAME:$IMAGE_VERSION

# Log
# docker logs -f --tail=500 <Container Id>
