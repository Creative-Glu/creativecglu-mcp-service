/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { GetPropertySchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class GetPropertyTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-get-property',
    description: `
      🎯 Purpose:
        1. This tool retrieves detailed information about a specific property for a HubSpot object type.
        2. You can use this to get all metadata related to a property, including its type, options,
          and other configuration details.
    `,
    parameters: GetPropertySchema,
  })
  async process(args: z.infer<typeof GetPropertySchema>) {
    try {
      const response = await this.client.get(
        `/crm/v3/properties/${args.objectType}/${args.propertyName}`,
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
            text: `Error retrieving HubSpot property ${args.propertyName} for ${args.objectType}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
