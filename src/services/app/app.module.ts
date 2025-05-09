import { Module } from '@nestjs/common';
import controllers from 'services/app/http/controllers';
import imports from 'services/app/imports';
import providers from 'services/app/providers';

@Module({
  imports,
  controllers,
  providers,
})
export default class AppModule {}
