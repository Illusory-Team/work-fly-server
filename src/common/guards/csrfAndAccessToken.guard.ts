import { TokensService } from 'tokens/tokens.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { IS_PUBLIC_KEY } from '@constants/index';

@Injectable()
export class CsrfAndAccessTokenGuard implements CanActivate {
  constructor(private reflector: Reflector, private tokensService: TokensService, private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.tokensService.getCsrfTokenFromRequest(request);
    await this.tokensService.validateCSRFToken(token);

    const { accessToken } = request.cookies;
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const { userId } = this.tokensService.validateAccessToken(accessToken);
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findById(userId);
    request.user = user;

    return true;
  }
}
