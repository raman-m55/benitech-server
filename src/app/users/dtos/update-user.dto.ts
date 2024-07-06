import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../../constants/enums';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  first_name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  last_name: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: string;
}
