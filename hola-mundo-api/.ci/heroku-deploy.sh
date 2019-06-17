#!/bin/bash

if [[ -z $1 ]]; then
    echo "Heroku app name cannot be empty"
    exit 1
fi

if [[ -z $2 ]]; then
    echo "Heroku proc name cannot be empty"
    exit 1
fi

if [[ -z $3 ]]; then
    echo "Docker image name cannot be empty"
    exit 1
fi

docker login -u _ -p "$HEROKU_TOKEN" registry.heroku.com
docker tag $3:latest registry.heroku.com/$1/$2
docker push registry.heroku.com/$1/$2
