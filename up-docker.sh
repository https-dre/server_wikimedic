#!/bin/bash

set -x

docker stop $1

docker remove $1

docker build -t $1:latest .

docker image prune -f

docker run -d --env-file .env.docker -p $2:$3 --name $1 $1