import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'prisma/prisma.module';
import { PositionsService } from './positions.service';
import { PositionCommandHandlers } from './commands';
import { PositionQueryHandlers } from './queries';

@Module({
  providers: [PositionsService, ...PositionCommandHandlers, ...PositionQueryHandlers],
  imports: [PrismaModule, CqrsModule],
  exports: [PositionsService],
})
export class PositionsModule {}
