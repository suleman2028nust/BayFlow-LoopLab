import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}

export const NotificationService = {
  async createNotification(data: CreateNotificationDTO) {
    try {
      return await prisma.notification.create({
        data: {
          userId: data.userId,
          title: data.title,
          message: data.message,
          type: data.type,
          link: data.link,
        },
      });
    } catch (error) {
      console.error('[NotificationService] Error creating notification:', error);
      return null;
    }
  },

  async createMultipleNotifications(notifications: CreateNotificationDTO[]) {
    try {
      if (!notifications.length) return;
      return await prisma.notification.createMany({
        data: notifications.map((n) => ({
          userId: n.userId,
          title: n.title,
          message: n.message,
          type: n.type,
          link: n.link,
        })),
      });
    } catch (error) {
      console.error('[NotificationService] Error creating multiple notifications:', error);
      return null;
    }
  },

  async getUserNotifications(userId: string, limit = 50) {
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return { notifications, unreadCount };
  },

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
