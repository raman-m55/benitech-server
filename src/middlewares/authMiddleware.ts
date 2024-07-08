import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../helpers/jwtToken';
import UserModel from '../models/user.model';
import { isArray } from 'class-validator';
import { finedOneUserById } from '../app/users/usersServices';
import { ERROR_MESSAGES } from '../constants/messages';
import { IUser } from '../interfaces/user.interface';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser | null;
    }
  }
}

export const currentUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
    req.currentUser = null;
    next();
    return;
  } else {
    try {
      const token = authHeader.split(' ')[1];
      const { id } = decodeToken(token) as JwtPayload;
      const currentUser = await finedOneUserById(id);
      if (currentUser) {
        delete currentUser.password;
        req.currentUser = currentUser;
        next();
      } else {
        req.currentUser = null;
        next();
      }
    } catch (error: any) {
      console.error('Error in currentUserMiddleware:', error);
      req.currentUser = null;
      next();
    }
  }
};

export const checkLoginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.currentUser === null) {
      return res.status(401).send({ message: ERROR_MESSAGES.Inaccessibility });
    }
    next();
  } catch (error: any) {
    res.status(401).send({ message: ERROR_MESSAGES.Inaccessibility });
  }
};

export const isAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    return res.status(401).send({ message: ERROR_MESSAGES.Inaccessibility });
  }
  const role = req.currentUser.role;
  if (role !== 'admin') {
    return res.status(401).send({ message: ERROR_MESSAGES.Inaccessibility });
  } else {
    next();
  }
};
