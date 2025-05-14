import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import {
  HubspotDealCreateDto,
  HubspotDealSearchDto,
  HubspotDealSearchV2Dto,
  HubspotDealUpdateDto,
} from 'services/hubspot/dto';
import { HubspotDealService } from 'services/hubspot/providers/services';

import { VersionControllers } from './hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'deals',
})
export default class HubspotDealController {
  constructor(private readonly hubspotDealService: HubspotDealService) {
    this.hubspotDealService = hubspotDealService;
  }

  @Get()
  async getDeals(
    @Query() { limit, ...filter }: HubspotDealSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.getDeals({
      perPage: limit,
      ...filter,
    });
  }

  @Get(':dealId')
  async getDealById(
    @Param() payload: HubspotDealSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.getDealById(payload);
  }

  @Post()
  async createDeal(
    @Body() payload: HubspotDealCreateDto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.createDeal(payload);
  }

  @Put(':dealId')
  async updateDeal(
    @Body() payload: HubspotDealUpdateDto,
    @Param() { dealId }: HubspotDealSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.updateDeal({ ...payload, dealId });
  }

  @Delete(':dealId')
  async deleteDeal(
    @Param() { dealId }: HubspotDealSearchV2Dto,
  ): Promise<ResponseType> {
    await this.hubspotDealService.deleteDeal(dealId);

    return {
      message: 'Deal deleted successfully',
    };
  }
}
