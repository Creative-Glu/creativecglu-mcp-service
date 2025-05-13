import { Get } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import { HubspotContactSearchDto } from 'services/hubspot/dto/contacts/HubspotContactSearch.dto';
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
  async getContacts({
    limit,
    ...payload
  }: HubspotContactSearchDto): Promise<ResponseType> {
    return await this.hubspotContactService.getContacts({
      perPage: limit,
      ...payload,
    });
  }
}
