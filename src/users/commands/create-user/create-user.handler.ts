import { PrismaService } from 'prisma/prisma.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { User } from '@prisma/client';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { dto } = command;

    return this.prismaService.user.create({ data: dto });
  }
}
