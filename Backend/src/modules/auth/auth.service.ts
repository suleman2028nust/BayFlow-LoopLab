import { prisma } from '../../config/prisma';
import { redis } from '../../config/redis';
import { sendOTPEmail, sendPasswordResetEmail } from '../../config/brevo';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const AuthService = {
  async register(data: any) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(data.password, 12);
    
    const result = await prisma.$transaction(async (tx) => {
      let shopId = null;
      let createdShop = null;
      if (data.role === 'OWNER' && data.shopName) {
        createdShop = await tx.shop.create({
          data: {
            name: data.shopName,
            phone: data.phoneNumber || null,
            city: data.city || 'Lahore',
            address: data.address || 'Main Workshop Area',
            workingHours: {
              open: '09:00',
              close: '18:00',
              slotDurationMinutes: 60,
              daysOpen: [1, 2, 3, 4, 5, 6]
            }
          }
        });
        shopId = createdShop.id;
      }
      
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          phoneNumber: data.phoneNumber,
          role: data.role,
          shopId
        }
      });

      if (createdShop) {
        await tx.shop.update({
          where: { id: createdShop.id },
          data: { ownerId: user.id }
        });

        // Auto-seed default services for immediate booking availability
        await tx.service.createMany({
          data: [
            { shopId: createdShop.id, name: 'Oil Change & Filter', durationMinutes: 30, basePrice: 5200 },
            { shopId: createdShop.id, name: 'Check Engine Light OBD-II Scan', durationMinutes: 45, basePrice: 2500 },
            { shopId: createdShop.id, name: 'Brake Pad & Rotor Overhaul', durationMinutes: 60, basePrice: 8500 },
            { shopId: createdShop.id, name: 'AC Gas Refill & Leak Inspection', durationMinutes: 40, basePrice: 4000 },
            { shopId: createdShop.id, name: 'Suspension & Wheel Alignment', durationMinutes: 60, basePrice: 3500 },
          ]
        });

        // Auto-seed initial inventory catalog (with Ignition Coil at 0 stock for PO demonstration)
        await tx.inventory.createMany({
          data: [
            { shopId: createdShop.id, sku: 'PART-001', name: 'Ignition Coil OEM', quantity: 0, unitPrice: 6500, reorderLevel: 2 },
            { shopId: createdShop.id, sku: 'PART-002', name: 'Oil Filter (Honda OEM)', quantity: 12, unitPrice: 900, reorderLevel: 5 },
            { shopId: createdShop.id, sku: 'PART-003', name: 'Engine Oil 4L Full Synthetic', quantity: 20, unitPrice: 5200, reorderLevel: 5 },
            { shopId: createdShop.id, sku: 'PART-004', name: 'Ceramic Brake Pads Set', quantity: 8, unitPrice: 4500, reorderLevel: 3 },
            { shopId: createdShop.id, sku: 'PART-005', name: 'Iridium Spark Plugs Set', quantity: 15, unitPrice: 3800, reorderLevel: 4 },
          ]
        });
      }

      return user;
    });

    const otp = generateOTP();
    await redis.set(`otp:${result.email}`, otp, { ex: 300 }); // 5 mins TTL

    console.log('\n======================================================');
    console.log(`🔑 [BAYFLOW OTP CODE GENERATED]`);
    console.log(`   Target Email : ${result.email}`);
    console.log(`   Target Phone : ${result.phoneNumber || '(None provided in signup form)'}`);
    console.log(`   OTP Code     : ${otp}`);
    console.log(`   Expires In   : 5 Minutes`);
    console.log('======================================================\n');
    
    // 1. Send via Brevo REST API Email
    sendOTPEmail(result.email, otp, data.name || 'User').catch((err) => {
      console.error('⚠️ [Brevo Email Error]:', err.message || err);
    });

    // 2. Send via WhatsApp if phone number provided
    if (result.phoneNumber) {
      console.log(`📲 [Auth] Dispatching WhatsApp OTP to ${result.phoneNumber}...`);
      WhatsAppService.sendMessage(
        result.phoneNumber,
        `Your BayFlow verification code is: ${otp}. Valid for 5 minutes.`
      ).catch((err) => {
        console.error('⚠️ [WhatsApp Dispatch Error]:', err.message || err);
      });
    } else {
      console.log(`ℹ️ [Auth] No phone number provided for ${result.email} — WhatsApp OTP skipped.`);
    }
    
    return {
      message: 'Registration successful. Please verify your email.',
      email: result.email
    };
  },

  async verifyOtp(data: any) {
    const storedOtp = await redis.get(`otp:${data.email}`);
    if (!storedOtp || String(storedOtp).trim() !== String(data.otp).trim()) {
      throw new Error('Invalid or expired OTP');
    }

    const user = await prisma.user.update({
      where: { email: data.email },
      data: { isVerified: true }
    });

    await redis.del(`otp:${data.email}`);

    // Send Welcome WhatsApp Message if phone exists
    if (user.phoneNumber) {
      WhatsAppService.sendMessage(
        user.phoneNumber,
        `Welcome to BayFlow! 🎉 Your account is verified and ready to use.`
      ).catch(console.error);
    }

    return this.generateTokens(user);
  },

  async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Please verify your email first');

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    return this.generateTokens(user);
  },

  async generateTokens(user: any) {
    const accessExpiresIn = (process.env.JWT_EXPIRES_IN || '15m') as any;
    const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any;

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, shopId: user.shopId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: accessExpiresIn }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: refreshExpiresIn }
    );

    await redis.set(`session:${user.id}`, refreshToken, { ex: 7 * 24 * 60 * 60 });
    return { accessToken, refreshToken };
  },
  
  async logout(userId: string) {
    await redis.del(`session:${userId}`);
    return { message: 'Logged out successfully' };
  },

  async forgotPassword(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('User not found');

    const otp = generateOTP();
    await redis.set(`pwd_otp:${user.email}`, otp, { ex: 300 }); // 5 mins TTL

    console.log('\n======================================================');
    console.log(`🔑 [BAYFLOW PASSWORD RESET OTP GENERATED]`);
    console.log(`   Target Email : ${user.email}`);
    console.log(`   OTP Code     : ${otp}`);
    console.log(`   Expires In   : 5 Minutes`);
    console.log('======================================================\n');

    // 1. Send via Brevo REST API Email
    sendPasswordResetEmail(user.email, otp, 'User').catch((err) => {
      console.error('⚠️ [Brevo Email Error]:', err.message || err);
    });

    // 2. Send via WhatsApp if user has phone
    if (user.phoneNumber) {
      WhatsAppService.sendMessage(
        user.phoneNumber,
        `Your BayFlow password reset code is: ${otp}. Valid for 5 minutes.`
      ).catch((err) => {
        console.error('⚠️ [WhatsApp Dispatch Error]:', err.message || err);
      });
    }

    return {
      message: 'Password reset OTP sent to email'
    };
  },

  async resetPassword(data: any) {
    const storedOtp = await redis.get(`pwd_otp:${data.email}`);
    if (!storedOtp || String(storedOtp).trim() !== String(data.otp).trim()) {
      throw new Error('Invalid or expired OTP');
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { email: data.email },
      data: { passwordHash }
    });

    await redis.del(`pwd_otp:${data.email}`);
    return { message: 'Password reset successfully' };
  }
};
