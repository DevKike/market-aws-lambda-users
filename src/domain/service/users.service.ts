import { ICreateUser, IUser } from '../entity/users.entity.interface';

export interface IUsersService {
  saveUser(user: ICreateUser): Promise<IUser>;
}
