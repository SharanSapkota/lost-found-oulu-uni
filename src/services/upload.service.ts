import supabase from "../utils/supabase";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const uploadService = {

  uploadItemPhoto: async (file: Express.Multer.File): Promise<string> => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = `items/${filename}`;

    const { error } = await supabase.storage
      .from("lostfound")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage
      .from("lostfound")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  deleteItemPhoto: async (photoUrl: string): Promise<void> => {
    try {
      const url = new URL(photoUrl);
      const parts = url.pathname.split("/items/");
      if (parts.length < 2) return;

      const filePath = `items/${parts[1]}`;

      const { error } = await supabase.storage
        .from("lostfound")
        .remove([filePath]);

      if (error) throw new Error(`Delete failed: ${error.message}`);
    } catch {
      console.error("Could not delete photo from storage");
    }
  },

};