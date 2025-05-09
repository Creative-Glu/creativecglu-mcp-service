/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { HttpError } from 'common/exceptions';
import { ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';
import {
  HubspotDealCreateDto,
  HubspotDealCreateSchema,
} from 'services/hubspot/dto/deals/HubspotDealCreate.dto';
import {
  HubspotDealDeleteDto,
  HubspotDealDeleteSchema,
} from 'services/hubspot/dto/deals/HubspotDealDelete.dto';
import {
  HubspotDealSearchDto,
  HubspotDealSearchSchema,
  HubspotDealSearchV2Dto,
  HubspotDealSearchV2Schema,
} from 'services/hubspot/dto/deals/HubspotDealSearch.dto';
import { DealNotFoundException } from 'services/hubspot/exceptions';

import { HubspotDealService } from '../services';

const PREFIX_TOOL = 'hubspot/deals';

@Injectable()
export default class HubspotDealToolController {
  constructor(private readonly hubspotDealService: HubspotDealService) {
    this.hubspotDealService = hubspotDealService;
  }

  @Tool({
    name: `${PREFIX_TOOL}/get-deals`,
    description:
      // eslint-disable-next-line max-len
      'Retrieve a list of HubSpot deals. Optionally, search by `name`, `amount`, or `stage` to filter results..',
    parameters: HubspotDealSearchSchema,
  })
  async getDeals({
    limit,
    ...payload
  }: HubspotDealSearchDto): Promise<ResponseType> {
    const { data, meta } = await this.hubspotDealService.getDeals({
      perPage: limit,
      ...payload,
    });

    if (meta.total === 0)
      return {
        content: [
          {
            type: CONTENT_TYPE.TEXT,
            text: '**No Deals Found**',
          },
        ],
      };

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Total Deals**: ${meta.total}
              \n\n **Deals**: ${data
                .map(
                  (d) => `
                    \n - **${d.properties.dealname || null}**
                    \n    - **dealId**: ${d.id || null}
                    \n    - **amount**: ${d.properties.amount || null}
                    \n    - **stage**: ${d.properties.dealstage || null}
                    \n    - **pipeline**: ${d.properties.pipeline || null}
                    \n    - **contacts**: ${
                      d.contacts.map(
                        (c) => `
                    \n        - **${c.properties.firstname || null} ${c.properties.lastname || null}**
                    \n        - **contactId**: ${c.id || null}
                    \n        - **emailAddress**: ${c.properties.email || null}
                    \n        - **phoneNumber**: ${c.properties.phone || null}
                    `,
                      ) || null
                    }
                  `,
                )
                .join('')}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/get-deal`,
    description: 'Retrieve a single HubSpot deak by providing `dealid`.',
    parameters: HubspotDealSearchV2Schema,
  })
  async getDeal(payload: HubspotDealSearchV2Dto): Promise<ResponseType> {
    const parsedPayload = HubspotDealSearchV2Schema.safeParse(payload);

    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotDealService.getDealById(payload);

    if (!data) return await DealNotFoundException(payload);

    console.log(data);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Deal Found**:
              \n - **${data.properties.dealname || null}**
              \n    - **dealId**: ${data.id || null}
              \n    - **amount**: ${data.properties.amount || null}
              \n    - **stage**: ${data.properties.stage || null}
              \n    - **contacts**: ${
                data.contacts.map(
                  (c) => `
              \n        - **${c.properties.firstname || null} ${c.properties.lastname || null}**
              \n        - **contactId**: ${c.id || null}
              \n        - **emailAddress**: ${c.properties.email || null}
              \n        - **phoneNumber**: ${c.properties.phone || null}
                    `,
                ) || null
              }
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/create-deal`,
    description:
      'Create a new HubSpot deal with the provided `name`, `amount`, and `stage`.',
    parameters: HubspotDealCreateSchema,
  })
  async createDeal(payload: HubspotDealCreateDto): Promise<ResponseType> {
    const parsedPayload = HubspotDealCreateSchema.safeParse(payload);

    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotDealService.createDeal(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Deal Created**:
            \n - **${data.properties.dealname || null}**
            \n    - **dealId**: ${data.id || null}
            \n    - **amount**: ${data.properties.amount || null}
            \n    - **stage**: ${data.properties.dealstage || null}
            \n    - **pipeline**: ${data.properties.pipeline || null}
            \n    - **contacts**: ${
              data.contacts.map(
                (c) => `
            \n        - **${c.properties.firstname || null} ${c.properties.lastname || null}**
            \n        - **contactId**: ${c.id || null}
            \n        - **emailAddress**: ${c.properties.email || null}
            \n        - **phoneNumber**: ${c.properties.phone || null}
                  `,
              ) || null
            }
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/update-deal`,
    description:
      'Update an existing HubSpot deal with the provided `dealId`, `name`, `amount`, and `stage`.',
    parameters: HubspotDealCreateSchema,
  })
  async updateDeal(payload: HubspotDealCreateDto): Promise<ResponseType> {
    const parsedPayload = HubspotDealCreateSchema.safeParse(payload);
    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotDealService.updateDeal(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Deal Updated**:
            \n - **${data.properties.dealname || null}**
            \n    - **dealId**: ${data.id || null}
            \n    - **amount**: ${data.properties.amount || null}
            \n    - **stage**: ${data.properties.dealstage || null}
            \n    - **pipeline**: ${data.properties.pipeline || null}
            \n    - **contacts**: ${
              data.contacts.map(
                (c) => `
            \n        - **${c.properties.firstname || null} ${c.properties.lastname || null}**
            \n        - **contactId**: ${c.id || null}
            \n        - **emailAddress**: ${c.properties.email || null}
            \n        - **phoneNumber**: ${c.properties.phone || null}
                  `,
              ) || null
            }
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/delete-deal`,
    description: 'Delete an existing HubSpot deal with the provided `dealId`.',
    parameters: HubspotDealDeleteSchema,
  })
  async deleteDealId(payload: HubspotDealDeleteDto): Promise<ResponseType> {
    const parsedPayload = HubspotDealDeleteSchema.safeParse(payload);
    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    await this.hubspotDealService.deleteDeal(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Deal Deleted**
          `,
        },
      ],
    };
  }
}
