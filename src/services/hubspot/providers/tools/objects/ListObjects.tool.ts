/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { ObjectListSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class ListObjectsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-list-objects',
    description: `
      🎯 Purpose:
        1. Retrieves a paginated list of objects of a specified type from HubSpot.

      📦 Returns:
        1. Collection of objects with their properties and metadata, plus pagination information.

      🧭 Usage Guidance:
        1. Use for initial data exploration to understand the data structure of a HubSpot object type.
        2. Helps list objects when the search criteria or filter criteria is not clear.
        3. Use 'hubspot-search-objects' for targeted queries when the data structure is known.
        4. Use 'hubspot-batch-read-objects' to retrieve specific objects by their IDs.
        5. Use 'hubspot-list-associations' to list associations between objects.
    `,
    parameters: ObjectListSchema,
  })
  async process(args: z.infer<typeof ObjectListSchema>) {
    try {
      const queryParams = new URLSearchParams();
      const paramMappings = {
        limit: args.limit?.toString(),
        after: args.after,
        properties:
          args.properties && args.properties.length > 0
            ? args.properties.join(',')
            : undefined,
        associations:
          args.associations && args.associations.length > 0
            ? args.associations.join(',')
            : undefined,
        archived: args.archived?.toString() || 'false',
      };
      Object.entries(paramMappings).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
      const response = await this.client.get(
        `/crm/v3/objects/${args.objectType}?${queryParams.toString()}`,
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                results: response.results.map((item) => ({
                  id: item.id,
                  properties: item.properties,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  archived: item.archived,
                  archivedAt: item.archivedAt,
                  associations: item.associations,
                })),
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
            text: `Error listing HubSpot ${args.objectType}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
