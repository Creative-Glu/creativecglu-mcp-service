import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import {
  HubspotContactCreateDto,
  HubspotContactSearchDto,
  HubspotContactSearchV2Dto,
  HubspotContactUpdateDto,
} from 'services/hubspot/dto';
import { HubspotContactService } from 'services/hubspot/providers/services';
import { removeEmpty } from 'utils';

import { VersionControllers } from './hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'contacts',
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export default class HubspotContactController {
  constructor(private readonly hubspotContactService: HubspotContactService) {
    this.hubspotContactService = hubspotContactService;
  }

  @Get()
  async getContacts(
    @Query() filter: HubspotContactSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.getContacts(removeEmpty(filter));
  }

  @Get(':contactId')
  async getContactById(
    @Param() payload: HubspotContactSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.getContactById(payload);
  }

  @Post()
  async createContact(
    @Body() payload: HubspotContactCreateDto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.createContact(payload);
  }

  @Put(':contactId')
  async updateContact(
    @Body() payload: HubspotContactUpdateDto,
    @Param() { contactId }: HubspotContactSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.updateContact({
      ...payload,
      contactId,
    });
  }

  @Delete(':contactId')
  async deleteContact(
    @Param() { contactId }: HubspotContactSearchV2Dto,
  ): Promise<ResponseType> {
    await this.hubspotContactService.deleteContact(contactId);

    return {
      message: 'Contact deleted successfully',
    };
  }
}
