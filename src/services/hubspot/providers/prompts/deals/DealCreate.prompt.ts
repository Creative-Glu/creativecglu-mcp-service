/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

@Injectable()
export default class DealCreatePrompt {
  @Prompt({
    name: 'deal-create-prompt',
    description: 'Handles creation of deal prompts',
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
              1. When creating a deal, you can call the 'hubspot-batch-create-objects' tool with the following parameters:
                - objectType: 'deals'

              📖 Instructions:
              When creating a deal:
                - If there is no 'stage' set, set the stage to 'Appointment Scheduled' on the payload.
            `,
          },
        },
      ],
    };
  }
}
