import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private tokensService: TokensService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { refreshToken } = request.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokenData = this.tokensService.validateRefreshToken(refreshToken);
    if (!tokenData) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
