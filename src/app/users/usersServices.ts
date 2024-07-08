import { Request, Response } from 'express';
import UserModel from '../../models/user.model';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';
import { IUser } from '../../interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import validateMongoDbId from '../../utils/validateMongoDbId';

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = UserModel.find(JSON.parse(queryString));

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
      const UserCount = await UserModel.countDocuments();
      if (skip >= UserCount)
        return res.status(404).send({ message: ERROR_MESSAGES.notFoundPage });
    }
    const user = await query;
    return res.send({ data: user, message: SUCCESS_MESSAGES.usersFound });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const getOneUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const user = await finedOneUserById(id);
    if (!user) return res.status(404).send({ message: ERROR_MESSAGES.userNotFound });
    return res.send({ message: SUCCESS_MESSAGES.userFound, user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};
export const deletedUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) return res.status(404).send({ message: ERROR_MESSAGES.userNotFound });
    return res.send({ message: SUCCESS_MESSAGES.userDeleted, user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const data: UpdateUserDto = req.body;
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
      },
      { new: true }
    );
    return res.send({ message: SUCCESS_MESSAGES.userUpdated, updateUser });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

export const blockUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    await UserModel.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.send({ message: SUCCESS_MESSAGES.userBlocked });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const unBlockUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    await UserModel.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.send({ message: SUCCESS_MESSAGES.userUnblocked });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const finedOneUserById = async (id: string): Promise<IUser | null> => {
  return await UserModel.findById({ _id: id });
};
