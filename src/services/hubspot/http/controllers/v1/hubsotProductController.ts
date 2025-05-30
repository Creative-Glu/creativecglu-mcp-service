import { Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
// Update these imports to your actual Product DTOs
import {
  HubspotProductSearchDto,
  HubspotProductSearchV2Dto,
} from 'services/hubspot/dto';
import { HubspotProductService } from 'services/hubspot/providers/services';
import { removeEmpty } from 'utils';

import { VersionControllers } from './hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'products',
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export default class HubspotProductController {
  constructor(private readonly hubspotProductService: HubspotProductService) {
    this.hubspotProductService = hubspotProductService;
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch Hubspot Products',
    description:
      // eslint-disable-next-line max-len
      'Retrieve a list of Hubspot products with optional filters such as `perPage`, `productname`, and `productId`.',
  })
  async getProducts(
    @Query() filter: HubspotProductSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotProductService.getProducts(removeEmpty(filter));
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Fetch a Hubspot Product by ID',
    description:
      'Retrieve a specific Hubspot product using its unique identifier `productId`.',
  })
  async getProductById(
    @Param() payload: HubspotProductSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotProductService.getProductById(payload);
  }
}
