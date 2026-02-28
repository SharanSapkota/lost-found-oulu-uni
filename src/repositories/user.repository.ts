import prisma from "../utils/prisma";
import "dotenv/config"; // loads .env

import { Role } from "../constants/enums";
export const userRepository = {

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: { events: { include: { event: true } } },
    });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: { events: { include: { event: true } } },
    });
  },

  findAllAdmins: async () => {
    return prisma.user.findMany({
      where: { role: Role.ADMIN },
      include: { events: { include: { event: true } } },
    });
  },

  create: async (data: {
    name: string;
    email: string;
    passwordHash: string;
    role: any;
  }) => {
    return prisma.user.create({ data });
  },

  assignToEvent: async (userId: string, eventId: string) => {
    return prisma.userEvent.create({
      data: { userId, eventId },
    });
  },

  update: async (id: string, data: Partial<{
    name: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
  }>) => {
    return prisma.user.update({ where: { id }, data });
  },

  delete: async (id: string) => {
    return prisma.user.delete({ where: { id } });
  },

};