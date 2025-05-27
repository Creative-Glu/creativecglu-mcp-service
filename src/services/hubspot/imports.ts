import { McpModule } from '@rekog/mcp-nest';
import CommonModule from 'services/common';

export default [
  CommonModule,
  McpModule.forRoot({
    name: process.env.APP_NAME,
    sseEndpoint: '/api/v1/hubspot/sse',
    version: '1.0.0',
  }),
];
