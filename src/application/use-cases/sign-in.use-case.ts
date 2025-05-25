import {
  ISignInReq,
  ISignInRes,
} from '../../domain/entity/users.entity.interface';
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
        throw new Error('Invalid email or password');
      }

      const token = jwtUtil.sign({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      return {
        message: 'Signed in with success!',
        token,
      };
    } catch (error) {
      console.error('Sign in error: ', error);
      throw new Error('Invalid email or password');
    }
  }
}
