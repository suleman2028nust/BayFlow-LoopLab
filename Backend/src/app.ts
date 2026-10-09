import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.route';
import bookingRoutes from './modules/booking/booking.route';
import whatsappRoutes from './modules/whatsapp/whatsapp.route';
import shopRoutes from './modules/shop/shop.route';
import notificationRoutes from './modules/notification/notification.route';
import callRoutes from './modules/call/call.route';
import { globalErrorHandler } from './common/middlewares/errorHandler';
import { rateLimiter } from './common/middlewares/rateLimiter';
import { setupSwagger } from './config/swagger';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(rateLimiter); // Global rate limiter

// Setup Swagger Documentation
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calls', callRoutes);

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
