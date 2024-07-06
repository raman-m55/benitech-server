import e, { Request, Response } from 'express';
import { SignUpDto } from './dtos/sign-up-.dto';
import UserModel from '../../models/user.model';
import bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { findUserByEmail, finedOneUserById } from '../users/usersServices';
import { decodeToken, encodeToken } from '../../helpers/jwtToken';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';
import { JwtPayload } from '../../interfaces/jwt.interFace';
import { ChangePassword } from './dtos/change-password.dto';
import crypto from 'crypto';
import validateMongoDbId from '../../utils/validateMongoDbId';
import {
  sendEmailForForgotPassword,
  sendEmailForSendOtpCode,
} from '../../utils/sendEmail';
import { ForgotPassword } from './dtos/forgot-password.dto';
import OtpModel from '../../models/otp.model';
import { OtpDto } from './dtos/otp.dto';

export const otp = async (req: Request, res: Response) => {
  try {
    const data: OtpDto = req.body;
    if (data.code) {
      const checkCode = await OtpModel.findOne({
        code: data.code,
        email: data.email,
        is_used: false,
        expired: false,
      });

      if (!checkCode)
        return res.status(401).send({ message: ERROR_MESSAGES.codeIsNotValid });
      const currentTime = new Date();

      if (currentTime > checkCode.expiresAt) {
        await OtpModel.findByIdAndUpdate(checkCode._id, { expired: true });
        return res.send({ message: ERROR_MESSAGES.codeExpired });
      }
      await OtpModel.findByIdAndUpdate(checkCode._id, { is_used: true });
      const user = await findUserByEmail(data.email);

      //در صورتی که کاربر از قبال ثبت نام کرده باشد این عملیات انجام میشود
      if (user) {
        const accessToken = encodeToken({ id: user._id });
        const refreshToken = encodeToken({ id: user._id });
        await UserModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.send({ message: SUCCESS_MESSAGES.createdUser, accessToken });
      } else {
        //در صورتی که کاربر اولین بار است که وارد میشود این عملیات انجام شود
        const newUser = await UserModel.create({ email: data.email });
        await newUser.save();
        const accessToken = encodeToken({ id: newUser._id });
        const refreshToken = encodeToken({ id: newUser._id });
        await UserModel.findByIdAndUpdate(newUser._id, { refreshToken }, { new: true });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.send({ message: SUCCESS_MESSAGES.createdUser, accessToken });
      }
    } else {
      const otp = await generateOtpCode();
      const currentTime = new Date();
      const expiresAt = new Date(currentTime.getTime() + 120 * 1000);
      const newOtp = await OtpModel.create({
        code: otp,
        email: data.email,
        expiresAt,
      });
      await newOtp.save();
      await sendEmailForSendOtpCode(data.email, otp);
      return res.send({ message: SUCCESS_MESSAGES.otpSendToEmail });
    }
  } catch (error: any) {
    return res.status(500).send('Server Error');
  }
};

//User registration

// export const signUp = async (req: Request, res: Response) => {
//   try {
//     const data: SignUpDto = req.body;
//     const user = await findUserByEmail(data.email);
//     if (user) return res.status(401).send({ message: ERROR_MESSAGES.duplicateEmail });
//     const hashedPassword = await hashPassword(data.password, 10);
//     data.password = hashedPassword;
//     const newUser = await UserModel.create({ ...data });
//     await newUser.save();
//     const accessToken = encodeToken({ id: newUser._id });
//     const refreshToken = encodeToken({ id: newUser._id });
//     await UserModel.findByIdAndUpdate(newUser._id, { refreshToken }, { new: true });
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });
//     return res.send({ message: SUCCESS_MESSAGES.createdUser, accessToken });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).send('Server Error');
//   }
// };

// // Verify twoFactor code

// export const verifyTwoFactorCode = async (req: Request, res: Response) => {
//   try {
//   } catch (error: any) {
//     return res.status(500).send('Server Error');
//   }
// };

// //User access to the site

// export const signIn = async (req: Request, res: Response) => {
//   try {
//     const data: SignInDto = req.body;
//     const user = await findUserByEmail(data.email);
//     if (!user) return res.status(401).send({ message: ERROR_MESSAGES.emailNotFound });
//     const compare = await comparePassword(data.password, user.password);
//     if (!compare) res.status(401).send({ message: ERROR_MESSAGES.wrongPassword });
//     const accessToken = encodeToken({ id: user._id });
//     const refreshToken = encodeToken({ id: user._id });
//     await UserModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });
//     return res.send({ message: SUCCESS_MESSAGES.logInDone, accessToken });
//   } catch (error: any) {
//     console.error(error.message);
//     return res.status(500).send('Server Error');
//   }
// };

//handle refresh token
export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).send({ message: ERROR_MESSAGES.refreshTokenNotFound });
    }
    const user = await UserModel.findOne({ refreshToken });
    if (!user)
      return res.status(401).send({ message: ERROR_MESSAGES.TokenRefreshMismatch });
    const verify = decodeToken(refreshToken) as JwtPayload;
    if (user._id.toString() !== verify.id) {
    }
    const accessToken = encodeToken(user._id);
    return res.send({ message: SUCCESS_MESSAGES.createdRefreshToken, accessToken });
  } catch (error: any) {
    return res.status(403).send({ message: error.message });
  }
};

//logout user

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).send({ message: ERROR_MESSAGES.refreshTokenNotFound });
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }
    await UserModel.findByIdAndUpdate(refreshToken, { refreshToken: '' });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data: ChangePassword = req.body;
    validateMongoDbId(id);
    const user = await finedOneUserById(id);
    if (!user) return res.status(404).send({ message: ERROR_MESSAGES.userNotFound });
    if (!user.password)
      return res.status(404).send({ message: ERROR_MESSAGES.notFoundPassword });

    const matchPassword = await comparePassword(user.password, data.password);
    if (!matchPassword)
      return res.status(401).send({ message: ERROR_MESSAGES.passwordNotMatched });

    const hashedPassword = await hashPassword(data.password, 10);
    user.password = hashedPassword;
    await user.save();
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const data: ForgotPassword = req.body;
    const user = await findUserByEmail(data.email);
    if (!user) return res.status(404).send({ message: ERROR_MESSAGES.userNotFound });
    const { passwordResetToken, passwordResetExpires } =
      generateResetPasswordAndExpires();
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save();
    const dataSendEmail = {
      email: data.email,
      content: `https://benitech.com/reset-password?token=${passwordResetToken}`,
    };
    await sendEmailForForgotPassword(dataSendEmail);

    res.send(passwordResetToken);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const hashedPassword = await hashPassword(password, 10);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).send({ message: ERROR_MESSAGES.noUsersFound });
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).send({ message: SUCCESS_MESSAGES.resetPassword });
  } catch (error: any) {
    return res.status(500).send('Server Error');
  }
};

export const hashPassword = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (firstPassword: string, secondPassword: string) => {
  return await bcrypt.compare(firstPassword, secondPassword);
};

export const generateResetPasswordAndExpires = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
  return { passwordResetToken, passwordResetExpires };
};

export const generateOtpCode = async () => {
  //ساخت کد 5 رقمی که در دیتابیس وجود ندارد
  let code: number | null = null;
  while (!code) {
    const fiveDigitCode = getRandomCode();
    const checkCode = await OtpModel.findOne({
      code: fiveDigitCode,
    });
    if (!checkCode) {
      code = fiveDigitCode;
      break;
    }
  }
  return code;
};

export const getRandomCode = () => {
  const min = 10000;
  const max = 99999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp;
};
