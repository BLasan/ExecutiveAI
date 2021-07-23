import json
import boto3
import jwt

def lambda_handler(event, context):
    jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
    user_id = jwtData['cognito:username']
    print(user_id)
    
    event_body = json.loads(event["body"])
    print(event_body["folders"])
    dashboardID = event['pathParameters']['dashboardid'];
    
    response = client.delete_item(
        TableName="dashboard",
        Key={"S": dashboardID},
        ReturnValues='NONE'
    )
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*"

        },
        'body': json.dumps('Hello from Lambda!')
    }
