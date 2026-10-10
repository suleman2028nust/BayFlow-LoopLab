import { Router } from 'express';
import { CallController } from './call.controller';
import { AuthGuard } from '../../common/middlewares/authGuard';

const router = Router();

// In-App Voice Calling routes (Brief §8.1)
router.post('/initiate', AuthGuard, CallController.initiateCall);
router.get('/incoming', AuthGuard, CallController.getIncomingCall);
router.get('/booking/:bookingId', AuthGuard, CallController.getBookingCallLogs);
router.patch('/:callId/status', AuthGuard, CallController.updateStatus);
router.post('/:callId/signal', AuthGuard, CallController.sendSignal);
router.get('/:callId/signals', AuthGuard, CallController.getSignals);
router.get('/:callId', AuthGuard, CallController.getCallById);

export default router;
