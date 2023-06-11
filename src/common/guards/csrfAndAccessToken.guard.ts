import { TokensService } from 'tokens/tokens.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'users/users.service';
import { IS_PUBLIC_KEY } from '@constants/index';

@Injectable()
export class CsrfAndAccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = await this.tokensService.getCSRFTokenFromRequest(request);
    const csrfTokenData = await this.tokensService.validateCSRFToken(token);

    const { accessToken } = request.cookies;
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const { userId } = await this.tokensService.validateAccessToken(accessToken);
    if (!userId || csrfTokenData.userId !== userId) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.getById(userId);
    request.user = user;

    return true;
  }
}
