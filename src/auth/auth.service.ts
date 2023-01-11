import { TokensService } from './../tokens/tokens.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserData } from './types';
import { PureUserDto } from '../users/dto/pure-user.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  async register(dto: RegisterUserDto): Promise<UserData> {
    const candidate = await this.usersService.findOneByEmail(dto.email);
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }

    const hashPassword = await this.tokensService.hashPayload(dto.password);
    const user = await this.usersService.create({
      ...dto,
      password: hashPassword,
    });

    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);
    return { user: new PureUserDto(user), tokens };
  }

  async login(dto: LoginUserDto): Promise<UserData> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new HttpException('Email was not found', HttpStatus.FORBIDDEN);
    }

    const isEquals = await compare(dto.password, user.password);
    if (!isEquals) {
      throw new HttpException('Email or password is incorrect', HttpStatus.FORBIDDEN);
    }

    const tokens = await this.tokensService.generateTokens(user.id);
    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken);
    return { user: new PureUserDto(user), tokens };
  }

  async logout(refreshToken: string): Promise<void> {
    if(!refreshToken) {
      throw new HttpException('You are not authorized', HttpStatus.UNAUTHORIZED);
    }
    await this.tokensService.nullRefreshToken(refreshToken)
  }

  async refresh(refreshToken: string): Promise<UserData> {
    if(!refreshToken) {
      throw new HttpException('You are not authorized', HttpStatus.UNAUTHORIZED);
    }

    const userData = this.tokensService.validateRefreshToken(refreshToken)
    const tokenFromDb = await this.tokensService.findRefreshToken(refreshToken)

    if(!userData || !tokenFromDb) {
      throw new HttpException('You are not authorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findOneById(userData.userId)
    const tokens = await this.tokensService.generateTokens(user.id)

    await this.tokensService.saveRefreshToken(user.id, tokens.refreshToken)

    return {user: new PureUserDto(user), tokens}
  }
}
