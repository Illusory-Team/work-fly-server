import { FilesModule } from 'files/files.module';
import { PositionsModule } from 'positions/positions.module';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UserHandlers],
  imports: [PrismaModule, CqrsModule, PositionsModule, FilesModule],
  exports: [UsersService],
})
export class UsersModule {}
