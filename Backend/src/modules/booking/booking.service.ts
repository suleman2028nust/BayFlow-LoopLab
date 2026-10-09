import { prisma } from '../../config/prisma';
import { redis } from '../../config/redis';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

// The Strict State Machine Rules
export const BOOKING_MACHINE: any = {
  PENDING: { next: ['CONFIRMED', 'CANCELLED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] },
  CONFIRMED: { next: ['ASSIGNED', 'CANCELLED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] },
  ASSIGNED: { next: ['INSPECTING'], allowedRoles: ['TECHNICIAN'] }, // Tech inspects
  INSPECTING: { next: ['ESTIMATE_REVIEW'], allowedRoles: ['TECHNICIAN'] }, // Tech submits estimate
  ESTIMATE_REVIEW: { next: ['AWAITING_CUSTOMER'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] }, // SA reviews
  AWAITING_CUSTOMER: { next: ['ESTIMATE_APPROVED', 'ESTIMATE_REJECTED'], allowedRoles: ['CUSTOMER'] }, // Customer decides
  ESTIMATE_APPROVED: { next: ['PARTS_PENDING', 'PARTS_READY', 'IN_REPAIR'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] }, 
  PARTS_PENDING: { next: ['PARTS_ORDERED', 'PARTS_READY'], allowedRoles: ['PARTS_PERSON'] },
  PARTS_ORDERED: { next: ['PARTS_READY'], allowedRoles: ['PARTS_PERSON'] },
  PARTS_READY: { next: ['IN_REPAIR'], allowedRoles: ['PARTS_PERSON', 'TECHNICIAN'] },
  IN_REPAIR: { next: ['QC_PENDING'], allowedRoles: ['TECHNICIAN'] },
  QC_PENDING: { next: ['QC_IN_PROGRESS'], allowedRoles: ['QC_INSPECTOR'] },
  QC_IN_PROGRESS: { next: ['READY_FOR_PICKUP', 'IN_REPAIR'], allowedRoles: ['QC_INSPECTOR'] }, // Pass -> READY. Fail -> IN_REPAIR.
  READY_FOR_PICKUP: { next: ['COMPLETED'], allowedRoles: ['OWNER', 'SERVICE_ADVISOR'] }
};

export const BookingService = {
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
      if (existing) throw new Error('This time slot is no longer available.');

      const booking = await prisma.booking.create({
        data: {
          shopId: data.shopId,
          customerId,
          slotTime: new Date(data.slotTime),
          vehicleDetails: data.vehicleDetails,
          issuesReported: data.issuesReported,
          status: 'PENDING'
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

      // Optional: Push to BullMQ for "New Booking Notification" to Shop Owner here

      return booking;
    } finally {
      // ALWAYS release the lock
      await redis.del(lockKey);
    }
  },

  async updateStatus(bookingId: string, newStatus: string, user: any, notes?: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error('Booking not found');

    const currentState = BOOKING_MACHINE[booking.status];
    
    // 1. Check if the transition is allowed from the current state
    if (!currentState.next.includes(newStatus)) {
      throw new Error(`Invalid state transition from ${booking.status} to ${newStatus}`);
    }

    // 2. Check if the User's Role is allowed to make this specific transition
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

    // Perform transition and write Audit Log inside a Transaction
    return prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: newStatus as any },
        include: { customer: true }
      });

      await tx.bookingHistory.create({
        data: {
          bookingId,
          fromStatus: booking.status,
          toStatus: newStatus as any,
          userId: user.userId,
          notes: notes || null
        }
      });

      // Send WhatsApp Notification in background (non-blocking)
      if (updatedBooking.customer.phoneNumber) {
        let msg = '';
        switch(newStatus) {
          case 'CONFIRMED': msg = `BayFlow: Your booking for ${(updatedBooking.vehicleDetails as any)?.make || 'your car'} is Confirmed! ✅`; break;
          case 'INSPECTING': msg = `BayFlow: Our technician is currently inspecting your car. 🔍`; break;
          case 'ESTIMATE_REVIEW': msg = `BayFlow: The inspection is complete. An estimate has been generated for your review. 📝`; break;
          case 'IN_REPAIR': msg = `BayFlow: Good news! The repair work has officially started on your car. 🔧`; break;
          case 'READY_FOR_PICKUP': msg = `BayFlow: Great news! Your car is Ready for Pickup! 🚗✨`; break;
        }
        
        if (msg) {
          // Fire and forget
          WhatsAppService.sendMessage(updatedBooking.customer.phoneNumber, msg).catch(console.error);
        }
      }

      return updatedBooking;
    });
  },

  // 4. Technician adds an Estimate (Parts + Labour)
  async addEstimate(bookingId: string, data: { labourCost: number, partsCost: number, notes?: string }) {
    return prisma.$transaction(async (tx) => {
      const totalCost = data.labourCost + data.partsCost;
      
      const estimate = await tx.estimate.upsert({
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
      await tx.booking.update({
        where: { id: bookingId },
        data: { estimateTotal: totalCost }
      });

      // Auto-transition to ESTIMATE_REVIEW
      await this.updateStatus(bookingId, 'ESTIMATE_REVIEW', { userId: 'SYSTEM', role: 'TECHNICIAN' }, 'Estimate submitted');

      return estimate;
    });
  },

  // 5. Customer Approves or Rejects Estimate
  async respondToEstimate(bookingId: string, status: 'APPROVED' | 'REJECTED', customerId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.customerId !== customerId) throw new Error('Unauthorized');

    return prisma.$transaction(async (tx) => {
      await tx.estimate.update({
        where: { bookingId },
        data: { status }
      });

      const nextStatus = status === 'APPROVED' ? 'ESTIMATE_APPROVED' : 'ESTIMATE_REJECTED';
      await this.updateStatus(bookingId, nextStatus, { userId: customerId, role: 'CUSTOMER' }, `Estimate ${status.toLowerCase()}`);
      
      return true;
    });
  },

  // 6. QC Inspector logs an issue
  async addQCIssue(bookingId: string, description: string) {
    return prisma.$transaction(async (tx) => {
      const issue = await tx.qCIssue.create({
        data: {
          bookingId,
          description
        }
      });

      // Send car back to technician
      await this.updateStatus(bookingId, 'IN_REPAIR', { userId: 'SYSTEM', role: 'QC_INSPECTOR' }, `QC Failed: ${description}`);
      return issue;
    });
  }
};
