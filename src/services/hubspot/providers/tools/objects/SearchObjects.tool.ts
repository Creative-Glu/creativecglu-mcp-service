/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { ObjectSearchSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class SearchObjectsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-search-objects',
    description: `
    🎯 Purpose:
      1. Performs advanced filtered searches across HubSpot object types using complex criteria.

    📋 Prerequisites:
      1. Use the hubspot-list-objects tool to sample existing objects for the object type.
      2. If hubspot-list-objects tool's response isn't helpful, use hubspot-list-properties tool.

    📦 Returns:
      1. Filtered collection matching specific criteria with pagination information.

    🧭 Usage Guidance:
      1. Preferred for targeted data retrieval when exact filtering criteria are known. Supports complex boolean logic through filter groups.
      2. Use hubspot-list-objects when filter criteria is not specified or clear or when a search fails.
      3. Use hubspot-batch-read-objects to retrieve specific objects by their IDs.
      4. Use hubspot-list-associations to get the associations between objects.

    🔍 Filtering Capabilities:
      1. Think of "filterGroups" as separate search conditions that you want to combine with OR logic (meaning ANY of them can match).
      2. If you want to find things that match ALL of several conditions (AND logic), put those conditions together in the same filters list.
      3. If you want to find things that match AT LEAST ONE of several conditions (OR logic), put each condition in a separate filterGroup.
      4. You can include a maximum of five filterGroups with up to 6 filters in each group, with a maximum of 18 filters in total.
    `,
    parameters: ObjectSearchSchema,
  })
  async process(args: z.infer<typeof ObjectSearchSchema>) {
    try {
      const { query, limit, after, properties, sorts, filterGroups } = args;
      const requestBody = {
        query,
        limit,
        after,
        properties:
          properties && properties.length > 0 ? properties : undefined,
        sorts: sorts && sorts.length > 0 ? sorts : undefined,
        filterGroups:
          filterGroups && filterGroups.length > 0 ? filterGroups : undefined,
      };
      const cleanRequestBody = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(requestBody).filter(([_, value]) => value !== undefined),
      );
      const response = await this.client.post(
        `/crm/v3/objects/${args.objectType}/search`,
        {
          body: cleanRequestBody,
        },
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
            text: `Error searching HubSpot ${args.objectType}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
