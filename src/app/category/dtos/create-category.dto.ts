import { IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategory {
  @IsString({ message: 'نام دسته بندی باید یک رشته باشد' })
  @IsNotEmpty({ message: 'وارد کردن عنوان دسته بندی الزامی است' })
  @Length(3, 100, { message: 'عنوان  دسته بندی باید بین 3 تا 40 کاراکتر باشد' })
  name: string;

  @IsMongoId({ message: 'شناسه دسته‌بندی والد باید یک MongoID معتبر باشد' })
  @IsOptional()
  parent: string;
}
