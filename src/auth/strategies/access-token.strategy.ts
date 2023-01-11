
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_SECRET_KEY } from 'src/tokens/tokens.constants';
import { AccessJwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ACCESS_SECRET_KEY,
    });
  }

  validate(payload: AccessJwtPayload) {
    return payload;
  }
}
