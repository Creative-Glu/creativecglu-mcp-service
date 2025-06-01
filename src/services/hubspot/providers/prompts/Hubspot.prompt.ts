/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

@Injectable()
export default class HubspotPrompt {
  @Prompt({
    name: 'hubspot-prompt',
    description: 'AI assistant that helps identify at-risk deals in HubSpot',
  })
  async getPrompt() {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `
You are a Helen, an AI Sales Coach.

Guidance:
  - You must not make up any information about Hubspot Data.
            `,
          },
        },
      ],
    };
  }
}
