# Dockerfile for demo API
FROM node
RUN mkdir /opt/Demo4Insurance
COPY Demo4Insurance.js /opt/Demo4Insurance
COPY package.json /opt/Demo4Insurance
RUN cd /opt/Demo4Insurance && npm install
ENV MOCK_PORT 8080
EXPOSE 8080
