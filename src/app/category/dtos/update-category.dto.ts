import { IsMongoId, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategory {
  @IsString({ message: 'نام دسته بندی باید یک رشته باشد' })
  @Length(3, 100, { message: 'عنوان  دسته بندی باید بین 3 تا 40 کاراکتر باشد' })
  @IsOptional()
  name: string;

  @IsMongoId({ message: 'شناسه دسته‌بندی والد باید یک MongoID معتبر باشد' })
  @IsOptional()
  parent: string;
}
