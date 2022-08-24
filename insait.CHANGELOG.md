


## [1.0.4] (22-08-2022)
Version pass the Nexus - Fix from 1.0.3
Insert console.log to solve the "package.json" not found issue


## [1.0.3] (22-08-2022)
Version does not pass the Nexus - Forgot to change name of tar file
- Insert console.log to solve the "package.json" not found issue

## [1.0.2] (17-08-2022)
First version that passes the Nexus !
This is a docker-squash from 1.0.1
Build the image with dev.insait-cube.Dockerfile to make the 1.0.2 img work and unzip the tar.gz files.

## [1.0.1] (17-08-2022)
This is a docker-squash from 1.0.0
This is a broken image like 0.1.4.
We need to unzip to files in the container to make it work.
1. insait-tar.gz
mv shelljs in node_modules/
mv Cargo.lock in packages/cubejs-backend-native/

## [1.0.0] (17-08-2022)
This is a broken image like 0.1.4.
We need to unzip to files in the container to make it work.
1. insait-tar.gz
mv shelljs in node_modules/
mv Cargo.lock in packages/cubejs-backend-native/

2. insait-front.tar.gz
mv the two .js files in packages/cubejs-playground/build/static/js/

## [0.1.4] (17-08-2022)
This is a broken image because there's missing shelljs in the node_modules package.
The shelljs package and Cargo.lock is in a insait-package.zip 


## [0.1.3] (17-08-2022)
Contains all updated packages again vulneratbilities except shelljs and Cargo.lock
