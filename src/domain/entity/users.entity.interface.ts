export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: number;
}

export interface ICreateUser extends Omit<IUser, 'id' | 'createdAt'> {}

export interface ISignUpRes {
  user: Omit<IUser, 'password'>;
}

export interface ISignInReq extends Pick<IUser, 'email' | 'password'> {}

export interface ISignInRes {
  token: string;
}

export interface IUserInfoReq extends Pick<IUser, 'id'> {}

export interface IUserInfoRes {
  user: Omit<IUser, 'password'>;
}
