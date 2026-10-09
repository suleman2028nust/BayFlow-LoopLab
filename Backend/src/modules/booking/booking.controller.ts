import { Request, Response, NextFunction } from 'express';
import { BookingService } from './booking.service';
import { InventoryService } from '../inventory/inventory.service';

export const BookingController = {
  // Create booking (Customer)
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = (req as any).user.userId;
      const result = await BookingService.createBooking(req.body, customerId);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  // Get list of bookings (Role-scoped)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { status, shopId, date } = req.query;
      const bookings = await BookingService.getBookings(user, {
        status: status ? String(status) : undefined,
        shopId: shopId ? String(shopId) : undefined,
        date: date ? String(date) : undefined
      });
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  },

  // Get single booking by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id as string, user);
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  },

  // Get booking history / audit trail
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const history = await BookingService.getBookingHistory(id as string, user);
      res.status(200).json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  },

  // Assign technician to booking
  async assignTechnician(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { technicianId } = req.body;
      const result = await BookingService.assignTechnician(id as string, technicianId, user);
      res.status(200).json({ success: true, data: result, message: 'Technician assigned successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Update status (State Machine)
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

  // Add / Revise Estimate
  async addEstimate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { labourCost, partsCost, notes } = req.body;
      const user = (req as any).user;
      const result = await BookingService.addEstimate(id, { labourCost: Number(labourCost), partsCost: Number(partsCost), notes }, user);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  // Respond to Estimate (Customer)
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

  // Allocate parts to booking
  async allocateParts(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { items } = req.body; // array of { inventoryId, quantity }
      const user = (req as any).user;
      const result = await InventoryService.allocatePartsToBooking(id, items, user);
      res.status(200).json({ success: true, data: result, message: 'Parts allocated to booking' });
    } catch (error) {
      next(error);
    }
  },

  // QC Inspector logs failure
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
