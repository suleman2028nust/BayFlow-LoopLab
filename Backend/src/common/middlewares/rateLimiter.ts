import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after a minute' },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: { success: false, message: 'Too many authentication attempts, please try again later' },
});

export const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 OTP requests per hour
  message: { success: false, message: 'Too many OTP requests, please try again later' },
});
