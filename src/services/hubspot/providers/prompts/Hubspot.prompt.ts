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
                  - Use **'MCP - Execute Tool'** to run a selected tool  
                  - Use **'MCP - Execute Prompt'** to run a selected prompt  
                  - Use **'MCP - Execute Resource'** to run a selected resource  
                  - Follow each tool, prompt, or resource’s **description and schema** precisely.
                - Select and execute the appropriate tool, prompt, or resource based on the user's intent.
                - If a tool supports **pagination**, handle it according to the schema definition.


              📌 Additional Guidelines
                - If the user requests **"all"**, **"total"**, or similar terms:
                  - It means they want to see **all available results**.
                  - If the schema has a limit field, **set it as high as possible**.
                  - If there is no limit field, use the **default behavior** defined by the tool.


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
