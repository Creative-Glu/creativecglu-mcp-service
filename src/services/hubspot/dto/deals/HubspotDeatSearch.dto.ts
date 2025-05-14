import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotDeatSearchDto extends PartialType(FilterType) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  dealname?: string;
}

export class HubspotDealSearchV2Dto extends PartialType(HubspotDeatSearchDto) {
  @IsNotEmpty()
  @IsString()
  dealId: string;
}
