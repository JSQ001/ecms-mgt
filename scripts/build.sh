#!/bin/sh

if [ $# -gt 1 ] ; then
docker build -t demo-app:$1 -t  demo-app:latest  .
else
docker build -t  demo-app:latest  .
fi
