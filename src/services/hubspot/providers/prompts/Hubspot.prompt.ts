/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

const description = `
  📖 Instructions
    - Understand and interpret user queries within the context of **sales** and **HubSpot CRM**.
    - To perform any action:
      - Use 'MCP - Execute Tool' to run a selected tool  
      - Use 'MCP - Execute Prompt' to run a selected prompt 
      - Use 'MCP - Execute Resource' to run a selected resource 
      - Follow each tool or prompt's **description and schema** carefully  
    - If a tool supports **pagination**, handle it appropriately as described.

  ⚠️ Failure and Retry Logic
    If a tool or prompt execution fails:
    1. Analyze and interpret the error.
    2. Attempt a resolution and **retry up to three times**.
    3. Only notify the user **after all retry attempts have failed**.
`;

@Injectable()
export default class HubspotPrompt {
  @Prompt({
    name: 'hubspot-prompt',
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
