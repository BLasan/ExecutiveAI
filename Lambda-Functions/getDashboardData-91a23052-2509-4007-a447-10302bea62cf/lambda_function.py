import json
import boto3
import base64
import pandas as pd
import io
import jwt

def lambda_handler(event, context):
    print(event)
    try:
        dashboardID = event['pathParameters']['dashboardid'];
        jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
        user_id = jwtData['cognito:username']
        print(user_id)
        
        client = boto3.client('dynamodb')
        response = client.get_item(
            TableName='dashboard',
            ConsistentRead=True,
            Key={'dashboardID': {'S': dashboardID}},
            ReturnConsumedCapacity='TOTAL',
        )
        response_json = json.loads(json.dumps(response))
        data = response_json['Item']
        folderName = data["folder"]["S"]
        fileName = data["file"]["S"]
        key = data["folder"]["S"] + "/" + data["file"]["S"]
        delimiter = data["delimiter"]["S"]
        
        s3_client = boto3.client('s3')
        response = client.get_item(
            TableName='user_data',
            ConsistentRead=True,
            Key={'user_id': {'S': user_id}},
            ReturnConsumedCapacity='TOTAL',
        )
        response_json = json.loads(json.dumps(response))
        print(response_json)
        data_bucket_name= response_json['Item']['bucket_name']['S']
        response = s3_client.get_object(Bucket=data_bucket_name, Key=key)
        response_body = response["Body"].read()
        
        data_array = list()
        #boto3.resource('dynamodb')
        #print(data)
        for chart in data["charts"]["L"]:
            #print(data["M"]["chart"])
            column_array = []
            columns = chart["M"]["chart"]["M"]["columns"]["L"]
            for column in columns:
            	column_array.append(column["S"])
            dataset = pd.read_csv(io.BytesIO(response_body), delimiter=delimiter, low_memory=False, usecols=column_array)
            dataset = dataset.dropna()
            ## TODO: Remove redundant code lines
            if chart["M"]["chart"]["M"]["chartType"]["S"] == "pie":
                #deserializer = boto3.dynamodb.types.TypeDeserializer()
                #chart_data = {k: deserializer.deserialize(v) for k,v in chart.items()}
                col_data = pie(dataset, column_array, chart)
            elif chart["M"]["chart"]["M"]["chartType"]["S"] == "bar":
                #deserializer = boto3.dynamodb.types.TypeDeserializer()
                #chart_data = {k: deserializer.deserialize(v) for k,v in chart.items()}
                col_data = bar(dataset, column_array, chart)
            elif chart["M"]["chart"]["M"]["chartType"]["S"] == "line":
                #deserializer = boto3.dynamodb.types.TypeDeserializer()
                #chart_data = {k: deserializer.deserialize(v) for k,v in chart.items()}
                labels = dataset[column_array[0]].values.astype('str').tolist() 
                data_val = dataset[column_array[1]].values.tolist()
                col_data = {'data': data_val, 'labels': labels, 'chart': chart}
            print(col_data)
            data_array.append(col_data)
        #print(data)
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps({'message': 'Success', 'charts': data_array, 'folder_name': folderName, 'file_name': fileName, 'delimiter': delimiter})
        }
    except Exception as ex:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps({'message': str(ex), 'charts': '', 'folder_name': '', 'file_name': '', 'delimiter': ''})
        }
        

def pie(dataset, columns, chart):
    col_data = dict()
    for column in columns:
        element_count = list(dataset[column].value_counts())
        elements = list(dataset[column].unique())
        # element_map = dict()
        # for i in range(len(cols)):
        #     element_map[cols[i]] = element_count[i]
        col_data = {'labels': elements, 'data': element_count, 'chart': chart}
    return col_data
    
def bar(dataset, columns, chart):
    col_data = dict()
    for column in columns:
        element_count = list(dataset[column].value_counts())
        elements = list(dataset[column].unique())
        # element_map = dict()
        # for i in range(len(cols)):
        #     element_map[cols[i]] = element_count[i]
        col_data = {'labels': elements, 'data': element_count, 'chart': chart}
    return col_data
