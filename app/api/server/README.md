# Api server

A backend api server for sdvx score rader app.


## Deploy

```sh
# Build container image and push it to registory
sh docker_image_push.sh

# Update Cloud Run
cd ../../../infra/terraform/api/
tf plan
tf apply -auto-approve
```


## Usage

```sh
# install dependent modules
npm install

# start graphql server
npm run dev
```

May check at http://localhost:4000.
Sample query is in doc/ directory.
