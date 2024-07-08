import { Request, Response, Router } from 'express';
import { checkLoginMiddleware, isAdminMiddleware } from '../../middlewares';
const router = Router();

router.use(checkLoginMiddleware);
router.use(isAdminMiddleware);

export default router;
