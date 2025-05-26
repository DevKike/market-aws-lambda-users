import {
  IUserInfoReq,
  IUserInfoRes,
} from '../../domain/entity/users.entity.interface';
import { IUsersService } from '../../domain/service/users.service.interface';
import { IUseCase } from '../../domain/use-case/users.use-case.interface';

export class UserInfoUseCase implements IUseCase<IUserInfoReq, IUserInfoRes> {
  constructor(private readonly _usersService: IUsersService) {}

  async execute(input: IUserInfoReq): Promise<IUserInfoRes> {
    try {
      const { id } = input;

      const user = await this._usersService.getById(id);

      const userCopy = { ...(user as any) };

      delete userCopy.password;

      return {
        user: userCopy,
      };
    } catch (error) {
      throw error;
    }
  }
}
