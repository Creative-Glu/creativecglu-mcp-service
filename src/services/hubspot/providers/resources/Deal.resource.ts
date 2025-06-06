import { Injectable } from '@nestjs/common';
import { Resource } from '@rekog/mcp-nest';

@Injectable()
export default class DealResource {
  @Resource({
    uri: 'mcp://hubspot-resource/deal-resource/{dealId}',
    name: 'deal-resource',
    mimeType: 'text/plain',
  })
  async process({ uri, dealId, deal }) {
    return {
      content: [
        {
          uri,
          text: JSON.stringify({
            dealId,
            ...deal,
          }),
          mimeType: 'text/plain',
        },
      ],
    };
  }
}
