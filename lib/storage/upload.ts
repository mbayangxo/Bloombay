"use client";

import { createClient } from "@/lib/supabase/client";
import { compressImage, blobToFile } from "@/lib/images/compress";

async function prepare(file: File, maxWidthPx: number, maxSizeKB: number): Promise<File> {
  try {
    const blob = await compressImage(file, { maxWidthPx, maxSizeKB });
    return blobToFile(blob, file.name);
  } catch {
    return file; // fall back to original if compression fails
  }
}

export async function uploadClubCover(file: File, clubId: string): Promise<string> {
  const compressed = await prepare(file, 1200, 400);
  const supabase = createClient();
  const path = `${clubId}/cover.webp`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, compressed, { upsert: true, contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const compressed = await prepare(file, 400, 150);
  const supabase = createClient();
  const path = `${userId}/avatar.webp`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, compressed, { upsert: true, contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
}

export async function uploadClubPhoto(file: File, clubId: string): Promise<string> {
  const compressed = await prepare(file, 1200, 400);
  const supabase = createClient();
  const path = `${clubId}/photos/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
}

export async function uploadPartnerPhoto(file: File, partnerId: string): Promise<string> {
  const compressed = await prepare(file, 1200, 400);
  const supabase = createClient();
  const path = `partners/${partnerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
}

export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const compressed = await prepare(file, 800, 250);
  const supabase = createClient();
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
}

export async function uploadHangerImage(file: File, listingId: string): Promise<string> {
  const compressed = await prepare(file, 800, 300);
  const supabase = createClient();
  const path = `listings/${listingId}/${Date.now()}.webp`;
  const { error } = await supabase.storage
    .from("hanger")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("hanger").getPublicUrl(path).data.publicUrl;
}
