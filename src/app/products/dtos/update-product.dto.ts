import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, Length, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'عنوان باید یک رشته باشد' })
  @Length(3, 100, { message: 'عنوان باید بین 3 تا 100 کاراکتر باشد' })
  @IsOptional()
  title: string;

  @IsString({ message: 'مسیر باید یک رشته باشد' })
  @Length(3, 100, { message: 'مسیر باید بین 3 تا 100 کاراکتر باشد' })
  @IsOptional()
  slug: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'قیمت باید یک عدد باشد' })
  @IsOptional()
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'تعداد باید یک عدد باشد' })
  @IsOptional()
  quantity: number;

  @IsString({ message: 'نام دسته باید یک رشته باشد' })
  @IsOptional()
  category: string;

  @IsString({ message: 'نام برند باید یک رشته باشد' })
  @IsOptional()
  brand: string;

  @IsString({ message: 'رنگ محصول باید یک رشته باشد' })
  @IsOptional()
  color: string;
}
