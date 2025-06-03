/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { ObjectAssociationSchema } from 'services/hubspot/dto';
import { z } from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class CreateAssociationTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-create-association',
    description: `
    🛡️ Guardrails:
      1.  Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

    🎯 Purpose:
      1. Establishes relationships between HubSpot objects, linking records across different object types, by creating an association between two objects.

    📋 Prerequisites:
      1. Use the hubspot-get-user-details tool to get the OwnerId and UserId if you don't have that already.
      2. Use the hubspot-get-association-definitions tool to identify valid association types before creating associations.
    `,
    parameters: ObjectAssociationSchema,
  })
  async process(args: z.infer<typeof ObjectAssociationSchema>) {
    try {
      const response = await this.client.put(
        // eslint-disable-next-line max-len
        `/crm/v4/objects/${args.fromObjectType}/${args.fromObjectId}/associations/${args.toObjectType}/${args.toObjectId}`,
        { body: args.associations },
      );
      return {
        fromObjectTypeId: response.fromObjectTypeId,
        fromObjectId: response.fromObjectId,
        toObjectTypeId: response.toObjectTypeId,
        toObjectId: response.toObjectId,
        labels: response.labels,
      };
    } catch (error) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Error creating HubSpot association: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
