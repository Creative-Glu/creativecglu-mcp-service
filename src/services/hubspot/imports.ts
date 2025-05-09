import { McpModule, McpTransportType } from '@rekog/mcp-nest';
import CommonModule from 'services/common';

export default [
  CommonModule,
  McpModule.forRoot({
    name: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    transport: McpTransportType.SSE,
    sseEndpoint: 'api/v1/hubspot/sse',
    messagesEndpoint: 'api/v1/hubspot/sse/messages',
  }),
];
