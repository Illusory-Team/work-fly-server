import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateAccessTokenQuery } from './validate-access-token.query';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@QueryHandler(ValidateAccessTokenQuery)
export class ValidateAccessTokenQueryHandler implements IQueryHandler<ValidateAccessTokenQuery> {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async execute(query: ValidateAccessTokenQuery) {
    try {
      const { accessToken } = query;

      return this.jwtService.verify(accessToken, { secret: this.configService.get<string>('ACCESS_SECRET_KEY') });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
