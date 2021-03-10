import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const createMessages = async (): Promise<APIGatewayProxyResult> => {
  const createdAt = Date.now();

  const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      'messages': [
        {
          PutRequest: {
            Item: {
              uuid: '5d35bf8cce827600040936d8',
              conversationId: '5d35bcd6ce827600040936d0',
              value: 'Hey!',
              direction: 'incoming',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35bf9ace827600040936d9',
              conversationId: '5d35bcd6ce827600040936d0',
              value: 'Hey!',
              direction: 'outgoing',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35bfa8ce827600040936da',
              conversationId: '5d35bcd6ce827600040936d0',
              value: 'How do you doing?!',
              direction: 'incoming',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35bfbcce827600040936db',
              conversationId: '5d35bcd6ce827600040936d0',
              value: "I'm great, what about you?",
              direction: 'outgoing',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35c015ce827600040936dc',
              conversationId: '5d35bcd6ce827600040936d0',
              value: "Do you wanna go to the party Saturday? Everybody wants to go!",
              direction: 'incoming',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35c14dce827600040936e0',
              conversationId: '5d35bcdace827600040936d1',
              value: "Please call me I need to speak to you",
              direction: 'incoming',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35c15dce827600040936e1',
              conversationId: '5d35bcdace827600040936d1',
              value: "Barbara needs help",
              direction: 'incoming',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d35c183ce827600040936e2',
              conversationId: '5d35bcdace827600040936d1',
              value: "Sure, What's her number?",
              direction: 'outgoing',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d84b9fbfbd2210004f3070e',
              conversationId: '5d35bce9ce827600040936d4',
              value: "Let's have a conversation",
              direction: 'incoming',
              createdAt,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              uuid: '5d84b9fcfbd2210004f3070f',
              conversationId: '5d35bce9ce827600040936d4',
              value: "Sure, why not?",
              direction: 'outgoing',
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

export const messages = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const conversationId = event.pathParameters.conversationId;

  const paramsConversation: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: 'conversations',
    Key: {
      uuid: conversationId
    },
    ProjectionExpression: '#name',
    ExpressionAttributeNames: {"#name": "name"}
  }

  try {
    const resultConversation = await dynamoDb.get(paramsConversation).promise();

    const conversationName = resultConversation.Item.name;

    const paramsMessages: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: 'messages',
      KeyConditionExpression: 'conversationId = :conversationId',
      ExpressionAttributeValues: {
        ":conversationId": conversationId,
      }
    }

    const resultMessages = await dynamoDb.query(paramsMessages).promise();

    const messages = {
      name: conversationName,
      messages: resultMessages.Items
    }

    return {
      statusCode: 200,
      body: JSON.stringify(messages)
    }
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error:  err.message })
    }
  }
}