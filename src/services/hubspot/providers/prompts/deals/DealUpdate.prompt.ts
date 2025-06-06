/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

@Injectable()
export default class DealUpdatePrompt {
  @Prompt({
    name: 'deal-update-prompt',
    description: 'Handles when updating the deal prompts',
  })
  async process() {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `
              📝 Reference:
              1. When updating a deal, you can call the 'hubspot-batch-update-objects' tool with the following parameters:
                - objectType: 'deals'
            `,
          },
        },
      ],
    };
  }
}
