import prisma from "../utils/prisma";

export const claimRepository = {

  findAllByEvent: async (eventId: any, filters?: {
    status?: any;
  }) => {
    return prisma.claim.findMany({
      where: {
        item: { eventId },
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        item: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findAllByItem: async (itemId: string) => {
    return prisma.claim.findMany({
      where: { itemId },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id: string) => {
    return prisma.claim.findUnique({
      where: { id },
      include: { item: { include: { event: true } } },
    });
  },

  create: async (data: {
    claimerName: string;
    claimerContact: string;
    ownershipProof: string;
    itemId: string;
  }) => {
    return prisma.claim.create({
      data,
      include: { item: true },
    });
  },

hasApprovedClaim: async (itemId: string) => {
  const approved = await prisma.claim.findFirst({
    where: { itemId, status: "APPROVED" },
  });
  return !!approved;
},

updateStatus: async (
  id: string,
  status: string,
  adminNote?: string,
  pickupCode?: string
) => {
  return prisma.claim.update({
    where: { id },
    data: {
      status: status as any,
      ...(adminNote && { adminNote }),
      ...(pickupCode && { pickupCode }),
    },
    include: { item: { include: { event: true } } },
  });
},

};