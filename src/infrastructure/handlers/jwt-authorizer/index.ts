import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';
import { jwtUtil } from '../../utils/jwt/jwt.util';
import { IJwtPayload } from '../../utils/jwt/interface/jwt-payload.interface';

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = event.authorizationToken.replace('Bearer ', '');
    const decoded = jwtUtil.verify<IJwtPayload>(token);

    return {
      principalId: decoded.id,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
      context: {
        userId: decoded.id,
        email: decoded.email,
        name: decoded.name,
      },
    };
  } catch (error) {
    console.error('JWT verification failed', error);

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
};
