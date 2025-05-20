import { ICreateUser } from '../../domain/entity/users.entity.interface';
import { IUsersService } from '../../domain/service/users.service';
import { IUseCase } from '../../domain/use-case/users.use-case.interface';

export class SignUpUseCase implements IUseCase<ICreateUser, void> {
  constructor(private readonly _usersService: IUsersService) {}

  async execute(input: ICreateUser): Promise<void> {
    try {
      await this._usersService.saveUser(input);
    } catch (error) {
      throw error;
    }
  }
}
