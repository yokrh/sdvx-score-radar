FROM node:10.16

LABEL maintainer="yokrh"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY .env ./
COPY src/ ./src/
COPY sdvx-score-rader-sa-api.json ./

# Run app
# 8080 is the default port of Cloud Run. See Terraform script (infra/terraform/api/main.tf) for more information.
EXPOSE 8080
CMD [ "npm", "run", "start" ]
