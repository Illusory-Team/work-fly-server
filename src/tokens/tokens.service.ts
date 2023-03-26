import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Token, CSRFToken } from '@prisma/client';
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from './tokens.constants';
import { ConfigService } from '@nestjs/config';
import { TokensDto } from './dto';
import { Request } from 'express';

@Injectable()
export class TokensService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getCsrfTokenFromRequest(req: Request) {
    return (req.headers['csrf-token'] ||
      req.headers['xsrf-token'] ||
      req.headers['x-csrf-token'] ||
      req.headers['x-xsrf-token']) as string;
  }

  validateCSRFToken(csrfToken: string) {
    try {
      // throws error when it's invalid or expired
      return this.jwtService.verify(csrfToken, { secret: this.configService.get('CSRF_SECRET_KEY') }); 
    } catch (e) {
      throw new ForbiddenException();
    }
  }

  async generateCSRFToken(userId: string) {
    return this.jwtService.signAsync(
      { userId },
      { secret: this.configService.get('CSRF_SECRET_KEY'), expiresIn: '15m' },
    );
  }

  async saveCSRFToken(userId: string, csrfToken: string): Promise<CSRFToken> {
    const tokenData = await this.prismaService.cSRFToken.findUnique({
      where: { userId },
    });
    if (tokenData) {
      return this.prismaService.cSRFToken.update({
        where: { userId: tokenData.userId },
        data: { ...tokenData, csrfToken },
      });
    }
    return this.prismaService.cSRFToken.create({
      data: { userId, csrfToken },
    });
  }

  async nullCSRFToken(csrfToken: string): Promise<CSRFToken> {
    const tokenData = await this.prismaService.cSRFToken.findUnique({
      where: { csrfToken },
    });

    return this.prismaService.cSRFToken.update({
      where: { csrfToken: tokenData.csrfToken },
      data: { ...tokenData, csrfToken: null },
    });
  }

  async findCSRFToken(csrfToken: string): Promise<CSRFToken> {
    return this.prismaService.cSRFToken.findUnique({ where: { csrfToken } });
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<Token> {
    const tokenData = await this.prismaService.token.findUnique({
      where: { userId },
    });
    if (tokenData) {
      return this.prismaService.token.update({
        where: { userId: tokenData.userId },
        data: { ...tokenData, refreshToken },
      });
    }
    return this.prismaService.token.create({
      data: { userId, refreshToken },
    });
  }

  async nullRefreshToken(refreshToken: string): Promise<Token> {
    const tokenData = await this.prismaService.token.findUnique({
      where: { refreshToken },
    });

    return this.prismaService.token.update({
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
          userId,
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
    return this.prismaService.token.findUnique({ where: { refreshToken } });
  }

  validateRefreshToken(refreshToken: string) {
    return this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('REFRESH_SECRET_KEY') });
  }

  validateAccessToken(accessToken: string) {
    return this.jwtService.verify(accessToken, { secret: this.configService.get<string>('ACCESS_SECRET_KEY') });
  }

  hashPayload(payload: string): Promise<string> {
    return hash(payload, 7);
  }
}
