import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'ایمیل باید معتبر باشد' })
  @IsNotEmpty({ message: 'ایمیل نباید خالی باشد' })
  email: string;

  @IsNotEmpty({ message: 'رمز عبور نباید خالی باشد' })
  @MinLength(4, { message: 'رمز عبور باید حداقل ۴ کاراکتر باشد' })
  @MaxLength(8, { message: 'رمز عبور باید حداکثر ۸ کاراکتر باشد' })
  password: string;
}
