import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotContactSearchDto extends PartialType(FilterType) {
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.email))
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.phone))
  @IsPhoneNumber(null)
  phone?: string;
}

export class HubspotContactSearchV2Dto extends PartialType(
  HubspotContactSearchDto,
) {
  @IsNotEmpty()
  @IsString()
  contactId: string;
}
