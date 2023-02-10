import { PositionsService } from './../positions/positions.service';
import { CompaniesService } from './../companies/companies.service';
import { UserDataDto } from './dto/user-data.dto';
import { TokensService } from './../tokens/tokens.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common/exceptions';
import { compare } from 'bcrypt';
import { PureUserDto } from 'src/users/dto';
import { RegisterUserOwnerDto, UserSessionDto } from './dto';
import { EMAIL_PASSWORD_INCORRECT, NO_SESSION, USER_EXISTS } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private companiesService: CompaniesService,
    private positionsService: PositionsService,
  ) {}

  async setSession(dto: UserSessionDto) {
    const candidate = await this.usersService.findByEmail(dto.email);
    if (candidate) {
      throw new ForbiddenException(USER_EXISTS);
    }

    const hashPassword = await this.tokensService.hashPayload(dto.password);
    return { ...dto, password: hashPassword };
  }

  async register(dto: RegisterUserOwnerDto): Promise<UserDataDto> {
    if (!dto.user) {
      throw new ForbiddenException(NO_SESSION);
    }

    const candidate = await this.usersService.findByEmail(dto.user.email);
    if (candidate) {
      throw new ForbiddenException(USER_EXISTS);
    }

    const company = await this.companiesService.create(dto.company);
    const position = await this.positionsService.create(company.id, 'Owner');
    const user = await this.usersService.create({ ...dto.user, companyId: company.id, positionId: position.id });

    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);
    return { user: new PureUserDto(user), tokens, position };
  }

  async login(dto: LoginUserDto): Promise<UserDataDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException(EMAIL_PASSWORD_INCORRECT);
    }

    const isEquals = await compare(dto.password, user.password);
    if (!isEquals) {
      throw new ForbiddenException(EMAIL_PASSWORD_INCORRECT);
    }

    const position = await this.positionsService.findById(user.positionId);
    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);
    return { user: new PureUserDto(user), tokens, position };
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    await this.tokensService.nullRefreshToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<UserDataDto> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userData = this.tokensService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokensService.findRefreshToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(userData.userId);
    const position = await this.positionsService.findById(user.positionId);
    const tokens = await this.tokensService.generateTokens(user.id);

    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: new PureUserDto(user), tokens, position };
  }
}
