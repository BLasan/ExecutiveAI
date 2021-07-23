import boto3, os, datetime, time
import json
import base64

def lambda_handler(event, context):
    # x_columns = event["Body"]["x_columns"]
    # y_column = event["Body"]["y_column"]
    # date_columns = event["Body"]["date_columns"]
    # model_name = event["Body"]["model_name"]
    try:
        data = json.loads(base64.b64decode(event['body']))
        columns = data["columns"]
        date_columns = data["date_columns"]
        dir_name = data["folder_name"]
        csv_name = data["csv_name"]
        
        # columns = [
        #     "Satisfaction",
        #     "Loyalty"
        # ]
        # date_columns = []
        
        model_name = "KMEANS-" + str(datetime.datetime.today()).replace(' ', '-').replace(':', '-').rsplit('.')[0]
    
        clientDb = boto3.client('dynamodb')
    
        job_update = clientDb.update_item(
            TableName='user_data',
            Key={
                'user_id': {'S': '1001'}
            },
            UpdateExpression="set jobs=list_append(jobs, :t)",
            ExpressionAttributeValues={
                ':t': {
                    'L': [{
                       'M': {
                           "columns" : {"L": columns},
                           "date_columns" : {"L": date_columns},
                           "model_name": {"S": model_name},
                           "csv_name" : {"S": csv_name},
                           "mapping" : {"S": ''},
                           "type" : {"S": 'kmeans'},
                           "job_status": {"S": ''}
                        } 
                    }]
                }
            },
            ReturnValues="ALL_OLD"
        )
        
    
        response_json = json.loads(json.dumps(job_update))
        job_id = len(response_json["Attributes"]["jobs"]["L"])
        
        bucket_name = response_json["Attributes"]["bucket_name"]["S"]
        
        folders = response_json["Attributes"]["folders"]["L"]
        
        # req_folder = list(filter(lambda x: x.M.name.S == dir_name, folders))
        # req_file = list(filter(lambda x: x.M.name.S == csv_name, req_folder[0].M.files.L))
        # date_cols = list(filter(lambda x: x.M.data_type.S == "datetime64[ns]", req_file[0].M.data_types.L))
        
        # date_columns = list()
        # for col in date_cols:
        #     date_columns.append(col.M.col_name.S)
            
        # print(date_columns)
        
        user_name = response_json["Attributes"]["user_name"]["S"]
        user_id = "1001"
        print(bucket_name)
        
        job = create_sagemaker_job(columns, date_columns, model_name, job_id, dir_name, csv_name, bucket_name, user_id, user_name)
    
        return {
            'statusCode': 201,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            'body': json.dumps({'job': job, 'message': 'Job Started !!!'}) 
        }
    except Exception as ex:
        print(str(ex))
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            'body': json.dumps({'job': '', 'message': str(ex)}) 
        }

def create_sagemaker_job(columns,date_cols,model_name,job_id,dir_name, csv_name, bucket_name, user_id, user_name):
    try:
        sm = boto3.client('sagemaker')
        s3_uri = 's3://' + bucket_name + '/' + dir_name + '/' + csv_name
        
        algorithmSpecification = {
            # 'TrainingImage': '366225826754.dkr.ecr.us-east-1.amazonaws.com/kmeans-clustering:v1.0.9',
            'TrainingImage': '366225826754.dkr.ecr.us-east-1.amazonaws.com/kmeans-clustering:latest',
            'TrainingInputMode': 'File'
        }
        
        inputDataConfig = [{
            'ChannelName': 'train',
            'InputMode': 'File',
            'DataSource': {
                'S3DataSource': {
                    'S3DataType': 'S3Prefix',
                    'S3Uri': s3_uri
                }
            },
            'ContentType': 'csv'
        }]
        
        outputDataConfig = {
            'S3OutputPath': 's3://' + bucket_name + '/' + dir_name + '/' + model_name + '/' + 'output'
        }
        
        resourceConfig = {
            'InstanceType': 'ml.c4.xlarge',
            'InstanceCount': 1,
            'VolumeSizeInGB': 30
        }
        
        stoppingCondition = {
            'MaxRuntimeInSeconds': 86400,
        } 
        
        sel_columns = list()
        for col in columns:
            sel_columns.append(col['S'])
            
        date_columns = list()
        for col in date_cols:
            date_columns.append(col['S'])
        
        hyperparameters = {
            "model_name": model_name,   
            "selected_cols": ' '.join([str(elem) for elem in sel_columns]),
            "date_col_len": str(len(date_columns)),
            "date_cols": ' '.join([str(elem) for elem in date_columns]),
            "user": user_name,
            "job_id": str(job_id),
            "folder": dir_name,
            "bucket_name": bucket_name,
            "user_id": user_id
        }
        
        roleARN = 'arn:aws:iam::366225826754:role/service-role/AmazonSageMaker-ExecutionRole-20201205T225156'
        training_job_name = user_name + '-kmeans-' +str(datetime.datetime.today()).replace(' ', '-').replace(':', '-').rsplit('.')[0]
        resp = sm.create_training_job(
                TrainingJobName=training_job_name, 
                AlgorithmSpecification=algorithmSpecification, 
                RoleArn=roleARN,
                InputDataConfig=inputDataConfig, 
                OutputDataConfig=outputDataConfig,
                ResourceConfig=resourceConfig, 
                StoppingCondition=stoppingCondition,
                HyperParameters=hyperparameters,
                Tags= [{'Key': 'name', 'Value': 'kmeans'}]
        )
        
        desc = sm.describe_training_job(TrainingJobName=training_job_name)
        print(desc)
        return training_job_name
    except Exception as ex:
        raise Exception(str(ex))
    
    # status = desc['TrainingJobStatus']
    # while status=='InProgress':
    #   time.sleep(60)
    #   desc = sm.describe_endpoint(EndpointName=endpoint_name)
    #   status = desc['TrainingJobStatus']
    #   print("Status: " + status)
    #   failure = desc['FailureReason']
      
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps({'status': status, 'failure': failure})
    # }
