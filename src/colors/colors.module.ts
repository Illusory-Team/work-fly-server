import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';

@Module({
  providers: [ColorsService],
  exports: [ColorsService],
  imports: [PrismaModule],
})
export class ColorsModule {}
