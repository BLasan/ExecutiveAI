### Lambda Functions of Neurale

This directory contains all the lambda functions written in `python 3.8`.

1. Delete Dashboard - Delete a particular dashboard.
2. Delete Files - Delete uploaded CSV files.
3. Delete Folder - Delete folders created.
4. File Upload Trigger - Identify and update the column detials into the dynamodb table.
5. Generate S3 URL - Generate a pre-signed url for the file upload.
6. Get CSV Data - Get data of a CSV file.
7. Get Dashboard Data - Get dashboard data.
8. Get Directories - Get all details of the folders created.
9. Get Graph Data - Get data of a selected graph.
10. Sagemaker Job - Create a training job for Regression.
11. KMEANS Train - Create a training job for KMEANS Clustering.
12. Get Models - Get all models of a CSV file.
14. Get Trend Date - Get Trend data for the selected columns.
15. XGBoost Predict - Get predictions for a regression model.


## Upload a lambda function to AWS using AWS Console

1. You can create a lambda function with a archived code (By uploading an archive of the required lambda function)

## Upload a lambda function to AWS using AWS CLI

1. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. `cp pack-functions <Lambda-Function>/`
2. `cd <Lambda-Function>`
3. `chmod +x pack-functions.sh`
4. `./pack-functions FILE_NAME PACKAGE_NAME FUNCTION_NAME VIRTUAL_ENV PROFILE_NAME`