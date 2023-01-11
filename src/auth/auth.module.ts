import { TokensModule } from './../tokens/tokens.module';
import { UsersModule } from './../users/users.module';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AccessTokenStrategy, RefreshTokenStrategy],
  imports: [UsersModule, TokensModule],
})
export class AuthModule {}
