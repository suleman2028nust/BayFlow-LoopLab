import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await AuthService.verifyOtp(req.body);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await AuthService.login(req.body);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      if (userId) {
        await AuthService.logout(userId);
      }
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.forgotPassword(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
};
