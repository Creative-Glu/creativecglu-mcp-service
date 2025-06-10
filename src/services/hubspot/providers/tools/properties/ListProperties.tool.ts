/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { PropertiesListSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class ListPropertiesTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-list-properties',
    description: `
      🎯 Purpose:
        1. This tool retrieves a complete catalog of properties for any HubSpot object type.

      🧭 Usage Guidance:
        1. This API has a large response that can consume a lot of tokens. Use the 'hubspot-list-objects' tool to sample existing objects for the object type first.
        2. Try to use the hubspot-get-property tool to get a specific property.
        3. Use at the beginning of workflows to understand available data structures.
    `,
    parameters: PropertiesListSchema,
  })
  async process(args: z.infer<typeof PropertiesListSchema>) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('archived', args.archived?.toString() || 'false');
      queryParams.append(
        'includeHidden',
        args.includeHidden?.toString() || 'false',
      );
      const response = await this.client.get(
        `/crm/v3/properties/${args.objectType}?${queryParams.toString()}`,
      );
      // Filter each result to only include the specified fields
      const filteredResults = response.results.map((property) => ({
        name: property.name,
        label: property.label,
        type: property.type,
        description: property.description,
        groupName: property.groupName,
      }));
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
            text: `Error listing HubSpot properties for ${args.objectType}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
