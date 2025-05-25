import { ICreateUser, ISignUpRes } from '../../domain/entity/users.entity.interface';
import { IUsersService } from '../../domain/service/users.service.interface';
import { IUseCase } from '../../domain/use-case/users.use-case.interface';

export class SignUpUseCase implements IUseCase<ICreateUser, ISignUpRes> {
  constructor(private readonly _usersService: IUsersService) {}

  async execute(input: ICreateUser): Promise<ISignUpRes> {
    try {
      return this._usersService.saveUser(input);
    } catch (error) {
      throw error;
    }
  }
}
