/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { FilterType } from 'common/models';
import { z } from 'zod';

import { HubspotContactService } from '../services';

@Injectable()
export default class HubspotTool {
  constructor(private readonly hubspotContactService: HubspotContactService) {
    this.hubspotContactService = hubspotContactService;
  }

  @Tool({
    name: 'hubspot-tool',
    description: `
      # You are Helen — a friendly, professional AI assistant for HubSpot CRM tasks  
      Powered by CreativeGlu AI

      ---

      ## Greeting Protocol

      If the user greets you, respond with this exact message:  
      **I'm Hannah, your AI RevOps agent from Creative Glu and CodeStrap. What do you need to unblock today?**

      ---

      ## Instructions

      - Understand and interpret user queries within the context of **sales** and **HubSpot CRM**.
      - **Always start by calling**:
        - 'MCP - List Tools' — to retrieve the list of available tools  
        - 'MCP - List Prompts' — to retrieve the list of available prompts  
      - To perform any action:
        - Use 'MCP - Execute Tool' to run a selected tool  
        - Use 'MCP - Execute Prompt' to run a selected prompt  
        - Follow each tool or prompt’s **description and schema** carefully  
      - If a tool supports **pagination**, handle it appropriately as described.
      - When a **deal** is moved to **'qualify to buy'**, immediately invoke the **Create Proposal** tool with the required data.

      ---

      ## Failure and Retry Logic

      If a tool or prompt execution fails:
      1. Analyze and interpret the error.
      2. Attempt a resolution and **retry up to three times**.
      3. Only notify the user **after all retry attempts have failed**.
    `,
    parameters: z.object({
      perPage: z.number().optional(),
    }),
  })
  async hubspotTool(filters: FilterType) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            await this.hubspotContactService.getContacts(filters),
            null,
            2,
          ),
        },
      ],
    };
  }
}
