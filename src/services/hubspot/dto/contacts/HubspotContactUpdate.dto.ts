import {
  IsEmail,
  isEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

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
  @ValidateIf((p) => !isEmpty(p.email))
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.phone))
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}
