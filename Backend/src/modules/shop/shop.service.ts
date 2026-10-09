import { prisma } from '../../config/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export const ShopService = {
  // Owner adds a new staff member to their shop
  async addStaffMember(data: { shopId: string; email: string; name?: string; role: Role; password?: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // Generate random password if not provided
    const rawPassword = data.password || Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(rawPassword, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        shopId: data.shopId,
        isVerified: true, // Staff added by owner are pre-verified
      }
    });

    return { user, rawPassword };
  }
};
