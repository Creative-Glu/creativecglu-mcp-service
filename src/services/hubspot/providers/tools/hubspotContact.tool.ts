import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { HttpError } from 'common/exceptions';
import { ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';
import {
  HubspotContactCreateDto,
  HubspotContactCreateSchema,
} from 'services/hubspot/dto/contacts/HubspotContactCreate.dto';
import {
  HubspotContactDeleteDto,
  HubspotContactDeleteSchema,
} from 'services/hubspot/dto/contacts/hubspotContactDelete.dto';
import {
  HubspotContactSearchDto,
  HubspotContactSearchSchema,
  HubspotContactSearchV2Dto,
  HubspotContactSearchV2Schema,
} from 'services/hubspot/dto/contacts/HubspotContactSearch.dto';
import {
  HubspotContactUpdateDto,
  HubspotContactUpdateSchema,
} from 'services/hubspot/dto/contacts/HubspotContactUpdate.dto';
import { ContactNotFoundException } from 'services/hubspot/exceptions';

import { HubspotContactService } from '../services';

const PREFIX_TOOL = 'hubspot/contacts';

@Injectable()
export default class HubspotContactToolController {
  constructor(private readonly hubspotContactService: HubspotContactService) {
    this.hubspotContactService = hubspotContactService;
  }

  @Tool({
    name: `${PREFIX_TOOL}/get-contacts`,
    description:
      // eslint-disable-next-line max-len
      'Retrieve a list of HubSpot contacts. Optionally, search by `firstname`, `lastname`, `email`, or `phone` to filter results.',
    parameters: HubspotContactSearchSchema,
  })
  async getContacts({
    limit,
    ...payload
  }: HubspotContactSearchDto): Promise<ResponseType> {
    const { data, meta } = await this.hubspotContactService.getContacts({
      perPage: limit,
      ...payload,
    });

    if (meta.total === 0)
      return {
        content: [
          {
            type: CONTENT_TYPE.TEXT,
            text: '**No Contacts Found**',
          },
        ],
      };

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Total Contacts**: ${meta.total}
              \n\n **Contacts**: ${data
                .map(
                  (d) => `
                    \n - **${d.properties.firstname || null} ${d.properties.lastname || null}**
                    \n    - **contactId**: ${d.id || null}
                    \n    - **emailAddress**: ${d.properties.email || null}
                    \n    - **phoneNumber**: ${d.properties.phone || null}
                    \n    - **companyId**: ${d.company?.hs_object_id || null}
                  `,
                )
                .join('')}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/get-contact`,
    description: 'Retrieve a single HubSpot contact by providing `contactId`.',
    parameters: HubspotContactSearchV2Schema,
  })
  async getContact(payload: HubspotContactSearchV2Dto): Promise<ResponseType> {
    const parsedPayload = HubspotContactSearchV2Schema.safeParse(payload);

    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotContactService.getContactById(payload);
    if (!data) return await ContactNotFoundException(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Contact Found**:
              \n - **${data.properties?.firstname || null} ${data.properties?.lastname || null}**
              \n    - **contactId**: ${data.id || null}
              \n    - **emailAddress**: ${data.properties?.email || null}
              \n    - **phoneNumber**: ${data.properties?.phone || null}
              \n    - **companyId**: ${data.company?.hs_object_id || null}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/create-contact`,
    description:
      // eslint-disable-next-line max-len
      'Create a new HubSpot contact with the provided `firstname`, `lastname`, `email` and `phone`.',
    parameters: HubspotContactCreateSchema,
  })
  async createContact(payload: HubspotContactCreateDto): Promise<ResponseType> {
    const parsedPayload = HubspotContactCreateSchema.safeParse(payload);

    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotContactService.createContact(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Contact Created**:
              \n - **${data.properties?.firstname || null} ${data.properties?.lastname || null}**
              \n    - **contactId**: ${data.id || null}
              \n    - **emailAddress**: ${data.properties?.email || null}
              \n    - **phoneNumber**: ${data.properties?.phone || null}
              \n    - **companyId**: ${data.company?.hs_object_id || null}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/update-contact`,
    description:
      // eslint-disable-next-line max-len
      'Update an existing HubSpot contact with the provided `contactId`, `firstname`, `lastname`, `email`, and `phone`.',
    parameters: HubspotContactUpdateSchema,
  })
  async updateContact(payload: HubspotContactUpdateDto): Promise<ResponseType> {
    const parsedPayload = HubspotContactCreateSchema.safeParse(payload);
    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotContactService.updateContact(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Contact Updated**:
              \n - **${data.properties?.firstname || null} ${data.properties?.lastname || null}**
              \n    - **contactId**: ${data.id || null}
              \n    - **emailAddress**: ${data.properties?.email || null}
              \n    - **phoneNumber**: ${data.properties?.phone || null}
              \n    - **companyId**: ${data.company?.hs_object_id || null}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/delete-contact`,
    description:
      // eslint-disable-next-line max-len
      'Delete an existing HubSpot contact with the provided `contactId`.',
    parameters: HubspotContactDeleteSchema,
  })
  async deleteContactId(
    payload: HubspotContactDeleteDto,
  ): Promise<ResponseType> {
    const parsedPayload = HubspotContactDeleteSchema.safeParse(payload);
    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    await this.hubspotContactService.deleteContact(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Contact Deleted**
          `,
        },
      ],
    };
  }
}
