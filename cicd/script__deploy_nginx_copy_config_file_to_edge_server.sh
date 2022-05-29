#!/usr/bin/env bash

BASEDIR=$(dirname "$0")

scp $BASEDIR/nginx.conf root@128.199.204.144:/etc/nginx/conf.d/mrzenw.com.conf
echo 'OK'
