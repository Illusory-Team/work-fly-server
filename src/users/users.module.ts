import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FilesModule } from 'files/files.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PositionsModule } from 'positions/positions.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCommandHandlers } from './commands';
import { UserQueryHandlers } from './queries';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UserCommandHandlers, ...UserQueryHandlers],
  imports: [PrismaModule, CqrsModule, PositionsModule, FilesModule],
  exports: [UsersService],
})
export class UsersModule {}
