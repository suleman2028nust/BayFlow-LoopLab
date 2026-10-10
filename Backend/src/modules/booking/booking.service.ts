import { prisma } from '../../config/prisma';
import { redis } from '../../config/redis';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { sendEmail } from '../../config/brevo';
import { NotificationService } from '../notification/notification.service';
import bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

// The Strict State Machine Rules (Brief Section 5 - The Complete Booking Lifecycle)
// Each status has one responsible role and a limited set of allowed next actions.
export interface StateTransitionRule {
  allowedNext: {
    [nextStatus: string]: string[]; // Target status -> exact allowed role(s)
  };
}

export const BOOKING_MACHINE: Record<string, StateTransitionRule> = {
  // Step 1: PENDING -> Owner of step: Service Advisor (confirms or declines)
  PENDING: {
    allowedNext: {
      CONFIRMED: ['SERVICE_ADVISOR'],
      CANCELLED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 2: CONFIRMED -> Owner of step: Service Advisor (assigns technician)
  CONFIRMED: {
    allowedNext: {
      ASSIGNED: ['SERVICE_ADVISOR'],
      CANCELLED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 3: ASSIGNED -> Owner of step: Technician (physically inspects vehicle)
  ASSIGNED: {
    allowedNext: {
      INSPECTING: ['TECHNICIAN'],
      CANCELLED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 4: INSPECTING -> Owner of step: Technician (submits estimate to SA)
  INSPECTING: {
    allowedNext: {
      ESTIMATE_REVIEW: ['TECHNICIAN'],
    },
  },
  // Step 5: ESTIMATE_REVIEW -> Owner of step: Service Advisor (reviews/edits and sends to customer)
  ESTIMATE_REVIEW: {
    allowedNext: {
      AWAITING_CUSTOMER: ['SERVICE_ADVISOR'],
      CANCELLED: ['SERVICE_ADVISOR'],
    },
  },
  // Step 6: AWAITING_CUSTOMER -> Owner of step: Customer (accepts or rejects estimate)
  AWAITING_CUSTOMER: {
    allowedNext: {
      ESTIMATE_APPROVED: ['CUSTOMER'],
      ESTIMATE_REJECTED: ['CUSTOMER'],
      CANCELLED: ['CUSTOMER', 'SERVICE_ADVISOR'],
    },
  },
  // Step 6b (Edge Case): ESTIMATE_REJECTED -> Owner of step: Service Advisor (revises or cancels)
  ESTIMATE_REJECTED: {
    allowedNext: {
      ESTIMATE_REVIEW: ['SERVICE_ADVISOR'],
      CANCELLED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 7: ESTIMATE_APPROVED -> Owner of step: Service Advisor (assigns parts person)
  ESTIMATE_APPROVED: {
    allowedNext: {
      PARTS_PENDING: ['SERVICE_ADVISOR'],
      CANCELLED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 8: PARTS_PENDING -> Owner of step: Parts Person (creates PO or marks ready if in stock)
  PARTS_PENDING: {
    allowedNext: {
      PARTS_ORDERED: ['PARTS_PERSON'],
      PARTS_READY: ['PARTS_PERSON'],
      CANCELLED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 9: PARTS_ORDERED -> Owner of step: Parts Person (confirms parts arrival)
  PARTS_ORDERED: {
    allowedNext: {
      PARTS_READY: ['PARTS_PERSON'],
      CANCELLED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 10: PARTS_READY -> Owner of step: Parts Person (allocates parts, stock deducted)
  PARTS_READY: {
    allowedNext: {
      IN_REPAIR: ['PARTS_PERSON'],
    },
  },
  // Step 11: IN_REPAIR -> Owner of step: Technician (performs repair, sends to QC)
  IN_REPAIR: {
    allowedNext: {
      QC_PENDING: ['TECHNICIAN'],
    },
  },
  // Step 12: QC_PENDING -> Owner of step: Any QC Person (picks job from queue)
  QC_PENDING: {
    allowedNext: {
      QC_IN_PROGRESS: ['QC_INSPECTOR'],
    },
  },
  // Step 13: QC_IN_PROGRESS -> Owner of step: QC Inspector (road test: passes to READY_FOR_PICKUP or fails back to IN_REPAIR)
  QC_IN_PROGRESS: {
    allowedNext: {
      READY_FOR_PICKUP: ['QC_INSPECTOR'],
      IN_REPAIR: ['QC_INSPECTOR'],
    },
  },
  // Step 14 & 15: READY_FOR_PICKUP -> Owner of step: Service Advisor / Customer (vehicle picked up)
  READY_FOR_PICKUP: {
    allowedNext: {
      COMPLETED: ['SERVICE_ADVISOR', 'CUSTOMER'],
    },
  },
  // Step 16: COMPLETED -> Final state
  COMPLETED: {
    allowedNext: {},
  },
  CANCELLED: {
    allowedNext: {},
  },
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
  // 1. Customer creates a booking (Supports authenticated customer or guest checkout with customerInfo)
  async createBooking(data: any, authenticatedUserId?: string) {
    let customerId = authenticatedUserId;
    let newTokens: any = null;
    let customerUser: any = null;

    if (!customerId && data.customerInfo) {
      const { email, password, name, phoneNumber } = data.customerInfo;
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const passwordHash = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
          data: {
            email,
            passwordHash,
            role: 'CUSTOMER',
            isVerified: true,
            phoneNumber: phoneNumber || null
          }
        });
      } else {
        // Ensure user is verified so they can log in seamlessly
        if (!user.isVerified) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
          });
        }
      }
      customerId = user.id;
      customerUser = { id: user.id, email: user.email, name: (user as any).name || user.email.split('@')[0], role: user.role };
      newTokens = await AuthService.generateTokens(user);
    }

    if (!customerId) {
      throw new Error('Please sign in or provide contact credentials to confirm your booking.');
    }

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

      // In-App Notification for Customer
      NotificationService.createNotification({
        userId: customerId,
        title: 'Booking Confirmed - BayFlow',
        message: `Your booking request for ${carName} on ${new Date(data.slotTime).toLocaleDateString()} has been scheduled.`,
        type: 'PENDING',
        link: `/customer/bookings/${booking.id}`
      }).catch(console.error);

      return {
        booking,
        accessToken: newTokens?.accessToken || null,
        user: customerUser
      };
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
    } else if (user.role === 'OWNER') {
      const targetShopId = filters?.shopId || user.shopId;
      if (targetShopId) {
        where.shopId = targetShopId;
      } else {
        // Owner sees all bookings for shops they own
        const ownedShops = await prisma.shop.findMany({
          where: { ownerId: user.userId },
          select: { id: true }
        });
        const shopIds = ownedShops.map(s => s.id);
        if (shopIds.length > 0) {
          where.shopId = { in: shopIds };
        }
      }
    } else {
      // SERVICE_ADVISOR
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
    if (booking.status !== 'CONFIRMED') {
      throw new Error(`Cannot assign technician: Booking must be in CONFIRMED status (current: ${booking.status})`);
    }

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

    // Idempotent: If booking is already in the target status, return it directly
    if (booking.status === newStatus) {
      return booking;
    }

    const currentState = BOOKING_MACHINE[booking.status];
    if (!currentState) {
      throw new Error(`Current state ${booking.status} is not recognized in state machine`);
    }

    const allowedRolesForTarget = currentState.allowedNext[newStatus];
    
    // 1. Check if the transition is allowed
    if (!allowedRolesForTarget) {
      const allowedNextStates = Object.keys(currentState.allowedNext);
      throw new Error(`Invalid state transition: Cannot move booking from ${booking.status} to ${newStatus}. Allowed next states: [${allowedNextStates.join(', ') || 'None (Terminal)'}]`);
    }

    // 2. Role authorization check
    const isSupervisor = user.role === 'OWNER' || user.role === 'ADMIN';
    if (!allowedRolesForTarget.includes(user.role) && !isSupervisor) {
      throw new Error(`Security Violation: Role ${user.role} cannot move booking from ${booking.status} to ${newStatus}. Responsible role: ${allowedRolesForTarget.join(' or ')}.`);
    }

    // 3. Strict Ownership Checks
    if (user.role === 'TECHNICIAN' && booking.assignedTechId && booking.assignedTechId !== user.userId) {
      throw new Error('You can only update bookings assigned directly to you.');
    }
    if (user.role === 'CUSTOMER' && booking.customerId && booking.customerId !== user.userId) {
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
      const updatedBooking = await prisma.$transaction(async (tx) => {
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

        const ub = await tx.booking.update({
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

        return ub;
      }, { maxWait: 10000, timeout: 20000 });

      // Customer & Staff Notifications (Dispatched after transaction commits)
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
          notifyShopStaff(updatedBooking.shopId, ['QC_INSPECTOR'], `🔍 [QC Required] Booking #${bookingId} (${carName}) is ready for Quality Check inspection.`, 'QC Inspection Pending', 'QC_PENDING');
          break;
        case 'QC_IN_PROGRESS':
          msg = `🕵️‍♂️ BayFlow: The repair is done! Our inspector is now performing a final Quality Check (QC).`;
          break;
        case 'READY_FOR_PICKUP': 
          msg = `🎉 BayFlow: Great news! ${carName} is 100% Ready for Pickup!`; 
          subject = 'Your Car is Ready!';
          notifyShopStaff(updatedBooking.shopId, ['SERVICE_ADVISOR', 'OWNER'], `🎉 [Ready for Pickup] Vehicle #${bookingId} (${carName}) passed QC. Ready for handover.`, 'Vehicle Ready for Customer Handover', 'READY_FOR_PICKUP');
          break;
        case 'COMPLETED':
          msg = `🤝 BayFlow: Thank you for choosing us! Have a safe drive.`;
          notifyShopStaff(updatedBooking.shopId, ['SERVICE_ADVISOR', 'OWNER'], `🤝 [Job Completed] Booking #${bookingId} (${carName}) closed and payment settled.`, 'Booking Completed', 'COMPLETED');
          break;
        case 'CANCELLED':
          msg = `❌ BayFlow: Your booking for ${carName} has been cancelled.`;
          subject = 'Booking Cancelled';
          break;
      }
      
      if (msg) {
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

