import { Response, NextFunction } from 'express';
import { AuthRequest } from './authGuard';
import { prisma } from '../../config/prisma';

export const TenantGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  // Customers are global, their data access is restricted by customerId/userId.
  if (req.user.role === 'CUSTOMER') {
    return next(); 
  }

  // For STAFF and OWNERS, check targetShopId if explicitly provided
  const targetShopId = req.params.shopId || req.query.shopId || (req.body ? req.body.shopId : undefined);

  // If the user is an OWNER, they can access any shop they own
  if (req.user.role === 'OWNER') {
    if (targetShopId) {
      if (req.user.shopId !== targetShopId) {
        const owned = await prisma.shop.findFirst({
          where: { id: targetShopId as string, ownerId: req.user.userId }
        });
        if (!owned) {
          return res.status(403).json({
            success: false,
            message: 'Tenant Isolation Violation: You do not own this shop branch.'
          });
        }
      }
    }
    return next();
  }

  // For STAFF members, verify targetShopId matches their assigned shop
  if (targetShopId && req.user.shopId && req.user.shopId !== targetShopId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Tenant Isolation Violation: You are not authorized to access data for this shop.' 
    });
  }

  if (req.user.shopId) {
    if (!req.body) req.body = {};
    if (!req.body.shopId) req.body.shopId = req.user.shopId;
    if (!req.query) req.query = {};
    if (!req.query.shopId) req.query.shopId = req.user.shopId;
  }

  next();
};

