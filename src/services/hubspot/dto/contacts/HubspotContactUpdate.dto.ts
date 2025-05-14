import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class HubspotContactUpdateDto {
  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}
