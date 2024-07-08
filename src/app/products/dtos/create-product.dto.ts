import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsMongoId, Length } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'عنوان باید یک رشته باشد' })
  @IsNotEmpty({ message: 'وارد کردن عنوان الزامی است' })
  @Length(3, 100, { message: 'عنوان باید بین 3 تا 100 کاراکتر باشد' })
  title: string;

  @IsString({ message: 'مسیر باید یک رشته باشد' })
  @IsNotEmpty({ message: 'وارد کردن مسیر الزامی است' })
  @Length(3, 100, { message: 'مسیر باید بین 3 تا 100 کاراکتر باشد' })
  slug: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'قیمت باید یک عدد باشد' })
  @IsNotEmpty({ message: 'وارد کردن قیمت الزامی است' })
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'تعداد باید یک عدد باشد' })
  @IsNotEmpty({ message: 'وارد کردن تعداد الزامی است' })
  quantity: number;

  @IsMongoId({ message: 'شناسه دسته‌بندی باید یک MongoID معتبر باشد' })
  @IsNotEmpty({ message: 'وارد کردن دسته‌بندی الزامی است' })
  category: string;

  @IsString({ message: 'نام برند باید یک رشته باشد' })
  @IsNotEmpty({ message: 'وارد کردن برند الزامی است' })
  brand: string;

  @IsString({ message: 'رنگ محصول باید یک رشته باشد' })
  @IsNotEmpty({ message: 'وارد کردن رنگ محصول الزامی است' })
  color: string;
}
