import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEventV2,
} from 'aws-lambda';
import { jwtUtil } from '../../utils/jwt/jwt.util';
import { IJwtPayload } from '../../utils/jwt/interface/jwt-payload.interface';

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewayAuthorizerResult> => {
  try {
    let token;

    if (event.headers && event.headers.authorization) {
      const authHeader = event.headers.authorization;
      if (authHeader.startsWith('token ')) {
        token = authHeader.substring(6);
      } else if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    const decoded = jwtUtil.verify<IJwtPayload>(token!);

    return {
      principalId: decoded.id,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.routeArn,
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
            Resource: event.routeArn,
          },
        ],
      },
    };
  }
};
