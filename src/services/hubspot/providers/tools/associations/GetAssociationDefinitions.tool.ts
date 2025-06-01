/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { AssociationSchemaDefinitionSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class GetAssociationDefinitionsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-get-association-definitions',
    description: `
      🎯 Purpose:
        1. Retrieves valid association types between specific HubSpot object types.

      📦 Returns:
        1. Array of valid association definitions with type IDs, labels, and categories.

      🧭 Usage Guidance:
        1. Always use before creating associations to ensure valid relationship types or to help troubleshoot association creation errors.
    `,
    parameters: AssociationSchemaDefinitionSchema,
  })
  async getAssociationDefinitions(
    args: z.infer<typeof AssociationSchemaDefinitionSchema>,
  ) {
    try {
      const response = await this.client.get(
        `/crm/v4/associations/${args.fromObjectType}/${args.toObjectType}/labels`,
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
            text: `Error retrieving HubSpot association schema definitions: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
