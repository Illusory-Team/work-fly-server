import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TokenHandlers } from './commands';

@Module({
  providers: [TokensService, ...TokenHandlers],
  exports: [TokensService],
  imports: [PrismaModule, CqrsModule, JwtModule.register({})],
})
export class TokensModule {}
