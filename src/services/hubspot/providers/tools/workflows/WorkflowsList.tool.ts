/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { WorkflowsListSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class WorkflowsListTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-list-workflows',
    description: `
      🎯 Purpose:
        1. This tool retrieves a paginated list of workflows from the HubSpot account.

      🧭 Usage Guidance:
        1. Use the "limit" parameter to control the number of results returned per page.
        2. For pagination, use the "after" parameter with the value from the previous response's paging.next.after.
        3. This endpoint returns essential workflow information including ID, name, type, and status.
    `,
    parameters: WorkflowsListSchema,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async workflowsList(args: z.infer<typeof WorkflowsListSchema>) {
    try {
      const params: Record<string, any> = {};
      if (args.limit) {
        params.limit = args.limit;
      }
      if (args.after) {
        params.after = args.after;
      }
      const response = await this.client.get('/automation/v4/flows', {
        params,
      });
      const filteredResults = response.results;
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                results: filteredResults,
                paging: response.paging,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing HubSpot workflows: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
