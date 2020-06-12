#!/usr/bin/env bash

# Variables
IMAGE_NAME=sdvx-score-rader-api
IMAGE_VERSION=1.0.0

# Run
docker run -it -d -p 4000:4000 sdvx-score-rader-api:1.0.0
