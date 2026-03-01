import supabase from "../utils/supabase";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export const uploadService = {

  uploadItemPhoto: async (file: Express.Multer.File): Promise<string> => {
    const compressed = await sharp(file.buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 75,
        progressive: true,
      })
      .toBuffer();

    const filename = `${uuidv4()}.jpg`;
    const filePath = `items/${filename}`;

    const { error } = await supabase.storage
      .from("lostfound")
      .upload(filePath, compressed, {
        contentType: "image/jpeg",
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
      const parts = url.pathname.split("/lostfound/"); 
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