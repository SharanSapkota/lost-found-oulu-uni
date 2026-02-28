import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { eventRepository } from "../repositories/event.repository";
import { Role } from "../constants/enums";

export const requireEventScope = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role === Role.SUPER_ADMIN) return next();

    const eventId = req.params.eventId || req.params.id;

    if (req.params.slug) {
      const event = await eventRepository.findBySlug(req.params.slug);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (req.user?.eventId !== event.id) {
        return res.status(403).json({ message: "Access denied to this event" });
      }
      return next();
    }

    if (req.user?.eventId !== eventId) {
      return res.status(403).json({ message: "Access denied to this event" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};