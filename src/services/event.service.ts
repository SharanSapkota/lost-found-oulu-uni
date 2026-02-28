import { nanoid } from "nanoid";
import { eventRepository } from "../repositories/event.repository";
import { EventStatus } from "../constants/enums";

export const eventService = {

  getAllEvents: async () => {
    return eventRepository.findAll();
  },

  getEventById: async (id: string) => {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error("Event not found");
    return event;
  },

  getEventBySlug: async (slug: any) => {
    const event = await eventRepository.findBySlug(slug);
    if (!event) throw new Error("Event not found");
    if (event.status === EventStatus.ARCHIVED) throw new Error("Event is no longer active");
    return event;
  },

  createEvent: async (data: {
    name: string;
    type: any;
    description?: string;
    startDate: Date;
    endDate: Date;
    config?: {
      requirePhoto?: boolean;
      itemExpiryDays?: number;
      notifyOnClaim?: boolean;
      primaryColor?: string;
      logoUrl?: string;
    };
  }) => {
    const slug = nanoid(8);
    const publicUrl = `${process.env.FRONTEND_URL}/e/${slug}`;

    const event = await eventRepository.createWithConfig(
      {
        name: data.name,
        type: data.type,
        description: data.description,
        slug,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      data.config || {}
    );

    return { ...event, publicUrl };
  },

  updateEvent: async (id: any, data: Partial<{
    name: string;
    type: any;
    description: string;
    status: any;
    startDate: Date;
    endDate: Date;
  }>) => {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error("Event not found");
    return eventRepository.update(id, data);
  },

  deactivateEvent: async (id: any) => {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error("Event not found");
    return eventRepository.updateStatus(id, EventStatus.ARCHIVED);
  },

  getGlobalStats: async () => {
  return eventRepository.getStats();
},

getEventStats: async (eventId: any) => {
  const event = await eventRepository.findById(eventId);
  if (!event) throw new Error("Event not found");
  return eventRepository.getEventStats(eventId);
},

updateEventConfig: async (eventId: any, config: Partial<{
  requirePhoto: boolean;
  itemExpiryDays: number;
  notifyOnClaim: boolean;
  primaryColor: string;
  logoUrl: string;
}>) => {
  const event = await eventRepository.findById(eventId);
  if (!event) throw new Error("Event not found");
  return eventRepository.updateConfig(eventId, config);
},

  getPublicUrl: (slug: string) => {
    return `${process.env.FRONTEND_URL}/e/${slug}`;
  },

};