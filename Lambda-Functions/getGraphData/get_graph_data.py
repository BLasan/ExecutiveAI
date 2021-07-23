import json
import base64
import pandas as pd
import boto3
import io
import jwt
import uuid

def lambda_handler(event, context):
    try:
        event_data = json.loads(event['body'])
        jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
        user_id = jwtData['cognito:username']
        dashboardID = event['pathParameters']['dashboardid'];
        chart = event_data["data"]["chart_type"]
        columns = event_data["data"]["columns"]
        folder = event_data["data"]["dir_name"]
        file_name = event_data["data"]["file_name"]
        delimiter = event_data["delimiter"]
        key = folder + '/' + file_name
        chart = event_data["chart"]
        chart["L"][0]["M"]["id"] = {'S': str(uuid.uuid1())}
        print(chart)
        
        clientDb = boto3.client('dynamodb')
        chart_update = clientDb.update_item(
            TableName='dashboard',
            Key={
                'dashboardID': {'S': dashboardID}
            },
            UpdateExpression="set charts=list_append(charts, :t)",
            ExpressionAttributeValues={
                ':t': chart
            },
            ReturnValues="ALL_NEW"
        )
        
        chart_json = json.loads(json.dumps(chart_update))
        
        client = boto3.client('dynamodb')
        s3_client = boto3.client('s3')
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
        dataset = pd.read_csv(io.BytesIO(response_body), delimiter=delimiter, low_memory=False, usecols=columns)
        chart_type = chart["L"][0]["M"]["chart"]["M"]["chartType"]["S"]

        print(dataset)
        dataset = dataset.dropna()
        # print(columns[0])
        # print(columns[1])
        # columns = dataset.columns.tolist()
        # labels = dataset[columns[0]].values.astype('str').tolist()
        # data = dataset[columns[1]].values.tolist()
        col_data = {}
        if chart_type == "pie":
            col_data = pie(dataset, columns)
        elif chart_type == "bar":
            col_data = bar(dataset, columns)
        elif chart_type == "line":
            labels = dataset[columns[0]].values.astype('str').tolist() 
            data = dataset[columns[1]].values.tolist()
            col_data = {'data': data, 'labels': labels}
            print(col_data)
        response_data = {"data": col_data, "message": 'success', "charts": chart_json}
        print(response_data)
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps(response_data)
        }
    except Exception as ex:
        response_data = {"data": '', "message": str(ex), "charts": ''}
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
            },
            'body': json.dumps(response_data)
        }    


def pie(dataset, columns):
    col_data = dict()
    for column in columns:
        element_count = list(dataset[column].value_counts())
        elements = list(dataset[column].unique())
        # element_map = dict()
        # for i in range(len(cols)):
        #     element_map[cols[i]] = element_count[i]
        col_data = {'labels': elements, 'data': element_count}
    return col_data
    
def bar(dataset, columns):
    col_data = dict()
    for column in columns:
        element_count = list(dataset[column].value_counts())
        elements = list(dataset[column].unique())
        # element_map = dict()
        # for i in range(len(cols)):
        #     element_map[cols[i]] = element_count[i]
        col_data = {'labels': elements, 'data': element_count}
    return col_data
