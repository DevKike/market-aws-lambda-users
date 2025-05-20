import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ICreateUser } from '../../../../domain/entity/users.entity.interface';
import { SignUpUseCase } from '../../../../application/use-cases/sign-up.use-case';
import { UsersService } from '../../../service/users.service';
import { UsersRepository } from '../../../repository/users.repository';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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

    if (
      !requestBody.name ||
      !requestBody.email ||
      !requestBody.password ||
      !requestBody.phone
    ) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Missing required fields: name, email, password or phone',
        }),
      };
    }

    const userRequest: ICreateUser = {
      name: requestBody.name,
      email: requestBody.email,
      password: requestBody.password,
      phone: requestBody.phone,
    };

    const repository = new UsersRepository();
    const service = new UsersService(repository);
    const useCase = new SignUpUseCase(service);

    const response = await useCase.execute(userRequest);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'User created successfully',
        data: response,
      }),
    };
  } catch (error) {
    console.error('Error creating user:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Error creating user',
        error: (error as Error).message,
      }),
    };
  }
};
