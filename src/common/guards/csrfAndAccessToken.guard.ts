import { TokensService } from '../../tokens/tokens.service';
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './accessToken.guard';

@Injectable()
export class CsrfAndAccessGuard extends AccessTokenGuard implements CanActivate {
  constructor(private reflector: Reflector, private tokensService: TokensService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.tokensService.getCsrfTokenFromRequest(request);
    this.tokensService.validateCSRFToken(token);

    // if valid and it's not public => use access token guard next
    return super.canActivate(context);
  }
}
