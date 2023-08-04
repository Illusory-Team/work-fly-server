import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('work-fly')
    .setDescription('work-fly api')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        name: 'access',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'jwt access-token',
      },
      'access',
    )
    .addSecurity('refresh', {
      type: 'apiKey',
      name: 'refresh',
      description: 'UNNECESSARY TO TYPE IN, using from cookies',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,PATCH,PUT,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.use(
    session({
      name: 'WORKFLY_SESSION',
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: +process.env.SESSION_TIME_MS,
        httpOnly: true,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
