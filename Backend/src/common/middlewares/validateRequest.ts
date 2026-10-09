import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({ success: false, errors: error.errors });
    }
  };
};
