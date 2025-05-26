import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ISignInReq } from '../../../domain/entity/users.entity.interface';
import { SignInUseCase } from '../../../application/use-cases/sign-in.use-case';
import { UsersService } from '../../service/users.service';
import { UsersRepository } from '../../repository/users.repository';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import { signInValidator } from '../../schemas/sign-in/sign-in.schema';
import { errorFormatter } from '../../utils/error-formatter/error-formatter.util';
import httpErrorHandler from '@middy/http-error-handler';

export const signInHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Sign-in request received:', event);

  try {
    const userData = event.body as unknown as ISignInReq;

    const response = await new SignInUseCase(
      new UsersService(new UsersRepository())
    ).execute(userData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'User signed with success!',
        data: response,
      }),
    };
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
};

export const handler = middy(signInHandler)
  .use(jsonBodyParser())
  .use(signInValidator)
  .use(errorFormatter())
  .use(httpErrorHandler());
