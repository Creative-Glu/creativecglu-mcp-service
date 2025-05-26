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
  HubspotCompanyCreateDto,
  HubspotCompanySearchDto,
  HubspotCompanySearchV2Dto,
} from 'services/hubspot/dto';
import { HubspotCompanyService } from 'services/hubspot/providers/services';
import { removeEmpty } from 'utils';

import { VersionControllers } from './hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'companies',
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export default class HubspotCompanyController {
  constructor(private readonly hubspotCompanyService: HubspotCompanyService) {
    this.hubspotCompanyService = hubspotCompanyService;
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch Hubspot Companies',
    description:
      // eslint-disable-next-line max-len
      'Retrieve a list of Hubspot companies with optional filters like `limit`, `name` and `domain` and `phone`.',
  })
  async getCompanies(
    @Query() filter: HubspotCompanySearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotCompanyService.getCompanies(removeEmpty(filter));
  }

  @Get(':companyId')
  @ApiOperation({
    summary: 'Fetch Hubspot Company by ID',
    description:
      'Retrieve details of a specific Hubspot company using its unique `companyId`.',
  })
  async getCompanyById(
    @Param() payload: HubspotCompanySearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotCompanyService.getCompanyById(payload);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a Hubspot Company',
    description:
      // eslint-disable-next-line max-len
      'Create a new Hubspot company using the provided details, such as `name`, `domain`, and other optional fields like `phone`.',
  })
  async createCompany(
    @Body() payload: HubspotCompanyCreateDto,
  ): Promise<ResponseType> {
    return await this.hubspotCompanyService.createCompany(payload);
  }

  @Put(':companyId')
  @ApiOperation({
    summary: 'Update a Hubspot Company',
    description:
      // eslint-disable-next-line max-len
      'Update an existing Hubspot company using the provided details, such as `name`, `domain`, and other optional fields like `phone`, identified by its unique `companyId`.',
  })
  async updateCompany(
    @Body() payload: HubspotCompanyCreateDto,
    @Param() { companyId }: HubspotCompanySearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotCompanyService.updateCompany({
      ...payload,
      companyId,
    });
  }

  @Delete(':companyId')
  @ApiOperation({
    summary: 'Delete a Hubspot Company',
    description:
      'Delete an existing Hubspot company identified by its unique `companyId`.',
  })
  async deleteCompany(
    @Param() { companyId }: HubspotCompanySearchV2Dto,
  ): Promise<ResponseType> {
    await this.hubspotCompanyService.deleteCompany(companyId);

    return {
      message: 'Company deleted successfully',
    };
  }
}
