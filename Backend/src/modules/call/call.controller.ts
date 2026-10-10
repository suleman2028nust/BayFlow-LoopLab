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

  // Check for active ringing incoming call
  async getIncomingCall(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const call = await CallService.getIncomingCall(authReq.user);
      res.status(200).json({ success: true, data: call, call });
    } catch (error) {
      next(error);
    }
  },

  // Get specific Call Log by ID
  async getCallById(req: Request, res: Response, next: NextFunction) {
    try {
      const callId = req.params.callId as string;
      const call = await CallService.getCallById(callId);
      if (!call) {
        res.status(404).json({ success: false, message: 'Call not found' });
        return;
      }
      res.status(200).json({ success: true, data: call });
    } catch (error) {
      next(error);
    }
  },

  // WebRTC Signal: Post Offer/Answer/Candidate
  async sendSignal(req: Request, res: Response, next: NextFunction) {
    try {
      const callId = req.params.callId as string;
      const { sender, type, payload } = req.body;
      const signal = CallService.addSignal(callId, sender, type, payload);
      res.status(200).json({ success: true, data: signal });
    } catch (error) {
      next(error);
    }
  },

  // WebRTC Signals: Get Opposing Party Signals
  async getSignals(req: Request, res: Response, next: NextFunction) {
    try {
      const callId = req.params.callId as string;
      const sender = (req.query.sender as 'caller' | 'receiver') || 'caller';
      const after = Number(req.query.after || 0);
      const signals = CallService.getSignals(callId, sender, after);
      res.status(200).json({ success: true, data: signals });
    } catch (error) {
      next(error);
    }
  },
};
