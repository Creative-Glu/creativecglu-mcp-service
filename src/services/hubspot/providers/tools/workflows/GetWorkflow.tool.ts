/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { GetWorkflowSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class GetWorkflowTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-get-workflow',
    description: `
      🎯 Purpose:
        1. This tool retrieves detailed information about a specific workflow from the HubSpot account.

      🧭 Usage Guidance:
        1. Use the "flowId" parameter to specify which workflow to retrieve.
        2. This endpoint returns complete workflow information including actions, enrollment criteria, and scheduling.
        3. Use the hubspot-list-workflows tool first to identify the workflow ID you need.
    `,
    parameters: GetWorkflowSchema,
  })
  async process(args: z.infer<typeof GetWorkflowSchema>) {
    try {
      const response = await this.client.get(
        `/automation/v4/flows/${args.flowId}`,
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
            text: `Error retrieving HubSpot workflow (ID: ${args.flowId}): ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
