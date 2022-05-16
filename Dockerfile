#可访问 https://hub.docker.com/_/nginx 查看python镜像源
FROM nginx:alpine
MAINTAINER jsq <1647014149@qq.com>
#将当前目录下dist文件夹所有文件都拷贝到image文件中指定目录
COPY ./dist /usr/share/nginx/webApp
COPY scripts/nginx.conf /etc/nginx/conf.d/default.conf
# 开放容器的80端口，允许外部访问这个端口
EXPOSE 80
