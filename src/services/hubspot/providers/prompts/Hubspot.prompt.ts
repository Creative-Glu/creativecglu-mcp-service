/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';

@Injectable()
export default class HubspotPrompt {
  @Prompt({
    name: 'hubspot-prompt',
    description: 'Hubspot MCP prompt',
  })
  async process() {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `
              📖 Instructions  
                - Understand and interpret user queries within the context of **sales** and **HubSpot CRM**.  
                - To perform any action:
                  - Use 'MCP - Execute Tool' to run a selected tool  
                  - Use 'MCP - Execute Prompt' to run a selected prompt  
                  - Use 'MCP - Execute Resource' to run a selected resource  
                  - Follow each tool, prompt, or resource's **description and schema** carefully
                - Execute the appropriate tool, prompt, or resource based on the user's request.
                - If a tool supports **pagination**, handle it as described in its definition.

              ⚠️ Failure and Retry Logic  
                If a tool or prompt execution fails:  
                1. Analyze and interpret the error.  
                2. Attempt a resolution and **retry up to three times**.  
                3. Only notify the user **after all retry attempts have failed**.
            `,
          },
        },
      ],
    };
  }
}
