/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { TokenInfoSchema } from 'services/hubspot/dto';
import z from 'zod';

import { HubspotClientV2 } from '../../clients';

@Injectable()
export default class UserCredentialsTool {
  constructor(private readonly client: HubspotClientV2) {
    this.client = new HubspotClientV2();
  }

  @Tool({
    name: 'hubspot-get-user-details',
    description: `
      🎯 Purpose
        1. Authenticates and analyzes the current HubSpot access token, providing context about the user's permissions and account details.

      🧭 Usage Guidance:
        1. This tool must be used before performing any operations with Hubspot tools to determine the identity of the user, and permissions they have on their Hubspot account.

      📦 Returns:
        1. User ID, Hub ID, App ID, token type, a comprehensive list of authorized API scopes, and detailed owner information, and account information.
        2. The uiDomain and hubId can be used to construct URLs to the HubSpot UI for the user.
        3. If the user is an owner, the ownerId will help identify objects that are owned by the user.
    `,
    parameters: TokenInfoSchema,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(args: z.infer<typeof TokenInfoSchema>) {
    const accessToken =
      process.env.PRIVATE_APP_ACCESS_TOKEN || process.env.HUBSPOT_ACCESS_TOKEN;
    if (!accessToken) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: PRIVATE_APP_ACCESS_TOKEN not found in environment variables',
          },
        ],
        isError: true,
      };
    }
    try {
      const [tokenInfo, accountInfo] = await Promise.all([
        this.client.post('/oauth/v2/private-apps/get/access-token-info', {
          body: { tokenKey: accessToken },
        }),
        this.client.get('/account-info/v3/details').catch(() => null),
      ]);
      const ownerInfo = await this.client
        .get(
          `/crm/v3/owners/${tokenInfo.userId}?idProperty=userId&archived=false`,
        )
        .catch(() => null);
      return {
        content: [
          {
            type: 'text',
            text: '- Token Info: ' + JSON.stringify(tokenInfo, null, 2),
          },
          {
            type: 'text',
            text: '- OwnerInfo: ' + JSON.stringify(ownerInfo, null, 2),
          },
          {
            type: 'text',
            text: '- AccountInfo: ' + JSON.stringify(accountInfo, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving token, owner, and account information. ${error instanceof Error ? error.message : String(error)}
            `,
          },
        ],
        isError: true,
      };
    }
  }
}
