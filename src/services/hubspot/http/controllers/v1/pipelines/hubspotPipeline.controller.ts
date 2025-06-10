import { Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import {
  HubspotPipelineSearchDto,
  HubspotPipelineSearchV2Dto,
} from 'services/hubspot/dto';
import { HubspotPipelineService } from 'services/hubspot/providers/services';
import { removeEmpty } from 'utils';

import { VersionControllers } from '../hubspot.controller';

@ExtendedController({
  parent: VersionControllers.v1,
  path: 'pipelines',
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export default class HubspotPipelineController {
  constructor(private readonly hubspotPipelineService: HubspotPipelineService) {
    this.hubspotPipelineService = hubspotPipelineService;
  }

  @Get()
  async getPipelines(
    @Query() filter: HubspotPipelineSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotPipelineService.getPipelines(removeEmpty(filter));
  }

  @Get(':pipelineId')
  async getPipelineById(
    @Param() payload: HubspotPipelineSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotPipelineService.getPipelineById(payload);
  }
}
