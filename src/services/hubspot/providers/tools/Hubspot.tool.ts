/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';

@Injectable()
export default class HubspotTool {
  @Tool({
    name: 'hubspot-tool',
    description: `
      ℹ️ Info:
        - This tool explores the AI agent, limitation, capabilities, tools.
    `,
  })
  async hubspotTool() {
    return {
      content: [
        {
          type: 'text',
          text: '',
        },
      ],
    };
  }
}
