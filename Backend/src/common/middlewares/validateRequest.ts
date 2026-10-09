import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      const firstErrorMessage = error.errors && error.errors.length > 0 ? error.errors[0].message : 'Validation failed';
      res.status(400).json({
        success: false,
        message: firstErrorMessage,
        errors: error.errors
      });
    }
  };
};

