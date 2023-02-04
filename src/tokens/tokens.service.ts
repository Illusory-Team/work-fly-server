import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Token } from '@prisma/client';
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from './tokens.constants';
import { ConfigService } from '@nestjs/config';
import { TokensDto } from './dto';

@Injectable()
export class TokensService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async saveRefreshToken(userId: string, refreshToken: string): Promise<Token> {
    const tokenData = await this.prismaService.token.findUnique({
      where: { userId },
    });
    if (tokenData) {
      return await this.prismaService.token.update({
        where: { userId: tokenData.userId },
        data: { ...tokenData, refreshToken },
      });
    }
    return await this.prismaService.token.create({
      data: { userId, refreshToken },
    });
  }

  async nullRefreshToken(refreshToken: string): Promise<Token> {
    const tokenData = await this.prismaService.token.findUnique({
      where: { refreshToken },
    });

    return await this.prismaService.token.update({
      where: { refreshToken: tokenData.refreshToken },
      data: { ...tokenData, refreshToken: null },
    });
  }

  async generateTokens(userId: string): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: ACCESS_SECRET_KEY,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          userId
        },
        {
          secret: REFRESH_SECRET_KEY,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async findRefreshToken(refreshToken: string): Promise<Token> {
    return this.prismaService.token.findUnique({where: {refreshToken}})
  }

  validateRefreshToken(refreshToken: string) {
    return this.jwtService.verify(refreshToken, {secret: this.configService.get<string>('REFRESH_SECRET_KEY')})
  }

  validateAccessToken(accessToken: string) {
    return this.jwtService.verify(accessToken, {secret: this.configService.get<string>('ACCESS_SECRET_KEY')})
  }

  hashPayload(payload: string): Promise<string> {
    return hash(payload, 7);
  }
}
