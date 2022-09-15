
echo Insert version

read VERSION

docker build -t insait/cube.js:temp -f dev.Dockerfile ../../
docker-squash --tag insait/cube.js:$VERSION insait/cube.js:temp
