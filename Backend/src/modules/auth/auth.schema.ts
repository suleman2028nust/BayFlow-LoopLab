import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{1,14}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordMessage = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(passwordRegex, passwordMessage),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format. Must be E.164 format e.g., +1234567890').optional(),
  role: z.enum(['CUSTOMER', 'OWNER']).default('CUSTOMER'),
  shopName: z.string().min(2).max(100).regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Invalid characters in shop name').optional() // required if role is OWNER
}).refine(data => {
  if (data.role === 'OWNER' && !data.shopName) {
    return false;
  }
  return true;
}, { message: "Shop name is required for owners", path: ["shopName"] });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  newPassword: z.string().regex(passwordRegex, passwordMessage)
});
