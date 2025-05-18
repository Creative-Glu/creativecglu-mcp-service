import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotPipelineSearchDto extends PartialType(FilterType) {
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;
}

export class HubspotPipelineSearchV2Dto extends PartialType(
  HubspotPipelineSearchDto,
) {
  @IsNotEmpty()
  @IsString()
  pipelineId: string;
}
