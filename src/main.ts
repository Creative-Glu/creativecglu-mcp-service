/* eslint-disable import/order */
import { config } from 'dotenv';

config();

import { NestFactory } from '@nestjs/core';
import AppModule from 'services/app';
import { useContainer } from 'class-validator';
import CommonModule from 'services/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(CommonModule), { fallbackOnErrors: true });
  await app.listen(process.env.APP_PORT);
}
bootstrap();
