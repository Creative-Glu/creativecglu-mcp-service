import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import {
  HubspotDealCreateDto,
  HubspotDealSearchDto,
  HubspotDealSearchV2Dto,
  HubspotDealUpdateDto,
  HubspotDealUpdateV2Dto,
} from 'services/hubspot/dto';
import { HubspotDealService } from 'services/hubspot/providers/services';
import { removeEmpty } from 'utils';

import { VersionControllers } from './hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'deals',
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export default class HubspotDealController {
  constructor(private readonly hubspotDealService: HubspotDealService) {
    this.hubspotDealService = hubspotDealService;
  }

  @Get()
  async getDeals(@Query() filter: HubspotDealSearchDto): Promise<ResponseType> {
    return await this.hubspotDealService.getDeals(removeEmpty(filter));
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

  @Patch(':dealId')
  async changeDealStage(
    @Body() payload: HubspotDealUpdateV2Dto,
    @Param() { dealId }: HubspotDealSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.changeDealStage({
      ...payload,
      dealId,
    });
  }
}
