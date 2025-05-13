import { Get, Param, Query } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import {
  HubspotContactSearchDto,
  HubspotContactSearchV2Dto,
} from 'services/hubspot/dto';
import { HubspotContactService } from 'services/hubspot/providers/services';

import { VersionControllers } from './hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'contacts',
})
export default class HubspotContactController {
  constructor(private readonly hubspotContactService: HubspotContactService) {
    this.hubspotContactService = hubspotContactService;
  }

  @Get()
  async getContacts(
    @Query() { limit, ...filter }: HubspotContactSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.getContacts({
      perPage: limit,
      ...filter,
    });
  }

  @Get(':contactId')
  async getContact(
    @Param() payload: HubspotContactSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.getContactById(payload);
  }
}
