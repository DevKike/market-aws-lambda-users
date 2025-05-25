import { ICreateUser, IUser } from '../entity/users.entity.interface';

export interface IUsersRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(user: ICreateUser): Promise<IUser>;
}
