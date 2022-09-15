#!/bin/bash
set -e
FILE=/insait-is-installed

if [ -f "$FILE" ]; then
    echo "Insait one-time setup is already done."
    cd /cube/conf/
else 
    echo "$FILE DOES NOT exist. Starting Insait's one-time setup..."
    mv /insait /insait.tar.gz
    cd /
    tar -xvzf /insait.tar.gz
    cd /cube/conf/
    npm init -y
    touch $FILE
fi

echo "Starting cubejs server"
cubejs server