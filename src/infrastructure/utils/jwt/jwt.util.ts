import jwt, { SignOptions } from 'jsonwebtoken';
import { environments } from '../../environments/environments.dev';

export const jwtUtil = {
  sign: (payload: object): string => {
    const options: SignOptions = {
      expiresIn: environments.tokenExpiration,
    };
    return jwt.sign(payload, environments.jwtSecretKey, options);
  },

  verify: <T>(token: string): T => {
    return jwt.verify(token, environments.jwtSecretKey) as T;
  },
};
