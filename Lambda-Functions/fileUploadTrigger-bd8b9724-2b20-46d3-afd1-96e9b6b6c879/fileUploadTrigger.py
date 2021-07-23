import json
import boto3
import pandas as pd
import numpy as np
import io
import re
import jwt

def lambda_handler(event, context):
    
    print(event)

    try:
        # Get bucket data
        # bucket_name = event['Records'][0]['s3']['bucket']['name']
        # key = event['Records'][0]['s3']['object']['key']
        # file_size = event['Records'][0]['s3']['object']['size']
        # user_id = bucket_name.split("-", 1)

        jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
        user_id = jwtData['cognito:username']
        print(user_id)
        
        # data = json.loads(base64.b64decode(event['body']))
        data = json.loads(event['body'])
        bucket_name = data['bucket_name']
        key = data['key']
        file_size = data['size']
    
        print(bucket_name, key, file_size)
        
        # Get file name
        s3_client = boto3.client('s3')
        response = s3_client.get_object(Bucket=bucket_name, Key=key)
        print(response)
        delimiter = ''
        response_body = response["Body"].read()
        df = pd.read_csv(io.BytesIO(response_body),delimiter=",")
        print(df)
        print(len(df.columns.tolist()))
        if len(df.columns.tolist()) > 1:
            delimiter = ','
        elif len(df.columns.tolist()) == 1:
            df = pd.read_csv(io.BytesIO(response_body),delimiter=";")
            print(df)
            print(len(df.columns.tolist()))
            if len(df.columns.tolist()) == 1:
                df = pd.read_csv(io.BytesIO(response_body),delimiter=" ")
                if len(df.columns.tolist()) == 1:
                    return { 'statusCode': 400, 'body': json.dumps('Cannot upload a csv with 1 column')}
                else:
                    delimiter = " "
            else:
                delimiter = ';'
        print(df.columns.tolist())
        col_dict = dict()
        for col in df.columns.tolist():
            varia = re.sub(r'[$-/:-?{-~!"^_`\[\]]', '_', col)
            col_dict[col] = varia
            
        df = df.rename(columns=col_dict)
        print(df)

        isNullArr = []
        for col_name, isNull in df.isnull().any().iteritems():
            isNullArr.append({"M": {"col_name": {"S": col_name}, "is_null": {"BOOL": isNull}}})
        isNullArray = {"L":isNullArr}

        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_datetime(df[col])
                except ValueError:
                    pass
    
        dataTypeArr = []
        for col_name, data_type in df.dtypes.iteritems():
            dataTypeArr.append({"M": {"col_name": {"S": col_name}, "data_type": {"S": str(data_type) }}})
        dataTypeArray = {"L": dataTypeArr}
    
        uniqueValArr = []
        for col_name in df.columns:
            if df[col_name].dtype == 'object':
                arr = []
                for val in df[col_name].unique():
                    arr.append({"S" : val})
                uniqueValArr.append({"M": {"col_name": {"S": col_name}, "values": {"L": arr }}})
        uniqueValArray = {"L": uniqueValArr}

        clientDb = boto3.client('dynamodb')

        response = clientDb.get_item(
            TableName='user_data',
            ConsistentRead=True,
            Key={'user_id': {'S': user_id}},
            ReturnConsumedCapacity='TOTAL',
        )
        response_json = json.loads(json.dumps(response))
        folders= response_json['Item']['folders']['L']

        folder_id = 0
        file_id = 0
        folder_name = key.split('/')[0]
        file_name = key.split('/')[1]
        print(folders)
        for folder in folders:
            if folder['M']['name']['S'] == folder_name:
                for file_obj in folder['M']['files']['L']:
                    if file_obj['M']['name']['S'] == file_name:
                        break
                    file_id += 1
                break
            folder_id += 1
        update_expression = f"set folders[{int(folder_id)}].files[{int(file_id)}].data_types=:d,folders[{int(folder_id)}].files[{int(file_id)}].obj_data=:o,folders[{int(folder_id)}].files[{int(file_id)}].null_data=:n, folders[{int(folder_id)}].files[{int(file_id)}].delimiter=:l"
        print(update_expression)
        job_update = clientDb.update_item(
            TableName='user_data',
            Key={
                'user_id': {'S': user_id}
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues={
                ":d": dataTypeArray,
                ":o": uniqueValArray,
                ":n": isNullArray,
                ":l": {'S': delimiter}
            },
            ReturnValues="NONE"
        )
        
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps('File Upolad Success')
        }
    except Exception as ex:
        print(str(ex))
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps(str(ex))
        }        
