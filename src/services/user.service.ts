import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { eventRepository } from "../repositories/event.repository";
import prisma from "../utils/prisma";
import { Role } from "../constants/enums";

export const userService = {

  getAllAdmins: async () => {
    return userRepository.findAllAdmins();
  },

  getAdminById: async (id: any) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  createAdmin: async (data: {
    name: any;
    email: any;
    password: any;
    eventId: any;
  }) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error("Email already in use");

    const event = await eventRepository.findById(data.eventId);
    if (!event) throw new Error("Event not found");

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: Role.ADMIN,
    });

    await userRepository.assignToEvent(user.id, data.eventId);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  deactivateAdmin: async (id: any) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");
    return userRepository.update(id, { isActive: false });
  },

  activateAdmin: async (id: any) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");
    return userRepository.update(id, { isActive: true });
  },

reassignAdmin: async (adminId: any, newEventId: any) => {
  const user = await userRepository.findById(adminId);
  if (!user) throw new Error("Admin not found");
  const event = await eventRepository.findById(newEventId);
  if (!event) throw new Error("Event not found");

  await prisma.userEvent.deleteMany({ where: { userId: adminId } });

  await userRepository.assignToEvent(adminId, newEventId);
},

  resetPassword: async (id: any, newPassword: any) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return userRepository.update(id, { passwordHash });
  },

};