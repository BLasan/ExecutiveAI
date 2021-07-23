import json
import jwt
import boto3

def lambda_handler(event, context):
    
    jwtData = jwt.decode(event['headers']['Authorization'], options={"verify_signature": False})
    user_id = jwtData['cognito:username']
    print(user_id)
    
    try:
        event_body = json.loads(event["body"])
        print(event_body["files"])
        
        clientDb = boto3.client('dynamodb')
        files_updated = clientDb.update_item(
            TableName='user_data',
            Key={
                'user_id': {'S': user_id}
            },
            UpdateExpression=f"set folders[{int(event_body['dir_id'])}]=:t",
            ExpressionAttributeValues={
                ':t': event_body["files"]
            },
            ReturnValues="ALL_NEW"
        )
        
        print(files_updated)
        
        s3Client = boto3.client('s3')
        response = s3Client.delete_object(
            Bucket=files_updated['Attributes']['bucket_name']['S'],
            Key=event_body['key'],
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