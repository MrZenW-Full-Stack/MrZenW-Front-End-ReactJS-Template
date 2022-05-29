#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
echo $BASEDIR

source $BASEDIR/stages/_init.sh

# source $BASEDIR/stages/test_eslint.sh

source $BASEDIR/stages/production.publish.sh