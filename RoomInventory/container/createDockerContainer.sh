#!/bin/bash
docker run -e LANG=ja_JP.UTF-8 -d --net=apics_nw --ip="172.27.0.16" -p 8080:8080 -e MOCK_PORT=8080 --name=demo_api demo_api node /opt/demo_api/Demo4OracleTravel.js 8080