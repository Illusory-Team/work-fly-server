import { Injectable, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { REFRESH_SECRET_KEY } from 'src/tokens/tokens.constants';
import { RefreshJwtPayload } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: REFRESH_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshJwtPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    if(!refreshToken) {
      throw new ForbiddenException('Refresh token malformed')
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
