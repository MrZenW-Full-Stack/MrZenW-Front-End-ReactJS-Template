#!/usr/bin/env bash
BASEDIR=$(dirname "$0")
echo $BASEDIR

node -v
npm -v

rm -rf node_modules/
rm -rf dist/


npm ci --production=false # install all the dependencies and devDependencies
echo 'INIT FINISHED'