import { Body, Get, Param, Post, Query } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import {
  HubspotCompanyCreateDto,
  HubspotCompanySearchDto,
  HubspotCompanySearchV2Dto,
} from 'services/hubspot/dto';
import { HubspotCompanyService } from 'services/hubspot/providers/services';

import { VersionControllers } from './hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'companies',
})
export default class HubspotCompanyController {
  constructor(private readonly hubspotCompanyService: HubspotCompanyService) {
    this.hubspotCompanyService = hubspotCompanyService;
  }

  @Get()
  async getCompanies(
    @Query() { limit, ...filter }: HubspotCompanySearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotCompanyService.getCompanies({
      perPage: limit,
      ...filter,
    });
  }

  @Get(':companyId')
  async getCompanyById(
    @Param() payload: HubspotCompanySearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotCompanyService.getCompanyById(payload);
  }

  @Post()
  async createCompany(
    @Body() payload: HubspotCompanyCreateDto,
  ): Promise<ResponseType> {
    return await this.hubspotCompanyService.createCompany(payload);
  }
}
