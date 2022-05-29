#!/usr/bin/env bash

# delete container
docker stop mrzenw_front_end_reactjs_template__container_test
docker rm mrzenw_front_end_reactjs_template__container_test
docker rmi registry.gitlab.com/MrZenW-Full-Stack/MrZenW-Front-End-ReactJS-Template:latest
echo 'Deleted old image in docker'
docker build -t registry.gitlab.com/MrZenW-Full-Stack/MrZenW-Front-End-ReactJS-Template:latest .
echo 'Built the new image'

docker_image_filename="mrzenw_front_end_reactjs_template.$(date '+%Y-%m-%d_%H-%M-%S').tar"
mkdir -p ./docker_image_exported
docker save registry.gitlab.com/MrZenW-Full-Stack/MrZenW-Front-End-ReactJS-Template:latest > ./docker_image_exported/$docker_image_filename.exporting
mv ./docker_image_exported/$docker_image_filename.exporting ./docker_image_exported/$docker_image_filename
echo 'OK!'
