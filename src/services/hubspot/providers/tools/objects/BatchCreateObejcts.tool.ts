/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { BatchCreateObjectsSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class BatchCreateObjectsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-batch-create-objects',
    description: `
      🛡️ Guardrails:
        1. Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

      🎯 Purpose:
        1. Creates multiple HubSpot objects of the same objectType in a single API call, optimizing for bulk operations.

      📋 Prerequisites:
        1. Use the hubspot-get-user-details tool to get the OwnerId and UserId if you don't have that already.
        2. Use the hubspot-list-objects tool to sample existing objects for the object type.
        3. Use the hubspot-get-association-definitions tool to identify valid association types before creating associations.
    `,
    parameters: BatchCreateObjectsSchema,
  })
  async process(args: z.infer<typeof BatchCreateObjectsSchema>) {
    try {
      const response = await this.client.post(
        `/crm/v3/objects/${args.objectType}/batch/create`,
        {
          body: {
            inputs: args.inputs,
          },
        },
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: response.status,
                results: response.results.map((result) => ({
                  id: result.id,
                  properties: result.properties,
                  createdAt: result.createdAt,
                  updatedAt: result.updatedAt,
                })),
                requestedAt: response.requestedAt,
                startedAt: response.startedAt,
                completedAt: response.completedAt,
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
            text: `Error batch creating HubSpot objects. : ${error instanceof Error ? error.message : String(error)}
            `,
          },
        ],
        isError: true,
      };
    }
  }
}
