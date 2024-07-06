import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class OtpDto {
  @IsNotEmpty({ message: 'لطفا ایمیل را وارد کنید' })
  @IsEmail({}, { message: 'لطفا یک ایمیل معتبر وارد کنید' })
  email: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  code: number;
}
