/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { GetEngagementSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class GetEngagementTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-get-engagement',
    description: `
      🎯 Purpose:
        1. Retrieves a HubSpot engagement by ID.
    `,
    parameters: GetEngagementSchema,
  })
  async process(args: z.infer<typeof GetEngagementSchema>) {
    try {
      const { engagementId } = args;
      const response = await this.client.get(
        `/engagements/v1/engagements/${engagementId}`,
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving HubSpot engagement: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
