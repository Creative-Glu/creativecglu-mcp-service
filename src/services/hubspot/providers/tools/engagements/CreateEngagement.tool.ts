/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { CreateEngagementSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class CreateEngagementTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-create-engagement',
    description: `
    🛡️ Guardrails:
      1. Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

    🎯 Purpose:
      1. Creates a HubSpot engagement (Note or Task) associated with contacts, companies, deals, or tickets.
      2. This endpoint is useful for keeping your CRM records up-to-date on any interactions that take place outside of HubSpot.
      3. Activity reporting in the CRM also feeds off of this data.

    📋 Prerequisites:
      1. Use the hubspot-get-user-details tool to get the OwnerId and UserId.

    🧭 Usage Guidance:
      1. Use NOTE type for adding notes to records
      2. Use TASK type for creating tasks with subject, status, and assignment
      3. Both require relevant associations to connect them to CRM records
      4. Other types of engagements (EMAIL, CALL, MEETING) are NOT supported yet.
      5. HubSpot notes and task descriptions support HTML formatting. However headings (<h1>, <h2>, etc.) look ugly in the CRM. So use them sparingly.
    `,
    parameters: CreateEngagementSchema,
  })
  async process(args: z.infer<typeof CreateEngagementSchema>) {
    try {
      const { type, ownerId, timestamp, associations, metadata } = args;
      const engagementTimestamp = timestamp || Date.now();
      const requestBody = {
        engagement: {
          active: true,
          ownerId,
          type,
          timestamp: engagementTimestamp,
        },
        associations,
        metadata,
      };
      const response = await this.client.post('/engagements/v1/engagements', {
        body: requestBody,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                engagement: response,
                message: `Successfully created ${type.toLowerCase()} engagement`,
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
            text: `Error creating HubSpot engagement: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
