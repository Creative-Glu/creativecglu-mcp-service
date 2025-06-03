/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { AssociationsListSchema } from 'services/hubspot/dto';
import { z } from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class ListAssociationsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-list-associations',
    description: `
      🎯 Purpose:
        1. Retrieves existing relationships between a specific object and other objects of a particular type.
        2. For example, you can find all companies that a contact is associated with, all deals related to a company, or discover which customers have an open ticket.

      📦 Returns:
        1. Collection of associated object IDs and relationship metadata.
        2. Use hubspot-batch-read-objects to get more information about the associated objects.

      🧭 Usage Guidance:
        1. Use this tool when mapping relationships between different HubSpot objects to understand your data's connections.
        2. This tool is ideal when you already know a specific record's ID and need to discover its relationships with other object types.
        3. Prefer this over hubspot-search-objects tool when exploring established connections rather than filtering by properties or criteria.
    `,
    parameters: AssociationsListSchema,
  })
  async process(args: z.infer<typeof AssociationsListSchema>) {
    try {
      // Build the API path
      let endpoint = `/crm/v4/objects/${args.objectType}/${args.objectId}/associations/${args.toObjectType}?limit=500`;
      // Add pagination parameter if provided
      if (args.after) {
        endpoint += `&after=${args.after}`;
      }
      // Make API request
      const response = await this.client.get(endpoint);
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
            text: `Error retrieving HubSpot associations: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
