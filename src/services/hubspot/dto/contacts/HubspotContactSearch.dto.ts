import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEmail,
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotContactSearchDto extends PartialType(FilterType) {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

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
  @IsPhoneNumber()
  phone?: string;
}

export class HubspotContactSearchV2Dto extends PartialType(
  HubspotContactSearchDto,
) {
  @IsNotEmpty()
  @IsString()
  contactId: string;
}
