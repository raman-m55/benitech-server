import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPassword {
  @IsEmail({}, { message: 'ایمیل باید معتبر باشد' })
  @IsNotEmpty({ message: 'ایمیل نباید خالی باشد' })
  email: string;
}
