import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Module({
  providers: [CompaniesService],
  exports: [CompaniesService],
  imports: [PrismaModule],
})
export class CompaniesModule {}
