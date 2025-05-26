import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserInfoUseCase } from '../../../application/use-cases/user-info.use-case';
import { UsersService } from '../../service/users.service';
import { UsersRepository } from '../../repository/users.repository';
import jsonBodyParser from '@middy/http-json-body-parser';
import { errorFormatter } from '../../utils/error-formatter/error-formatter.util';
import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';

const userInfoHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.lambda?.userId;

    if (!userId) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'User ID not found in authorization context',
        }),
      };
    }

    const response = await new UserInfoUseCase(
      new UsersService(new UsersRepository())
    ).execute({ id: userId });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'User info retrieved successfully',
        data: response,
      }),
    };
  } catch (error) {
    console.error('Error retrieving user info:', error);
    throw error;
  }
};

export const handler = middy(userInfoHandler)
  .use(errorFormatter())
  .use(httpErrorHandler());
