import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ColorsService } from './colors.service';
import { ColorHandlers } from './commands';

@Module({
  providers: [ColorsService, ...ColorHandlers],
  exports: [ColorsService],
  imports: [PrismaModule, CqrsModule],
})
export class ColorsModule {}
