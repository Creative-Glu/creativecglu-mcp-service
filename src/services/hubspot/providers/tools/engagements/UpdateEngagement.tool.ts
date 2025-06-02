/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { UpdateEngagementSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class UpdateEngagementTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-update-engagement',
    description: `
      🛡️ Guardrails:
        1. Data Modification Warning: This tool modifies HubSpot data. Only use when the user has explicitly requested to update their CRM.

      🎯 Purpose:
        1. Updates an existing HubSpot engagement (Note or Task).
        2. Allows modification of engagement attributes, content, and metadata.

      📋 Prerequisites:
        1. You need the engagement ID to update an existing engagement.
        2. Use the hubspot-get-engagement tool to get the current engagement details if needed.
        3. Use the hubspot-get-user-details tool to get the owner ID.

      🧭 Usage Guidance:
        1. Use for updating NOTE content or TASK details (subject, description, status).
        2. Only include the fields you want to update - other fields will remain unchanged.
        3. HubSpot notes and task descriptions support HTML formatting. However headings (<h1>, <h2>, etc.) look ugly in the CRM. So use them sparingly.
    `,
    parameters: UpdateEngagementSchema,
  })
  async updateEngagement(args: z.infer<typeof UpdateEngagementSchema>) {
    try {
      const { engagementId, ownerId, timestamp, metadata, associations } = args;
      // Build request body with only provided fields
      const requestBody = {
        ...(ownerId || timestamp !== undefined
          ? {
              engagement: {
                ...(ownerId && { ownerId }),
                ...(timestamp !== undefined && { timestamp }),
              },
            }
          : {}),
        ...(Object.keys(metadata).length > 0 && { metadata }),
        ...(Object.keys(associations).length > 0 && { associations }),
      };
      const response = await this.client.patch(
        `/engagements/v1/engagements/${engagementId}`,
        {
          body: requestBody,
        },
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                engagement: response,
                message: `Successfully updated engagement ${engagementId}`,
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
            text: `Error updating HubSpot engagement: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
