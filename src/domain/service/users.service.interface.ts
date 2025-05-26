import {
  ICreateUser,
  ISignUpRes,
  IUser,
} from '../entity/users.entity.interface';

export interface IUsersService {
  getById(id: IUser['id']): Promise<IUser>;
  getByEmail(email: string): Promise<IUser>;
  saveUser(user: ICreateUser): Promise<ISignUpRes>;
}
