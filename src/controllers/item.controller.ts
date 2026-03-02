import { Request, Response } from "express";
import { itemService } from "../services/item.service";
import { uploadService } from "../services/upload.service";

export const itemController = {

  getItemsByEvent: async (req: Request, res: Response) => {
    try {
      const params = req.params;

      const { category, status, search, page, limit } = req.query;
      const items = await itemService.getItemsByEvent(params.eventId, {
        category: category as string,
        status: status as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      return res.status(200).json(items);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },

  getItemById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await itemService.getItemById(id);
      return res.status(200).json(item);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },

  uploadItem: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "Photo is required" });
      }

      const photoUrl = await uploadService.uploadItemPhoto(req.file);

      const item = await itemService.uploadItem(slug, {
        ...req.body,
        photoUrl,
      });

      return res.status(201).json(item);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  markAsReunited: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await itemService.markAsReunited(id);
      return res.status(200).json(item);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  editItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await itemService.editItem(id, req.body);
      return res.status(200).json(item);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  deleteItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const item = await itemService.getItemById(id);
      if (item?.photoUrl) {
        await uploadService.deleteItemPhoto(item.photoUrl);
      }

      await itemService.deleteItem(id);
      return res.status(200).json({ message: "Item deleted" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

};