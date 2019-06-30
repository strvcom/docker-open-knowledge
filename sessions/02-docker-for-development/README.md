# Session 2 - Docker for development 🐋

### Docker networking

One of the reasons Docker containers and services are so powerful is that you can connect them together, or connect them to non-Docker workloads. Docker’s networking subsystem is pluggable, using drivers. Several drivers exist by default, and provide core networking functionality:

* bridge: The default network driver. If you don’t specify a driver, this is the type of network you are creating. Bridge networks are usually used when your applications run in standalone containers that need to communicate.

* host: For standalone containers, remove network isolation between the container and the Docker host, and use the host’s networking directly. host is only available for swarm services on Docker 17.06 and higher.

* overlay: Overlay networks connect multiple Docker daemons together and enable swarm services to communicate with each other. You can also use overlay networks to facilitate communication between a swarm service and a standalone container, or between two standalone containers on different Docker daemons. This strategy removes the need to do OS-level routing between these containers.

* macvlan: Macvlan networks allow you to assign a MAC address to a container, making it appear as a physical device on your network. The Docker daemon routes traffic to containers by their MAC addresses. Using the macvlan driver is sometimes the best choice when dealing with legacy applications that expect to be directly connected to the physical network, rather than routed through the Docker host’s network stack.

* none: For this container, disable all networking. Usually used in conjunction with a custom network driver. none is not available for swarm services.

### Docker registry
A registry is a storage and content delivery system, holding named Docker images, available in different tagged versions.

Example: the image strvcom/docker-workshop, with tags 1.0 and 1.1.

Users interact with a registry by using docker push and pull commands.

```
docker pull strvcom/docker-workshop:1.1
```

```
docker tag hola-mundo-api -t strvcom/docker-workshop:1.1
docker push strvcom/docker-workshop:1.1
```

[Docker Hub](https://hub.docker.com/) provides a free-to-use, hosted Registry, plus additional features (organization accounts, automated builds, and more).

### Linking containers

Basically consists on giving containers a unique name in a DNS scope 
* A (legacy) way to achieve this is by using the flag “—link” 
* The recommended way to do it is just by creating a managed bridge network 
* Containers must be running in the same network 
* Instead of referencing a container as 172.16.0.1:8080 you could container1:8080 
* "Service discovery" out of the box

### Manage data in Docker
By default all files created inside a container are stored on a writable container layer. This means that:

* The data doesn’t persist when that container no longer exists, and it can be difficult to get the data out of the container if another process needs it.
* A container’s writable layer is tightly coupled to the host machine where the container is running. You can’t easily move the data somewhere else.
* Writing into a container’s writable layer requires a storage driver to manage the filesystem. The storage driver provides a union filesystem, using the Linux kernel. This extra abstraction reduces performance as compared to using data volumes, which write directly to the host filesystem.

No matter which type of mount you choose to use, the data looks the same from within the container. It is exposed as either a directory or an individual file in the container’s filesystem.

* <b>Volumes</b>  are stored in a part of the host files ystem which is managed by Docker (/var/lib/docker/volumes/ on Linux). Non-Docker processes should not modify this part of the filesystem. Volumes are the best way to persist data in Docker.

* <b>Bind mounts</b>  may be stored anywhere on the host system. They may even be important system files or directories. Non-Docker processes on the Docker host or a Docker container can modify them at any time.

* <b>tmpfs</b> mounts are stored in the host system’s memory only, and are never written to the host system’s filesystem.

<img src="img/mount.png" width="500" height="300" />

### Docker compose
Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration. 

Compose works in all environments: production, staging, development, testing, as well as CI workflows. 

Using Compose is basically a three-step process:

* Define your app’s environment with a Dockerfile so it can be reproduced anywhere.
* Define the services that make up your app in docker-compose.yml so they can be run together in an isolated environment.
* Run docker-compose up and Compose starts and runs your entire app.

Let's add docker-compose.yml into our application to get it ready for local development:

```
version: '2.4'

services:
  api:
    build:
      context: .
      target: dev
    image: hola-mundo-api:dev
    container_name: hola-mundo-api
    ports:
      - "3000:3000"
    environment:
      POSTGRES_URL: "postgresql://postgres:postgres@db:5432/hola-mundo-db"
      PORT: 3000
    volumes:
      - .:/app:delegated
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:10.6-alpine
    container_name: hola-mundo-db
    ports:
      - "5432:5432"
    volumes:
      - type: tmpfs
        target: /var/lib/postgresql/data
      - ./.db/initdb.d:/docker-entrypoint-initdb.d
    healthcheck:
      test: pg_isready -U postgres -h 127.0.0.1
      interval: 5s
```

Let's also adjust Dockerfile:

```
FROM node:12-slim AS base
ENV NODE_ENV=production
WORKDIR /app
RUN chown -R node:node /app
RUN chmod 755 /app
USER node
COPY ./package*.json ./
RUN npm ci && npm cache clean --force

FROM base AS dev
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:${PATH}
RUN npm install --only=development
CMD ["nodemon", "src/app.js", "--inspect=0.0.0.0:9229"]

FROM base AS source
COPY ./src /app/src/

FROM source as test
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:${PATH}
COPY --from=dev /app/node_modules /app/node_modules
COPY ./.eslintrc.js /app/.eslintrc.js
COPY ./tests/ /app/tests/
RUN eslint .
RUN jest
CMD ["echo", "tests succeed!"]

FROM source AS prod
CMD ["node", "src/app.js"]
```