import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule]
})
export class UsersModule {}
