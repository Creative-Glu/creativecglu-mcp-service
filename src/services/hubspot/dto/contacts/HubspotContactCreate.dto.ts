import {
  IsEmail,
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export default class HubspotContactCreateDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.phone))
  @IsPhoneNumber(null)
  phone?: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}
