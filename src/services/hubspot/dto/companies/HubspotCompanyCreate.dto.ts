import {
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export default class HubspotCompanyCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.domain))
  @IsUrl()
  domain?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.phone))
  @IsPhoneNumber(null)
  phone?: string;
}
