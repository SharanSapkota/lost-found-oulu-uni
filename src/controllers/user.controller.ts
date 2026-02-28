import { Request, Response } from "express";
import { userService } from "../services/user.service";

export const userController = {

  getAllAdmins: async (req: Request, res: Response) => {
    try {
      const admins = await userService.getAllAdmins();
      return res.status(200).json(admins);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  createAdmin: async (req: Request, res: Response) => {
    try {
      const { name, email, password, eventId } = req.body;
      const admin = await userService.createAdmin({ name, email, password, eventId });
      return res.status(201).json(admin);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  deactivateAdmin: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await userService.deactivateAdmin(id);
      return res.status(200).json({ message: "Admin deactivated" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  getAdminById: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await userService.getAdminById(id);
    return res.status(200).json(admin);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
},

activateAdmin: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.activateAdmin(id);
    return res.status(200).json({ message: "Admin activated" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
},

reassignAdmin: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { eventId } = req.body;
    await userService.reassignAdmin(id, eventId);
    return res.status(200).json({ message: "Admin reassigned successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
},

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      await userService.resetPassword(id, newPassword);
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

};