#!/usr/bin/env bash

ssh root@128.199.204.144 "nginx -t && nginx -s stop && nginx"
echo 'OK'