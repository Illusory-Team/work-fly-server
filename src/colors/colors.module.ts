import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ColorsService } from './colors.service';
import { ColorQueryHandlers } from './queries';

@Module({
  providers: [ColorsService, ...ColorQueryHandlers],
  exports: [ColorsService],
  imports: [PrismaModule, CqrsModule],
})
export class ColorsModule {}
