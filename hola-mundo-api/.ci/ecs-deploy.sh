#!/usr/bin/env bash

set -o errexit
set -o pipefail

AWS_REGION="us-east-1"

if [[ -z $1 ]]; then
    echo "ECR repository cannot be empty"
    exit 1
fi

if [[ -z $2 ]]; then
    echo "Docker image name cannot be empty"
    exit 1
fi

# Log in to AWS ECR with Docker
$(./bin/aws ecr get-login --no-include-email --region ${AWS_REGION})

releasetag="$1:latest"

docker tag $2:latest ${releasetag}
docker push ${releasetag}
