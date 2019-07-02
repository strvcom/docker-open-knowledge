# Session 3 - Docker deployment & orchestration 🐋

### Container orchestration

Container orchestration is all about managing the life cycles of containers, especially in large, dynamic environments. Software teams use container orchestration to control and automate many tasks:

* Provisioning and deployment of containers
* Redundancy and availability of containers
* Scaling up or removing containers to spread application load evenly across host infrastructure
* Movement of containers from one host to another if there is a shortage of resources in a host, or if a host dies
* Allocation of resources between containers
* External exposure of services running in a container with the outside world
* Load balancing of service discovery between containers
* Health monitoring of containers and hosts

### Deployment pipeline with Travis, Docker and Heroku

Let's add a simple deployment pipeline defined in travis.yml to our app:

```yml
services:
- docker

env:
  global:
  - secure: FSQZIVgPk/IKVQbNqdly9hYkuvSxzgp7I4u9y7zddPqufrX01Q+t5hdmvWIcpGl7ZagrgrG0tiqaIead+2y3ZTZ2PdxJ/cduXxx01XcRESxHte9m+CuAVlRXuL1rpaQBhutPqScQI5/xhPsBUrJ4oVLEjgzbqB20Yu2eOwrphWSpxu7B2O9e5mQsIr6TrDZOjt0/ZLtt/5/Soh+9yPuO40YzUdqglwWjkxbogn2GDF2wwPi2tv+33wEPQtaOLU83EJQuDuEA8Gk9arV/G+di004ABYXhMgdg6jT77omhyNRQE0nqdjd1raLq1GSm0FaFg5ZB6O+GC9D6yFTNzfmyOCvKDNBtfgCbr/dgeW4Nsk0wpPohWMDBr38Hk+I9aEGZ5JAR3qqZq7AU+5Nw9Fge6R0NEFA0EsCMjs64JKjD4NG9TCAwPDsfPX9t8My6Z0vNGnAGUvY8FxJ5ryIWUG28D5Pc04HhtpGk5RBDhNFw+YioStmcSbQUakUvI+tNKnzeGHl7o2Ydeha58zuHmlka9250Ja3tXa3fXLATA4SYJaauipMtjNfo8Wt3h5cnk0auea70uX8jikD6bdnEulZke4fdLPaBbjRH8LxZbmoHUYtdFJiYunrmrB82sGEhHXpeJc81sqJtfEk9tKwFRBc4dqGNkxqYFXjt33I/xKsvZps=

matrix:
  include:
  # hola-mundo-api
  - name: hola-mundo-api pipeline
    language: node_js
    node_js:
    - 12
    env:
    - PACKAGE_LOCATION=hola-mundo-api
    - HEROKU_APP_NAME=hola-mundo-api-dev
    - HEROKU_PROC_NAME=web
    before_script:
      - cd $PACKAGE_LOCATION   
    script:
      - docker build -t ${PACKAGE_LOCATION}:test --target test .

deploy:
  provider: script
  skip_cleanup: true
  script: bash ./.ci/deploy.sh
  on:
    branch: master
```

Also we need to define few scripts:

.ci/deploy.sh
```sh
docker build -t $PACKAGE_LOCATION . --target prod
bash ./.ci/heroku-deploy.sh $HEROKU_APP_NAME $HEROKU_PROC_NAME $PACKAGE_LOCATION
bash ./.ci/heroku-release.sh $HEROKU_APP_NAME $HEROKU_PROC_NAME
```

.ci/heroku-deploy.sh
```sh
docker login -u _ -p "$HEROKU_TOKEN" registry.heroku.com
docker tag $3:latest registry.heroku.com/$1/$2
docker push registry.heroku.com/$1/$2
```

.ci/heroku-release.sh
```sh
imageId=$(docker inspect registry.heroku.com/$1/$2 --format={{.Id}})
payload='{"updates":[{"type":"web","docker_image":"'"$imageId"'"}]}'
curl -n -X PATCH https://api.heroku.com/apps/$1/formation \
-d "$payload" \
-H "Content-Type: application/json" \
-H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
-H "Authorization: Bearer $HEROKU_TOKEN"
```

### Deployment pipeline with Travis, Docker and ECS

Let's modify the deployment pipeline for deployments to ECS:

```yml
services:
- docker

env:
  global:
  - secure: cHq4/ycpbZymnf+bMavFOo92bU7zaKzN1JXAEa8tlAdS485zP8RIK2+PMTKkP+4gdBOMB5FxQ6U2F26QxufB3cazhMX9xwblTCmrdooqvO4SK1gMUct3EEcIe514NN6IefKCadeg0EcV+Wz5Gxe0wlZJ0NeyhF5VpyFkbmuhiNLiVp5gPT4rOOKnMSnh+xSIAhI/1ZOeA+ELZLFHmMLCrzgWsCJYCdBNP6EQ5kQTom+QIMKh0fHmhicx4AcCdsbCkYDJ6QfvD6sDhBXRJeDO4cw+nyN3FQUS0wXVfLBKrV1j5jq0oAxIyYiWQZOFrI/z+MeXoEfhT9heXwnP9HymbyeysRChAJVZXBTkPpQcxfVHCdAtPkmcIzv2hi5wfbA3gAm4VMN+hQRThDhnjGW8TObzpkEdX/+g3acxOGRwk68KGb94+cvhUEzqBSPuZh2V136NocVsMV58aCqaU5OZA29jeWFJntNCxUKf8pBGDv5kzBJDedXu3aS/X54CeBJMP3CoMCSt3xN20bTPgk7ppB9wRN+agoLC6aKgyBwoUXsiuiCdNUM2Gqv1RxLORTI07IYKw/NSqCtbZFGnXM+z1xYHyQrdxFqxFxDqKimzhtaR4i+0w0q2W0II3X7oS3+QcaxBZ0LJMb2FkRYpuSM20XJz0pej/kl5HjLoMY9M48Q=

matrix:
  include:
  # hola-mundo-api
  - name: hola-mundo-api pipeline
    language: node_js
    node_js:
    - 12
    env:
    - PACKAGE_LOCATION=hola-mundo-api
    - ECS_REPO=805382315593.dkr.ecr.us-east-1.amazonaws.com/api-default
    - AWS_PROFILE=playground
    before_script:
      - cd $PACKAGE_LOCATION   
      - ./.ci/before-install.sh
    script:
      - docker build -t ${PACKAGE_LOCATION}:test --target test .

deploy:
  provider: script
  skip_cleanup: true
  script: bash ./.ci/deploy.sh
  on:
    branch: master
```

Also we need to define few scripts:

.ci/before-install.sh
```sh
set -o errexit
set -o pipefail

# Extract AWS credentials file so we can use AWS stuff without exporting access key/secret
mkdir -p ~/.aws && echo ${AWS_CREDENTIALS_FILE} | base64 -d > ~/.aws/credentials
```

.ci/deploy.sh
```sh
docker build -t $PACKAGE_LOCATION . --target prod
bash ./.ci/ecs-deploy.sh $ECS_REPO $PACKAGE_LOCATION
```

.ci/ecs-deploy.sh
```sh
#!/usr/bin/env bash

set -o errexit
set -o pipefail

AWS_REGION="us-east-1"

# Log in to AWS ECR with Docker
$(./bin/aws ecr get-login --no-include-email --region ${AWS_REGION})

releasetag="$1:latest"

docker tag $2:latest ${releasetag}
docker push ${releasetag}
```

### Docker Swarm
