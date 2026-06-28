"use client";

import { createClient } from "@/lib/supabase/client";
import { compressImage, blobToFile } from "@/lib/images/compress";
import { transformSupabaseImage } from "@/lib/images/supabase-transform";

// Returns an optimized render-path URL rather than the raw object URL.
// This lets Supabase resize/compress on the fly without storing extra files.
function renderUrl(rawUrl: string, width: number, quality = 80): string {
  return transformSupabaseImage(rawUrl, { width, quality, resize: "cover" }) ?? rawUrl;
}

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
  const raw = supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
  return renderUrl(raw, 1200, 85);
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const compressed = await prepare(file, 400, 150);
  const supabase = createClient();
  const path = `${userId}/avatar.webp`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, compressed, { upsert: true, contentType: "image/webp" });
  if (error) throw error;
  const raw = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  return renderUrl(raw, 400, 80);
}

export async function uploadClubPhoto(file: File, clubId: string): Promise<string> {
  const compressed = await prepare(file, 1200, 400);
  const supabase = createClient();
  const path = `${clubId}/photos/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  const raw = supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
  return renderUrl(raw, 1200, 85);
}

export async function uploadPartnerPhoto(file: File, partnerId: string): Promise<string> {
  const compressed = await prepare(file, 1200, 400);
  const supabase = createClient();
  const path = `partners/${partnerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  const raw = supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
  return renderUrl(raw, 1200, 85);
}

export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const compressed = await prepare(file, 800, 250);
  const supabase = createClient();
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  const raw = supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
  return renderUrl(raw, 800, 80);
}

export async function uploadHangerImage(file: File, listingId: string): Promise<string> {
  const compressed = await prepare(file, 800, 300);
  const supabase = createClient();
  const path = `listings/${listingId}/${Date.now()}.webp`;
  const { error } = await supabase.storage
    .from("hanger")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  const raw = supabase.storage.from("hanger").getPublicUrl(path).data.publicUrl;
  return renderUrl(raw, 800, 80);
}

// ── Event / Gathering media ───────────────────────────────────────────────────

export async function uploadEventPhoto(file: File, eventId: string): Promise<string> {
  const compressed = await prepare(file, 1400, 500);
  const supabase = createClient();
  const path = `${eventId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("event-media")
    .upload(path, compressed, { upsert: false, contentType: "image/webp" });
  if (error) throw error;
  const raw = supabase.storage.from("event-media").getPublicUrl(path).data.publicUrl;
  return renderUrl(raw, 1400, 85);
}

export async function uploadEventVoiceNote(blob: Blob, eventId: string): Promise<string> {
  const supabase = createClient();
  const path = `${eventId}/voice-${Date.now()}.m4a`;
  const { error } = await supabase.storage
    .from("event-media")
    .upload(path, blob, { upsert: false, contentType: "audio/mp4" });
  if (error) throw error;
  // Voice notes are not images — return raw URL (no transform)
  return supabase.storage.from("event-media").getPublicUrl(path).data.publicUrl;
}

// ── Club crest / customization ───────────────────────────────────────────────

export async function uploadClubCrestBadge(svgString: string, clubId: string): Promise<string> {
  const supabase = createClient();
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const path = `${clubId}/crest.svg`;
  const { error } = await supabase.storage
    .from("club-covers")
    .upload(path, blob, { upsert: true, contentType: "image/svg+xml" });
  if (error) throw error;
  // SVG is vector — no pixel transform needed
  return supabase.storage.from("club-covers").getPublicUrl(path).data.publicUrl;
}
