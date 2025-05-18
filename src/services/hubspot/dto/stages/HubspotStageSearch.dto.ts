import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotStageSearchDto extends PartialType(FilterType) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

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
  pipelineId?: string = 'default';

  @IsNotEmpty()
  @IsString()
  stageId: string;
}
