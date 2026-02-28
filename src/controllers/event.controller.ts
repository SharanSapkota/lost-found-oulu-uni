import { Request, Response } from "express";
import { eventService } from "../services/event.service";

export const eventController = {

  getAllEvents: async (req: Request, res: Response) => {
    try {
      const events = await eventService.getAllEvents();
      return res.status(200).json(events);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  getEventBySlug: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const event = await eventService.getEventBySlug(slug);
      return res.status(200).json(event);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },

  createEvent: async (req: Request, res: Response) => {
    try {
      const event = await eventService.createEvent(req.body);
      return res.status(201).json(event);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  updateEvent: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await eventService.updateEvent(id, req.body);
      return res.status(200).json(event);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  getGlobalStats: async (req: Request, res: Response) => {
  try {
    const stats = await eventService.getGlobalStats();
    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
},

getEventStats: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await eventService.getEventStats(id);
    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
},

updateEventConfig: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const config = await eventService.updateEventConfig(id, req.body);
    return res.status(200).json(config);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
},

  deactivateEvent: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await eventService.deactivateEvent(id);
      return res.status(200).json({ message: "Event deactivated" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

};