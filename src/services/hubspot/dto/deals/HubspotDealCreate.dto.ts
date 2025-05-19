import {
  IsArray,
  isEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export default class HubspotDealCreateDto {
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

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsString()
  pipeline?: string;
}
