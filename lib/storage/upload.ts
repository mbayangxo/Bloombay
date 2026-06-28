"use client";

import { compressImage, blobToFile } from "@/lib/images/compress";
import { transformSupabaseImage } from "@/lib/images/supabase-transform";
import { uploadViaApi } from "./client-api";

function renderUrl(rawUrl: string, width: number, quality = 80): string {
  return transformSupabaseImage(rawUrl, { width, quality, resize: "cover" }) ?? rawUrl;
}

async function prepare(file: File, maxWidthPx: number, maxSizeKB: number): Promise<File> {
  try {
    const blob = await compressImage(file, { maxWidthPx, maxSizeKB });
    return blobToFile(blob, file.name);
  } catch {
    return file;
  }
}

async function uploadImage(
  file: File,
  purpose: Parameters<typeof uploadViaApi>[0]["purpose"],
  subpath?: string,
  renderWidth?: number,
): Promise<string> {
  const prepared = await prepare(
    file,
    renderWidth ?? 1200,
    purpose === "avatar" || purpose === "profile_photo" ? 150 : 400,
  );
  const result = await uploadViaApi({
    file: prepared,
    purpose,
    mimeType: prepared.type,
    subpath,
  });
  if (!result.publicUrl) {
    throw new Error("Expected public URL for upload.");
  }
  return renderWidth ? renderUrl(result.publicUrl, renderWidth, 85) : result.publicUrl;
}

export async function uploadClubCover(file: File, clubId: string): Promise<string> {
  return uploadImage(file, "club_cover", `clubs/${clubId}`, 1200);
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const prepared = await prepare(file, 400, 150);
  const result = await uploadViaApi({ file: prepared, purpose: "avatar", mimeType: prepared.type });
  if (!result.publicUrl) throw new Error("Avatar upload failed.");
  return renderUrl(result.publicUrl, 400, 80);
}

export async function uploadClubPhoto(file: File, clubId: string): Promise<string> {
  return uploadImage(file, "club_photo", `clubs/${clubId}/photos`, 1200);
}

export async function uploadPartnerPhoto(file: File, partnerId: string): Promise<string> {
  return uploadImage(file, "partner_photo", `partners/${partnerId}`, 1200);
}

export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const prepared = await prepare(file, 800, 250);
  const result = await uploadViaApi({ file: prepared, purpose: "profile_photo", mimeType: prepared.type });
  if (!result.publicUrl) throw new Error("Profile photo upload failed.");
  return renderUrl(result.publicUrl, 800, 80);
}

export async function uploadHangerImage(file: File, listingId: string): Promise<string> {
  return uploadImage(file, "hanger_image", `listings/${listingId}`, 800);
}

export async function uploadEventPhoto(file: File, eventId: string): Promise<string> {
  return uploadImage(file, "event_cover", `events/${eventId}`, 1400);
}

export async function uploadEventVoiceNote(blob: Blob, eventId: string): Promise<string> {
  const result = await uploadViaApi({
    file: blob,
    purpose: "event_audio",
    mimeType: "audio/mp4",
    subpath: `events/${eventId}`,
  });
  if (!result.publicUrl) throw new Error("Voice note upload failed.");
  return result.publicUrl;
}

export async function uploadClubCrestBadge(svgString: string, clubId: string): Promise<string> {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const result = await uploadViaApi({
    file: blob,
    purpose: "club_cover",
    mimeType: "image/svg+xml",
    subpath: `clubs/${clubId}`,
  });
  if (!result.publicUrl) throw new Error("Crest upload failed.");
  return result.publicUrl;
}
