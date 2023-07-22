import { hash } from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { USER_EXISTS } from '@constants/error';
import { UsersService } from 'users/users.service';
import { SetSessionReturnDto } from 'auth/dto';
import { SetSessionCommand } from './set-session.command';
import { ConfigService } from '@nestjs/config';

@CommandHandler(SetSessionCommand)
export class SetSessionCommandHandler implements ICommandHandler<SetSessionCommand> {
  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {}

  async execute(command: SetSessionCommand): Promise<SetSessionReturnDto> {
    const { dto } = command;

    const candidate = await this.usersService.getByEmail(dto.email);
    if (candidate) {
      throw new ForbiddenException(USER_EXISTS);
    }

    const hashPassword = await hash(dto.password, +this.configService.get<string>('AUTH_SALT_ROUNDS'));
    return { ...dto, password: hashPassword };
  }
}