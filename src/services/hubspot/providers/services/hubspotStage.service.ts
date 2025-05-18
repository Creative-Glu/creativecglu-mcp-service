import { Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { HttpError, NotFoundException } from 'common/exceptions';
import { ResponseType } from 'common/models';
import {
  HubspotStageSearchDto,
  HubspotStageSearchV2Dto,
} from 'services/hubspot/dto';
import HubspotClient from 'services/hubspot/providers/clients/hubspot.client';

import HubspotPipelineService from './hubspotPipeline.service';

@Injectable()
export default class HubspotStageService {
  constructor(
    private readonly hubspotClient: HubspotClient,
    private readonly hubspotPipelineService: HubspotPipelineService,
  ) {
    this.hubspotPipelineService = hubspotPipelineService;
    this.hubspotClient = hubspotClient;
  }

  async getStages({
    pipelineId,
    name,
  }: HubspotStageSearchDto): Promise<ResponseType> {
    const { data: pipeline } =
      await this.hubspotPipelineService.getPipelineById({
        pipelineId,
      });

    try {
      const data = await Promise.all(
        pipeline.stages
          .filter((stage: any) => {
            if (!isEmpty(name))
              return stage.label.toLowerCase().includes(name.toLowerCase());

            return true;
          })
          .map((stage: any) => ({
            stageId: stage.id,
            ...stage,
          })),
      );

      return {
        data,
        meta: { total: data.length },
      };
    } catch (err) {
      throw new HttpError(err.message);
    }
  }

  async getStageById({
    pipelineId,
    stageId,
  }: HubspotStageSearchV2Dto): Promise<ResponseType> {
    const { data: pipeline } =
      await this.hubspotPipelineService.getPipelineById({
        pipelineId,
      });

    const data: Record<string, any> = await Promise.all(
      pipeline.stages
        .map((stage: any) => ({
          stageId: stage.id,
          ...stage,
        }))
        .filter((stage: any) => stage.id === stageId),
    );

    if (!data[0]) {
      throw new NotFoundException({
        collection: 'stage',
        id: stageId,
      });
    }

    return {
      data: data[0],
    };
  }
}
