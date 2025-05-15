import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotCompanySearchDto extends PartialType(FilterType) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class HubspotCompanySearchV2Dto extends PartialType(
  HubspotCompanySearchDto,
) {
  @IsNotEmpty()
  @IsString()
  companyId: string;
}
