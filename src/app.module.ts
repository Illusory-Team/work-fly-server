import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccessTokenGuard } from './common/guards';
import { CompaniesModule } from './companies/companies.module';
import { IsPhoneNumberConstraint } from './common/decorators';
import { PositionsModule } from './positions/positions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    TokensModule,
    PrismaModule,
    CompaniesModule,
    PositionsModule,
    FilesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }, IsPhoneNumberConstraint],
})
export class AppModule {}
