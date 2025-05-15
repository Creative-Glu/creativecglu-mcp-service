import { Injectable } from '@nestjs/common';
import c from 'common/constants';
import { HttpError } from 'common/exceptions';
import { FilterType, ResponseType } from 'common/models';
import {
  HubspotDealCreateDto,
  HubspotDealSearchV2Dto,
  HubspotDealUpdateDto,
} from 'services/hubspot/dto';
import HubspotClient from 'services/hubspot/providers/clients/hubspot.client';
import { removeEmpty } from 'utils';

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
          operator: 'EQ',
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
          operator: 'EQ',
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
            ...deal,
            contacts,
          };
        }),
      );
      return {
        data,
        meta: { total: data.length },
      };
    } catch (error) {
      throw new HttpError(error);
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
          ...deal,
          contacts,
        },
      };
    } catch (err) {
      throw new HttpError(err);
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
          ...deal,
          contacts,
        },
      };
    } catch (error) {
      console.log(error);

      throw new HttpError(error);
    }
  }

  async updateDeal({
    dealId,
    ...rest
  }: HubspotDealUpdateDto): Promise<ResponseType> {
    await this.getDealById({ dealId });

    if (rest.name) {
      (rest as Record<string, any>).dealname = rest.name;
      delete rest.name;
    }

    if (rest.stage) {
      (rest as Record<string, any>).dealstage = rest.stage;
      delete rest.stage;
    }

    try {
      return {
        data: await this.hubspotClient.client.crm.deals.basicApi.update(
          dealId,
          {
            properties: await removeEmpty(rest),
          },
        ),
      };
    } catch (error) {
      throw new HttpError(error);
    }
  }

  async deleteDeal(dealId: string): Promise<void> {
    await this.getDealById({ dealId });

    try {
      await this.hubspotClient.client.crm.deals.basicApi.archive(dealId);
    } catch (error) {
      throw new HttpError(error);
    }
  }
}
