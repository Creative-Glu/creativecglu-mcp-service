import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class HubspotDealUpdateDto {
  @IsOptional()
  @IsString()
  dealId?: string;

  @IsOptional()
  @IsString()
  dealname?: string;

  @IsOptional()
  @IsEmail()
  amount?: string;

  @IsOptional()
  @IsString()
  stage?: string;
}
