#!/bin/bash

if [[ -z $1 ]]; then
    echo "Heroku app name cannot be empty"
    exit 1
fi

if [[ -z $2 ]]; then
    echo "Heroku proc name cannot be empty"
    exit 1
fi

imageId=$(docker inspect registry.heroku.com/$1/$2 --format={{.Id}})
payload='{"updates":[{"type":"web","docker_image":"'"$imageId"'"}]}'
curl -n -X PATCH https://api.heroku.com/apps/$1/formation \
-d "$payload" \
-H "Content-Type: application/json" \
-H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
-H "Authorization: Bearer $HEROKU_TOKEN"
