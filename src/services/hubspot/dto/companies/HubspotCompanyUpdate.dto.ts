import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export default class HubspotCompanyUpdateDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;
}
