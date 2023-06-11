import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompaniesHandlers } from './commands';

@Module({
  providers: [CompaniesService, ...CompaniesHandlers],
  controllers: [CompaniesController],
  exports: [CompaniesService],
  imports: [CqrsModule, PrismaModule],
})
export class CompaniesModule {}
