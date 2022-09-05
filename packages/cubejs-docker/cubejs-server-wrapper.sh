#!/bin/bash

FILE=/test-insait.txt

if [ -f "$FILE" ]; then
    echo "$FILE exists."
    echo "Starting cubejs server"
    cd /cube/conf/
    cubejs server
else 
    echo "$FILE DOES NOT exist. Will untar the insait.tar.gz and then start cube"
    mv /insait /insait.tar.gz
    cd /
    tar -xvzf /insait.tar.gz
    cd /cube/conf/
    npm init -y 
    cubejs server
fi
