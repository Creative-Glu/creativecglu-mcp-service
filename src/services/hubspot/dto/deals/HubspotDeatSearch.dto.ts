import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotDeatSearchDto extends PartialType(FilterType) {
  @IsOptional()
  limit?: number;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.contactIds))
  @IsArray({ each: true })
  @IsString({ each: true })
  contactIds?: string[];

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.companyIds))
  @IsArray({ each: true })
  @IsString({ each: true })
  companyIds?: string[];

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  stageId?: string;
}

export class HubspotDealSearchV2Dto extends PartialType(HubspotDeatSearchDto) {
  @IsNotEmpty()
  @IsString()
  dealId: string;
}
