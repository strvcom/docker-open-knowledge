# Session 1 - Basics of Docker 🐋

### Virtual Machines vs Containerization

Similar goals:
* Both are virtualization strategies  
* Self-contained units that could run everywhere 
* To isolate an application and all its dependencies

VMs are a better choice for running apps that require all of the operating system’s resources and functionality, when you need to run multiple applications on servers, or have a wide variety of operating systems to manage.

Containers are a better choice when your biggest priority is maximizing the number of applications running on a minimal number of servers.
Containers share the the host system’s kernel.

For more info see:
https://www.backblaze.com/blog/vm-vs-containers/

### Docker

TODO: more silly definitions needed :)

* Implementation of Containers Virtualization
* Layered file system - UnionFS
* Declarable volumes and network units
* Public registry
* Community and Enterprise editions
* Integrated Orchestrator/Cluster manager

### WHY DOCKER?

TODO: Don't use terms those are not properly explained so far, rather start with more general goals

* It works in my machine!!!
* Registries - Push/Pull 
* Layers and Cache 
* Run-time isolation - Security 
* Environment replication

Docker provides the ability to package and run an application in a loosely isolated environment called a container. The isolation and security allow you to run many containers simultaneously on a given host. Containers are lightweight because they don’t need the extra load of a hypervisor, but run directly within the host machine’s kernel. This means you can run more containers on a given hardware combination than if you were using virtual machines

Docker provides tooling and a platform to manage the lifecycle of your containers:

Develop your application and its supporting components using containers.
The container becomes the unit for distributing and testing your application.
Deploy application into your production environment, as a container or an orchestrated service. This works in the same way whether your environment is a local machine, in-house hosting or a cloud provider.

Fast, consistent delivery of your applications
Responsive deployment and scaling
Running more workloads on the same hardware

### DOCKER ARCHITECTURE

Client-Server architecture 

* Docker Client (CLI) 
* Docker REST API
* Docker Daemon (Server)
* Docker Registry

The Docker client and daemon can run on the same system, or you can connect a Docker client to a remote Docker daemon. The Docker client and daemon communicate using a REST API, over UNIX sockets or a network interface.

#### The Docker daemon
The Docker daemon (dockerd) listens for Docker API requests and manages Docker objects such as images, containers, networks, etc. A daemon can also communicate with other daemons.

#### The Docker client
The Docker client (docker) is the primary way that many Docker users interact with Docker. When you use commands such as docker run, the client sends these commands to dockerd, which carries them out. The docker command uses the Docker API. The Docker client can communicate with more than one daemon.

#### Docker Image
An image is a read-only template with instructions for creating a Docker container

#### Docker registries
A Docker registry stores Docker images. Docker Hub is a public registry that anyone can use, and Docker is configured to look for images on Docker Hub by default. You can even run your own private registry.

When you use the docker pull or docker run commands, the required images are pulled from your configured registry. When you use the docker push command, your image is pushed to your configured registry.

#### Docker Container
A container is an instance of an image


### Building docker images

Dockerfile
Docker builds images automatically by reading the instructions from a Dockerfile -- a text file that contains all commands, in order, needed to build a given image.

A Docker image consists of layers each of which represents a Dockerfile instruction. The layers are stacked and each one is a delta of the changes from the previous layer.

    FROM ubuntu:18.04
    COPY . /app
    RUN make /app
    CMD python /app/app.py

Each instruction creates one layer, so 4 layers are created in total on top of the ubuntu:18.04 image:

FROM creates a layer from the ubuntu:18.04 Docker image.
COPY adds files from your Docker client’s current directory.
RUN builds your application with make.
CMD specifies what command to run within the container.

When you run an image and generate a container, you add a new writable layer (the “container layer”) on top of the underlying layers. All changes made to the running container, such as writing new files, modifying existing files, and deleting files, are written to this thin writable container layer.

https://docs.docker.com/storage/storagedriver/

Base Image
A base image is the image which implies the image to build on top of. It refers to the contents of the FROM directive in the Dockerfile. Each subsequent declaration in the Dockerfile modifies this base image. 
There are various base images available (in different OS flavors). They usually contain specific OS setup and utilities.

Now let's create a Dockerfile for our simple API server written in Node.js.

docker history

production and development build

USER
By default, root in a container is the same root (uid 0) as on the host machine. If a user manages to break out of an application running as root in a container, he may be able to gain access to the host with the same root user.

In Dockerfiles, you can define CMD defaults that include an executable. For example:
CMD ["executable","param1","param2"]
NOTE: There can only be one CMD instruction in a Dockerfile. If you list more than one CMD, then only the last CMD will take effect.
