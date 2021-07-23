import json
import boto3
import base64
import pandas as pd
import numpy as np
import io
import jwt

def lambda_handler(event, context):
    try:
        directory = event['queryStringParameters']['directory']
        file_name = event['queryStringParameters']['file']
        jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
        user_id = jwtData['cognito:username']
        print(user_id)
        key = directory + "/" + file_name
        s3_client = boto3.client('s3')

        print(key)

        client = boto3.client('dynamodb')
        response = client.get_item(
            TableName='user_data',
            ConsistentRead=True,
            Key={'user_id': {'S': user_id}},
            ReturnConsumedCapacity='TOTAL',
        )
        response_json = json.loads(json.dumps(response))
        data_bucket_name= response_json['Item']['bucket_name']['S']
        folders = response_json['Item']['folders']['L']
        directory_data = list(filter(lambda folder: folder["M"]["name"]["S"] == directory, folders))[0]
        file_data = list(filter(lambda files: files["M"]["name"]["S"] == file_name, directory_data['M']['files']['L']))[0]
        delimiter = file_data['M']['delimiter']['S']
        print(delimiter)

        response = s3_client.get_object(Bucket=data_bucket_name, Key=key)
        #s3_csv_name = file_name
        #s3.download_file(bucket_name,key, s3_csv_name)
        #delimiter_csv = ''
        #with open(s3_csv_name, 'r') as csvfile:
	 #    dialect = csv.Sniffer().sniff(csvfile.readline())
	 #   delimiter_csv = dialect.delimiter
	 #   print(dialect.delimiter)
        response_body = response["Body"].read()
        dataset = pd.read_csv(io.BytesIO(response_body), delimiter=delimiter, low_memory=False)

        df = dataset

        column_list = dataset.columns.tolist()
        header_rows = np.array(dataset.head().values).tolist()

        isNullArr = []
        for col_name, isNull in df.isnull().any().iteritems():
            isNullArr.append({'col_name': col_name, 'is_null': isNull})
            #isNullArr.append({"M": {"col_name": {"S": col_name}, "is_null": {"BOOL": isNull}}})
        #isNullArray = {"L":isNullArr}

        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_datetime(df[col])
                except ValueError:
                    pass
 
        dataTypeArr = []
        for col_name, data_type in df.dtypes.iteritems():
            dataTypeArr.append({'col_name': col_name, 'data_type': str(data_type) })
            #dataTypeArr.append({"M": {"col_name": {"S": col_name}, "data_type": {"S": str(data_type) }}})
        #dataTypeArray = {"L": dataTypeArr}
 
        uniqueValArr = []
        for col_name in df.columns:
            if df[col_name].dtype == 'object':
                arr = []
                for val in df[col_name].unique():
                    arr.append(val)
                    #arr.append({"S" : val})
                uniqueValArr.append({'col_name': col_name, 'values': arr})
                #uniqueValArr.append({"M": {"col_name": {"S": col_name}, "values": {"L": arr }}})
        #uniqueValArray = {"L": uniqueValArr}

        print(column_list)

        print(header_rows)

        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps({'columns': column_list, 'header_rows': header_rows, 'data_types': dataTypeArr, 'null_data': isNullArr, 'object_data': uniqueValArr, 'delimiter': delimiter,  'message': 'success'})
        }
    except Exception as ex:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps({'columns': '', 'header_rows': '', 'data_types': '', 'null_data': '', 'object_data': '', 'delimiter': '', 'message': str(ex)})
        }       


