import middy from '@middy/core';
import { IHttpError } from './interfaces/http-error.interface';
import { BaseException } from '../../../domain/exceptions/base.exception';

export const errorFormatter = (): middy.MiddlewareObj => {
  const onError = async (request: middy.Request) => {
    const { error } = request;

    if (error instanceof BaseException) {
      request.response = {
        statusCode: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
        }),
      };

      return request.response;
    }

    const requestError = error as unknown as IHttpError;
    if (requestError.statusCode === 400) {
      const formattedError = {
        message: 'Validation error in the request',
      };

      request.response = {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedError),
      };

      return request.response;
    }

    request.response = {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Internal server error',
        details: [{ field: 'server', message: 'An unexpected error occurred' }],
      }),
    };

    return request.response;
  };

  return {
    onError,
  };
};