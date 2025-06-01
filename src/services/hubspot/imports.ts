import { McpModule } from '@rekog/mcp-nest';
import { BasicAuthGuard } from 'services/auth/providers/guards';
import CommonModule from 'services/common';

export default [
  CommonModule,
  McpModule.forRoot({
    name: process.env.APP_NAME,
    sseEndpoint: '/api/v1/hubspot/sse',
    mcpEndpoint: '/api/v1/hubspot/mcp',
    version: '1.0.0',
    guards: [BasicAuthGuard],
  }),
];
