import { prisma } from '../../config/prisma';
import { NotificationService } from '../notification/notification.service';

const DAILY_API_KEY = process.env.DAILY_API_KEY || '';
const DAILY_DOMAIN = process.env.DAILY_DOMAIN || 'https://reachly.daily.co';

interface CallSignal {
  id: string;
  sender: 'caller' | 'receiver';
  type: string;
  payload: any;
  timestamp: number;
}

// In-memory WebRTC signaling cache keyed by callId
const callSignals = new Map<string, CallSignal[]>();

// In-memory active calls cache for ultra-fast, zero-DB-overhead polling
const activeCallsMap = new Map<string, any>();

export const CallService = {
  // 1. Create a Call Session instantly
  async initiateCall(bookingId: string, caller: { userId: string; role: string; email?: string }) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, shop: true }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Cancel/expire prior ringing calls in-memory and in DB
    for (const [id, call] of activeCallsMap.entries()) {
      if (call.bookingId === bookingId && call.status === 'RINGING') {
        call.status = 'MISSED';
      }
    }
    prisma.callLog.updateMany({
      where: { bookingId, status: 'RINGING' },
      data: { status: 'MISSED' },
    }).catch(() => {});

    // Clear stale WebRTC signals
    callSignals.delete(bookingId);

    // Determine receiver
    let receiverId: string = '';
    let receiverName = '';

    if (caller.role === 'CUSTOMER') {
      const shopStaff = await prisma.user.findFirst({
        where: { shopId: booking.shopId, role: { in: ['SERVICE_ADVISOR', 'OWNER'] } }
      });
      receiverId = shopStaff?.id || booking.shop.ownerId || '';
      if (!receiverId) {
        const anyStaff = await prisma.user.findFirst({ where: { shopId: booking.shopId } });
        receiverId = anyStaff?.id || booking.shopId;
      }
      receiverName = 'Service Advisor';
    } else {
      receiverId = booking.customerId;
      receiverName = booking.customer.email;
    }

    if (!receiverId) {
      receiverId = booking.shopId;
    }

    const roomName = `bayflow-${bookingId.slice(0, 8)}-${Date.now()}`;
    const roomUrl = `${DAILY_DOMAIN}/${roomName}`;

    // Non-blocking background room creation
    if (DAILY_API_KEY) {
      fetch('https://api.daily.co/v1/rooms', {
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
            start_video_off: true,
            exp: Math.floor(Date.now() / 1000) + 7200,
          },
        }),
      }).catch(() => {});
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

    const callPayload = {
      id: callLog.id,
      bookingId,
      callerId: caller.userId,
      receiverId,
      shopId: booking.shopId,
      roomUrl,
      roomName,
      status: 'RINGING',
      duration: 0,
      createdAtMs: Date.now(),
      createdAt: callLog.createdAt,
      booking: {
        id: booking.id,
        vehicleDetails: booking.vehicleDetails,
        customer: { id: booking.customer.id, email: booking.customer.email, phoneNumber: booking.customer.phoneNumber },
        shop: { id: booking.shop.id, name: booking.shop.name, phone: booking.shop.phone },
      },
      caller: {
        id: caller.userId,
        email: caller.email || '',
        role: caller.role,
      },
    };

    // Cache in-memory for sub-millisecond polling by both callLog.id and bookingId
    activeCallsMap.set(callLog.id, callPayload);
    activeCallsMap.set(bookingId, callPayload);

    // Send In-App Notification
    const callerTitle = caller.role === 'CUSTOMER' ? 'Customer' : 'Service Advisor';
    NotificationService.createNotification({
      userId: receiverId,
      title: `📞 Incoming Call from ${callerTitle}`,
      message: `${callerTitle} is calling regarding booking #${bookingId.slice(0, 8)}. Click to answer.`,
      type: 'INCOMING_CALL',
      link: `/call/${callLog.id}?roomUrl=${encodeURIComponent(roomUrl)}`,
    }).catch(() => {});

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
    // 1. Update in-memory state immediately
    let inMem = activeCallsMap.get(callId);
    if (!inMem) {
      for (const call of activeCallsMap.values()) {
        if (call.id === callId || call.bookingId === callId) {
          inMem = call;
          break;
        }
      }
    }

    if (inMem) {
      inMem.status = status;
      if (duration > 0) inMem.duration = duration;
      // Also update the mirrored bookingId or callId key in map
      if (activeCallsMap.has(inMem.id)) activeCallsMap.get(inMem.id).status = status;
      if (activeCallsMap.has(inMem.bookingId)) activeCallsMap.get(inMem.bookingId).status = status;
    }

    if (status === 'ENDED' || status === 'REJECTED' || status === 'MISSED') {
      callSignals.delete(callId);
      if (inMem) {
        callSignals.delete(inMem.id);
        callSignals.delete(inMem.bookingId);
      }
      setTimeout(() => {
        activeCallsMap.delete(callId);
        if (inMem) {
          activeCallsMap.delete(inMem.id);
          activeCallsMap.delete(inMem.bookingId);
        }
      }, 20000);
    }

    // 2. Sync to Database (Try by id, then by bookingId)
    try {
      let dbCall = await prisma.callLog.findUnique({ where: { id: callId } }).catch(() => null);
      if (!dbCall) {
        dbCall = await prisma.callLog.findFirst({
          where: { bookingId: callId },
          orderBy: { createdAt: 'desc' }
        }).catch(() => null);
      }

      if (dbCall) {
        const updated = await prisma.callLog.update({
          where: { id: dbCall.id },
          data: {
            status: status as any,
            duration: duration > 0 ? duration : inMem?.duration || dbCall.duration,
          },
        });
        return updated;
      }
    } catch (err) {
      console.warn('DB updateCallStatus sync error:', err);
    }

    return inMem || { id: callId, status, duration };
  },

  // 3. Get Call Log by ID (In-memory first, DB fallback, checks both id and bookingId)
  async getCallById(callId: string) {
    // 1. Check in-memory by key
    const inMem = activeCallsMap.get(callId);
    if (inMem) return inMem;

    // 2. Scan in-memory
    for (const call of activeCallsMap.values()) {
      if (call.id === callId || call.bookingId === callId) {
        return call;
      }
    }

    // 3. Check DB by id
    try {
      const byId = await prisma.callLog.findUnique({
        where: { id: callId },
        include: {
          booking: {
            select: {
              id: true,
              vehicleDetails: true,
              customer: { select: { id: true, email: true, phoneNumber: true } },
              shop: { select: { id: true, name: true, phone: true } },
            },
          },
        },
      });
      if (byId) return byId;

      // 4. Check DB by bookingId (latest call)
      const byBooking = await prisma.callLog.findFirst({
        where: { bookingId: callId },
        include: {
          booking: {
            select: {
              id: true,
              vehicleDetails: true,
              customer: { select: { id: true, email: true, phoneNumber: true } },
              shop: { select: { id: true, name: true, phone: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (byBooking) return byBooking;
    } catch (e) {}

    return null;
  },

  // 4. Get Call History for a Booking
  async getCallLogsByBooking(bookingId: string) {
    return prisma.callLog.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  },

  // 5. Check for active incoming ringing call (In-memory first, zero DB overhead!)
  async getIncomingCall(user: { userId: string; role: string; shopId?: string | null }) {
    const now = Date.now();

    // Scan in-memory calls first (takes < 0.05ms!)
    for (const call of activeCallsMap.values()) {
      if (call.status === 'RINGING' && now - call.createdAtMs < 35000) {
        if (call.callerId !== user.userId) {
          if (user.role === 'CUSTOMER') {
            if (call.receiverId === user.userId) {
              return call;
            }
          } else {
            // Service Advisor / Owner / Staff
            if (call.receiverId === user.userId || (user.shopId && call.shopId === user.shopId)) {
              return call;
            }
          }
        }
      }
    }

    // DB fallback (only if not found in memory)
    const activeCutoff = new Date(Date.now() - 35000);
    const whereClause: any =
      user.role === 'CUSTOMER'
        ? {
            receiverId: user.userId,
            callerId: { not: user.userId },
            status: 'RINGING',
            createdAt: { gte: activeCutoff },
          }
        : {
            status: 'RINGING',
            createdAt: { gte: activeCutoff },
            callerId: { not: user.userId },
            OR: [
              { receiverId: user.userId },
              ...(user.shopId ? [{ booking: { shopId: user.shopId } }] : []),
            ],
          };

    try {
      const call = await prisma.callLog.findFirst({
        where: whereClause,
        include: {
          booking: {
            select: {
              id: true,
              vehicleDetails: true,
              customer: { select: { id: true, email: true, phoneNumber: true } },
              shop: { select: { id: true, name: true, phone: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!call) return null;

      const callerUser = await prisma.user.findUnique({
        where: { id: call.callerId },
        select: { id: true, email: true, role: true, phoneNumber: true },
      });

      return {
        ...call,
        caller: callerUser,
      };
    } catch (err) {
      return null;
    }
  },

  // 6. WebRTC Signaling: Add Signal (offer, answer, ice-candidate)
  addSignal(callId: string, sender: 'caller' | 'receiver', type: string, payload: any) {
    const current = callSignals.get(callId) || [];
    const newSignal: CallSignal = {
      id: Math.random().toString(36).slice(2),
      sender,
      type,
      payload,
      timestamp: Date.now(),
    };
    current.push(newSignal);
    if (current.length > 80) current.shift();
    callSignals.set(callId, current);

    // Also mirror to activeCall's bookingId or id key if available
    const inMem = activeCallsMap.get(callId);
    if (inMem) {
      if (inMem.id !== callId) callSignals.set(inMem.id, current);
      if (inMem.bookingId !== callId) callSignals.set(inMem.bookingId, current);
    }

    return newSignal;
  },

  // 7. WebRTC Signaling: Get Signals from opposing party
  getSignals(callId: string, sender: 'caller' | 'receiver', afterTimestamp = 0) {
    let signals = callSignals.get(callId);
    if (!signals || signals.length === 0) {
      const inMem = activeCallsMap.get(callId);
      if (inMem) {
        signals = callSignals.get(inMem.id) || callSignals.get(inMem.bookingId);
      }
    }
    const list = signals || [];
    return list.filter((s) => s.sender !== sender && s.timestamp > afterTimestamp);
  },
};
