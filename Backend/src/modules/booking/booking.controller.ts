import { Request, Response, NextFunction } from 'express';
import { BookingService } from './booking.service';

export const BookingController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = (req as any).user.userId;
      const result = await BookingService.createBooking(req.body, customerId);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const result = await BookingService.updateStatus(id as string, status, user, notes);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};
