#!/bin/bash

GIT_REF=`git symbolic-ref -q --short HEAD || git describe --tags --exact-match`

echo "VERSION=$GIT_REF" > .env