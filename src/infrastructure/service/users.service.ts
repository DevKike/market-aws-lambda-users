import {
  ICreateUser,
  ISignUpRes,
  IUser,
} from '../../domain/entity/users.entity.interface';
import { IUsersRepository } from '../../domain/repository/users.repository.interface';
import { IUsersService } from '../../domain/service/users.service.interface';
import { bcrypt } from '../utils/bcrypt/bcrypt.util';

export class UsersService implements IUsersService {
  constructor(private readonly _usersRepository: IUsersRepository) {}

  async getByEmail(email: string): Promise<IUser> {
    const user = await this._usersRepository.findByEmail(email);

    if (!user) throw new Error();

    return user;
  }

  async saveUser(user: ICreateUser): Promise<ISignUpRes> {
    const existingUser = await this._usersRepository.findByEmail(user.email);

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const encryptedPassword = await bcrypt.hash(user.password);

    const savedUser = await this._usersRepository.save({
      ...user,
      password: encryptedPassword,
    });

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      createdAt: savedUser.createdAt,
    };
  }
}
