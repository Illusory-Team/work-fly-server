import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { CreateUserDto, FindUserDto, PatchUserDto, PureUserDto } from './dto';
import { CreateUserCommand, PatchUserCommand, RemoveAvatarCommand, SaveAvatarCommand } from './commands';
import { GetUserByEmailQuery, GetUserQuery, GetUserWithPositionQuery } from './queries';

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  async getById(id: string): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  async getWithPosition(id: string): Promise<FindUserDto> {
    return this.queryBus.execute(new GetUserWithPositionQuery(id));
  }

  async getByEmail(email: string): Promise<User> {
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  async patchOne(user: User, dto: PatchUserDto): Promise<PureUserDto> {
    return this.commandBus.execute(new PatchUserCommand(user, dto));
  }

  async saveAvatar(user: User, file: Express.Multer.File): Promise<PureUserDto> {
    return this.commandBus.execute(new SaveAvatarCommand(user, file));
  }

  async removeAvatar(user: User): Promise<PureUserDto> {
    return this.commandBus.execute(new RemoveAvatarCommand(user));
  }
}
