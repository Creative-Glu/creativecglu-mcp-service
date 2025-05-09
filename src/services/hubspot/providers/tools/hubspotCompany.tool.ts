import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { HttpError } from 'common/exceptions';
import { ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';
import {
  HubspotCompanyCreateDto,
  HubspotCompanyCreateSchema,
} from 'services/hubspot/dto/companies/HubspotCompanyCreate.dto';
import {
  HubspotCompanyDeleteDto,
  HubspotCompanyDeleteSchema,
} from 'services/hubspot/dto/companies/HubspotCompanyDelete.dto';
import {
  HubspotCompanySearchDto,
  HubspotCompanySearchSchema,
  HubspotCompanySearchV2Dto,
  HubspotCompanySearchV2Schema,
} from 'services/hubspot/dto/companies/HubspotCompanySearch.dto';
import { CompanytNotFoundException } from 'services/hubspot/exceptions';

import { HubspotCompanyService } from '../services';

const PREFIX_TOOL = 'hubspot/companies';

@Injectable()
export default class HubspotCompanyToolController {
  constructor(private readonly hubspotCompanyService: HubspotCompanyService) {
    this.hubspotCompanyService = hubspotCompanyService;
  }

  @Tool({
    name: `${PREFIX_TOOL}/get-companies`,
    description:
      // eslint-disable-next-line max-len
      'Retrieve a list of HubSpot companies. Optionally, search by `name`, `domain`, or `phone` to filter results..',
    parameters: HubspotCompanySearchSchema,
  })
  async getCompanies({
    limit,
    ...payload
  }: HubspotCompanySearchDto): Promise<ResponseType> {
    const { data, meta } = await this.hubspotCompanyService.getCompanies({
      perPage: limit,
      ...payload,
    });

    if (meta.total === 0)
      return {
        content: [
          {
            type: CONTENT_TYPE.TEXT,
            text: '**No Companies Found**',
          },
        ],
      };

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Total Companies**: ${meta.total}
              \n\n **Companies**: ${data
                .map(
                  (d) => `
                    \n - **${d.properties.name ?? null}**
                    \n    - **companyId**: ${d.id ?? null}
                    \n    - **domain**: ${d.properties.domain ?? null}
                    \n    - **phone**: ${d.properties.phone ?? null}
                  `,
                )
                .join('')}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/get-company`,
    description: 'Retrieve a single HubSpot company by providing `companyId`.',
    parameters: HubspotCompanySearchV2Schema,
  })
  async getCompany(payload: HubspotCompanySearchV2Dto): Promise<ResponseType> {
    const parsedPayload = HubspotCompanySearchV2Schema.safeParse(payload);

    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotCompanyService.getCompanyById(payload);

    if (!data) return await CompanytNotFoundException(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Company Found**:
              \n - **${data.properties.name ?? null}**
              \n    - **companyId**: ${data.id ?? null}
              \n    - **domain**: ${data.properties.domain ?? null}
              \n    - **phone**: ${data.properties.phone ?? null}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/create-company`,
    description:
      // eslint-disable-next-line max-len
      'Create a new HubSpot contact with the provided `name`, `domain`, and `phone`.',
    parameters: HubspotCompanyCreateSchema,
  })
  async createCompany(payload: HubspotCompanyCreateDto): Promise<ResponseType> {
    const parsedPayload = HubspotCompanyCreateSchema.safeParse(payload);

    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotCompanyService.createCompany(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Company Created**:
              \n - **${data.properties.name ?? null}**
              \n    - **companyId**: ${data.id ?? null}
              \n    - **domain**: ${data.properties.domain ?? null}
              \n    - **phone**: ${data.properties.phone ?? null}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/update-company`,
    description:
      // eslint-disable-next-line max-len
      'Update an existing HubSpot company with the provided `companyId`, `name`, `domain`, and `phone`.',
    parameters: HubspotCompanyCreateSchema,
  })
  async updateCompany(payload: HubspotCompanyCreateDto): Promise<ResponseType> {
    const parsedPayload = HubspotCompanyCreateSchema.safeParse(payload);
    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data } = await this.hubspotCompanyService.updateCompany(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Company Updated**:
              \n - **${data.properties.name ?? null}**
              \n    - **companyId**: ${data.id ?? null}
              \n    - **domain**: ${data.properties.domain ?? null}
              \n    - **phone**: ${data.properties.phone ?? null}
          `,
        },
      ],
    };
  }
  @Tool({
    name: `${PREFIX_TOOL}/delete-company`,
    description:
      // eslint-disable-next-line max-len
      'Delete an existing HubSpot company with the provided `companyId`.',
    parameters: HubspotCompanyDeleteSchema,
  })
  async deleteCompanyId(
    payload: HubspotCompanyDeleteDto,
  ): Promise<ResponseType> {
    const parsedPayload = HubspotCompanyDeleteSchema.safeParse(payload);
    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    await this.hubspotCompanyService.deleteCompany(payload);

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Company Deleted**
          `,
        },
      ],
    };
  }
}
