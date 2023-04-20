import { PositionsModule } from './../positions/positions.module';
import { CompaniesModule } from './../companies/companies.module';
import { TokensModule } from './../tokens/tokens.module';
import { UsersModule } from './../users/users.module';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, TokensModule, CompaniesModule, PositionsModule],
})
export class AuthModule {}
