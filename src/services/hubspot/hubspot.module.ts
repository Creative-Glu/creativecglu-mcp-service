import { Module } from '@nestjs/common';
import imports from 'services/hubspot/imports';
import providers from 'services/hubspot/providers';

@Module({
  imports,
  providers,
})
export default class HubspotModule {}
