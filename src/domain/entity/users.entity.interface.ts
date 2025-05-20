export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: number;
}

export interface ICreateUser extends Omit<IUser, 'id' | 'createdAt'> {}

export interface ISignUpRes extends Omit<IUser, 'password'> {}
