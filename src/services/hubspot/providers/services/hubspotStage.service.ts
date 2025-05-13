import { Injectable } from '@nestjs/common';
import HubspotClient from 'services/hubspot/providers/clients/hubspot.client';

import HubspotDealService from './hubspotDeal.service';

@Injectable()
export default class HubspotStageService {
  constructor(
    private readonly hubspotClient: HubspotClient,
    private readonly hubspotDealService: HubspotDealService,
  ) {
    this.hubspotClient = hubspotClient;
    this.hubspotDealService = hubspotDealService;
  }

  // async getStages(): Promise<ResponseType> {
  //   try {
  //     const response =
  //       await this.hubspotClient.client.crm.pipelines.pipelinesApi.getAll(
  //         'deals',
  //       );

  //     const data: Record<string, any> = await Promise.all(response.results);

  //     return {
  //       data: data[0]?.stages ?? [],
  //       meta: { total: data[0]?.stages.length },
  //     };
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }

  // async getStageById(payload: HubspotStageSearchDto): Promise<ResponseType> {
  //   const { data } = await this.getStages();

  //   return { data: data.find((stage) => stage.id === payload.stageId) ?? null };
  // }

  // async moveDeal(payload: HubspotStageMoveDealDto): Promise<ResponseType> {
  //   try {
  //     if (
  //       (await (await this.getStageById({ stageId: payload.stageId })).data) ===
  //       null
  //     )
  //       return { data: null, message: 'stage not found' };

  //     if (
  //       (await (
  //         await this.hubspotDealService.getDealById({
  //           dealId: payload.dealId,
  //         })
  //       ).data) === null
  //     )
  //       return { data: null, message: 'Deal not found' };

  //     const data = await this.hubspotClient.client.crm.deals.basicApi.update(
  //       payload.dealId,
  //       {
  //         properties: {
  //           dealstage: payload.stageId,
  //         },
  //       },
  //     );

  //     return { data };
  //   } catch (error) {
  //     throw new HttpError(error);
  //   }
  // }
}
