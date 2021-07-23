import json
import boto3
import base64
import pandas as pd
import numpy as np
import io
import jwt

def lambda_handler(event, context):
    try:
        print(event)
        jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
        user_id = jwtData['cognito:username']
        directory = event['queryStringParameters']['directory']
        file_name = event['queryStringParameters']['file']
        model_name = event['queryStringParameters']['model_name']
        key = directory + "/" + model_name + "/" + 'pca_dataframe.csv'
        s3_client = boto3.client('s3')

        client = boto3.client('dynamodb')
        response = client.get_item(
            TableName='user_data',
            ConsistentRead=True,
            Key={'user_id': {'S': user_id}},
            ReturnConsumedCapacity='TOTAL',
        )
        response_json = json.loads(json.dumps(response))
        data_bucket_name= response_json['Item']['bucket_name']['S']

        response = s3_client.get_object(Bucket=data_bucket_name, Key=key)
        response_body = response["Body"].read()
        dataset = pd.read_csv(io.BytesIO(response_body), delimiter=",", low_memory=False)
        column_list = dataset.columns.tolist()
        print(column_list)

        csv_rows = np.array(dataset.values).tolist()
        print(csv_rows)

        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps({'columns': column_list, 'header_rows': csv_rows, 'message': 'success'})
        }
    except Exception as ex:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps({'columns': '', 'header_rows': '', 'message': str(ex)})
        }       



