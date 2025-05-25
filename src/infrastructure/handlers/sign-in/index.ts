import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ISignInReq } from '../../../domain/entity/users.entity.interface';
import { SignInUseCase } from '../../../application/use-cases/sign-in.use-case';
import { UsersService } from '../../service/users.service';
import { UsersRepository } from '../../repository/users.repository';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Sign-in request received:', event);

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Request body is required',
        }),
      };
    }

    const requestBody = JSON.parse(event.body);

    if (!requestBody.email || !requestBody.password) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Missing required fields: email or password',
        }),
      };
    }

    const signInRequest: ISignInReq = {
      email: requestBody.email,
      password: requestBody.password,
    };

    const repository = new UsersRepository();
    const service = new UsersService(repository);
    const signInUseCase = new SignInUseCase(service);

    const response = await signInUseCase.execute(signInRequest);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error during sign-in:', error);

    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Authentication failed',
        error: (error as Error).message,
      }),
    };
  }
};
