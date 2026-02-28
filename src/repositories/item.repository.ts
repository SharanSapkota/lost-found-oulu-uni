import "dotenv/config";
import prisma from "../utils/prisma";
import { ItemStatus } from "../constants/enums";
 // loads .env

export const itemRepository = {

  findAllByEvent: async (eventId: string, filters?: {
    category?: any;
    status?: any;
    search?: string;
  }) => {
    return prisma.item.findMany({
      where: {
        eventId,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && {
          name: { contains: filters.search, mode: "insensitive" },
        }),
      },
      include: {
        _count: { select: { claims: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findAllByEventId: async (eventId: string, filters?: {
  category?: any;
  status?: any;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where = {
    eventId,
    ...(filters?.category && { category: filters.category }),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.search && {
      name: { contains: filters.search, mode: "insensitive" as const },
    }),
  };

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      include: { _count: { select: { claims: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.item.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
},

  findById: async (id: string) => {
    return prisma.item.findUnique({
      where: { id },
      include: {
        event: true,
        claims: true,
      },
    });
  },

  create: async (data: {
    name: string;
    category: any;
    locationFound: string;
    photoUrl: string;
    eventId: string;
    expiresAt?: Date;
  }) => {
    return prisma.item.create({ data });
  },

  updateStatus: async (id: string, status: any) => {
    return prisma.item.update({ where: { id }, data: { status } });
  },

  update: async (id: string, data: Partial<{
    name: string;
    category: any;
    locationFound: string;
    photoUrl: string;
    status: any;
    expiresAt: Date;
  }>) => {
    return prisma.item.update({ where: { id }, data });
  },

  delete: async (id: string) => {
    return prisma.item.delete({ where: { id } });
  },

  expireItems: async () => {
    return prisma.item.updateMany({
      where: {
        expiresAt: { lte: new Date() },
        status: ItemStatus.UNCLAIMED,
      },
      data: { status: ItemStatus.EXPIRED },
    });
  },

};