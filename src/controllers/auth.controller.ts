import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const authController = {

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  },

  getMe: async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getMe(req.user!.id);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
},

  changePassword: async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = (req as any).user.id;
      await authService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

};