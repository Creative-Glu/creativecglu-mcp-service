import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class HubspotDealCreateDto {
  @IsNotEmpty()
  @IsString()
  contactId: string;

  @IsNotEmpty()
  @IsString()
  dealname: string;

  @IsNotEmpty()
  @IsEmail()
  amount: string;

  @IsOptional()
  @IsString()
  stage?: string;
}
