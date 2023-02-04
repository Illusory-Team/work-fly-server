import { TokensModule } from './../tokens/tokens.module';
import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule, TokensModule],
  controllers: [UsersController]
})
export class UsersModule {}
