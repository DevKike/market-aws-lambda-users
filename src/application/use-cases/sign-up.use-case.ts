import { ICreateUser, IUser } from '../../domain/entity/users.entity.interface';
import { IUsersService } from '../../domain/service/users.service';
import { IUseCase } from '../../domain/use-case/users.use-case.interface';

export class SignUpUseCase implements IUseCase<ICreateUser, IUser> {
  constructor(private readonly _usersService: IUsersService) {}

  async execute(input: ICreateUser): Promise<IUser> {
    try {
      return this._usersService.saveUser(input);
    } catch (error) {
      throw error;
    }
  }
}
