import { Injectable } from '@nestjs/common';
import c from 'common/constants';
import {
  NotFoundException,
  UnprocessableEntryException,
} from 'common/exceptions';
import { FilterType, ResponseType } from 'common/models';
import {
  HubspotContactCreateDto,
  HubspotContactSearchV2Dto,
  HubspotContactUpdateDto,
} from 'services/hubspot/dto';
import { removeEmpty } from 'utils';

import { HubspotClient } from '../clients';
import HubspotCompanyService from './hubspotCompany.service';

@Injectable()
export default class HubspotContactService {
  constructor(
    private readonly hubspotClient: HubspotClient,
    private readonly hubspotCompanyService: HubspotCompanyService,
  ) {
    this.hubspotClient = hubspotClient;
    this.hubspotCompanyService = hubspotCompanyService;
  }

  async getCompanyByContactId(
    contact: Record<string, any>,
  ): Promise<Record<string, any>[]> {
    let company = null;

    if (contact.properties.associatedcompanyid) {
      company = await this.hubspotClient.client.crm.companies.basicApi.getById(
        contact.properties.associatedcompanyid,
        ['name', 'domain', 'phone'],
      );

      company = {
        companyId: company.id,
        ...company.properties,
      };
    }

    return company;
  }

  async getContacts(filter: FilterType): Promise<ResponseType> {
    try {
      const { firstname, lastname, email, phone, ...rest } = filter;

      const filters: Record<string, any>[] = [];

      if (firstname)
        filters.push({
          propertyName: 'firstname',
          operator: 'CONTAINS_TOKEN',
          value: firstname,
        });

      if (lastname)
        filters.push({
          propertyName: 'lastname',
          operator: 'CONTAINS_TOKEN',
          value: lastname,
        });

      if (email)
        filters.push({
          propertyName: 'email',
          operator: 'EQ',
          value: email,
        });

      if (phone)
        filters.push({
          propertyName: 'phone',
          operator: 'EQ',
          value: phone,
        });

      console.log(rest.perPage, rest.perPage ?? c.PER_PAGE);

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
        response.results.map(async (contact: any) => ({
          contactId: contact.id,
          ...contact,
          company: await this.getCompanyByContactId(contact),
        })),
      );

      return { data, meta: { total: data.length } };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
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

      if (!contact) {
        throw new UnprocessableEntryException(
          `Contact with ID ${payload.contactId} does not exist`,
        );
      }

      return {
        data: {
          contactId: contact.id,
          ...contact,
          company: await this.getCompanyByContactId(contact),
        },
      };
    } catch (err) {
      if ([404, 400].includes(err.code))
        throw new NotFoundException({
          collection: 'contact',
          id: payload.contactId,
        });

      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async createContact({
    companyId,
    ...rest
  }: HubspotContactCreateDto): Promise<ResponseType> {
    try {
      if (!rest.phone) delete rest.phone;

      if (companyId) {
        await this.hubspotCompanyService.getCompanyById({
          companyId,
        });
      }

      const contact =
        await this.hubspotClient.client.crm.contacts.basicApi.create({
          properties: await removeEmpty(rest),
        });

      if (companyId)
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Contacts',
          'Companies',
          {
            inputs: [
              {
                _from: { id: contact.id },
                to: { id: companyId },
              },
            ],
          },
        );

      return {
        data: {
          contactId: contact.id,
          ...contact,
          company: await this.getCompanyByContactId(contact),
        },
      };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async updateContact({
    contactId,
    companyId,
    ...rest
  }: HubspotContactUpdateDto): Promise<ResponseType> {
    await this.getContactById({ contactId });

    if (companyId)
      await this.hubspotCompanyService.getCompanyById({
        companyId: companyId,
      });

    try {
      if (companyId)
        await this.hubspotClient.client.crm.associations.v4.batchApi.createDefault(
          'Contacts',
          'Companies',
          {
            inputs: [
              {
                _from: { id: contactId },
                to: { id: companyId },
              },
            ],
          },
        );

      const contact =
        await this.hubspotClient.client.crm.contacts.basicApi.update(
          contactId,
          {
            properties: await removeEmpty(rest),
          },
        );

      return {
        data: {
          contactId: contact.id,
          ...contact,
          company: await this.getCompanyByContactId(contact),
        },
      };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async deleteContact(contactId: string): Promise<void> {
    await this.getContactById({ contactId });

    try {
      await this.hubspotClient.client.crm.contacts.basicApi.archive(contactId);
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }
}
