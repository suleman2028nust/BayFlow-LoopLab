import { prisma } from '../../config/prisma';
import { NotificationService } from '../notification/notification.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

const DAILY_API_KEY = process.env.DAILY_API_KEY || '';
const DAILY_DOMAIN = process.env.DAILY_DOMAIN || 'https://reachly.daily.co';

export const CallService = {
  // 1. Create a Daily.co Room and start call
  async initiateCall(bookingId: string, caller: { userId: string; role: string; email?: string }) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, technician: true, shop: true }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Determine receiver
    let receiverId: string;
    let receiverName = '';
    let receiverPhone = '';

    if (caller.role === 'CUSTOMER') {
      // Customer calls Shop Service Advisor / Owner
      const shopStaff = await prisma.user.findFirst({
        where: { shopId: booking.shopId, role: { in: ['SERVICE_ADVISOR', 'OWNER'] } }
      });
      receiverId = shopStaff?.id || booking.shop.ownerId || '';
      receiverName = 'Service Advisor';
      receiverPhone = shopStaff?.phoneNumber || booking.shop.phone || '';
    } else {
      // Staff (SA/Tech/Owner) calls Customer
      receiverId = booking.customerId;
      receiverName = booking.customer.email;
      receiverPhone = booking.customer.phoneNumber || '';
    }

    if (!receiverId) {
      throw new Error('Receiver not found for this call');
    }

    // Unique room name for Daily.co
    const roomName = `bayflow-${bookingId.slice(0, 8)}-${Date.now()}`;

    // Call Daily.co REST API to create room
    let roomUrl = `${DAILY_DOMAIN}/${roomName}`;
    try {
      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName,
          privacy: 'public',
          properties: {
            enable_chat: true,
            start_audio_off: false,
            start_video_off: true, // Voice-first audio calling
            exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours expiry
          },
        }),
      });

      const data = (await response.json()) as any;
      if (data && data.url) {
        roomUrl = data.url;
      }
    } catch (err) {
      console.error('[CallService] Error creating Daily.co room, using fallback URL:', err);
    }

    // Save CallLog in Database
    const callLog = await prisma.callLog.create({
      data: {
        bookingId,
        callerId: caller.userId,
        receiverId,
        roomUrl,
        roomName,
        status: 'RINGING',
        duration: 0,
      },
    });

    // Send In-App Notification (Incoming Call Alert)
    const callerTitle = caller.role === 'CUSTOMER' ? 'Customer' : 'Service Advisor';
    NotificationService.createNotification({
      userId: receiverId,
      title: `📞 Incoming Call from ${callerTitle}`,
      message: `${callerTitle} is calling regarding booking #${bookingId.slice(0, 8)}. Click to answer.`,
      type: 'INCOMING_CALL',
      link: `/call/${callLog.id}?roomUrl=${encodeURIComponent(roomUrl)}`,
    }).catch(console.error);

    // If receiver has WhatsApp, send instant direct call link as well
    if (receiverPhone) {
      WhatsAppService.sendMessage(
        receiverPhone,
        `📞 [BayFlow Voice Call] ${callerTitle} is calling you regarding booking #${bookingId.slice(0, 8)}. Join audio call: ${roomUrl}`
      ).catch(console.error);
    }

    return {
      callId: callLog.id,
      roomUrl,
      roomName,
      bookingId,
      callerId: caller.userId,
      receiverId,
      receiverName,
      status: 'RINGING',
    };
  },

  // 2. Update Call Status (CONNECTED, MISSED, REJECTED, ENDED) + Duration
  async updateCallStatus(callId: string, status: 'RINGING' | 'CONNECTED' | 'MISSED' | 'REJECTED' | 'ENDED', duration = 0) {
    const callLog = await prisma.callLog.findUnique({
      where: { id: callId },
    });

    if (!callLog) {
      throw new Error('Call log not found');
    }

    const updated = await prisma.callLog.update({
      where: { id: callId },
      data: {
        status: status as any,
        duration: duration > 0 ? duration : callLog.duration,
      },
    });

    return updated;
  },

  // 3. Get Call History for a Booking
  async getCallLogsByBooking(bookingId: string) {
    return prisma.callLog.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
