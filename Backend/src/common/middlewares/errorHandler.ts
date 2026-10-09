import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
};
