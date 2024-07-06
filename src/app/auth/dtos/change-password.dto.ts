import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePassword {
  @IsNotEmpty({ message: 'رمز عبور نباید خالی باشد' })
  @MinLength(4, { message: 'رمز عبور باید حداقل ۴ کاراکتر باشد' })
  @MaxLength(8, { message: 'رمز عبور باید حداکثر ۸ کاراکتر باشد' })
  password: string;

  @IsNotEmpty({ message: 'رمز عبور نباید خالی باشد' })
  @MinLength(4, { message: 'رمز عبور باید حداقل ۴ کاراکتر باشد' })
  @MaxLength(8, { message: 'رمز عبور باید حداکثر ۸ کاراکتر باشد' })
  newPassword: string;
}
