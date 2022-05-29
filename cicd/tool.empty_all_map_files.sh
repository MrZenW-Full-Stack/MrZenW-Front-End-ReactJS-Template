#!/usr/bin/env bash
find ./dist/ -name '*.js.map' | while read line; do
    echo "Empty: $line"
    echo '' > $line
done
