/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

const description = `
  📖 Instructions:
    2. When successfully retrieving a deal, store the full deal object as a resource at:
      'mcp://hubspot-resource/deals/{dealId}' with MIME type 'application/json'.
    3. Use the 'dealId' from the result to populate the URI placeholder.
    4. Save the entire deal object (JSON) as the content of the resource.
`;

@Injectable()
export default class DealPrompt {
  @Prompt({
    name: 'deal-prompt',
    description,
  })
  async process() {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: description,
          },
        },
      ],
    };
  }
}
