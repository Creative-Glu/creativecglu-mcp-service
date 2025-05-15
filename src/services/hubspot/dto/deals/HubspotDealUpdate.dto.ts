import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export default class HubspotDealUpdateDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  contactIds: string[];

  @IsOptional()
  @IsString()
  dealId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  stage?: string;
}
