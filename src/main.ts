import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AccessTokenGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
