/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { GetHubspotLinkSchema } from 'services/hubspot/dto';
import { HUBSPOT_ID_TO_OBJECT_TYPE } from 'services/hubspot/models';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class GetHubspotLinkTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-get-link',
    description: `
      🎯 Purpose:
        1. Generates HubSpot UI links for different pages based on object types and IDs.
        2. Supports both index pages (lists of objects) and record pages (specific object details).

      📋 Prerequisites:
        1. Use the hubspot-get-user-details tool to get the PortalId and UiDomain.

      🧭 Usage Guidance:
        1. Use to generate links to HubSpot UI pages when users need to reference specific HubSpot records.
        2. Validates that object type IDs exist in the HubSpot system.
    `,
    parameters: GetHubspotLinkSchema,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(args: z.infer<typeof GetHubspotLinkSchema>) {
    const { portalId, uiDomain, pageRequests } = args;
    const validationResult = this.validateRequests(pageRequests);
    if (validationResult.errors.length > 0) {
      return this.formatErrorResponse(validationResult);
    }
    const urlResults = this.generateUrls(portalId, uiDomain, pageRequests);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(urlResults, null, 2),
        },
      ],
    };
  }
  isValidObjectTypeId(objectTypeId) {
    if (Object.keys(HUBSPOT_ID_TO_OBJECT_TYPE).includes(objectTypeId)) {
      return true;
    }
    if (objectTypeId.startsWith('2-')) {
      return true;
    }
    return false;
  }
  validateRequests(pageRequests) {
    const errors = [];
    const invalidObjectTypeIds = [];
    for (const request of pageRequests) {
      const { pagetype, objectTypeId, objectId } = request;
      // Validate objectTypeId exists
      if (!this.isValidObjectTypeId(objectTypeId)) {
        invalidObjectTypeIds.push(objectTypeId);
        errors.push(`Invalid objectTypeId: ${objectTypeId}`);
        continue;
      }
      // For record pages, objectId is required
      if (pagetype === 'record' && !objectId) {
        errors.push(
          `objectId is required for record page with objectTypeId: ${objectTypeId}`,
        );
      }
    }
    return { errors, invalidObjectTypeIds };
  }
  formatErrorResponse(validationResult) {
    const errorResponse: Record<string, any> = {
      errors: validationResult.errors,
    };
    // Add valid object type IDs only once if there were invalid IDs
    if (validationResult.invalidObjectTypeIds.length > 0) {
      errorResponse.validObjectTypeIds = Object.keys(HUBSPOT_ID_TO_OBJECT_TYPE);
      errorResponse.validObjectTypeIds.push(
        '2-x (where x is your custom object ID)',
      );
    }
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(errorResponse, null, 2),
        },
      ],
      isError: true,
    };
  }
  generateUrls(portalId, uiDomain, pageRequests) {
    return pageRequests.map((request) => {
      const { pagetype, objectTypeId, objectId } = request;
      let url = '';
      if (pagetype === 'index') {
        url = `https://${uiDomain}/contacts/${portalId}/objects/${objectTypeId}`;
      } else {
        url = `https://${uiDomain}/contacts/${portalId}/record/${objectTypeId}/${objectId}`;
      }
      return {
        pagetype,
        objectTypeId,
        objectId,
        url,
      };
    });
  }
}
