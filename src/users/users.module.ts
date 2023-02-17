import { FilesModule } from './../files/files.module';
import { PositionsModule } from './../positions/positions.module';
import { TokensModule } from './../tokens/tokens.module';
import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule, TokensModule, PositionsModule, FilesModule],
  controllers: [UsersController]
})
export class UsersModule {}
