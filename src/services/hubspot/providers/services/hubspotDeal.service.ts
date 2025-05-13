import { Injectable } from '@nestjs/common';
import HubspotClient from 'services/hubspot/providers/clients/hubspot.client';

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

  // async getDeals(filter: FilterType): Promise<ResponseType> {
  //   try {
  //     const { dealname, amount, stage, ...rest } = filter;

  //     const filters: Record<string, any>[] = [];

  //     if (dealname) {
  //       filters.push({
  //         propertyName: 'dealname',
  //         operator: 'EQ',
  //         value: dealname,
  //       });
  //     }

  //     if (amount) {
  //       filters.push({
  //         propertyName: 'amount',
  //         operator: 'EQ',
  //         value: amount,
  //       });
  //     }

  //     if (stage) {
  //       filters.push({
  //         propertyName: 'dealstage',
  //         operator: 'EQ',
  //         value: stage,
  //       });
  //     }

  //     const response =
  //       await this.hubspotClient.client.crm.deals.searchApi.doSearch({
  //         filterGroups: [{ filters }],
  //         limit: rest.perPage ?? c.PER_PAGE,
  //         properties: ['dealname', 'amount', 'dealstage', 'pipeline'],
  //       });

  //     const data = await Promise.all(
  //       response.results.map(async (deal: any) => {
  //         const contacts = [];
  //         const _contacts =
  //           await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
  //             'Deals',
  //             'Contacts',
  //             {
  //               inputs: [
  //                 {
  //                   id: deal.id,
  //                   associationType: 'deal_to_contact',
  //                 },
  //               ],
  //             },
  //           );

  //         if (_contacts.results[0].to.length > 0) {
  //           for (const _c of _contacts.results[0].to) {
  //             try {
  //               const { data } =
  //                 await this.hubspotContactService.getContactById({
  //                   contactId: _c.toObjectId,
  //                 });

  //               contacts.push(data);
  //             } catch {}
  //           }
  //         }

  //         return {
  //           ...deal,
  //           contacts,
  //         };
  //       }),
  //     );
  //     return {
  //       data,
  //       meta: { total: data.length },
  //     };
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }

  // async getDealById(payload: HubspotDealSearchV2Dto): Promise<ResponseType> {
  //   try {
  //     const deal = await this.hubspotClient.client.crm.deals.basicApi.getById(
  //       payload.dealId,
  //       ['dealname', 'amount', 'dealstage', 'pipeline', 'associatedcontactids'],
  //     );

  //     const contacts = [];
  //     const _contacts =
  //       await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
  //         'Deals',
  //         'Contacts',
  //         {
  //           inputs: [
  //             {
  //               id: deal.id,
  //               associationType: 'deal_to_contact',
  //             },
  //           ],
  //         },
  //       );

  //     if (_contacts.results[0].to.length > 0) {
  //       for (const _c of _contacts.results[0].to) {
  //         try {
  //           const { data } = await this.hubspotContactService.getContactById({
  //             contactId: _c.toObjectId,
  //           });

  //           contacts.push(data);
  //         } catch {}
  //       }
  //     }

  //     return {
  //       data: {
  //         ...deal,
  //         contacts,
  //       },
  //     };
  //   } catch {
  //     return { data: null };
  //   }
  // }

  // async createDeal({
  //   contactId,
  //   ...properties
  // }: HubspotDealCreateDto): Promise<ResponseType> {
  //   try {
  //     const deal = await this.hubspotClient.client.crm.deals.basicApi.create({
  //       properties: {
  //         ...properties,
  //         pipeline: 'default',
  //         dealstage: 'appointmentscheduled',
  //         amount: properties.amount ? properties.amount.toString() : '0',
  //       },
  //     });

  //     if (contactId)
  //       await this.hubspotClient.put({
  //         url: `/crm/v3/objects/deals/${deal.id}/associations/contacts/${contactId}/3`,
  //       });

  //     const contacts = [];
  //     const _contacts =
  //       await this.hubspotClient.client.crm.associations.v4.batchApi.getPage(
  //         'Deals',
  //         'Contacts',
  //         {
  //           inputs: [
  //             {
  //               id: deal.id,
  //               associationType: 'deal_to_contact',
  //             },
  //           ],
  //         },
  //       );

  //     if (_contacts.results[0].to.length > 0) {
  //       for (const _c of _contacts.results[0].to) {
  //         try {
  //           const { data } = await this.hubspotContactService.getContactById({
  //             contactId: _c.toObjectId,
  //           });

  //           contacts.push(data);
  //         } catch {}
  //       }
  //     }

  //     return {
  //       data: {
  //         ...deal,
  //         contacts,
  //       },
  //     };
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }

  // async updateDeal(properties: HubspotDealUpdateDto): Promise<ResponseType> {
  //   try {
  //     return {
  //       data: await this.hubspotClient.client.crm.deals.basicApi.update(
  //         properties.dealId,
  //         {
  //           properties,
  //         },
  //       ),
  //     };
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }

  // async deleteDeal(payload: HubspotDealDeleteDto): Promise<void> {
  //   try {
  //     await this.hubspotClient.client.crm.deals.basicApi.archive(
  //       payload.dealId,
  //     );
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }
}
