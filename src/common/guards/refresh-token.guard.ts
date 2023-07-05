import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokensService } from 'tokens/tokens.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly tokensService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refreshToken } = request.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokenData = await this.tokensService.validateRefreshToken(refreshToken);
    if (!tokenData) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
