import { BaseException } from './base.exception';

export class AuthenticationException extends BaseException {
  constructor(message: string) {
    super(message, 401);
  }
}
