import { UserReturnDto } from './dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Injectable } from '@nestjs/common';
import { RegisterUserOwnerDto, SetSessionReturnDto, UserSessionDto } from './dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand, LogoutCommand, RefreshCommand, RegisterCommand, SetSessionCommand } from './commands';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  async setSession(dto: UserSessionDto): Promise<SetSessionReturnDto> {
    return this.commandBus.execute(new SetSessionCommand(dto));
  }

  async register(dto: RegisterUserOwnerDto): Promise<UserReturnDto> {
    return this.commandBus.execute(new RegisterCommand(dto));
  }

  async login(dto: LoginUserDto): Promise<UserReturnDto> {
    return this.commandBus.execute(new LoginCommand(dto));
  }

  async logout(refreshToken: string, csrfToken: string): Promise<void> {
    return this.commandBus.execute(new LogoutCommand(refreshToken, csrfToken));
  }

  async refresh(refreshToken: string): Promise<UserReturnDto> {
    return this.commandBus.execute(new RefreshCommand(refreshToken));
  }
}
