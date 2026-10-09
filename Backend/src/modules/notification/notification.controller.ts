import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { AuthRequest } from '../../common/middlewares/authGuard';

export const NotificationController = {
  async getMyNotifications(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const userId = authReq.user.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const result = await NotificationService.getUserNotifications(userId, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const userId = authReq.user.userId;
      const id = req.params.id as string;

      const updated = await NotificationService.markAsRead(id, userId);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const userId = authReq.user.userId;

      await NotificationService.markAllAsRead(userId);
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
