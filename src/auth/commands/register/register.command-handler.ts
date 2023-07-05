import { ForbiddenException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { NO_SESSION, USER_EXISTS } from '@constants/error';
import { TokensService } from 'tokens/tokens.service';
import { CompaniesService } from 'companies/companies.service';
import { PositionsService } from 'positions/positions.service';
import { UsersService } from 'users/users.service';
import { RegisterCommand } from './register.command';
import { AuthMapper } from 'auth/auth.mapper';
import { AuthReturn } from 'auth/auth.interface';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly companiesService: CompaniesService,
    private readonly positionsService: PositionsService,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthReturn> {
    const { dto } = command;

    if (!dto.user) {
      throw new ForbiddenException(NO_SESSION);
    }

    const candidate = await this.usersService.getByEmail(dto.user.email);
    if (candidate) {
      throw new ForbiddenException(USER_EXISTS);
    }

    const company = await this.companiesService.create(dto.company);
    const position = await this.positionsService.create(company.id, 'Owner');
    const user = await this.usersService.create({ ...dto.user, companyId: company.id, positionId: position.id });

    const tokens = await this.tokensService.generateTokens(user.id);

    return AuthMapper.makeAuthResponse(user, position, tokens);
  }
}
