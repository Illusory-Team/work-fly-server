import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto';
import { CreateUserCommand } from './commands';
import { GetUserByEmailQuery, GetUserQuery } from './queries';

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  async getById(id: string): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  async getByEmail(email: string): Promise<User> {
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }
}
