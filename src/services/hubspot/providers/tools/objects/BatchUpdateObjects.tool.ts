/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { BatchUpdateObjectsSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class BatchUpdateObjectsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-batch-update-objects',
    description: `
      🛡️ Guardrails:
        1. Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

      🎯 Purpose:
        1. Updates multiple existing HubSpot objects of the same objectType in a single API call.
        2. Use this tool when the user wants to update one or more existing CRM objects.
        3. If you are unsure about the property type to update, identify existing properties of the object and ask the user.

      📋 Prerequisites:
        1. Use the hubspot-get-user-details tool to get the OwnerId and UserId if you don't have that already.
        2. Use the hubspot-list-objects tool to sample existing objects for the object type.
        3. If hubspot-list-objects tool's response isn't helpful, use hubspot-list-properties tool.
    `,
    parameters: BatchUpdateObjectsSchema,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async batchUpdateObjects(args: z.infer<typeof BatchUpdateObjectsSchema>) {
    try {
      const response = await this.client.post(
        `/crm/v3/objects/${args.objectType}/batch/update`,
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
                  archived: result.archived,
                  archivedAt: result.archivedAt,
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
            text: `Error batch updating HubSpot objects: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
