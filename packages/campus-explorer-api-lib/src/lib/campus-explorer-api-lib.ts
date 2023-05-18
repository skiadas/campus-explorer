import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
  'Access-Control-Allow-Origin': '*', // Allow from anywhere
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH', // Allow only GET request
};

export const handlePostImageFunction = async (
  event: APIGatewayProxyEvent,
  context: any
): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers,
      body: '{ "message": "OK" }',
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }
};


export const handlePostImageFunction2 = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers,
      body: '{ "message": "OK" }',
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }
};