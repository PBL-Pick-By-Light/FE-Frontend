# PBL-Frontend
This is the frontend of the [Pick-by-Light](https://github.com/PBL-Pick-By-Light) project.
Detailed information about the project and the single components can be found in the frontend [documentation](./docs/README.md). 

The frontend can be started via [docker](https://docs.docker.com/get-started/).

## Start
The docker commands must be used in the location of the "Dockerfile" file.

Before the build, the ip to the backend can be adjusted in the `config/config.json`.
Further adjustments for the nginx server can be configured in the `config/nginx.conf`, but are usually not necessary.
#### Build Docker-Image
```
docker build . -t frontend
```

#### First time build and run container
The port used by the webserver can be specified within the command. Default is `8080`.<br> (`80` is the port of the nginx server running in the container, defined in the `config/nginx.conf`.)
```
docker run --name frontend -d -p 8080:80 frontend
```

#### Start or stop container after first run
```
docker start frontend
docker stop frontend
```
#### Development
```
npm install
npm run serve
```
