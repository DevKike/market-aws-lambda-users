import {
  ICreateUser,
  ISignUpRes,
  IUser,
} from '../entity/users.entity.interface';

export interface IUsersService {
  getByEmail(email: string): Promise<IUser>;
  saveUser(user: ICreateUser): Promise<ISignUpRes>;
}
