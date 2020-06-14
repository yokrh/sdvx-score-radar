#!/usr/bin/env bash

# Prepare GCP SA Credentials
sh ./copy_sa_credentials.sh

# Variables
IMAGE_NAME=sdvx-score-rader-api
IMAGE_VERSION=1.0.0

# Build a container image
docker build -t $IMAGE_NAME:$IMAGE_VERSION .
