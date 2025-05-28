import { Injectable } from '@nestjs/common';
import c from 'common/constants';
import {
  NotFoundException,
  UnprocessableEntryException,
} from 'common/exceptions';
import { FilterType, ResponseType } from 'common/models';
import {
  HubspotCompanyCreateDto,
  HubspotCompanyUpdateDto,
} from 'services/hubspot/dto';
import { HubspotCompanySearchV2Dto } from 'services/hubspot/dto/companies/HubspotCompanySearch.dto';
import { removeEmpty } from 'utils';

import { HubspotClient } from '../clients';

@Injectable()
export default class HubspotCompanyService {
  constructor(private readonly hubspotClient: HubspotClient) {
    this.hubspotClient = hubspotClient;
  }

  async getCompanies(filter: FilterType): Promise<ResponseType> {
    try {
      const { name, domain, phone, ...rest } = filter;

      const filters: Record<string, any>[] = [];

      if (name) {
        filters.push({
          propertyName: 'name',
          operator: 'CONTAINS_TOKEN',
          value: name,
        });
      }

      if (domain) {
        filters.push({
          propertyName: 'domain',
          operator: 'EQ',
          value: domain,
        });
      }

      if (phone) {
        filters.push({
          propertyName: 'phone',
          operator: 'EQ',
          value: phone,
        });
      }

      const response =
        await this.hubspotClient.client.crm.companies.searchApi.doSearch({
          filterGroups: [
            {
              filters,
            },
          ],
          limit: rest.perPage ?? c.PER_PAGE,
          properties: ['name', 'domain', 'phone'],
        });

      const data = await Promise.all(
        response.results.map(async (company) => ({
          companyId: company.id,
          ...company,
        })),
      );

      return { data, meta: { total: data.length } };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async getCompanyById(
    payload: HubspotCompanySearchV2Dto,
  ): Promise<ResponseType> {
    try {
      const company =
        await this.hubspotClient.client.crm.companies.basicApi.getById(
          payload.companyId,
          ['name', 'domain', 'phone'],
        );

      return {
        data: {
          companyId: company.id,
          ...company,
        },
      };
    } catch (err) {
      if ([404, 400].includes(err.code))
        throw new NotFoundException({
          collection: 'company',
          id: payload.companyId,
        });

      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async createCompany(
    properties: HubspotCompanyCreateDto,
  ): Promise<ResponseType> {
    try {
      const company =
        await this.hubspotClient.client.crm.companies.basicApi.create({
          properties: await removeEmpty(properties),
        });

      return {
        data: {
          companyId: company.id,
          ...company,
        },
      };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async updateCompany({
    companyId,
    ...rest
  }: HubspotCompanyUpdateDto): Promise<ResponseType> {
    await this.getCompanyById({ companyId });

    try {
      if (!rest.phone) delete rest.phone;

      const company =
        await this.hubspotClient.client.crm.companies.basicApi.update(
          companyId,
          {
            properties: await removeEmpty(rest),
          },
        );

      return {
        data: {
          companyId: company.id,
          ...company,
        },
      };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async deleteCompany(companyId: string): Promise<void> {
    await this.getCompanyById({ companyId });

    try {
      await this.hubspotClient.client.crm.companies.basicApi.archive(companyId);
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }
}
