import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotStageSearchDto extends PartialType(FilterType) {
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  pipelineId?: string;
}

export class HubspotStageSearchV2Dto extends PartialType(
  HubspotStageSearchDto,
) {
  @IsOptional()
  @IsString()
  pipelineId?: string;

  @IsNotEmpty()
  @IsString()
  stageId: string;
}
