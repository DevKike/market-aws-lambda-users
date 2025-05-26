import {
  ICreateUser,
  ISignUpRes,
  IUser,
} from '../../domain/entity/users.entity.interface';
import { ConflictException } from '../../domain/exceptions/conflict.exception';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import { IUsersRepository } from '../../domain/repository/users.repository.interface';
import { IUsersService } from '../../domain/service/users.service.interface';
import { bcrypt } from '../utils/bcrypt/bcrypt.util';

export class UsersService implements IUsersService {
  constructor(private readonly _usersRepository: IUsersRepository) {}

  async getById(id: IUser['id']): Promise<IUser> {
    const user = await this._usersRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getByEmail(email: string): Promise<IUser> {
    const user = await this._usersRepository.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async saveUser(user: ICreateUser): Promise<ISignUpRes> {
    const existingUser = await this._usersRepository.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const encryptedPassword = await bcrypt.hash(user.password);

    const savedUser = await this._usersRepository.save({
      ...user,
      password: encryptedPassword,
    });

    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        createdAt: savedUser.createdAt,
      },
    };
  }
}
