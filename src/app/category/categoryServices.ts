import { Request, Response } from 'express';
import CategoryModel from '../../models/category.model';
import { CreateCategory } from './dtos/create-category.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';
import validateMongoDbId from '../../utils/validateMongoDbId';
import { UpdateCategory } from './dtos/update-category.dto';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const data: CreateCategory = req.body;
    const category = await findCategoryByName(data.name);
    if (category)
      return res.status(401).send({ message: ERROR_MESSAGES.repetitiveCategory });
    const newCategory = await CategoryModel.create(data);
    await newCategory.save();
    res.send({ message: SUCCESS_MESSAGES.createdCategory });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = CategoryModel.find(JSON.parse(queryString));

    // مرتب‌سازی (Sorting)

    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    // محدود کردن فیلدهای برگشتی (Field Limiting)

    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // مخفی کردن فیلد __v به عنوان پیش‌فرض
    }

    //صفحه بندی

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = page - 1 + limit;

    if (req.query.page) {
      const categoryCount = await CategoryModel.countDocuments();
      if (skip >= categoryCount)
        return res.status(404).send({ message: ERROR_MESSAGES.notFoundPage });
    }
    const category = await query;
    return res.send({ data: category, message: SUCCESS_MESSAGES.findCategories });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const getOneCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);

    const category = await finedOneCategoryById(id);
    if (!category)
      return res.status(404).send({ message: ERROR_MESSAGES.categoryNotFound });
    return res.send({ data: category, message: SUCCESS_MESSAGES.findCategory });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const data: UpdateCategory = req.body;
    const updateCateory = await CategoryModel.findByIdAndUpdate(id, data);
    console.log(updateCateory);

    return res.send({ message: SUCCESS_MESSAGES.categoryUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    await CategoryModel.findByIdAndDelete(id);
    return res.send({ message: SUCCESS_MESSAGES.deleteCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const findCategoryByName = async (name: string) => {
  return await CategoryModel.findOne({ name });
};

export const finedOneCategoryById = async (id: string) => {
  return await CategoryModel.findById({ _id: id });
};
