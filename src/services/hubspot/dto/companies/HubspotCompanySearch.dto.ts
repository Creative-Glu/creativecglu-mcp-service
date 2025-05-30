import { PartialType } from '@nestjs/mapped-types';
import {
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotCompanySearchDto extends PartialType(FilterType) {
  @IsOptional()
  perPage?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.domain))
  @IsUrl()
  domain?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.phone))
  @IsPhoneNumber(null)
  phone?: string;
}

export class HubspotCompanySearchV2Dto extends PartialType(
  HubspotCompanySearchDto,
) {
  @IsNotEmpty()
  @IsString()
  companyId: string;
}
