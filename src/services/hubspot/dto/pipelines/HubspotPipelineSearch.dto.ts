import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotPipelineSearchDto extends PartialType(FilterType) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  name?: string;
}

export class HubspotPipelineSearchV2Dto extends PartialType(
  HubspotPipelineSearchDto,
) {
  @IsOptional()
  @IsString()
  pipelineId?: string = 'default';
}
