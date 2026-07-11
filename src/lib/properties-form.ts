import { promises as fs } from "fs";
import path from "path";
import { slugify } from "@/lib/cms";
import {
  createSupabaseAdminClient,
  getSupabaseStorageBucket,
  isSupabaseStorageConfigured
} from "@/lib/supabase-server";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

export function numberFromForm(formData: FormData, key: string) {
  const value = formData.get(key);
  return Number(value || 0);
}

export function textFromForm(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function parseAmenities(formData: FormData) {
  return textFromForm(formData, "amenidades")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseExistingImages(formData: FormData): string[] {
  const raw = formData.get("existingImages");
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return [];
  }
  return [];
}

export function parseNewImageUrls(formData: FormData): string[] {
  const raw = formData.get("newImageUrls");
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return [];
  }
  return [];
}

export async function saveImages(formData: FormData, title: string) {
  const preUploaded = parseNewImageUrls(formData);
  if (preUploaded.length) {
    return preUploaded;
  }

  const files = formData.getAll("imagenes").filter((item): item is File => item instanceof File && item.size > 0);
  if (!files.length) {
    return [];
  }

  if (isSupabaseStorageConfigured()) {
    const supabase = createSupabaseAdminClient();
    const bucket = getSupabaseStorageBucket();
    const slug = slugify(title);

    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const extension = path.extname(file.name) || ".png";
        const filename = `${slug}-${Date.now()}-${index}${extension}`;
        const storagePath = `properties/${filename}`;
        const bytes = Buffer.from(await file.arrayBuffer());

        const { data, error } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
          contentType: file.type || "image/png",
          upsert: false
        });

        if (error) {
          throw new Error(`Supabase image upload failed: ${error.message}`);
        }

        const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path);
        return publicUrl.publicUrl;
      })
    );

    return uploadedImages;
  }

  await fs.mkdir(uploadDirectory, { recursive: true });

  const savedImages = await Promise.all(
    files.map(async (file, index) => {
      const extension = path.extname(file.name) || ".png";
      const filename = `${slugify(title)}-${Date.now()}-${index}${extension}`;
      const destination = path.join(uploadDirectory, filename);
      const bytes = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(destination, bytes);
      return `/uploads/${filename}`;
    })
  );

  return savedImages;
}
