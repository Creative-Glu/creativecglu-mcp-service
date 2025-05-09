/* eslint-disable import/order */
import { config } from 'dotenv';

config();

import { NestFactory } from '@nestjs/core';
import AppModule from 'services/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
