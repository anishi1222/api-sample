# Dockerfile for demo API
FROM node
RUN mkdir /opt/demo_api
COPY Demo4OracleTravel.js /opt/demo_api/.
COPY package.json /opt/demo_api/.
RUN cd /opt/demo_api && npm install
ENV MOCK_PORT 8080
EXPOSE 8080
