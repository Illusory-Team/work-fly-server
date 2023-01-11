import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt-access') implements IAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
