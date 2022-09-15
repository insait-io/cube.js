# Step 1: build and compress the image.
./build-image.sh 1.0.19

# Step 2: loopback test with a PostgreSQL based container.
docker compose -f postgres-docker-compose.yml up

# Step 3: 3.1. open the playground
#         3.2. go to 'Build', select any Dimension and click on 'Run'
http://localhost:4000

# If all went well you should see the list of dimensions.
