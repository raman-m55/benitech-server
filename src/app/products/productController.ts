import { Request, Response, Router } from 'express';
import {
  checkLoginMiddleware,
  isAdminMiddleware,
  validateMiddleware,
} from '../../middlewares';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  getProductsByCategory,
  updateProduct,
} from './productServices';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

const router = Router();
router.use(checkLoginMiddleware);
router.use(isAdminMiddleware);

router.post(
  '/create',
  validateMiddleware(CreateProductDto),
  async (req: Request, res: Response) => {
    try {
      return await createProduct(req, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get('/get-all', async (req: Request, res: Response) => {
  try {
    return await getAllProduct(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/get-one/:id', async (req: Request, res: Response) => {
  try {
    return await getOneProduct(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put(
  '/update/:id',
  validateMiddleware(UpdateProductDto),
  async (req: Request, res: Response) => {
    try {
      return await updateProduct(req, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete('/delete/:id', async (req, res) => {
  try {
    return await deleteProduct(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category/:id', async (req: Request, res: Response) => {
  try {
    return await getProductsByCategory(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
