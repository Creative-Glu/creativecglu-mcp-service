import HubspotProductController from './v1/hubsotProductController';
import HubspotCompanyV1Controller from './v1/hubspotCompany.controller';
import HubspotContactV1Controller from './v1/hubspotContact.controller';
import HubspotDealV1Controller from './v1/hubspotDeal.controller';
import HubspotPipelineV1Controller from './v1/pipelines/hubspotPipeline.controller';
import HubspotStageV1Controller from './v1/pipelines/hubspotStage.controller';

export default [
  HubspotCompanyV1Controller,
  HubspotContactV1Controller,
  HubspotDealV1Controller,
  HubspotPipelineV1Controller,
  HubspotStageV1Controller,
  HubspotProductController,
];
