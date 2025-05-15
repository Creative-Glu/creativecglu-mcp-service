import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class HubspotCompanyCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
