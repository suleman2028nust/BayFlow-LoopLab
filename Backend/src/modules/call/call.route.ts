import { Router } from 'express';
import { CallController } from './call.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';

const router = Router();

// In-App Voice Calling routes (Brief §8.1)
router.post('/initiate', AuthGuard, CallController.initiateCall);
router.patch('/:callId/status', AuthGuard, CallController.updateStatus);
router.get('/booking/:bookingId', AuthGuard, CallController.getBookingCallLogs);

export default router;
