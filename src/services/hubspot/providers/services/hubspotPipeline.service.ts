import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { UnprocessableEntryException } from 'common/exceptions';
import { ResponseType } from 'common/models';
import {
  HubspotPipelineSearchDto,
  HubspotPipelineSearchV2Dto,
} from 'services/hubspot/dto';

import { HubspotClient } from '../clients';

export const DEFAULT_PIPELINE_ID = 'default';

@Injectable()
export default class HubspotPipelineService {
  constructor(private readonly hubspotClient: HubspotClient) {
    this.hubspotClient = hubspotClient;
  }

  async getPipelines(filter: HubspotPipelineSearchDto): Promise<ResponseType> {
    try {
      const { name, perPage } = filter;

      const response =
        await this.hubspotClient.client.crm.pipelines.pipelinesApi.getAll(
          'deals',
        );

      let data = await Promise.all(
        response.results
          .filter((pipeline: any) => {
            if (!isEmpty(name))
              return pipeline.label.toLowerCase().includes(name.toLowerCase());

            return true;
          })
          .map((pipeline: any) => ({
            pipelineId: pipeline.id,
            ...pipeline,
          })),
      );

      if (perPage && Number.isInteger(perPage) && perPage > 0)
        data = data.slice(0, perPage);

      return {
        data,
        meta: { total: response.total },
      };
    } catch (err) {
      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }

  async getPipelineById({
    pipelineId,
  }: HubspotPipelineSearchV2Dto): Promise<ResponseType> {
    try {
      const pipeline =
        await this.hubspotClient.client.crm.pipelines.pipelinesApi.getById(
          'deals',
          pipelineId,
        );

      return { data: { pipelineId: pipeline.id, ...pipeline } };
    } catch (err) {
      if ([404, 400].includes(err.code))
        throw new NotFoundException({
          collection: 'pipeline',
          id: pipelineId,
        });

      throw new UnprocessableEntryException(err?.body?.message ?? err?.message);
    }
  }
}
