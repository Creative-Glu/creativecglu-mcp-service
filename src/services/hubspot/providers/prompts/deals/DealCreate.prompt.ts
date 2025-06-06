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
              1. Use the hubspot-get-user-details tool to get the OwnerId and UserId if you don't have that already.
              2. Use the hubspot-list-objects tool to sample existing objects for the 'object' type.
              3. If hubspot-list-objects tool's response isn't helpful, use hubspot-list-properties tool.
              4. If there is no 'stage' set, set the stage to 'Appointment Scheduled' on the payload.
            `,
          },
        },
      ],
    };
  }
}
