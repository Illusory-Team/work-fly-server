import { TokensModule } from './../tokens/tokens.module';
import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  providers: [CompaniesService],
  exports: [CompaniesService],
  imports: [PrismaModule, TokensModule],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
