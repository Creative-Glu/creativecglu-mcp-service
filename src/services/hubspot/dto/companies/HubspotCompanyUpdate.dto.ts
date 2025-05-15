import { IsOptional, IsString } from 'class-validator';

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
  @IsString()
  phone?: string;
}
