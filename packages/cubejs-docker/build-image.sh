#!/bin/bash
# Builds the Cube image and compresses it.
#
# Prerequisites:
# pip3 install -r requirements.txt
#
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    echo "e.g. $0 1.0.19"
    exit 1
fi

set -e

VERSION=$1

docker build -t insait/cube.js:temp -f dev.Dockerfile ../../
docker-squash --tag insait/cube.js:$VERSION insait/cube.js:temp
echo "Successfully built version $VERSION"
echo "to push: docker push insait/cube.js:$VERSION"