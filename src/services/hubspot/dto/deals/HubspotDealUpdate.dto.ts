import {
  IsArray,
  isEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export default class HubspotDealUpdateDto {
  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.contactIds))
  @IsArray()
  @IsString({ each: true })
  contactIds: string[];

  @IsOptional()
  @IsString()
  dealId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @IsOptional()
  @IsString()
  stage?: string;
}
