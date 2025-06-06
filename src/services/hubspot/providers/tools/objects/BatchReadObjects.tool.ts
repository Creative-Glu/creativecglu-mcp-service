/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { BatchReadObjectsSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class BatchCreateObjectsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-batch-read-objects',
    description: `
      🎯 Purpose:
        1. Retrieves multiple HubSpot objects of the same object type by their IDs in a single batch operation.

      🧭 Usage Guidance:
        1. Use this tool to retrieve objects when the object IDs are known.
    `,
    parameters: BatchReadObjectsSchema,
  })
  async process(args: z.infer<typeof BatchReadObjectsSchema>) {
    try {
      const requestBody: Record<string, any> = {
        inputs: args.inputs,
      };
      if (args.properties && args.properties.length > 0) {
        requestBody.properties = args.properties;
      }
      if (args.propertiesWithHistory && args.propertiesWithHistory.length > 0) {
        requestBody.propertiesWithHistory = args.propertiesWithHistory;
      }
      const response = await this.client.post(
        `/crm/v3/objects/${args.objectType}/batch/read`,
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
                status: response.status,
                results: response.results.map((result) => {
                  const formattedResult: Record<string, any> = {
                    id: result.id,
                    properties: result.properties,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                  };
                  if (result.propertiesWithHistory) {
                    formattedResult.propertiesWithHistory =
                      result.propertiesWithHistory;
                  }
                  if (result.archived !== undefined) {
                    formattedResult.archived = result.archived;
                  }
                  if (result.archivedAt) {
                    formattedResult.archivedAt = result.archivedAt;
                  }
                  if (result.objectWriteTraceId) {
                    formattedResult.objectWriteTraceId =
                      result.objectWriteTraceId;
                  }
                  return formattedResult;
                }),
                requestedAt: response.requestedAt,
                startedAt: response.startedAt,
                completedAt: response.completedAt,
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
            text: `Error batch reading HubSpot objects: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
