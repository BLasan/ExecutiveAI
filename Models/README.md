### Models

We provide Clustering and Regression models to cluster and get predictions respectively.

1. Clustering - KMeans Algorithm
2. Regression - XGBooost Algorithm

## How to build the Image (Push to into the ECR)

1. Install [docker](https://docs.docker.com/get-docker/)
2. Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and do the required configurations.
2. `cd <Preferred Model>`
3. `chmod +x build_and_push.sh`
4. `./build_and_push.sh ACCOUNT_ID REGION VERSION`

## How to build the Image (Push to into the [Dockerhub](https://hub.docker.com/))

1. Install [docker](https://docs.docker.com/get-docker/)
2. `cd <Preferred Model>`
3. `chmod +x build_and_push.sh`
4. `./build_and_push_to_dockerhub.sh VERSION DOCKER_USERNAME`