#!/bin/bash

GIT_REF=`git symbolic-ref -q --short HEAD || git describe --tags --exact-match`

echo "$GIT_REF" > .version