import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { ValidateCSRFTokenQuery } from './validate-csrf-token.query';

@QueryHandler(ValidateCSRFTokenQuery)
export class ValidateCSRFTokenQueryHandler implements IQueryHandler<ValidateCSRFTokenQuery> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: ValidateCSRFTokenQuery) {
    try {
      const { csrfToken } = query;

      // throws error when it's invalid or expired
      const tokenData = this.jwtService.verify(csrfToken, { secret: this.configService.get('CSRF_SECRET_KEY') });

      const token = await this.prismaService.cSRFToken.findUnique({ where: { csrfToken } });
      if (!token) {
        throw new UnauthorizedException();
      }

      return tokenData;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
