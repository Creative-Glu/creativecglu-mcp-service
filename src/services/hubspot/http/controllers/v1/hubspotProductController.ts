import { Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
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
  async getProducts(
    @Query() filter: HubspotProductSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotProductService.getProducts(removeEmpty(filter));
  }

  @Get(':productId')
  async getProductById(
    @Param() payload: HubspotProductSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotProductService.getProductById(payload);
  }
}
