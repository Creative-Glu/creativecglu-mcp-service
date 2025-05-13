import { Module } from '@nestjs/common';
import controllers from 'services/hubspot/http/controllers';
import imports from 'services/hubspot/imports';
import providers from 'services/hubspot/providers';

@Module({
  imports,
  controllers,
  providers,
})
export default class HubspotModule {}
