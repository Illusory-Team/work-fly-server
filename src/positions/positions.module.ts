import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [PositionsService, ...PositionHandlers],
  imports: [PrismaModule, CqrsModule],
  exports: [PositionsService],
})
export class PositionsModule {}
