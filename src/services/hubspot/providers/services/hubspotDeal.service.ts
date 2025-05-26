import { Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import c from 'common/constants';
import { HttpError, NotFoundException } from 'common/exceptions';
import { FilterType, ResponseType } from 'common/models';
import {
  HubspotDealCreateDto,
  HubspotDealSearchV2Dto,
  HubspotDealUpdateDto,
  HubspotDealUpdateV2Dto,
} from 'services/hubspot/dto';
import { removeEmpty } from 'utils';

import { HubspotClient } from '../clients';
import HubspotCompanyService from './hubspotCompany.service';
import HubspotContactService from './hubspotContact.service';
import HubspotStageService from './hubspotStage.service';

@Injectable()
export default class HubspotDealService {
  constructor(
    private readonly hubspotClient: HubspotClient,
    private readonly hubspotContactService: HubspotContactService,
    private readonly hubspotCompanyService: HubspotCompanyService,
    private readonly hubspotStageService: HubspotStageService,
  ) {
    this.hubspotClient = hubspotClient;
    this.hubspotContactService = hubspotContactService;
    this.hubspotCompanyService = hubspotCompanyService;
    this.hubspotStageService = hubspotStageService;
  }

  async getContactsByDealId(dealId: string): Promise<Record<string, any>[]> {
    const contacts = [];
    const _contacts =
      await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
        'Deals',
        'Contacts',
        {
          inputs: [
            {
              id: dealId,
              associationType: 'deal_to_contact',
            },
          ],
        },
      );

    if (_contacts.results[0]?.to.length > 0) {
      for (const _c of _contacts.results[0].to) {
        try {
          const { data } = await this.hubspotContactService.getContactById({
            contactId: _c.toObjectId,
          });

          contacts.push(data);
        } catch {}
      }
    }

    return contacts;
  }

  async getCompaniesByDealid(dealId: string): Promise<Record<string, any>[]> {
    const companies = [];
    const _companies =
      await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
        'Deals',
        'Companies',
        {
          inputs: [
            {
              id: dealId,
              associationType: 'deal_to_company',
            },
          ],
        },
      );

    if (_companies.results[0]?.to.length > 0) {
      for (const _c of _companies.results[0].to) {
        try {
          const { data } = await this.hubspotCompanyService.getCompanyById({
            companyId: _c.toObjectId,
          });

          companies.push(data);
        } catch {}
      }
    }

    return companies;
  }

  async getDeals(filter: FilterType): Promise<ResponseType> {
    try {
      const {
        name,
        amount,
        stageId,
        contactIds,
        companyIds,
        contactId,
        companyId,
        ...rest
      } = filter;

      const filters: Record<string, any>[] = [];

      if (name) {
        filters.push({
          propertyName: 'dealname',
          operator: 'CONTAINS_TOKEN',
          value: name,
        });
      }

      if (amount) {
        filters.push({
          propertyName: 'amount',
          operator: 'EQ',
          value: amount,
        });
      }

      if (stageId) {
        filters.push({
          propertyName: 'dealstage',
          operator: 'CONTAINS_TOKEN',
          value: stageId,
        });
      }

      const response =
        await this.hubspotClient.client.crm.deals.searchApi.doSearch({
          filterGroups: [{ filters }],
          limit: rest.perPage ?? c.PER_PAGE,
          properties: ['dealname', 'amount', 'dealstage', 'pipeline'],
        });

      const data = await Promise.all(
        response.results
          .map(async (deal: any) => ({
            dealId: deal.id,
            ...deal,
            contacts: await this.getContactsByDealId(deal.id),
            companies: await this.getCompaniesByDealid(deal.id),
          }))
          .filter((deal) => {
            if (contactId)
              return deal.contacts.some(
                (contact) => contact.contactId === contactId,
              );

            if (companyId)
              return deal.companies.some(
                (contact) => contact.companyId === companyId,
              );

            if (contactIds)
              return deal.contacts.some((contact) =>
                contactIds.includes(contact.id),
              );

            if (companyIds)
              return deal.companies.some((contact) =>
                contactIds.includes(contact.id),
              );

            return true;
          }),
      );
      return {
        data,
        meta: { total: data.length },
      };
    } catch (err) {
      throw new HttpError(err.message);
    }
  }

  async getDealById(payload: HubspotDealSearchV2Dto): Promise<ResponseType> {
    try {
      const deal = await this.hubspotClient.client.crm.deals.basicApi.getById(
        payload.dealId,
        ['dealname', 'amount', 'dealstage', 'pipeline', 'associatedcontactids'],
      );

      return {
        data: {
          dealId: deal.id,
          ...deal,
          contacts: await this.getContactsByDealId(deal.id),
          companies: await this.getCompaniesByDealid(deal.id),
        },
      };
    } catch (err) {
      if ([404, 400].includes(err.code))
        throw new NotFoundException({
          collection: 'deal',
          id: payload.dealId,
        });

      throw new HttpError(err.message);
    }
  }

  async createDeal({
    contactIds,
    companyIds,
    contactId,
    companyId,
    ...rest
  }: HubspotDealCreateDto): Promise<ResponseType> {
    if (!isEmpty(contactIds))
      for (const _contactId of contactIds)
        await this.hubspotContactService.getContactById({
          contactId: _contactId,
        });

    if (!isEmpty(contactId))
      await this.hubspotContactService.getContactById({
        contactId,
      });

    if (!isEmpty(companyIds))
      for (const _companyId of companyIds)
        await this.hubspotCompanyService.getCompanyById({
          companyId: _companyId,
        });

    (rest as Record<string, any>).dealname = rest.name;
    delete rest.name;

    (rest as Record<string, any>).dealstage =
      rest.stageId ?? 'appointmentscheduled';
    delete rest.stageId;

    (rest as Record<string, any>).pipeline = rest.pipelineId ?? 'default';
    delete rest.pipelineId;

    try {
      const deal = await this.hubspotClient.client.crm.deals.basicApi.create({
        properties: await removeEmpty({
          ...rest,
          amount: rest.amount ? rest.amount.toString() : '0',
        }),
      });

      if (!isEmpty(contactIds))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Contacts',
          {
            inputs: contactIds.map((_contactId) => ({
              _from: { id: deal.id },
              to: { id: _contactId },
            })),
          },
        );

      if (!isEmpty(contactId))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Contacts',
          {
            inputs: [
              {
                _from: { id: deal.id },
                to: { id: contactId },
              },
            ],
          },
        );

      if (!isEmpty(companyIds))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Companies',
          {
            inputs: companyIds.map((_companyId) => ({
              _from: { id: deal.id },
              to: { id: _companyId },
            })),
          },
        );

      if (!isEmpty(companyId))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Companies',
          {
            inputs: [
              {
                _from: { id: deal.id },
                to: { id: companyId },
              },
            ],
          },
        );

      return {
        data: {
          dealId: deal.id,
          ...deal,
          contacts: await this.getContactsByDealId(deal.id),
          companies: await this.getCompaniesByDealid(deal.id),
        },
      };
    } catch (err) {
      throw new HttpError(err.message);
    }
  }

  async updateDeal({
    dealId,
    contactIds,
    companyIds,
    contactId,
    companyId,
    ...rest
  }: HubspotDealUpdateDto): Promise<ResponseType> {
    await this.getDealById({ dealId });

    if (!isEmpty(contactIds))
      for (const _contactId of contactIds)
        await this.hubspotContactService.getContactById({
          contactId: _contactId,
        });

    if (!isEmpty(contactId))
      await this.hubspotContactService.getContactById({
        contactId,
      });

    if (!isEmpty(companyIds))
      for (const _companyId of companyIds)
        await this.hubspotCompanyService.getCompanyById({
          companyId: _companyId,
        });

    if (!isEmpty(companyId))
      await this.hubspotCompanyService.getCompanyById({
        companyId,
      });

    if (rest.name) {
      (rest as Record<string, any>).dealname = rest.name;
      delete rest.name;
    }

    if (rest.stageId) {
      await this.hubspotStageService.getStageById({ stageId: rest.stageId });

      (rest as Record<string, any>).dealstage = rest.stageId;
      delete rest.stageId;
    }

    if (rest.amount)
      (rest as Record<string, any>).oooooooooamount = rest.amount.toString();

    try {
      const deal = await this.hubspotClient.client.crm.deals.basicApi.update(
        dealId,
        {
          properties: await removeEmpty(rest),
        },
      );

      if (!isEmpty(contactIds))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Contacts',
          {
            inputs: contactIds.map((_contactId) => ({
              _from: { id: deal.id },
              to: { id: _contactId },
            })),
          },
        );

      if (!isEmpty(contactId))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Contacts',
          {
            inputs: [
              {
                _from: { id: deal.id },
                to: { id: contactId },
              },
            ],
          },
        );

      if (!isEmpty(companyIds))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Companies',
          {
            inputs: companyIds.map((_companyId) => ({
              _from: { id: deal.id },
              to: { id: _companyId },
            })),
          },
        );

      if (!isEmpty(companyId))
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Deals',
          'Companies',
          {
            inputs: [
              {
                _from: { id: deal.id },
                to: { id: companyId },
              },
            ],
          },
        );

      return {
        data: {
          ...deal,
          dealId: deal.id,
          contacts: await this.getContactsByDealId(deal.id),
          companies: await this.getCompaniesByDealid(deal.id),
        },
      };
    } catch (err) {
      throw new HttpError(err.message);
    }
  }

  async deleteDeal(dealId: string): Promise<void> {
    await this.getDealById({ dealId });

    try {
      await this.hubspotClient.client.crm.deals.basicApi.archive(dealId);
    } catch (err) {
      throw new HttpError(err.message);
    }
  }

  async changeDealStage({
    stageId,
    dealId,
  }: HubspotDealUpdateV2Dto): Promise<ResponseType> {
    try {
      return {
        data: await this.updateDeal({
          stageId,
          dealId,
        } as HubspotDealUpdateDto),
      };
    } catch (err) {
      throw new HttpError(err.message);
    }
  }
}
