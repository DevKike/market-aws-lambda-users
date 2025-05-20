import { ICreateUser, IUser } from '../../domain/entity/users.entity.interface';
import { IUsersRepository } from '../../domain/repository/users.repository.interface';
import { IUsersService } from '../../domain/service/users.service';

export class UsersService implements IUsersService {
  constructor(private readonly _usersRepository: IUsersRepository) {}

  async saveUser(user: ICreateUser): Promise<IUser> {
    return await this._usersRepository.save(user);
  }
}
