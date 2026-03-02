import prisma from "../utils/prisma";
import "dotenv/config"; 

import { NotificationType, NotificationStatus } from "../constants/enums";
export const notificationRepository = {

  create: async (data: {
    type: any;
    recipient: string;
    message: string;
    claimId?: string;
  }) => {
    return prisma.notification.create({ data });
  },

  markAsSent: async (id: string) => {
    return prisma.notification.update({
      where: { id },
      data: { status: NotificationStatus.SENT, sentAt: new Date() },
    });
  },

  markAsFailed: async (id: string) => {
    return prisma.notification.update({
      where: { id },
      data: { status: NotificationStatus.FAILED },
    });
  },

  findPending: async () => {
    return prisma.notification.findMany({
      where: { status: NotificationStatus.PENDING },
    });
  },

};