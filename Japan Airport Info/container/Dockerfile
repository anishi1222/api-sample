# Dockerfile for demo API
FROM node
RUN mkdir /opt/demo_api
COPY JapanAirports.csv /opt/demo_api/.
COPY getAirportName.js /opt/demo_api/.
COPY package.json /opt/demo_api/.
RUN cd /opt/demo_api && npm install
ENV MOCK_PORT 8080
ENV MASTER_FILE /opt/demo_api/JapanAirports.csv
EXPOSE 8080
