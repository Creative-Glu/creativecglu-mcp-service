/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { SchemaInfoSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class GetSchemaTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-get-schemas',
    description: `
    🎯 Purpose:
      1. Retrieves all custom object schemas defined in the HubSpot account.

    🧭 Usage Guidance:
      1. Before working with custom objects to understand available object types,
        their properties, and associations.

    📦 Returns:
      1. Provides the objectTypeId and objectType for each schema.
      2. These attributes should be used for this object type instead of "custom" in subsequent requests.
    `,
    parameters: SchemaInfoSchema,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(args: z.infer<typeof SchemaInfoSchema>) {
    try {
      const schemas = await this.client.get('/crm-object-schemas/v3/schemas');
      const simplifiedResults = schemas.results.map((schema) => ({
        objectTypeId: schema.objectTypeId,
        objectType: schema.fullyQualifiedName.split('_')[1],
        name: schema.name,
        labels: schema.labels,
      }));
      return {
        content: [
          {
            type: 'text',
            text: 'Custom object schemas found. Note: These attributes should be used instead of "custom" in subsequent requests:',
          },
          {
            type: 'text',
            text: JSON.stringify({ results: simplifiedResults }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving schemas: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
