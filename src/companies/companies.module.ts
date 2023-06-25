import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompanyCommandHandlers } from './commands';
import { CompanyQueryHandlers } from './queries';

@Module({
  providers: [CompaniesService, ...CompanyCommandHandlers, ...CompanyQueryHandlers],
  controllers: [CompaniesController],
  exports: [CompaniesService],
  imports: [CqrsModule, PrismaModule],
})
export class CompaniesModule {}
