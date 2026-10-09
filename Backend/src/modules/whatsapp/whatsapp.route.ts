import { Router } from 'express';
import { WhatsAppController } from './whatsapp.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';
import { RBACGuard } from '../../common/middlewares/rbacGuard';

const router = Router();

// Temporarily removed AuthGuard for quick testing! Add back in production.
router.get('/qr', WhatsAppController.getQr);
router.get('/test', WhatsAppController.test);

export default router;
