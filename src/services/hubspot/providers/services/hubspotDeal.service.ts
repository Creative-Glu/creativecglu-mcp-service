import { Injectable } from '@nestjs/common';
import c from 'common/constants';
import { HttpError, NotFoundException } from 'common/exceptions';
import { FilterType, ResponseType } from 'common/models';
import {
  HubspotDealCreateDto,
  HubspotDealSearchV2Dto,
  HubspotDealUpdateDto,
} from 'services/hubspot/dto';
import { removeEmpty } from 'utils';

import { HubspotClient } from '../clients';
import HubspotContactService from './hubspotContact.service';

@Injectable()
export default class HubspotDealService {
  constructor(
    private readonly hubspotClient: HubspotClient,
    private readonly hubspotContactService: HubspotContactService,
  ) {
    this.hubspotClient = hubspotClient;
    this.hubspotContactService = hubspotContactService;
  }

  async getDeals(filter: FilterType): Promise<ResponseType> {
    try {
      const { name, amount, stage, ...rest } = filter;

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

      if (stage) {
        filters.push({
          propertyName: 'dealstage',
          operator: 'CONTAINS_TOKEN',
          value: stage,
        });
      }

      const response =
        await this.hubspotClient.client.crm.deals.searchApi.doSearch({
          filterGroups: [{ filters }],
          limit: rest.perPage ?? c.PER_PAGE,
          properties: ['dealname', 'amount', 'dealstage', 'pipeline'],
        });

      const data = await Promise.all(
        response.results.map(async (deal: any) => {
          const contacts = [];
          const _contacts =
            await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
              'Deals',
              'Contacts',
              {
                inputs: [
                  {
                    id: deal.id,
                    associationType: 'deal_to_contact',
                  },
                ],
              },
            );

          if (_contacts.results[0]?.to.length > 0) {
            for (const _c of _contacts.results[0].to) {
              try {
                const { data } =
                  await this.hubspotContactService.getContactById({
                    contactId: _c.toObjectId,
                  });

                contacts.push(data);
              } catch {}
            }
          }

          return {
            dealId: deal.id,
            ...deal,
            contacts,
          };
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

      const contacts = [];
      const _contacts =
        await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
          'Deals',
          'Contacts',
          {
            inputs: [
              {
                id: deal.id,
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

      return {
        data: {
          dealId: deal.id,
          ...deal,
          contacts,
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
    ...rest
  }: HubspotDealCreateDto): Promise<ResponseType> {
    for (const contactId of contactIds)
      await this.hubspotContactService.getContactById({
        contactId,
      });

    (rest as Record<string, any>).dealname = rest.name;
    delete rest.name;

    (rest as Record<string, any>).dealstage =
      rest.stage ?? 'appointmentscheduled';
    delete rest.stage;

    (rest as Record<string, any>).pipeline = rest.pipeline ?? 'default';
    delete rest.pipeline;
    try {
      const deal = await this.hubspotClient.client.crm.deals.basicApi.create({
        properties: await removeEmpty({
          ...rest,
          amount: rest.amount ? rest.amount.toString() : '0',
        }),
      });

      await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
        'Deals',
        'Contacts',
        {
          inputs: contactIds.map((contactId) => ({
            _from: { id: deal.id },
            to: { id: contactId },
          })),
        },
      );

      const contacts = [];
      const _contacts =
        await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
          'Deals',
          'Contacts',
          {
            inputs: [
              {
                id: deal.id,
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

      return {
        data: {
          dealId: deal.id,
          ...deal,
          contacts,
        },
      };
    } catch (err) {
      throw new HttpError(err.message);
    }
  }

  async updateDeal({
    dealId,
    contactIds,
    ...rest
  }: HubspotDealUpdateDto): Promise<ResponseType> {
    await this.getDealById({ dealId });

    for (const contactId of contactIds)
      await this.hubspotContactService.getContactById({
        contactId,
      });

    if (rest.name) {
      (rest as Record<string, any>).dealname = rest.name;
      delete rest.name;
    }

    if (rest.stage) {
      (rest as Record<string, any>).dealstage = rest.stage;
      delete rest.stage;
    }

    if (rest.amount)
      (rest as Record<string, any>).oooooooooamount = rest.amount.toString();

    if (contactIds)
      await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
        'Deals',
        'Contacts',
        {
          inputs: contactIds.map((contactId) => ({
            _from: { id: dealId },
            to: { id: contactId },
          })),
        },
      );

    try {
      const deal = await this.hubspotClient.client.crm.deals.basicApi.update(
        dealId,
        {
          properties: await removeEmpty(rest),
        },
      );

      return {
        data: {
          ...deal,
          dealId: deal.id,
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
}
