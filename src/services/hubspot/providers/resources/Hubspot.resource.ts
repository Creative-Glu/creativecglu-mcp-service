import { Injectable } from '@nestjs/common';
import { Resource } from '@rekog/mcp-nest';

@Injectable()
export default class HubspotResource {
  @Resource({
    uri: 'mcp://hubspot-resource/{resource}',
    name: 'hubspot-resource',
    mimeType: 'text/plain',
  })
  async process({ uri, resource, payload }) {
    return {
      content: [
        {
          uri,
          text: JSON.stringify({
            resource,
            payload,
          }),
          mimeType: 'text/plain',
        },
      ],
    };
  }
}
