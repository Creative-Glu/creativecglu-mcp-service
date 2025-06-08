/* eslint-disable import/order */
import { config } from 'dotenv';

config();

import { NestFactory } from '@nestjs/core';
import AppModule from 'services/app';
import { useContainer } from 'class-validator';
import CommonModule from 'services/common';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => ({
        statusCode: HttpStatus.ACCEPTED,
        message: errors.map((err) => Object.values(err.constraints)).flat(),
        errors: errors,
        error: 'CustomValidationError',
      }),
    }),
  );

  useContainer(app.select(CommonModule), { fallbackOnErrors: true });
  await app.listen(process.env.APP_PORT);
}
bootstrap();
