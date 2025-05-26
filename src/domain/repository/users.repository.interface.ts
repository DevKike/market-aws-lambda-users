import { ICreateUser, IUser } from '../entity/users.entity.interface';

export interface IUsersRepository {
  findById(id: IUser['id']): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  save(user: ICreateUser): Promise<IUser>;
}
