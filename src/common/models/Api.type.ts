import { IsOptional, IsString } from 'class-validator';

export default class ApiTypes {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  payload?: any;

  @IsOptional()
  params?: any;

  transformer?: (f: any) => any;
}
