import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Module({
  providers: [PositionsService],
  imports: [PrismaModule],
  exports: [PositionsService]
})
export class PositionsModule {}
