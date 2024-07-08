import { Request, Response, Router } from 'express';
import {
  checkLoginMiddleware,
  isAdminMiddleware,
  validateMiddleware,
} from '../../middlewares';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
} from './categoryServices';
import { CreateCategory } from './dtos/create-category.dto';
import { UpdateCategory } from './dtos/update-category.dto';
const router = Router();

router.use(checkLoginMiddleware);
router.use(isAdminMiddleware);

router.post(
  '/create',
  validateMiddleware(CreateCategory),
  async (req: Request, res: Response) => {
    try {
      return await createCategory(req, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get('/get-all', async (req: Request, res: Response) => {
  try {
    return await getAllCategories(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/get-one/:id', async (req: Request, res: Response) => {
  try {
    return await getOneCategory(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put(
  '/update/:id',
  validateMiddleware(UpdateCategory),
  async (req: Request, res: Response) => {
    try {
      return await updateCategory(req, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    return await deleteCategory(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
