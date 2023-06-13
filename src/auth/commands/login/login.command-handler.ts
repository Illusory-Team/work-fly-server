import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { compare } from 'bcrypt';
import { LoginCommand } from './login.command';
import { UsersService } from 'users/users.service';
import { TokensService } from 'tokens/tokens.service';
import { PositionsService } from 'positions/positions.service';
import { UserReturnDto } from 'auth/dto';
import { EMAIL_PASSWORD_INCORRECT, NOT_FOUND } from '@constants/error';
import { AuthMapper } from 'auth/auth.mapper';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly positionsService: PositionsService,
  ) {}

  async execute(command: LoginCommand): Promise<UserReturnDto> {
    const { dto } = command;

    const user = await this.usersService.getByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    const isEquals = await compare(dto.password, user.password);
    if (!isEquals) {
      throw new ForbiddenException(EMAIL_PASSWORD_INCORRECT);
    }

    const position = await this.positionsService.getById(user.positionId);

    const tokens = await this.tokensService.generateTokens(user.id);

    return AuthMapper.makeAuthResponse(user, position, tokens);
  }
}
