import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const passwordMessage = 'Password must be at least 8 characters with uppercase, lowercase, number, and a special character (e.g. BayFlow#2026)';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().regex(passwordRegex, passwordMessage),
  name: z.string().optional(),
  phoneNumber: z.string().optional().or(z.literal('')).transform(val => (val ? val.trim() : undefined)),
  role: z.enum(['CUSTOMER', 'OWNER']).default('CUSTOMER'),
  shopName: z.string().optional().or(z.literal('')).transform(val => (val ? val.trim() : undefined))
}).refine(data => {
  if (data.role === 'OWNER' && !data.shopName) {
    return false;
  }
  return true;
}, { message: "Shop / Garage name is required for Shop Owners", path: ["shopName"] });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain numbers only')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain numbers only'),
  newPassword: z.string().regex(passwordRegex, passwordMessage)
});

