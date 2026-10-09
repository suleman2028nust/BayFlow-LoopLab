import { Response, NextFunction } from 'express';
import { AuthRequest } from './authGuard';

export const TenantGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  // Customers are global, they don't have a specific shopId pinned to them.
  // Their data access will be restricted by their userId instead.
  if (req.user.role === 'CUSTOMER') {
    return next(); 
  }

  // For STAFF and OWNERS, their shopId must match the shop they are trying to access.
  // We check the target shopId from URL params, body, or query strings.
  const targetShopId = req.params.shopId || req.body.shopId || req.query.shopId;

  // If a specific shop ID is being targeted, verify it matches the user's shop ID
  if (targetShopId && req.user.shopId !== targetShopId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Tenant Isolation Violation: You are not authorized to access data for this shop.' 
    });
  }

  // If the endpoint doesn't specify a shopId but the user is staff, 
  // we can inject their shopId into the request body or query so controllers only fetch their data.
  if (!targetShopId && req.user.shopId) {
    req.body.shopId = req.user.shopId;
  }

  next();
};
