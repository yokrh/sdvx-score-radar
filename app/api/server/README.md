# Api server

A backend api server for sdvx score rader app.


## Deploy

```sh
# Build a container image, push it to the GCP Container Registory,
# and deploy new one to Cloud Run
sh docker_image_push.sh
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
