import { Request, Response } from 'express';
import UserModel from '../../models/user.model';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';
import { IUser } from '../../interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import validateMongoDbId from '../../utils/validateMongoDbId';

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    // محاسبه skip و limit
    const skip = (page - 1) * limit;
    const getAllUsers = await UserModel.find().skip(skip).limit(limit);
    if (!getAllUsers)
      return res.status(404).send({ message: ERROR_MESSAGES.noUsersFound });

    const totalUsers = await UserModel.countDocuments();
    return res.json({
      total: getAllUsers,
      page,
      pageSize: limit,
      totalPages: Math.ceil(totalUsers / limit),
      countAll: totalUsers,
      message: SUCCESS_MESSAGES.usersFound,
    });
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
