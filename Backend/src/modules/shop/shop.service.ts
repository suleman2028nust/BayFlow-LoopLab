import { prisma } from '../../config/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export const ShopService = {
  // 1. Owner creates a new shop
  async createShop(ownerId: string, data: { name: string; address?: string; city?: string; phone?: string; timezone?: string; workingHours?: any }) {
    let shopPhone = data.phone?.trim();
    if (!shopPhone) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (owner?.phoneNumber) {
        shopPhone = owner.phoneNumber;
      }
    }

    const shop = await prisma.shop.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        phone: shopPhone || null,
        timezone: data.timezone || 'Asia/Karachi',
        ownerId,
        workingHours: data.workingHours || {
          open: '09:00',
          close: '18:00',
          slotDurationMinutes: 60,
          daysOpen: [1, 2, 3, 4, 5, 6] // Mon-Sat
        }
      }
    });

    // Update user's shopId if not set
    await prisma.user.update({
      where: { id: ownerId },
      data: { shopId: shop.id }
    });

    return shop;
  },

  // 2. Public: list all shops for discovery
  async listAllShops() {
    return prisma.shop.findMany({
      include: {
        services: true,
        users: {
          select: { id: true, email: true, phoneNumber: true, role: true }
        },
        _count: {
          select: { bookings: true, users: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  // 3. Shop details with services and working hours
  async getShopById(shopId: string) {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        services: true,
        users: {
          select: { id: true, email: true, phoneNumber: true, role: true, isVerified: true, createdAt: true }
        }
      }
    });
    if (!shop) throw new Error('Shop not found');
    return shop;
  },

  // 4. Owner updates shop details
  async updateShop(shopId: string, user: any, data: { name?: string; address?: string; city?: string; phone?: string; timezone?: string; workingHours?: any }) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new Error('Shop not found');

    if (user.role !== 'OWNER' || (shop.ownerId && shop.ownerId !== user.userId && user.shopId !== shopId)) {
      throw new Error('Unauthorized to update this shop');
    }

    return prisma.shop.update({
      where: { id: shopId },
      data
    });
  },

  // 5. Owner adds a new staff member to their shop
  async addStaffMember(data: { shopId: string; email: string; name?: string; role: Role; password?: string; phoneNumber?: string }) {
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
        phoneNumber: data.phoneNumber,
        passwordHash,
        role: data.role,
        shopId: data.shopId,
        isVerified: true, // Staff added by owner are pre-verified
      }
    });

    return { user, rawPassword };
  },

  // 6. List staff team members of a shop
  async getShopTeam(shopId: string) {
    return prisma.user.findMany({
      where: {
        shopId,
        role: { not: 'CUSTOMER' }
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // 7. Remove/deactivate staff member
  async removeStaffMember(shopId: string, userId: string, requester: any) {
    const userToRemove = await prisma.user.findUnique({ where: { id: userId } });
    if (!userToRemove || userToRemove.shopId !== shopId) {
      throw new Error('Staff member not found in this shop.');
    }

    if (userToRemove.id === requester.userId) {
      throw new Error('Cannot remove yourself from the shop.');
    }

    // Remove shop association and revoke staff role
    return prisma.user.update({
      where: { id: userId },
      data: {
        shopId: null,
        role: 'CUSTOMER'
      }
    });
  },

  // 8. Slot System: Calculate available slots for date
  async getAvailableSlots(shopId: string, dateStr: string) {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new Error('Shop not found');

    const config = (shop.workingHours as any) || {
      open: '09:00',
      close: '18:00',
      slotDurationMinutes: 60,
      daysOpen: [1, 2, 3, 4, 5, 6]
    };

    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const dayOfWeek = targetDate.getUTCDay(); // 0 = Sun, 1 = Mon ...
    const isDayOpen = config.daysOpen ? config.daysOpen.includes(dayOfWeek) : true;

    if (!isDayOpen) {
      return {
        date: dateStr,
        isOpen: false,
        message: 'Shop is closed on this day of the week',
        slots: []
      };
    }

    // Parse open and close times
    const [openHour, openMin] = (config.open || '09:00').split(':').map(Number);
    const [closeHour, closeMin] = (config.close || '18:00').split(':').map(Number);
    const duration = config.slotDurationMinutes || 60;

    // Fetch existing bookings for this shop on this date
    const dayStart = new Date(dateStr);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dateStr);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const bookedSlots = await prisma.booking.findMany({
      where: {
        shopId,
        slotTime: { gte: dayStart, lte: dayEnd },
        status: { not: 'CANCELLED' }
      },
      select: { slotTime: true }
    });

    const bookedTimes = new Set(
      bookedSlots.map(b => b.slotTime.toISOString())
    );

    // Generate slots
    const slots = [];
    let currentMin = openHour * 60 + openMin;
    const endMin = closeHour * 60 + closeMin;

    while (currentMin + duration <= endMin) {
      const h = Math.floor(currentMin / 60);
      const m = currentMin % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

      const slotDate = new Date(dateStr);
      slotDate.setUTCHours(h, m, 0, 0);
      const slotIso = slotDate.toISOString();

      const isAvailable = !bookedTimes.has(slotIso);

      slots.push({
        time: timeStr,
        slotTime: slotIso,
        available: isAvailable
      });

      currentMin += duration;
    }

    return {
      date: dateStr,
      isOpen: true,
      shopTimezone: shop.timezone,
      slots
    };
  },

  // 9. Service Catalog CRUD
  async listServices(shopId: string) {
    return prisma.service.findMany({
      where: { shopId },
      orderBy: { name: 'asc' }
    });
  },

  async addService(shopId: string, data: { name: string; description?: string; durationMinutes?: number; basePrice?: number }) {
    return prisma.service.create({
      data: {
        shopId,
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes || 60,
        basePrice: data.basePrice || 0
      }
    });
  },

  async updateService(shopId: string, serviceId: string, data: { name?: string; description?: string; durationMinutes?: number; basePrice?: number }) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || service.shopId !== shopId) {
      throw new Error('Service not found in this shop.');
    }

    return prisma.service.update({
      where: { id: serviceId },
      data
    });
  },

  async deleteService(shopId: string, serviceId: string) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || service.shopId !== shopId) {
      throw new Error('Service not found in this shop.');
    }

    return prisma.service.delete({ where: { id: serviceId } });
  },

  // 10. Owner Analytics Overview (Brief §7.4 & §8.3)
  async getShopAnalytics(shopId: string) {
    const [
      totalBookings,
      bookingsByStatus,
      completedBookings,
      inventoryItems,
      qcIssuesCount,
      staffMembers,
    ] = await Promise.all([
      prisma.booking.count({ where: { shopId } }),
      prisma.booking.groupBy({
        by: ['status'],
        where: { shopId },
        _count: { status: true },
      }),
      prisma.booking.findMany({
        where: {
          shopId,
          status: { in: ['COMPLETED', 'READY_FOR_PICKUP', 'ESTIMATE_APPROVED', 'IN_REPAIR'] },
          estimateTotal: { not: null },
        },
        select: { estimateTotal: true },
      }),
      prisma.inventory.findMany({
        where: { shopId },
        select: { id: true, quantity: true, reorderLevel: true, unitPrice: true },
      }),
      prisma.qCIssue.count({
        where: { booking: { shopId } },
      }),
      prisma.user.groupBy({
        by: ['role'],
        where: { shopId },
        _count: { role: true },
      }),
    ]);

    // Status map
    const statusCounts: Record<string, number> = {};
    bookingsByStatus.forEach((b) => {
      statusCounts[b.status] = b._count.status;
    });

    // Total Revenue (PKR)
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.estimateTotal || 0), 0);

    // Active in-progress repairs
    const activeJobs = (statusCounts['INSPECTING'] || 0) + 
      (statusCounts['ESTIMATE_REVIEW'] || 0) + 
      (statusCounts['PARTS_PENDING'] || 0) + 
      (statusCounts['PARTS_ORDERED'] || 0) + 
      (statusCounts['PARTS_READY'] || 0) + 
      (statusCounts['IN_REPAIR'] || 0) + 
      (statusCounts['QC_PENDING'] || 0) + 
      (statusCounts['QC_IN_PROGRESS'] || 0);

    // Inventory metrics
    const lowStockItems = inventoryItems.filter((i) => i.quantity <= i.reorderLevel);
    const totalInventoryValue = inventoryItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

    // QC Fail metrics
    const completedCount = statusCounts['COMPLETED'] || 0;
    const qcTestedCount = completedCount + qcIssuesCount;
    const qcPassRate = qcTestedCount > 0 ? Number(((completedCount / qcTestedCount) * 100).toFixed(1)) : 100;
    const qcFailRate = qcTestedCount > 0 ? Number(((qcIssuesCount / qcTestedCount) * 100).toFixed(1)) : 0;

    return {
      shopId,
      summary: {
        totalBookings,
        activeJobs,
        completedBookings: completedCount,
        totalRevenuePKR: totalRevenue,
      },
      statusDistribution: statusCounts,
      inventorySummary: {
        totalCatalogItems: inventoryItems.length,
        lowStockCount: lowStockItems.length,
        totalValuationPKR: totalInventoryValue,
      },
      qualityControl: {
        totalQcIssuesLogged: qcIssuesCount,
        qcPassRatePercent: qcPassRate,
        qcFailRatePercent: qcFailRate,
      },
      staffBreakdown: staffMembers.map((s) => ({ role: s.role, count: s._count.role })),
    };
  },
};

