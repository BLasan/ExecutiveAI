import json
import os

def lambda_handler(event, context):
    # directory = event['queryStringParameters']['directory']
    # file_name = event['queryStringParameters']['file']
    # x = event['queryStringParameters']['x']
    # y = event['queryStringParameters']['y']
    directory = 'Demo'
    file_name = 'marketing_campaign.csv'
    x = 'Dt_Customer'
    y = 'Income'
    command = f"python3.8 /mnt/trend/get-date-trend.py {directory} {file_name} {x} {y}"
    data = os.popen(command)
    print(data)
    res = data.read()
    print(res)
    json_res = res.replace('\'', '"').replace('\n', '')
    print(json_res)
    result = {'data': json.loads(json_res)}
    print(result)
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*",
        },
        'body': json.dumps(result)
    }
