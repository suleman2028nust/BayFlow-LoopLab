import { Request, Response, NextFunction } from 'express';
import { WhatsAppService } from './whatsapp.service';

export const WhatsAppController = {
  // Endpoint to get the QR Code status/image
  async getQr(req: Request, res: Response, next: NextFunction) {
    try {
      const result = WhatsAppService.getQrCode();
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  // Test endpoint
  async test(req: Request, res: Response, next: NextFunction) {
    try {
      const phone = (req.query.phone as string) || (req.body?.phone as string) || '923289082754';
      const msg = (req.query.message as string) || (req.body?.message as string) || '🚗 Welcome to BayFlow! Your WhatsApp integration is working perfectly. 🚀';

      const sent = await WhatsAppService.sendMessage(phone, msg);
      if (sent) {
        res.json({ success: true, message: `Test message sent to ${phone}!` });
      } else {
        res.status(500).json({ success: false, message: `Failed to send to ${phone}. Check WhatsApp connection status.` });
      }
    } catch (err) {
      next(err);
    }
  }
};
