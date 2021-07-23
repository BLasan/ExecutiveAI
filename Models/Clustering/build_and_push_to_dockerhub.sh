#! /bin/bash

# The name of our algorithm
algorithm_name=kmeans-clustering

chmod +x kmeans-clustering/train
chmod +x kmeans-clustering/serve

version=$1

username=$2

docker build -t ${username}/${algorithm_name}:${version} .

docker push ${username}/${algorithm_name}:${version}