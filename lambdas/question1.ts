import { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { findCrewByMovieAndRole } from '../shared/util';

const client = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", JSON.stringify(event));

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
  }
};

export const getCrewByMovieIdAndRole = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const movieId = event.pathParameters?.movieId;
  const role = event.queryStringParameters?.role;

  if (!movieId || !role) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing movieId or role' }),
    };
  }

  const crew = findCrewByMovieAndRole(Number(movieId), role); 

  if (!crew) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Crew member not found' }),
    };
  }


  return {
    statusCode: 200,
    body: JSON.stringify(crew),
  };
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
function findCrewMemberByRole(movieIdNum: number, role: string) {
  throw new Error("Function not implemented.");
}

