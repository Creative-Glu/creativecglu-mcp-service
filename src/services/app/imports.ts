import { RouterModule } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import config from 'services/app/config';
import routes from 'services/app/routes';
import CommonModule from 'services/common';
import HubspotModule from 'services/hubspot';

export default [
  ...config,
  RouterModule.register(routes),
  ThrottlerModule.forRoot([
    {
      ttl: 6000,
      limit: 10,
    },
  ]),
  CommonModule,
  HubspotModule,
];
