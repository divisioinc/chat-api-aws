import { APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const createConversations = async (): Promise<APIGatewayProxyResult> => {
  const createdAt = Date.now();

  const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      'conversations': [
        {
          PutRequest: {
            Item: {
              uuid: '5d35bcd6ce827600040936d0',
              name: 'Kurzurlg',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35bcdace827600040936d1',
              name: 'Cadar',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35bce9ce827600040936d4',
              name: 'Felagodoa',
              createdAt,
            }
          }
        }
      ]
    }
  }

  try {
    const data = await dynamoDb.batchWrite(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}

export const conversations = async (): Promise<APIGatewayProxyResult> => {
  const params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: 'conversations',
  }

  try {
    const result = await dynamoDb.scan(params).promise();
  
    const conversations = result.Items.map(conversation => ({
      ...conversation,
      unread: true,
      lastMessage: {
        body: 'testt....',
        createdAt: Date.now(),
      },
    }))
  
    return {
      statusCode: 200,
      body: JSON.stringify(conversations)
    }
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error:  err.message })
    }
  }
}