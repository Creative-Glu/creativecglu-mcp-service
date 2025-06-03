import { Injectable } from '@nestjs/common';
import { Resource } from '@rekog/mcp-nest';

@Injectable()
export default class HubspotResource {
  @Resource({
    uri: 'mcp://hubspot-resource/{key}',
    name: 'hubspot-resource',
    mimeType: 'text/plain',
  })
  async process({ uri, key, payload }) {
    return {
      content: [
        {
          uri,
          text: JSON.stringify({
            key,
            payload,
          }),
          mimeType: 'text/plain',
        },
      ],
    };
  }
}
