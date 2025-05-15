import {
  isEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export default class HubspotCompanyUpdateDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.domain))
  @IsUrl()
  domain?: string;

  @IsOptional()
  @ValidateIf((p) => !isEmpty(p.phone))
  @IsPhoneNumber(null)
  phone?: string;
}
