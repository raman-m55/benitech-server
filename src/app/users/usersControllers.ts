import { Request, Response, Router } from 'express';
import {
  blockUser,
  deletedUserById,
  getAllUser,
  getOneUserById,
  unBlockUser,
  updateUserById,
} from './usersServices';
import {
  checkLoginMiddleware,
  isAdminMiddleware,
  validateMiddleware,
} from '../../middlewares';
import { UpdateUserDto } from './dtos/update-user.dto';

const router = Router();
router.use(checkLoginMiddleware);
router.use(isAdminMiddleware);

router.get('/get-all', async (req, res) => {
  try {
    return await getAllUser(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/get-one/:id', async (req: Request, res: Response) => {
  try {
    return await getOneUserById(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    return await deletedUserById(req, res);
  } catch (error: any) {}
});

router.put(
  '/update/:id',
  validateMiddleware(UpdateUserDto),
  async (req: Request, res: Response) => {
    try {
      return await updateUserById(req, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put('/block-user/:id', async (req: Request, res: Response) => {
  try {
    return await blockUser(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/unblock-user/:id', async (req: Request, res: Response) => {
  try {
    return await unBlockUser(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
