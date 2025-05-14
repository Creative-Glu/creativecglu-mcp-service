import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class HubspotDealUpdateDto {
  @IsNotEmpty()
  @IsString()
  dealId: string;

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
