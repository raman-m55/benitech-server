// src/interfaces/user.interface.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  cart: any;
  address: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  isBlocked: boolean;
  refreshToken?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
