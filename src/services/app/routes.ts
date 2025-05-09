import { Routes } from '@nestjs/core';
import CommonModule from 'services/common';
import HubspotModule from 'services/hubspot';

export default <Routes>[
  {
    path: '/',
    children: [
      {
        path: '/',
        module: CommonModule,
      },
      {
        path: '/',
        module: HubspotModule,
      },
    ],
  },
];
