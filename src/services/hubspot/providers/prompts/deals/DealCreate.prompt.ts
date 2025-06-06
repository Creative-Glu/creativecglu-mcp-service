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
              📖 Instructions:
              1. When creating a deal, call the 'hubspot-batch-create-objects' tool with the following parameters:
                - objectType: 'deals'
              2. You **must** use the 'hubspot-get-user-details' tool to obtain the OwnerId and UserId if not already available.
              3. You **must** use the 'hubspot-list-objects' tool to sample existing objects for the required 'object' type in the parameters.
              4. If the response from 'hubspot-list-objects' is not helpful, use the 'hubspot-list-properties' tool to get more details.
              5. If there is no 'stage' set, set the 'stage' field in the payload to 'Appointment Scheduled' and set the 'closeAt' field to the current date plus 1 month.
              6. If a 'stage' is provided, you **must** use the 'deal-stage-prompt' to resolve the 'stage' and the 'closeAt' value.
            `,
          },
        },
      ],
    };
  }
}
