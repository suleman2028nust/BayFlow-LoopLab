import { Request, Response, NextFunction } from 'express';
import { CallService } from './call.service';
import { AuthRequest } from '../../common/middlewares/authGuard';

export const CallController = {
  // Start or Join Call Room
  async initiateCall(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const { bookingId } = req.body;
      if (!bookingId) {
        res.status(400).json({ success: false, message: 'bookingId is required' });
        return;
      }

      const callData = await CallService.initiateCall(bookingId, authReq.user);
      res.status(201).json({ success: true, data: callData });
    } catch (error) {
      next(error);
    }
  },

  // Update Call Status (CONNECTED, MISSED, REJECTED, ENDED)
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const callId = req.params.callId as string;
      const { status, duration } = req.body;

      const updated = await CallService.updateCallStatus(callId, status, duration ? Number(duration) : 0);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  // Get Call Logs for a Booking
  async getBookingCallLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingId = req.params.bookingId as string;
      const logs = await CallService.getCallLogsByBooking(bookingId);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  },
};
