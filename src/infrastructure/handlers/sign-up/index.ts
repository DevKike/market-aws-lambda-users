import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ICreateUser } from '../../../domain/entity/users.entity.interface';
import { SignUpUseCase } from '../../../application/use-cases/sign-up.use-case';
import { UsersService } from '../../service/users.service';
import { UsersRepository } from '../../repository/users.repository';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { signUpValidator } from '../../schemas/sign-up/sign-up.schema';
import { errorFormatter } from '../../utils/error-formatter/error-formatter.util';

const signUpHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userData = event.body as unknown as ICreateUser;

    const response = await new SignUpUseCase(
      new UsersService(new UsersRepository())
    ).execute(userData);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'User registered with success!',
        data: response,
      }),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const handler = middy(signUpHandler)
  .use(jsonBodyParser())
  .use(signUpValidator)
  .use(errorFormatter())
  .use(httpErrorHandler());
