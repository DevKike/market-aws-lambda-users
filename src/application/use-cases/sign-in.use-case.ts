import {
  ISignInReq,
  ISignInRes,
} from '../../domain/entity/users.entity.interface';
import { AuthenticationException } from '../../domain/exceptions/authentication.exceptiont';
import { BaseException } from '../../domain/exceptions/base.exception';
import { IUsersService } from '../../domain/service/users.service.interface';
import { IUseCase } from '../../domain/use-case/users.use-case.interface';
import { bcrypt } from '../../infrastructure/utils/bcrypt/bcrypt.util';
import { jwtUtil } from '../../infrastructure/utils/jwt/jwt.util';

export class SignInUseCase implements IUseCase<ISignInReq, ISignInRes> {
  constructor(private readonly _usersService: IUsersService) {}

  async execute(input: ISignInReq): Promise<ISignInRes> {
    try {
      const user = await this._usersService.getByEmail(input.email);

      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new AuthenticationException('Invalid email or password.');
      }

      const token = jwtUtil.sign({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      return {
        token,
      };
    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      } else {
        throw new AuthenticationException('Invalid email or password.');
      }
    }
  }
}
