#!/bin/sh

pwd=${ALIYUN_REGISTRY_PASSWORD}
docker login --username=phenye -p $pwd registry.cn-hangzhou.aliyuncs.com
docker tag demo-app:latest registry.cn-hangzhou.aliyuncs.com/phenye/demo-app:latest
docker push registry.cn-hangzhou.aliyuncs.com/phenye/demo-app:latest


if [ $# -gt 0 ] ; then
  tag=$1
  docker tag demo-app:latest registry.cn-hangzhou.aliyuncs.com/phenye/demo-app:${tag}
  docker push registry.cn-hangzhou.aliyuncs.com/phenye/demo-app:${tag}
fi
