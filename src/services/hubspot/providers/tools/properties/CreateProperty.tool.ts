/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { CreatePropertySchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class GetPropertyTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-create-property',
    description: `
      🛡️ Guardrails:
        1. Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

      🎯 Purpose:
        1. Creates new custom properties for HubSpot object types, enabling data structure customization.

      📋 Prerequisites:
        1. Use the hubspot-get-user-details tool to get the OwnerId and UserId if you don't have that already.
        2. Use the hubspot-list-objects tool to sample existing objects for the object type.
        3. If hubspot-list-objects tool's response isn't helpful, use hubspot-list-properties tool.

      🧭 Usage Guidance:
        1. Use this tool when you need to create a new custom property for a HubSpot object type.
        2. Makes sure that the user is looking to create a new property, and not create an object of a specific object type.
        3. Use list-properties to get a list of all properties for a given object type to be sure that the property does not already exist.
        4. Use list-properties to to understand the data structure of object properties first.
    `,
    parameters: CreatePropertySchema,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createPropertyTool(args: z.infer<typeof CreatePropertySchema>) {
    try {
      const propertyData = {
        ...args,
        // Ensure name follows HubSpot naming convention (lowercase, no spaces)
        name: args.name.toLowerCase().replace(/\s+/g, '_'),
      };
      const { ...dataWithoutObjectType } = propertyData;
      const cleanPropertyData = Object.fromEntries(
        Object.entries(dataWithoutObjectType).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value !== undefined,
        ),
      );
      const response = await this.client.post(
        `/crm/v3/properties/${args.objectType}`,
        {
          body: cleanPropertyData,
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
            text: `Error creating HubSpot property for ${args.objectType}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
