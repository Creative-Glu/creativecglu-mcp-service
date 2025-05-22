import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FilterType } from 'common/models';

export default class HubspotProductSearchDto extends PartialType(FilterType) {
  @IsOptional()
  perPage?: number;

  @IsOptional()
  @IsString()
  name?: string;
}

export class HubspotProductSearchV2Dto extends PartialType(
  HubspotProductSearchDto,
) {
  @IsNotEmpty()
  @IsString()
  productId: string;
}
