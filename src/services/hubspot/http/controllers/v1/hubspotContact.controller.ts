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
import { ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Fetch Hubspot Contacts',
    description:
      // eslint-disable-next-line max-len
      'Retrieve a list of Hubspot contacts with optional filters like `limit`, `email`, `firstname`, `lastname`, and `phone`.',
  })
  async getContacts(
    @Query() filter: HubspotContactSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.getContacts(removeEmpty(filter));
  }

  @Get(':contactId')
  @ApiOperation({
    summary: 'Fetch Hubspot Contact by ID',
    description:
      'Retrieve a specific Hubspot contact by its unique `contactId`.',
  })
  async getContactById(
    @Param() payload: HubspotContactSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.getContactById(payload);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a Hubspot Contact',
    description:
      // eslint-disable-next-line max-len
      'Create a new Hubspot contact using the provided details, such as `email`, `firstname`, `lastname`, and other optional fields like `phone` and `companyId`.',
  })
  async createContact(
    @Body() payload: HubspotContactCreateDto,
  ): Promise<ResponseType> {
    return await this.hubspotContactService.createContact(payload);
  }

  @Put(':contactId')
  @ApiOperation({
    summary: 'Update a Hubspot Contact',
    description:
      // eslint-disable-next-line max-len
      'Update an existing Hubspot contact using the provided details, such as `email`, `firstname`, `lastname`, and other optional fields like `phone` and `companyId`, identified by its unique `contactId`.',
  })
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
  @ApiOperation({
    summary: 'Delete a Hubspot Contact',
    description:
      'Delete an existing Hubspot contact identified by its unique `contactId`.',
  })
  async deleteContact(
    @Param() { contactId }: HubspotContactSearchV2Dto,
  ): Promise<ResponseType> {
    await this.hubspotContactService.deleteContact(contactId);

    return {
      message: 'Contact deleted successfully',
    };
  }
}
