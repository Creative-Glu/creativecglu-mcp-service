import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

@Injectable()
export default class DealPrompt {
  @Prompt({
    name: 'deal-prompt',
    description:
      'Use this prompt for all HubSpot deal-related business logic or user prompts.',
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
              1. When successfully retrieving a deal, store the full deal object as a resource at:
                'mcp://hubspot-resource/deals/{dealId}' with MIME type 'application/json'.
              2. Use the 'dealId' from the result to populate the URI placeholder.
              3. Save the entire deal object (JSON) as the content of the resource.
              4. Ensure the resource is accessible for future reference.
            `,
          },
        },
      ],
    };
  }
}
