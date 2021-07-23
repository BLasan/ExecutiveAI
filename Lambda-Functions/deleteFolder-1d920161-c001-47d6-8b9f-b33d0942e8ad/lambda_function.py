import json
import jwt
import boto3

def lambda_handler(event, context):
    
    jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
    user_id = jwtData['cognito:username']
    print(user_id)
    
    try:
        event_body = json.loads(event["body"])
        
        clientDb = boto3.client('dynamodb')
        job_update = clientDb.update_item(
            TableName='user_data',
            Key={
                'user_id': {'S': user_id}
            },
            UpdateExpression="set folders=:t",
            ExpressionAttributeValues={
                ':t': event_body["folders"]
            },
            ReturnValues="NONE"
        )
        return {
            'statusCode': 204,
            'headers': {
                "Access-Control-Allow-Origin": "*"
    
            },
            'body': json.dumps('Successfully Updated!!')
        }
    except Exception as ex:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*"
    
            },
            'body': json.dumps(str(ex))
        }