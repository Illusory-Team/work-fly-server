import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateRefreshTokenQuery } from './validate-refresh-token.query';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@QueryHandler(ValidateRefreshTokenQuery)
export class ValidateRefreshTokenQueryHandler implements IQueryHandler<ValidateRefreshTokenQuery> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: ValidateRefreshTokenQuery) {
    try {
      const { refreshToken } = query;

      const tokenFromDb = await this.prismaService.token.findUnique({ where: { refreshToken } });
      if (!tokenFromDb) {
        throw new UnauthorizedException();
      }

      return this.jwtService.verify(tokenFromDb.refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
