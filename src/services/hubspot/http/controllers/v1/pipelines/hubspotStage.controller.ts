import { Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExtendedController } from '@yuriyempty/nestjs-extended-controller';
import { ResponseType } from 'common/models';
import {
  HubspotPipelineSearchV2Dto,
  HubspotStageSearchDto,
  HubspotStageSearchV2Dto,
} from 'services/hubspot/dto';
import { HubspotStageService } from 'services/hubspot/providers/services';
import { removeEmpty } from 'utils';

import HubspotPipelineController from './hubspotPipeline.controller';

@ExtendedController({
  parent: HubspotPipelineController,
  path: ':pipelineId/stages',
})
export default class HubspotStageController {
  constructor(private readonly hubspotStageService: HubspotStageService) {
    this.hubspotStageService = hubspotStageService;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getStages(
    @Param() { pipelineId }: HubspotPipelineSearchV2Dto,
    @Query() filter: HubspotStageSearchDto,
  ): Promise<ResponseType> {
    return await this.hubspotStageService.getStages(
      removeEmpty({
        ...filter,
        pipelineId,
      }),
    );
  }

  @Get(':stageId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getStageById(
    @Param() { pipelineId, stageId }: HubspotStageSearchV2Dto,
  ): Promise<ResponseType> {
    return await this.hubspotStageService.getStageById({
      pipelineId,
      stageId,
    });
  }
}
