# Dockerfile for API Gateway running on Docker Container
# Prerequisites
# - server-jre
# - ApiGatewayInstaller.zip
# - gateway-props.json
# - Python2.7.10+
#
FROM oraclelinux:7-slim
ENV JAVA_HOME=/u01/app/oracle/java ORACLE_BASE=/u01/app/oracle SERVER_JRE=server-jre-8u121-linux-x64.tar.gz
ENV http_proxy http://jp-proxy.jp.oracle.com:80/
ENV https_proxy https://jp-proxy.jp.oracle.com:80/
USER oracle
RUN mkdir /u01/app/oracle
COPY $SERVER_JRE $ORACLE_BASE
RUN cd $ORACLE_BASE && tar xvzf $SERVER_JRE && mv jdk1.8.0_121 java

