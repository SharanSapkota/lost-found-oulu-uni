import { EventStatus, EventType } from "../constants/enums";
import "dotenv/config"; // loads .env

import prisma from "../utils/prisma";

export const eventRepository = {

  findAll: async () => {
    return prisma.event.findMany({
      include: {
        config: true,
        admins: { include: { user: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id: string) => {
    return prisma.event.findUnique({
      where: { id },
      include: {
        config: true,
        admins: { include: { user: true } },
        _count: { select: { items: true } },
      },
    });
  },

  findBySlug: async (slug: any) => {
    return prisma.event.findUnique({
      where: { slug },
      include: { config: true },
    });
  },

  create: async (data: {
    name: string;
    type: any;
    description?: string;
    slug: string;
    startDate: Date;
    endDate: Date;
  }) => {
    return prisma.event.create({ data });
  },

  createWithConfig: async (
    eventData: {
      name: string;
      type: any;
      description?: string;
      slug: string;
      startDate: Date;
      endDate: Date;
    },
    configData: {
      requirePhoto?: boolean;
      itemExpiryDays?: number;
      notifyOnClaim?: boolean;
      primaryColor?: string;
      logoUrl?: string;
    }
  ) => {
    return prisma.event.create({
      data: {
        ...eventData,
        config: { create: configData },
      },
      include: { config: true },
    });
  },

  update: async (id: string, data: Partial<{
    name: string;
    type: any;
    description: string;
    status: any;
    startDate: Date;
    endDate: Date;
  }>) => {
    return prisma.event.update({ where: { id }, data });
  },

  updateStatus: async (id: string, status: any) => {
    return prisma.event.update({ where: { id }, data: { status } });
  },

  updateConfig: async (eventId: string, data: Partial<{
  requirePhoto: boolean;
  itemExpiryDays: number;
  notifyOnClaim: boolean;
  primaryColor: string;
  logoUrl: string;
}>) => {
  return prisma.eventConfig.update({
    where: { eventId },
    data,
  });
},

getStats: async () => {
  const [totalEvents, activeEvents, totalItems, totalClaims, reunited] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: "ACTIVE" } }),
      prisma.item.count(),
      prisma.claim.count(),
      prisma.item.count({ where: { status: "REUNITED" } }),
    ]);

  return { totalEvents, activeEvents, totalItems, totalClaims, reunited };
},

getEventStats: async (eventId: string) => {
  const [totalItems, pendingClaims, approvedClaims, reunited] =
    await Promise.all([
      prisma.item.count({ where: { eventId } }),
      prisma.claim.count({ where: { item: { eventId }, status: "PENDING" } }),
      prisma.claim.count({ where: { item: { eventId }, status: "APPROVED" } }),
      prisma.item.count({ where: { eventId, status: "REUNITED" } }),
    ]);

  return { totalItems, pendingClaims, approvedClaims, reunited };
},

  delete: async (id: string) => {
    return prisma.event.delete({ where: { id } });
  },

};