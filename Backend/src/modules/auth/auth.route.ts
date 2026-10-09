import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../common/middlewares/validateRequest';
import { authRateLimiter, otpRateLimiter } from '../../common/middlewares/rateLimiter';
import { registerSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/verify-otp', otpRateLimiter, validateRequest(verifyOtpSchema), AuthController.verifyOtp);
router.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', authRateLimiter, validateRequest(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authRateLimiter, validateRequest(resetPasswordSchema), AuthController.resetPassword);

export default router;
