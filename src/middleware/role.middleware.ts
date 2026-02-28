import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { Role } from "../constants/enums";

export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== Role.SUPER_ADMIN) {
    return res.status(403).json({ message: "Super admin access required" });
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    req.user?.role !== Role.ADMIN &&
    req.user?.role !== Role.SUPER_ADMIN
  ) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};