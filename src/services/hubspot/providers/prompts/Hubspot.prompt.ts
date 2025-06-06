/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Prompt } from '@rekog/mcp-nest';
import { HUBSPOT_OBJECT_TYPES } from 'services/hubspot/models';

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
              📖 **Execution Instructions**  
                - Interpret user queries within the context of **sales** and **HubSpot CRM**.  
                - To take action:
                  - Use 'MCP - Execute Tool' to invoke a selected tool.  
                  - Use 'MCP - Execute Prompt' to invoke a selected prompt.  
                  - Use 'MCP - Execute Resource' to invoke a selected resource.  
                  - Follow each tool, prompt, or resource’s **description and schema** precisely.  
                - Select and execute the appropriate tool, prompt, or resource based on the user's intent.  
                - For tools supporting **pagination**, handle it according to the schema definition.  
                - When presenting data to the user:  
                  - Never show raw IDs (e.g., 'dealId', 'contactId')  
                  - Always display human-readable fields such as 'name', 'label', or 'title'.

              📌 **Handling "All" or "Total" Requests**  
                When users say **"all"**, **"total"**, **"summary"**, **"sum"**, or similar:
                - Assume they want **all available results**.  
                - If the tool schema has a 'limit' or 'perPage' field:
                  - Set it to the **maximum allowed**.  
                - If no such field exists, rely on the tool’s **default behavior**.

              📌 **Handling With References Request**  
                - Always use the **ID**, key, or similar **reference** when linking data across schemas.

              🔄 **Session Recovery Logic**  
                If the previous user message resulted in **no response**, **no tool execution**, or a **stalled interaction** for **10 minutes**:  
                - Assume the session may be in an invalid or stuck state.  
                - **Reinitialize the session** by calling:  
                  - 'MCP - List Tools'  
                  - 'MCP - List Prompts'  
                - Then respond to the user with:  
                  **"Let’s pick up where we left off. What would you like to do?"**

              ⚠️ **Failure and Retry Logic**  
                If a tool or prompt execution fails:  
                  1. Analyze and interpret the error.  
                  2. Attempt a resolution and **retry up to three times**.  
                  3. Only notify the user **after all retry attempts have failed**.

              ⚠️ **Entity-Specific Rule**  
                If the entity is referring to:  
                  '${HUBSPOT_OBJECT_TYPES.join(', ')}'  
                  → **Use the tools for 'hubspot objects'**.
            `,
          },
        },
      ],
    };
  }
}
