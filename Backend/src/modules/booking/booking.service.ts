import { prisma } from '../../config/prisma';
import { redis } from '../../config/redis';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { sendEmail } from '../../config/brevo';
import { NotificationService } from '../notification/notification.service';

// The Strict State Machine Rules
export const BOOKING_MACHINE: any = {
  PENDING: { next: ['CONFIRMED', 'CANCELLED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR', 'CUSTOMER'] },
  CONFIRMED: { next: ['ASSIGNED', 'CANCELLED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR', 'CUSTOMER'] },
  ASSIGNED: { next: ['INSPECTING', 'CANCELLED'], allowedRoles: ['TECHNICIAN', 'SERVICE_ADVISOR', 'OWNER'] },
  INSPECTING: { next: ['ESTIMATE_REVIEW'], allowedRoles: ['TECHNICIAN'] },
  ESTIMATE_REVIEW: { next: ['AWAITING_CUSTOMER', 'CANCELLED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] },
  AWAITING_CUSTOMER: { next: ['ESTIMATE_APPROVED', 'ESTIMATE_REJECTED', 'CANCELLED'], allowedRoles: ['CUSTOMER', 'OWNER', 'SERVICE_ADVISOR'] },
  ESTIMATE_REJECTED: { next: ['ESTIMATE_REVIEW', 'CANCELLED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR', 'CUSTOMER'] },
  ESTIMATE_APPROVED: { next: ['PARTS_PENDING', 'PARTS_READY', 'IN_REPAIR', 'CANCELLED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] },
  PARTS_PENDING: { next: ['PARTS_ORDERED', 'PARTS_READY', 'CANCELLED'], allowedRoles: ['PARTS_PERSON', 'SERVICE_ADVISOR', 'OWNER'] },
  PARTS_ORDERED: { next: ['PARTS_READY', 'CANCELLED'], allowedRoles: ['PARTS_PERSON', 'SERVICE_ADVISOR', 'OWNER'] },
  PARTS_READY: { next: ['IN_REPAIR'], allowedRoles: ['PARTS_PERSON', 'TECHNICIAN', 'SERVICE_ADVISOR', 'OWNER'] },
  IN_REPAIR: { next: ['QC_PENDING'], allowedRoles: ['TECHNICIAN', 'SERVICE_ADVISOR', 'OWNER'] },
  QC_PENDING: { next: ['QC_IN_PROGRESS'], allowedRoles: ['QC_INSPECTOR', 'SERVICE_ADVISOR', 'OWNER'] },
  QC_IN_PROGRESS: { next: ['READY_FOR_PICKUP', 'IN_REPAIR'], allowedRoles: ['QC_INSPECTOR'] },
  READY_FOR_PICKUP: { next: ['COMPLETED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] },
  COMPLETED: { next: [], allowedRoles: [] },
  CANCELLED: { next: [], allowedRoles: [] }
};

// Helper: Notify Shop Staff (SA, Tech, Parts, QC, Owner) via In-App, WhatsApp, Email
async function notifyShopStaff(shopId: string, roles: string[], message: string, subject: string = 'BayFlow Staff Alert', type: string = 'STAFF_ALERT', link?: string) {
  try {
    const staffMembers = await prisma.user.findMany({
      where: {
        shopId,
        role: { in: roles as any }
      }
    });

    for (const staff of staffMembers) {
      // 1. In-App Notification (Bell Icon)
      NotificationService.createNotification({
        userId: staff.id,
        title: subject,
        message,
        type,
        link
      }).catch(console.error);

      // 2. WhatsApp Notification
      if (staff.phoneNumber) {
        WhatsAppService.sendMessage(staff.phoneNumber, message).catch(console.error);
      }
      
      // 3. Email Notification
      if (staff.email) {
        sendEmail(staff.email, subject, message).catch(console.error);
      }
    }
  } catch (err) {
    console.error('Staff notification error:', err);
  }
}


export const BookingService = {
  // 1. Customer creates a booking
  async createBooking(data: any, customerId: string) {
    const lockKey = `lock:slot:${data.shopId}:${new Date(data.slotTime).toISOString()}`;
    
    // DISTRIBUTED LOCK: Prevent race conditions (2 customers booking exact same ms)
    const acquired = await redis.set(lockKey, 'locked', { px: 5000, nx: true });
    if (!acquired) {
      throw new Error('This slot is currently being booked by someone else. Please try again.');
    }

    try {
      // Database level verification
      const existing = await prisma.booking.findUnique({
        where: {
          shopId_slotTime: {
            shopId: data.shopId,
            slotTime: new Date(data.slotTime)
          }
        }
      });
      if (existing && existing.status !== 'CANCELLED') {
        throw new Error('This time slot is no longer available.');
      }

      const booking = await prisma.booking.create({
        data: {
          shopId: data.shopId,
          customerId,
          slotTime: new Date(data.slotTime),
          vehicleDetails: data.vehicleDetails,
          issuesReported: data.issuesReported || [],
          serviceId: data.serviceId || null,
          status: 'PENDING'
        },
        include: {
          shop: true,
          customer: true,
          service: true
        }
      });

      // Audit Trail
      await prisma.bookingHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: 'PENDING',
          toStatus: 'PENDING',
          userId: customerId,
          notes: 'Booking created by customer'
        }
      });

      // Staff Notification: Notify Service Advisors & Owner
      const carName = (booking.vehicleDetails as any)?.make || 'Vehicle';
      notifyShopStaff(
        data.shopId,
        ['SERVICE_ADVISOR', 'OWNER'],
        `🔔 [New Booking Alert] Customer booked a slot for ${carName} on ${new Date(data.slotTime).toLocaleString()}. Booking ID: ${booking.id}`,
        'New Booking Received - BayFlow'
      );

      return booking;
    } finally {
      // ALWAYS release the lock
      await redis.del(lockKey);
    }
  },

  // 2. Role-scoped list of bookings
  async getBookings(user: any, filters?: { status?: string; shopId?: string; date?: string }) {
    const where: any = {};

    if (user.role === 'CUSTOMER') {
      where.customerId = user.userId;
    } else if (user.role === 'TECHNICIAN') {
      // Tech sees jobs assigned to them or unassigned jobs in their shop
      where.OR = [
        { assignedTechId: user.userId },
        { shopId: user.shopId, status: 'CONFIRMED' }
      ];
    } else if (user.role === 'PARTS_PERSON') {
      where.shopId = user.shopId || filters?.shopId;
    } else if (user.role === 'QC_INSPECTOR') {
      where.shopId = user.shopId || filters?.shopId;
    } else {
      // OWNER / SERVICE_ADVISOR
      const targetShopId = filters?.shopId || user.shopId;
      if (targetShopId) {
        where.shopId = targetShopId;
      }
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.date) {
      const start = new Date(filters.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filters.date);
      end.setHours(23, 59, 59, 999);
      where.slotTime = { gte: start, lte: end };
    }

    return prisma.booking.findMany({
      where,
      include: {
        customer: { select: { id: true, email: true, phoneNumber: true } },
        technician: { select: { id: true, email: true, phoneNumber: true } },
        shop: { select: { id: true, name: true, phone: true } },
        service: true,
        estimate: true,
        partsAllocated: { include: { inventory: true } },
        qcIssues: true
      },
      orderBy: { slotTime: 'asc' }
    });
  },

  // 3. Single booking with full details
  async getBookingById(bookingId: string, user: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: { select: { id: true, email: true, phoneNumber: true } },
        technician: { select: { id: true, email: true, phoneNumber: true } },
        shop: true,
        service: true,
        estimate: true,
        partsAllocated: { include: { inventory: true } },
        qcIssues: true,
        history: { orderBy: { timestamp: 'asc' } }
      }
    });

    if (!booking) throw new Error('Booking not found');

    // Access control
    if (user.role === 'CUSTOMER' && booking.customerId !== user.userId) {
      throw new Error('Access denied: You can only view your own bookings');
    }
    if (user.role !== 'CUSTOMER' && user.shopId && booking.shopId !== user.shopId) {
      throw new Error('Access denied: You can only view bookings for your shop');
    }

    return booking;
  },

  // 4. Booking audit trail / history
  async getBookingHistory(bookingId: string, user: any) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error('Booking not found');

    if (user.role === 'CUSTOMER' && booking.customerId !== user.userId) {
      throw new Error('Access denied');
    }
    if (user.role !== 'CUSTOMER' && user.shopId && booking.shopId !== user.shopId) {
      throw new Error('Access denied');
    }

    return prisma.bookingHistory.findMany({
      where: { bookingId },
      orderBy: { timestamp: 'asc' }
    });
  },

  // 5. Assign Technician to booking
  async assignTechnician(bookingId: string, techId: string, user: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true }
    });
    if (!booking) throw new Error('Booking not found');

    const tech = await prisma.user.findUnique({ where: { id: techId } });
    if (!tech || tech.role !== 'TECHNICIAN' || tech.shopId !== booking.shopId) {
      throw new Error('Invalid technician selected for this shop');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        assignedTechId: techId,
        status: 'ASSIGNED'
      },
      include: { customer: true, technician: true }
    });

    await prisma.bookingHistory.create({
      data: {
        bookingId,
        fromStatus: booking.status,
        toStatus: 'ASSIGNED',
        userId: user.userId,
        notes: `Assigned to technician ${tech.email}`
      }
    });

    // Notify assigned technician
    const carName = (booking.vehicleDetails as any)?.make || 'Vehicle';
    NotificationService.createNotification({
      userId: tech.id,
      title: 'Job Assigned to You',
      message: `You have been assigned job #${booking.id} (${carName}). Please proceed with inspection.`,
      type: 'JOB_ASSIGNED',
      link: '/dashboard/technician'
    }).catch(console.error);

    if (tech.phoneNumber) {
      WhatsAppService.sendMessage(tech.phoneNumber, `🔧 [BayFlow Job Assigned] You have been assigned job #${booking.id} (${carName}). Please proceed with inspection.`).catch(console.error);
    }
    if (tech.email) {
      sendEmail(tech.email, 'Job Assigned to You', `You have been assigned to repair ${carName}. Booking ID: ${booking.id}`).catch(console.error);
    }

    return updatedBooking;
  },

  // 6. Update status (State Machine + Concurrency Lock + Parts Release on Cancel)
  async updateStatus(bookingId: string, newStatus: string, user: any, notes?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { partsAllocated: true }
    });
    if (!booking) throw new Error('Booking not found');

    const currentState = BOOKING_MACHINE[booking.status];
    if (!currentState) {
      throw new Error(`Current state ${booking.status} is not recognized in state machine`);
    }
    
    // 1. Check if the transition is allowed
    if (!currentState.next.includes(newStatus)) {
      throw new Error(`Invalid state transition from ${booking.status} to ${newStatus}`);
    }

    // 2. Role authorization check
    if (!currentState.allowedRoles.includes(user.role)) {
      throw new Error(`Security Violation: A ${user.role} cannot move a booking from ${booking.status}.`);
    }

    // 3. Strict Ownership Checks
    if (user.role === 'TECHNICIAN' && booking.assignedTechId !== user.userId) {
      throw new Error('You can only update bookings assigned directly to you.');
    }
    if (user.role === 'CUSTOMER' && booking.customerId !== user.userId) {
      throw new Error('You can only update your own bookings.');
    }

    // 4. QC Concurrent Pick Lock: Ensure only 1 inspector can pick QC_IN_PROGRESS at once
    let qcLockKey: string | null = null;
    if (newStatus === 'QC_IN_PROGRESS') {
      qcLockKey = `lock:qc:${bookingId}`;
      const locked = await redis.set(qcLockKey, user.userId, { px: 15000, nx: true });
      if (!locked) {
        throw new Error('Concurrent Pick Lock: Another QC Inspector is currently picking or inspecting this vehicle.');
      }
    }

    try {
      return await prisma.$transaction(async (tx) => {
        // CANCELLATION LOGIC: Release reserved parts back to inventory
        if (newStatus === 'CANCELLED' && booking.partsAllocated.length > 0) {
          for (const allocatedPart of booking.partsAllocated) {
            await tx.inventory.update({
              where: { id: allocatedPart.inventoryId },
              data: {
                quantity: { increment: allocatedPart.quantity }
              }
            });
          }
        }

        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: { status: newStatus as any },
          include: { customer: true, shop: true, technician: true }
        });

        await tx.bookingHistory.create({
          data: {
            bookingId,
            fromStatus: booking.status,
            toStatus: newStatus as any,
            userId: user.userId,
            notes: notes || (newStatus === 'CANCELLED' && booking.partsAllocated.length > 0 ? 'Booking cancelled. Reserved parts released to stock.' : null)
          }
        });

        // Customer Notifications
        let msg = '';
        let subject = 'BayFlow Booking Update';
        const carName = (updatedBooking.vehicleDetails as any)?.make || 'your car';

        switch(newStatus) {
          case 'CONFIRMED': 
            msg = `🚗 BayFlow: Your booking request for ${carName} has been Accepted! We are waiting for you.`; 
            break;
          case 'ASSIGNED':
            msg = `🔧 BayFlow: A technician has been assigned to ${carName}.`;
            break;
          case 'INSPECTING': 
            msg = `🔍 BayFlow: Our technician is currently inspecting ${carName}. We will share the estimate shortly.`; 
            break;
          case 'AWAITING_CUSTOMER': 
          case 'ESTIMATE_REVIEW': 
            msg = `📝 BayFlow: The inspection is complete! The estimated bill is PKR ${updatedBooking.estimateTotal || '...'} Please check your portal to approve it.`; 
            subject = 'Action Required: Repair Estimate Ready';
            break;
          case 'ESTIMATE_APPROVED':
            msg = `✅ BayFlow: Thank you! Estimate approved. We are arranging the parts.`;
            // Staff notification: Notify Parts Person
            notifyShopStaff(updatedBooking.shopId, ['PARTS_PERSON'], `📦 [Estimate Approved] Booking #${bookingId} approved. Prepare/order required parts.`, 'Parts Preparation Required', 'PARTS_PENDING');
            break;
          case 'PARTS_READY':
            msg = `⚙️ BayFlow: All replacement parts for ${carName} are ready. Repair is commencing.`;
            if (updatedBooking.technician?.phoneNumber) {
              WhatsAppService.sendMessage(updatedBooking.technician.phoneNumber, `📦 [Parts Ready] Parts for booking #${bookingId} (${carName}) are ready. You can begin repair.`).catch(console.error);
            }
            if (updatedBooking.assignedTechId) {
              NotificationService.createNotification({
                userId: updatedBooking.assignedTechId,
                title: 'Parts Ready for Repair',
                message: `Parts for booking #${bookingId} (${carName}) are allocated. You can proceed with repair.`,
                type: 'PARTS_READY',
                link: '/dashboard/technician'
              }).catch(console.error);
            }
            break;
          case 'IN_REPAIR': 
            msg = `⚙️ BayFlow: Good news! The repair work has officially started on ${carName}.`; 
            break;
          case 'QC_PENDING':
            // Staff notification: Notify QC Inspectors
            notifyShopStaff(updatedBooking.shopId, ['QC_INSPECTOR'], `🔍 [QC Required] Booking #${bookingId} (${carName}) is ready for Quality Check inspection.`, 'QC Inspection Pending', 'QC_PENDING');
            break;
          case 'QC_IN_PROGRESS':
            msg = `🕵️‍♂️ BayFlow: The repair is done! Our inspector is now performing a final Quality Check (QC).`;
            break;
          case 'READY_FOR_PICKUP': 
            msg = `🎉 BayFlow: Great news! ${carName} is 100% Ready for Pickup!`; 
            subject = 'Your Car is Ready!';
            break;
          case 'COMPLETED':
            msg = `🤝 BayFlow: Thank you for choosing us! Have a safe drive.`;
            break;
          case 'CANCELLED':
            msg = `❌ BayFlow: Your booking for ${carName} has been cancelled.`;
            subject = 'Booking Cancelled';
            break;
        }
        
        if (msg) {
          // In-App Notification for Customer
          NotificationService.createNotification({
            userId: updatedBooking.customerId,
            title: subject,
            message: msg,
            type: newStatus,
            link: `/customer/bookings/${bookingId}`
          }).catch(console.error);

          if (updatedBooking.customer.phoneNumber) {
            WhatsAppService.sendMessage(updatedBooking.customer.phoneNumber, msg).catch(console.error);
          }
          if (updatedBooking.customer.email) {
            sendEmail(updatedBooking.customer.email, subject, msg).catch(console.error);
          }
        }

        return updatedBooking;
      });
    } finally {
      if (qcLockKey) {
        await redis.del(qcLockKey);
      }
    }
  },

  // 7. Add or Revise Estimate (Parts + Labour)
  async addEstimate(bookingId: string, data: { labourCost: number; partsCost: number; notes?: string }, user: { userId: string; role: string }) {
    const totalCost = data.labourCost + data.partsCost;
    
    const estimate = await prisma.estimate.upsert({
      where: { bookingId },
      create: {
        bookingId,
        labourCost: data.labourCost,
        partsCost: data.partsCost,
        totalCost: totalCost,
        notes: data.notes,
        status: 'PENDING'
      },
      update: {
        labourCost: data.labourCost,
        partsCost: data.partsCost,
        totalCost: totalCost,
        notes: data.notes,
        status: 'PENDING'
      }
    });

    // Update Booking total
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { estimateTotal: totalCost }
    });

    // Notify Service Advisor
    notifyShopStaff(
      booking.shopId,
      ['SERVICE_ADVISOR', 'OWNER'],
      `📝 [Estimate Submitted] Technician submitted estimate for booking #${bookingId}: PKR ${totalCost}. Please review.`,
      'Estimate Submitted for Review',
      'ESTIMATE_REVIEW'
    );

    // Auto-transition to ESTIMATE_REVIEW
    await this.updateStatus(bookingId, 'ESTIMATE_REVIEW', user, 'Estimate submitted / revised');

    return estimate;
  },

  // 8. Customer Approves or Rejects Estimate
  async respondToEstimate(bookingId: string, status: 'APPROVED' | 'REJECTED', customerId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.customerId !== customerId) throw new Error('Unauthorized');

    await prisma.estimate.update({
      where: { bookingId },
      data: { status }
    });

    const nextStatus = status === 'APPROVED' ? 'ESTIMATE_APPROVED' : 'ESTIMATE_REJECTED';
    await this.updateStatus(bookingId, nextStatus, { userId: customerId, role: 'CUSTOMER' }, `Estimate ${status.toLowerCase()}`);
    
    // Notify Service Advisor of customer response
    notifyShopStaff(
      booking.shopId,
      ['SERVICE_ADVISOR', 'OWNER'],
      `📢 [Customer Decision] Customer has ${status} the estimate for booking #${bookingId}.`,
      `Customer ${status} Estimate`,
      nextStatus
    );

    return true;
  },

  // 9. QC Inspector logs a failure issue
  async addQCIssue(bookingId: string, description: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error('Booking not found');

    const issue = await prisma.qCIssue.create({
      data: {
        bookingId,
        description
      }
    });

    // In-app alert for technician
    if (booking.assignedTechId) {
      NotificationService.createNotification({
        userId: booking.assignedTechId,
        title: 'QC Inspection Failed',
        message: `QC Inspector flagged a defect on job #${bookingId}: "${description}". Vehicle returned to repair.`,
        type: 'QC_FAILED',
        link: '/dashboard/technician'
      }).catch(console.error);
    }

    // Send car back to technician
    await this.updateStatus(bookingId, 'IN_REPAIR', { userId: 'SYSTEM', role: 'QC_INSPECTOR' }, `QC Failed: ${description}`);
    return issue;
  },

  // 10. Vehicle Service History (Brief §8.3)
  async getVehicleHistory(plate: string) {
    const normalizedPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    const allBookings = await prisma.booking.findMany({
      include: {
        shop: { select: { id: true, name: true, city: true, phone: true } },
        service: true,
        estimate: true,
        partsAllocated: { include: { inventory: true } },
        qcIssues: true,
        history: { orderBy: { timestamp: 'asc' } },
        technician: { select: { id: true, email: true, phoneNumber: true } },
        customer: { select: { id: true, email: true, phoneNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const matched = allBookings.filter((b: any) => {
      const v = b.vehicleDetails as any;
      if (!v || !v.plate) return false;
      return v.plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === normalizedPlate;
    });

    return {
      plate: plate.toUpperCase(),
      totalVisits: matched.length,
      bookings: matched,
    };
  }
};

