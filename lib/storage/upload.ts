"use client";

import { createClient } from "@/lib/supabase/client";

const MAX_COVER_BYTES = 8 * 1024 * 1024;  // 8 MB
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

function ext(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "jpg";
}

export async function uploadClubCover(file: File, clubId: string): Promise<string> {
  if (file.size > MAX_COVER_BYTES) throw new Error("Image must be under 8 MB.");
  const supabase = createClient();
  const path = `${clubId}/cover.${ext(file)}`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (file.size > MAX_AVATAR_BYTES) throw new Error("Image must be under 5 MB.");
  const supabase = createClient();
  const path = `${userId}/avatar.${ext(file)}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
}

export async function uploadClubPhoto(file: File, clubId: string): Promise<string> {
  if (file.size > MAX_COVER_BYTES) throw new Error("Image must be under 8 MB.");
  const supabase = createClient();
  const path = `${clubId}/photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext(file)}`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
}

export async function uploadPartnerPhoto(file: File, partnerId: string): Promise<string> {
  if (file.size > MAX_COVER_BYTES) throw new Error("Image must be under 8 MB.");
  const supabase = createClient();
  const path = `partners/${partnerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext(file)}`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
}

export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  if (file.size > MAX_AVATAR_BYTES) throw new Error("Image must be under 5 MB.");
  const supabase = createClient();
  // Unique filename per upload so multiple photos don't collide
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext(file)}`;
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
}
