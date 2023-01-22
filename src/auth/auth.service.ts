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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private companiesService: CompaniesService,
  ) {}

  async setSession(dto: UserSessionDto) {
    const candidate = await this.usersService.findOneByEmail(dto.email);
    if (candidate) {
      throw new ForbiddenException('User already exists');
    }

    const hashPassword = await this.tokensService.hashPayload(dto.password);
    return { ...dto, password: hashPassword };
  }

  async register(dto: RegisterUserOwnerDto): Promise<UserDataDto> {
    if (!dto.user) {
      throw new ForbiddenException('You don not have user data in the session, register user again');
    }

    const candidate = await this.usersService.findOneByEmail(dto.user.email);
    if (candidate) {
      throw new ForbiddenException('User already exists');
    }

    const company = await this.companiesService.create(dto.company);
    const user = await this.usersService.create({ ...dto.user, companyId: company.id });

    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);
    return { user: new PureUserDto(user), tokens };
  }

  async login(dto: LoginUserDto): Promise<UserDataDto> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException('Email or password is incorrect');
    }

    const isEquals = await compare(dto.password, user.password);
    if (!isEquals) {
      throw new ForbiddenException('Email or password is incorrect');
    }

    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);
    return { user: new PureUserDto(user), tokens };
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

    const user = await this.usersService.findOneById(userData.userId);
    const tokens = await this.tokensService.generateTokens(user.id);

    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: new PureUserDto(user), tokens };
  }
}
