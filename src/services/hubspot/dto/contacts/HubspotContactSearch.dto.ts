import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotContactSearchDto extends PartialType(FilterType) {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class HubspotContactSearchV2Dto extends PartialType(
  HubspotContactSearchDto,
) {
  @IsNotEmpty()
  @IsString()
  contactId: string;
}
