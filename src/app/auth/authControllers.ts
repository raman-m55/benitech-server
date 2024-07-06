import { Request, Response, Router } from 'express';
import { handleRefreshToken, logout, otp } from './authServices';
import { validateMiddleware } from '../../middlewares';
import { SignUpDto } from './dtos/sign-up-.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ChangePassword } from './dtos/change-password.dto';
import { ForgotPassword } from './dtos/forgot-password.dto';
import { ResetPassword } from './dtos/reset-password.dto';
import { assert } from 'console';
import { OtpDto } from './dtos/otp.dto';

const router = Router();

router.post('/otp', validateMiddleware(OtpDto), async (req: Request, res: Response) => {
  try {
    return await otp(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/refresh', async (req: Request, res: Response) => {
  try {
    return await handleRefreshToken(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/logout', async (req: Request, res: Response) => {
  try {
    return await logout(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// router.post(
//   '/sign-up',
//   validateMiddleware(SignUpDto),
//   async (req: Request, res: Response) => {
//     try {
//       const body: SignUpDto = req.body;
//       return await signUp(req, res);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );

// router.post('/sign-in', async (req: Request, res: Response) => {
//   try {
//     return await signIn(req, res);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.put(
//   '/change-password/:id',
//   validateMiddleware(ChangePassword),
//   async (req: Request, res: Response) => {
//     try {
//       return await changePassword(req, res);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );

// router.post(
//   '/forgot-password',
//   validateMiddleware(ForgotPassword),
//   async (req: Request, res: Response) => {
//     try {
//       return await forgotPassword(req, res);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );

// router.post(
//   '/reset-password/:token',
//   validateMiddleware(ResetPassword),
//   async (req: Request, res: Response) => {
//     try {
//       return await resetPassword(req, res);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );

export default router;
