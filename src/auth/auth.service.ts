import { PositionsService } from './../positions/positions.service';
import { CompaniesService } from './../companies/companies.service';
import { UserReturnDto } from './dto';
import { TokensService } from './../tokens/tokens.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common/exceptions';
import { compare } from 'bcrypt';
import { PureUserDto, PureRelationsUserDto } from 'src/users/dto';
import { RegisterUserOwnerDto, SetSessionReturnDto, UserSessionDto } from './dto';
import { EMAIL_PASSWORD_INCORRECT, NO_SESSION, USER_EXISTS } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private companiesService: CompaniesService,
    private positionsService: PositionsService,
  ) {}

  async setSession(dto: UserSessionDto): Promise<SetSessionReturnDto> {
    const candidate = await this.usersService.findByEmail(dto.email);
    if (candidate) {
      throw new ForbiddenException(USER_EXISTS);
    }

    const hashPassword = await this.tokensService.hashPayload(dto.password);
    return { ...dto, password: hashPassword };
  }

  async register(dto: RegisterUserOwnerDto): Promise<UserReturnDto> {
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

    const csrfToken = await this.tokensService.generateCSRFToken(user.id);
    await this.tokensService.saveCSRFToken(user.id, csrfToken);
    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);

    const responseUser: PureRelationsUserDto = { ...new PureUserDto(candidate), position };
    return { user: responseUser, tokens: { ...tokens, csrfToken } };
  }

  async login(dto: LoginUserDto): Promise<UserReturnDto> {
    const candidate = await this.usersService.findByEmail(dto.email);
    if (!candidate) {
      throw new ForbiddenException(EMAIL_PASSWORD_INCORRECT);
    }

    const isEquals = await compare(dto.password, candidate.password);
    if (!isEquals) {
      throw new ForbiddenException(EMAIL_PASSWORD_INCORRECT);
    }

    const position = await this.positionsService.findById(candidate.positionId);

    const csrfToken = await this.tokensService.generateCSRFToken(candidate.id);
    await this.tokensService.saveCSRFToken(candidate.id, csrfToken);
    const tokens = await this.tokensService.generateTokens(candidate.id);
    await this.tokensService.saveRefreshToken(candidate.id, tokens.refreshToken);

    const responseUser: PureRelationsUserDto = { ...new PureUserDto(candidate), position };
    return { user: responseUser, tokens: { ...tokens, csrfToken } };
  }

  async logout(refreshToken: string, csrfToken: string): Promise<void> {
    if (!refreshToken || !csrfToken) {
      throw new UnauthorizedException();
    }
    await this.tokensService.nullRefreshToken(refreshToken);
    await this.tokensService.nullCSRFToken(csrfToken);
  }

  async refresh(refreshToken: string, csrfToken: string): Promise<UserReturnDto> {
    if (!refreshToken || !csrfToken) {
      throw new UnauthorizedException();
    }

    const userRefreshData = this.tokensService.validateRefreshToken(refreshToken);
    const refreshTokenFromDb = await this.tokensService.findRefreshToken(refreshToken);
    const userCSRFData = this.tokensService.validateCSRFToken(csrfToken);
    const csrfTokenFromDb = await this.tokensService.findCSRFToken(csrfToken);

    if (!userRefreshData || !refreshTokenFromDb || !userCSRFData || !csrfTokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(userRefreshData.userId);
    const position = await this.positionsService.findById(user.positionId);

    const newCSRFToken = await this.tokensService.generateCSRFToken(user.id);
    await this.tokensService.saveCSRFToken(user.id, newCSRFToken);
    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);

    const responseUser: PureRelationsUserDto = { ...new PureUserDto(user), position };
    return { user: responseUser, tokens: { ...tokens, csrfToken } };
  }
}
