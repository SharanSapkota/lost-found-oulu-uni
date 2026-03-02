import { eventRepository } from "../repositories/event.repository";
import { ItemStatus } from "../constants/enums";
import { itemRepository } from "../repositories/item.repository";

export const itemService = {

  getItemsByEvent: async (eventId: any, filters?: {
    category?: any;
    status?: any;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    // const event = await eventRepository.findBySlug(eventSlug);
    // if (!event) throw new Error("Event not found");
    return itemRepository.findAllByEvent(eventId, filters);
  },
  
  editItem: async (id: any, data: {
    name?: string;
    category?: any;
    locationFound?: string;
  }) => {
    const item = await itemRepository.findById(id);
    if (!item) throw new Error("Item not found");
    return itemRepository.update(id, data);
  },

  getItemById: async (id: any) => {
    const item = await itemRepository.findById(id);
    if (!item) throw new Error("Item not found");
    return item;
  },

  uploadItem: async (eventSlug: any, data: {
    name: string;
    category: any;
    locationFound: string;
    photoUrl: string;
  }) => {
    const event = await eventRepository.findBySlug(eventSlug);
    if (!event) throw new Error("Event not found");

    let expiresAt: Date | undefined;
    if (event.config?.itemExpiryDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + event.config.itemExpiryDays);
    }

    return itemRepository.create({
      ...data,
      eventId: event.id,
      expiresAt,
    });
  },

  markAsReunited: async (id: any) => {
    const item = await itemRepository.findById(id);
    if (!item) throw new Error("Item not found");
    return itemRepository.updateStatus(id, ItemStatus.REUNITED);
  },

  deleteItem: async (id: any) => {
    const item = await itemRepository.findById(id);
    if (!item) throw new Error("Item not found");
    return itemRepository.delete(id);
  },

};