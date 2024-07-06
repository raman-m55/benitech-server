import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import validateMongoDbId from '../../utils/validateMongoDbId';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';
import slugify from 'slugify';
import { UpdateProductDto } from './dtos/update-product.dto';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data: CreateProductDto = req.body;
    // Process the slug field using slugify
    data.slug = slugify(data.slug, {
      lower: true, // تبدیل به حروف کوچک
      strict: true, // حذف کاراکترهای ویژه به جز جایگزین
      trim: true, // حذف کاراکترهای جایگزین در ابتدا و انتها
    });
    const slug = await findUserBySlug(data.slug);
    if (slug) return res.send({ message: ERROR_MESSAGES.repetitiveSlug });
    const newProduct = await ProductModel.create(data);
    await newProduct.save();
    return res.send({ newProduct, message: SUCCESS_MESSAGES.createdProduct });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const product = await findOneProductById(id);
    return res.send(product);
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const queryObj = { ...req.query };
    // حذف فیلدهای غیر ضروری که برای فیلتر کردن استفاده نمی‌شوند
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = ProductModel.find(JSON.parse(queryString));

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
      const productCount = await ProductModel.countDocuments();
      if (skip >= productCount)
        return res.status(404).send({ message: ERROR_MESSAGES.notFoundPage });
    }
    const product = await query;
    res.send({ data: product, message: SUCCESS_MESSAGES.usersFound });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const data: UpdateProductDto = req.body;
    // Process the slug field using slugify
    data.slug = slugify(data.slug, {
      lower: true, // تبدیل به حروف کوچک
      strict: true, // حذف کاراکترهای ویژه به جز جایگزین
      trim: true, // حذف کاراکترهای جایگزین در ابتدا و انتها
    });
    const slug = await findUserBySlug(data.slug);
    if (slug) return res.send({ message: ERROR_MESSAGES.repetitiveSlug });
    const updateProduct = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    return res.send({ message: SUCCESS_MESSAGES.productUpdated, updateProduct });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    await ProductModel.findByIdAndDelete(id);
    return res.send({ message: ERROR_MESSAGES.productDeleted });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const findOneProductById = async (id: string) => {
  return await ProductModel.findById(id);
};

export const findUserBySlug = async (slug: string) => {
  return await ProductModel.findOne({ slug });
};
