import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

import Meta from './Meta.type';

export enum ORDER_BY_TYPE {
  ASC = 'ASC',
  DESC = 'DESC',
}

export default class FilterType extends PartialType(Meta) {
  @IsOptional()
  sortBy?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsOptional()
  @IsEnum(ORDER_BY_TYPE)
  orderBy?: ORDER_BY_TYPE;

  [key: string]: any;
}
