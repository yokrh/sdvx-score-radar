FROM node:10.16

LABEL maintainer="yokrh"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY .env ./
COPY src/index.js ./src/index.js
COPY src/schema ./src/schema

# Run app
EXPOSE 4000
CMD [ "npm", "run", "start" ]
