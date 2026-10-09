import { Response, NextFunction } from 'express';
import { AuthRequest } from './authGuard';

export const TenantGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  // Customers are global, their data access is restricted by customerId/userId.
  if (req.user.role === 'CUSTOMER') {
    return next(); 
  }

  // For STAFF and OWNERS, check targetShopId if explicitly provided
  const targetShopId = req.params.shopId || req.query.shopId || (req.body ? req.body.shopId : undefined);

  // If a specific shop ID is being targeted, verify it matches the user's shop ID (or owner's shop)
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
