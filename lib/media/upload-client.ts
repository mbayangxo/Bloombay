"use client";

import { createClient } from "@/lib/supabase/client";
import { imageExtension, MAX_IMAGE_BYTES, type MediaBucket } from "./buckets";

export type UploadResult =
  | { ok: true; publicUrl: string; path: string }
  | { ok: false; error: string };

export async function uploadImageFile(
  bucket: MediaBucket,
  storagePath: string,
  file: File
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Please choose an image file." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image should be under 6MB." };
  }

  const supabase = createClient();
  const ext = imageExtension(file.name);
  const path = storagePath.includes(".") ? storagePath : `${storagePath}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    return { ok: false, error: error.message };
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { ok: true, publicUrl: urlData.publicUrl, path: data.path };
}
