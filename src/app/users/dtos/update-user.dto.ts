import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../../constants/enums';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  first_name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  last_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role: string;
}
