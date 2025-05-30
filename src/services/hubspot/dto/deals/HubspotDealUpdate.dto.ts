import {
  IsArray,
  isEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export default class HubspotDealUpdateDto {
  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.contactIds))
  @IsArray()
  @IsString({ each: true })
  contactIds?: string[];

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.contactIds))
  @IsArray()
  @IsString({ each: true })
  companyIds?: string[];

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.productIds))
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  dealId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  stageId?: string;
}

export class HubspotDealUpdateV2Dto {
  @IsOptional()
  @IsString()
  dealId?: string;

  @IsNotEmpty()
  @IsString()
  stageId: string;
}
