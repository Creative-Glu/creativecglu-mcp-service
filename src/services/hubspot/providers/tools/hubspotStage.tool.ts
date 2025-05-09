/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { HttpError } from 'common/exceptions';
import { ResponseType } from 'common/models';
import { CONTENT_TYPE } from 'common/models/Content.type';
import { HubspotDealDeleteSchema } from 'services/hubspot/dto/deals/HubspotDealDelete.dto';
import {
  HubspotStageMoveDealDto,
  HubspotStageMoveDealSchema,
} from 'services/hubspot/dto/stages/HubspotStageMoveDeal.dto';
import { StageUnableToPrcocessEntryException } from 'services/hubspot/exceptions';

import { HubspotStageService } from '../services';

const PREFIX_TOOL = 'hubspot/stages';

@Injectable()
export default class HubspotStageToolController {
  constructor(private readonly hubspotStageService: HubspotStageService) {
    this.hubspotStageService = hubspotStageService;
  }

  @Tool({
    name: `${PREFIX_TOOL}/get-stages`,
    description: 'Retrieve the stages of a HubSpot deal pipeline.',
  })
  async getStages(): Promise<ResponseType> {
    const { data, meta } = await this.hubspotStageService.getStages();

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
          **Total Stages**: ${meta.total}
            \n\n **Stages**: ${data
              .map(
                (d) => `
                \n - **${d.label ?? null}**
                \n    - **stageId**: ${d.id ?? null}
                `,
              )
              .join('')}
          `,
        },
      ],
    };
  }

  @Tool({
    name: `${PREFIX_TOOL}/move-deal`,
    description:
      'Move an existing HubSpot deal to a new stage with the provided `dealId` and `stageId`.',
    parameters: HubspotStageMoveDealSchema,
  })
  async moveDealStage(payload: HubspotStageMoveDealDto): Promise<ResponseType> {
    const parsedPayload = HubspotDealDeleteSchema.safeParse(payload);
    if (!parsedPayload.success)
      throw new HttpError(
        `Invalid payload: ${JSON.stringify(parsedPayload.error.errors)}`,
      );

    const { data, message } = await this.hubspotStageService.moveDeal(payload);

    if (!data)
      return await StageUnableToPrcocessEntryException({ ...payload, message });

    return {
      content: [
        {
          type: CONTENT_TYPE.TEXT,
          text: `
            **Deal Moved**
          `,
        },
      ],
    };
  }
}
