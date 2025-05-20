export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
}

export interface ICreateUser extends Omit<IUser, 'id' | 'createdAt'> {}
