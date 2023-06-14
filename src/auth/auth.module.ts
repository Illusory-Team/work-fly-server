import { PositionsModule } from 'positions/positions.module';
import { CompaniesModule } from 'companies/companies.module';
import { TokensModule } from 'tokens/tokens.module';
import { UsersModule } from 'users/users.module';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthCommandHandlers } from './commands';

@Module({
  providers: [...AuthCommandHandlers],
  controllers: [AuthController],
  imports: [CqrsModule, UsersModule, TokensModule, CompaniesModule, PositionsModule],
})
export class AuthModule {}
