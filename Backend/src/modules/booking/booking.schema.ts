import { z } from 'zod';

export const createBookingSchema = z.object({
  shopId: z.string().uuid(),
  serviceId: z.string().optional().nullable(),
  slotTime: z.string().min(1),
  vehicleDetails: z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(1900).max(2100),
    plate: z.string().min(1),
    color: z.string().optional(),
    mileage: z.string().optional()
  }),
  issuesReported: z.array(z.string()).min(1, 'Please report at least one issue'),
  notes: z.string().optional(),
  customerInfo: z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(4),
    phoneNumber: z.string().optional()
  }).optional()
});

export const updateStatusSchema = z.object({
  status: z.string(),
  notes: z.string().optional()
});
