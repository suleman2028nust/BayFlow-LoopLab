import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';

const router = Router();

// In-app notifications
router.get('/', AuthGuard, NotificationController.getMyNotifications);
router.patch('/read-all', AuthGuard, NotificationController.markAllAsRead);
router.patch('/:id/read', AuthGuard, NotificationController.markAsRead);

export default router;
