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
      const phone = '923289082754';
      await WhatsAppService.sendMessage(
        phone, 
        '🚗 Welcome to BayFlow! Your WhatsApp integration is working perfectly. 🚀'
      );
      res.json({ success: true, message: `Test message sent to ${phone}!` });
    } catch (err) {
      next(err);
    }
  }
};
