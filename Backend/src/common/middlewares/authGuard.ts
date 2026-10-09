import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    shopId: string | null;
  };
}

export const AuthGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me-secret-key') as any;
    
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      shopId: decoded.shopId
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: 'Token expired. Please refresh your token.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
