import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotDeatSearchDto extends PartialType(FilterType) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.contactIds))
  @IsArray({ each: true })
  @IsString({ each: true })
  contactIds?: string[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  stage?: string;
}

export class HubspotDealSearchV2Dto extends PartialType(HubspotDeatSearchDto) {
  @IsNotEmpty()
  @IsString()
  dealId: string;
}
