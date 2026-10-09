import { Router } from 'express';
import { BookingController } from './booking.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';
import { TenantGuard } from '../../common/middlewares/tenantGuard';
import { validateRequest } from '../../common/middlewares/validateRequest';
import { createBookingSchema, updateStatusSchema } from './booking.schema';

const router = Router();

// Create booking: AuthGuard ensures user is logged in
router.post(
  '/',
  AuthGuard,
  validateRequest(createBookingSchema),
  BookingController.create
);

// Update status: Needs AuthGuard + TenantGuard to ensure staff belongs to the shop
// Note: We don't use RBACGuard here because the state machine handles role validation directly per-status!
router.patch(
  '/:id/status',
  AuthGuard,
  TenantGuard,
  validateRequest(updateStatusSchema),
  BookingController.updateStatus
);

export default router;
