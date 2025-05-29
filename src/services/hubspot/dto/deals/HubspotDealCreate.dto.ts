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

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  stageId?: string;

  @IsOptional()
  @IsString()
  pipelineId?: string;
}
