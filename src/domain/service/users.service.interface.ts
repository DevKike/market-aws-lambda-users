import { ICreateUser, ISignUpRes } from '../entity/users.entity.interface';

export interface IUsersService {
  saveUser(user: ICreateUser): Promise<ISignUpRes>;
}
