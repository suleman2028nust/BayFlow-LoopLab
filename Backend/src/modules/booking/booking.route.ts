import { Router } from 'express';
import { BookingController } from './booking.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';
import { TenantGuard } from '../../common/middlewares/tenantGuard';
import { RBACGuard } from '../../common/middlewares/rbacGuard';
import { validateRequest } from '../../common/middlewares/validateRequest';
import { createBookingSchema, updateStatusSchema } from './booking.schema';

const router = Router();

// 1. List bookings (role-scoped)
router.get('/', AuthGuard, TenantGuard, BookingController.getAll);

// 2. Get single booking by ID
router.get('/:id', AuthGuard, TenantGuard, BookingController.getById);

// 3. Get booking audit trail / history
router.get('/:id/history', AuthGuard, TenantGuard, BookingController.getHistory);

// 4. Create booking (Customer)
router.post(
  '/',
  AuthGuard,
  validateRequest(createBookingSchema),
  BookingController.create
);

// 5. Assign technician (Owner / Service Advisor)
router.post(
  '/:id/assign',
  AuthGuard,
  TenantGuard,
  RBACGuard(['OWNER', 'SERVICE_ADVISOR']),
  BookingController.assignTechnician
);

// 6. Update status (State Machine)
router.patch(
  '/:id/status',
  AuthGuard,
  TenantGuard,
  validateRequest(updateStatusSchema),
  BookingController.updateStatus
);

// 7. Add / Revise Estimate
router.post(
  '/:id/estimate',
  AuthGuard,
  TenantGuard,
  BookingController.addEstimate
);

// 8. Respond to Estimate (Customer)
router.post(
  '/:id/estimate/respond',
  AuthGuard,
  BookingController.respondToEstimate
);

// 9. Allocate parts to booking
router.post(
  '/:id/parts',
  AuthGuard,
  TenantGuard,
  BookingController.allocateParts
);

// 10. QC issue reporting
router.post(
  '/:id/qc-issue',
  AuthGuard,
  TenantGuard,
  BookingController.addQcIssue
);

export default router;
