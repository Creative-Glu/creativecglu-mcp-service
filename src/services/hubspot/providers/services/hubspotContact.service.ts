import { Injectable } from '@nestjs/common';
import c from 'common/constants';
import { HttpError } from 'common/exceptions';
import { FilterType, ResponseType } from 'common/models';
import { HubspotContactSearchV2Dto } from 'services/hubspot/dto';
import HubspotClient from 'services/hubspot/providers/clients/hubspot.client';

@Injectable()
export default class HubspotContactService {
  constructor(private readonly hubspotClient: HubspotClient) {
    this.hubspotClient = hubspotClient;
  }

  async getContacts(filter: FilterType): Promise<ResponseType> {
    try {
      const { firstname, lastname, email, phone, ...rest } = filter;

      const filters: Record<string, any>[] = [];

      if (firstname) {
        filters.push({
          propertyName: 'firstname',
          operator: 'EQ',
          value: firstname,
        });
      }

      if (lastname) {
        filters.push({
          propertyName: 'lastname',
          operator: 'EQ',
          value: lastname,
        });
      }

      if (email) {
        filters.push({
          propertyName: 'email',
          operator: 'EQ',
          value: email,
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
        await this.hubspotClient.client.crm.contacts.searchApi.doSearch({
          filterGroups: [
            {
              filters,
            },
          ],
          limit: rest.perPage ?? c.PER_PAGE,
          properties: [
            'firstname',
            'lastname',
            'email',
            'phone',
            'associatedcompanyid',
          ],
        });

      const data = await Promise.all(
        response.results.map(async (contact: any) => {
          if (contact.properties.associatedcompanyid) {
            const company =
              await this.hubspotClient.client.crm.companies.basicApi.getById(
                contact.properties.associatedcompanyid,
                ['name', 'domain', 'phone'],
              );
            return { ...contact, company: company.properties };
          }
          return contact;
        }),
      );

      return { data, meta: { total: data.length } };
    } catch (error) {
      throw new HttpError(error);
    }
  }

  async getContactById(
    payload: HubspotContactSearchV2Dto,
  ): Promise<ResponseType> {
    try {
      const contact =
        await this.hubspotClient.client.crm.contacts.basicApi.getById(
          payload.contactId,
          ['firstname', 'lastname', 'email', 'phone', 'associatedcompanyid'],
        );

      if (contact.properties?.associatedcompanyid) {
        const company =
          await this.hubspotClient.client.crm.companies.basicApi.getById(
            contact.properties.associatedcompanyid,
            ['name', 'domain', 'phone'],
          );
        return { data: { ...contact, company: company.properties } };
      }

      return { data: contact };
    } catch {
      return { data: null };
    }
  }

  // async createContact(
  //   properties: HubspotContactCreateDto,
  // ): Promise<ResponseType> {
  //   try {
  //     if (!properties.phone) delete properties.phone;

  //     const data = await this.hubspotClient.client.crm.contacts.basicApi.create(
  //       {
  //         properties,
  //       },
  //     );

  //     if (properties.companyId)
  //       await this.hubspotClient.client.crm.contacts.associationsApi.create(
  //         data.id,
  //         'company',
  //         properties.companyId,
  //         'contact_to_company',
  //       );

  //     return { data: data };
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }

  // async updateContact(
  //   properties: HubspotContactUpdateDto,
  // ): Promise<ResponseType> {
  //   try {
  //     if (!properties.phone) delete properties.phone;

  //     return {
  //       data: await this.hubspotClient.client.crm.contacts.basicApi.update(
  //         properties.contactId,
  //         {
  //           properties,
  //         },
  //       ),
  //     };
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }

  // async deleteContact(paylaod: HubspotContactDeleteDto): Promise<void> {
  //   try {
  //     await this.hubspotClient.client.crm.contacts.basicApi.archive(
  //       paylaod.contactId,
  //     );
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }
}
