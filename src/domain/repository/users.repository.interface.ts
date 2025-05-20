import { ICreateUser, IUser } from '../entity/users.entity.interface';

export interface IUsersRepository {
  save(user: ICreateUser): Promise<IUser>;
}
