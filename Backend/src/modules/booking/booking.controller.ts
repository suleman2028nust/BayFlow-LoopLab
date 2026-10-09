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
  },

  async addEstimate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { labourCost, partsCost, notes } = req.body;
      const user = (req as any).user;
      const result = await BookingService.addEstimate(id, { labourCost, partsCost, notes }, user);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async respondToEstimate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body; // 'APPROVED' or 'REJECTED'
      const user = (req as any).user;
      
      await BookingService.respondToEstimate(id, status, user.userId);
      res.status(200).json({ success: true, message: `Estimate ${status}` });
    } catch (error) {
      next(error);
    }
  },

  async addQcIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { description } = req.body;
      const result = await BookingService.addQCIssue(id, description);
      res.status(201).json({ success: true, issue: result });
    } catch (error) {
      next(error);
    }
  }
};
