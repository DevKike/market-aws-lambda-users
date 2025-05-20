import { DynamoDB } from 'aws-sdk';
import { ICreateUser, IUser } from '../../domain/entity/users.entity.interface';
import { IUsersRepository } from '../../domain/repository/users.repository.interface';
import { environments } from '../environments/environments.dev';
import { v4 as uuidv4 } from 'uuid';

export class UsersRepository implements IUsersRepository {
  private readonly tableName: string;
  private readonly docClient: DynamoDB.DocumentClient;

  constructor() {
    this.tableName = environments.usersTableName;
    this.docClient = new DynamoDB.DocumentClient({
      region: environments.awsRegion,
    });
  }

  async save(user: ICreateUser): Promise<IUser> {
    const userId = uuidv4();
    const currentDate = new Date().getTime();

    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          id: userId,
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          createdAt: currentDate,
        } as ICreateUser,
      })
      .promise();

    return {
      ...user,
      id: userId,
      createdAt: currentDate,
    };
  }
}
