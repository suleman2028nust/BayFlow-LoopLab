import { Router } from 'express';
import { ShopController } from './shop.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';
import { RBACGuard } from '../../common/middlewares/rbacGuard';

const router = Router();

// Only the OWNER can add staff members to their shop
router.post('/staff', AuthGuard, RBACGuard(['OWNER']), ShopController.addStaff);

export default router;
