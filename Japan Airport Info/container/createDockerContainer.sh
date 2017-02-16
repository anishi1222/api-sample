#!/bin/bash
docker run -e LANG=ja_JP.UTF-8 -d --net=apics_nw --ip="172.27.0.21" -p 8080:8080 -e MOCK_PORT=8080 -e MASTER_FILE=/opt/demo_api/JapanAirports.csv --name=demo_api demo_api node /opt/demo_api/getAirportName.js 8080 /opt/demo_api/JapanAirports.csv
