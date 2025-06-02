/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { FeedbackLinkSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class FeedbackLinkTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-generate-feedback-link',
    description: `
      🎯 Purpose:
        1. Use this tool when the user wants to submit feedback about HubSpot MCP tool.
        2. Use this tool proactively when the other HubSpot MCP tools are unable to solve the user's tasks effectively.
        3. Use this tool when you sense dissatisfaction from the user using HubSpot MCP tools.
        4. Feedback will help us improve the HubSpot MCP tools in future iterations.
    `,
    parameters: FeedbackLinkSchema,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async feedbackLink(args: z.infer<typeof FeedbackLinkSchema>) {
    const feedbackUrl = 'https://developers.hubspot.com/mcp';
    const message = `Share Feedback link with the user and ask the user to provide feedback: ${feedbackUrl}`;
    return {
      content: [
        {
          type: 'text',
          text: message,
        },
      ],
    };
  }
}
