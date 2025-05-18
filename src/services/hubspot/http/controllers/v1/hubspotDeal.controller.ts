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
  HubspotDealCreateDto,
  HubspotDealSearchDto,
  HubspotDealSearchV2Dto,
  HubspotDealUpdateDto,
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
  @ApiOperation({
    summary: 'Fetch Hubspot Deals',
    description:
      // eslint-disable-next-line max-len
      'Retrieve a list of Hubspot deals with optional filters such as `limit`, `dealname`, and `contactId`.',
  })
  async getDeals(
    @Query() { limit, ...filter }: HubspotDealSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.getDeals(
      removeEmpty({
        perPage: limit,
        ...filter,
      }),
    );
  }

  @Get(':dealId')
  @ApiOperation({
    summary: 'Fetch a Hubspot Deal by ID',
    description:
      'Retrieve a specific Hubspot deal using its unique identifier `dealId`.',
  })
  async getDealById(
    @Param() payload: HubspotDealSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.getDealById(payload);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a Hubspot Deal',
    description:
      // eslint-disable-next-line max-len
      'Create a new Hubspot deal with the specified details, including an array of `contactIds`, `dealname`, `amount`, and optional fields such as `stage` and `pipeline`.',
  })
  async createDeal(
    @Body() payload: HubspotDealCreateDto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.createDeal(payload);
  }

  @Put(':dealId')
  @ApiOperation({
    summary: 'Update a Hubspot Deal',
    description:
      // eslint-disable-next-line max-len
      'Update an existing Hubspot deal with the specified details, including an array of `contactIds`, `dealname`, `amount`, and optional fields such as `stage` and `pipeline`, identified by its unique `dealId`.',
  })
  async updateDeal(
    @Body() payload: HubspotDealUpdateDto,
    @Param() { dealId }: HubspotDealSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotDealService.updateDeal({ ...payload, dealId });
  }

  @Delete(':dealId')
  @ApiOperation({
    summary: 'Delete a Hubspot Deal',
    description:
      // eslint-disable-next-line max-len
      'Delete an existing Hubspot deal identified by its unique `dealId`.',
  })
  async deleteDeal(
    @Param() { dealId }: HubspotDealSearchV2Dto,
  ): Promise<ResponseType> {
    await this.hubspotDealService.deleteDeal(dealId);

    return {
      message: 'Deal deleted successfully',
    };
  }
}
