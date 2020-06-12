#!/usr/bin/env bash

# Variables
IMAGE_NAME=sdvx-score-rader-api
IMAGE_VERSION=1.0.0

# Build a container image
docker build -t $IMAGE_NAME:$IMAGE_VERSION .
