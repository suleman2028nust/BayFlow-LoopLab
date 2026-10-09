import { z } from 'zod';

export const createBookingSchema = z.object({
  shopId: z.string().uuid(),
  serviceId: z.string().optional(),
  slotTime: z.string().datetime(), // ISO 8601 string
  vehicleDetails: z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(1900).max(2100),
    plate: z.string().min(1)
  }),
  issuesReported: z.array(z.string()).min(1, 'Please report at least one issue')
});

export const updateStatusSchema = z.object({
  status: z.string(),
  notes: z.string().optional()
});
