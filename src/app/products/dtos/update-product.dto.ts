import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, Length } from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'عنوان باید یک رشته باشد' })
  @Length(3, 100, { message: 'عنوان باید بین 3 تا 100 کاراکتر باشد' })
  title: string;

  @IsString({ message: 'مسیر باید یک رشته باشد' })
  @Length(3, 100, { message: 'مسیر باید بین 3 تا 100 کاراکتر باشد' })
  slug: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'قیمت باید یک عدد باشد' })
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'تعداد باید یک عدد باشد' })
  quantity: number;

  @IsString({ message: 'نام دسته باید یک رشته باشد' })
  category: string;

  @IsString({ message: 'نام برند باید یک رشته باشد' })
  brand: string;

  @IsString({ message: 'رنگ محصول باید یک رشته باشد' })
  color: string;
}
