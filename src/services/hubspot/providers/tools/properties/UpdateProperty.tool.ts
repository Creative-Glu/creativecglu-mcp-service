/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { UpdatePropertySchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class UpdatePropertyTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-update-property',
    description: `
      🛡️ Guardrails:
        1. Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

      🎯 Purpose:
        1. Updates existing custom properties for HubSpot object types, enabling data structure customization.

      🧭 Usage Guidance:
        1. Use hubspot-list-objects tool to sample existing objects for the object type.
        2. If hubspot-list-objects tool's response isn't helpful, use hubspot-list-properties tool.
    `,
    parameters: UpdatePropertySchema,
  })
  async updateProperty(args: z.infer<typeof UpdatePropertySchema>) {
    try {
      const { objectType, propertyName, ...updateData } = args;
      // Check if at least one field is provided for update
      if (Object.keys(updateData).length === 0) {
        throw new Error(
          'At least one property field must be provided for update',
        );
      }
      const response = await this.client.patch(
        `/crm/v3/properties/${objectType}/${propertyName}`,
        {
          body: updateData,
        },
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
            text: `Error updating HubSpot property ${args.propertyName} for ${args.objectType}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
