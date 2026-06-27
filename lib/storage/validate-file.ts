import type { UploadPurpose } from "./buckets";

export interface ValidateFileResult {
  ok: boolean;
  error?: string;
  width?: number;
  height?: number;
}

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const PDF_MIME = "application/pdf";

const ALLOWED_MIME_TYPES: Record<UploadPurpose, readonly string[]> = {
  avatar:              IMAGE_MIMES,
  profile_photo:       IMAGE_MIMES,
  government_id:       ["image/jpeg", "image/png", "image/webp", PDF_MIME],
  verification_selfie: ["image/jpeg", "image/png", "image/webp"],
  girlmate_listing:    IMAGE_MIMES,
  girlmate_voice:      ["audio/mp4", "audio/webm", "audio/ogg"],
  girlmate_video:      ["video/mp4", "video/webm"],
  girlmate_cover:      IMAGE_MIMES,
  event_cover:         IMAGE_MIMES,
  event_audio:         ["audio/mp4", "audio/webm", "audio/ogg"],
  club_cover:          ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  club_photo:          IMAGE_MIMES,
  partner_photo:       IMAGE_MIMES,
  hanger_image:        IMAGE_MIMES,
  avenue_media:        IMAGE_MIMES,
  report_evidence:     [...IMAGE_MIMES, "video/mp4", PDF_MIME],
  moderation_evidence: [...IMAGE_MIMES, PDF_MIME],
  city_asset:          IMAGE_MIMES,
  brand_asset:         ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
};

/** Max file size in bytes per purpose. */
export const MAX_FILE_SIZE: Record<UploadPurpose, number> = {
  avatar:              5 * 1024 * 1024,
  profile_photo:       5 * 1024 * 1024,
  government_id:       10 * 1024 * 1024,
  verification_selfie: 10 * 1024 * 1024,
  girlmate_listing:    8 * 1024 * 1024,
  girlmate_voice:      15 * 1024 * 1024,
  girlmate_video:      50 * 1024 * 1024,
  girlmate_cover:      8 * 1024 * 1024,
  event_cover:         10 * 1024 * 1024,
  event_audio:         10 * 1024 * 1024,
  club_cover:          10 * 1024 * 1024,
  club_photo:          10 * 1024 * 1024,
  partner_photo:       10 * 1024 * 1024,
  hanger_image:        8 * 1024 * 1024,
  avenue_media:        8 * 1024 * 1024,
  report_evidence:     10 * 1024 * 1024,
  moderation_evidence: 10 * 1024 * 1024,
  city_asset:          10 * 1024 * 1024,
  brand_asset:         8 * 1024 * 1024,
};

/** Optional max dimensions for raster images (width × height). */
export const MAX_IMAGE_DIMENSIONS: Partial<Record<UploadPurpose, { maxWidth: number; maxHeight: number }>> = {
  avatar:              { maxWidth: 4096, maxHeight: 4096 },
  profile_photo:       { maxWidth: 4096, maxHeight: 4096 },
  government_id:       { maxWidth: 8192, maxHeight: 8192 },
  verification_selfie: { maxWidth: 4096, maxHeight: 4096 },
  girlmate_cover:      { maxWidth: 4096, maxHeight: 4096 },
  event_cover:         { maxWidth: 8192, maxHeight: 8192 },
  club_cover:          { maxWidth: 4096, maxHeight: 4096 },
};

const SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { mime: "video/mp4", bytes: [0x00, 0x00, 0x00] },
  { mime: "audio/webm", bytes: [0x1a, 0x45, 0xdf, 0xa3] },
  { mime: "video/webm", bytes: [0x1a, 0x45, 0xdf, 0xa3] },
  { mime: "audio/ogg", bytes: [0x4f, 0x67, 0x67, 0x53] },
];

const SKIP_MAGIC = new Set(["image/svg+xml", "audio/mp4"]);

function checkMagicBytes(buffer: Buffer, mime: string): boolean {
  if (SKIP_MAGIC.has(mime)) return true;
  const sig = SIGNATURES.find((s) => s.mime === mime);
  if (!sig) return true;
  const offset = sig.offset ?? 0;
  if (buffer.length < offset + sig.bytes.length) return false;
  const matches = sig.bytes.every((b, i) => buffer[offset + i] === b);
  if (!matches) return false;
  if (mime === "image/webp") {
    const webp = [0x57, 0x45, 0x42, 0x50];
    return webp.every((b, i) => buffer[8 + i] === b);
  }
  return true;
}

async function readImageDimensions(buffer: Buffer, mime: string): Promise<{ width?: number; height?: number }> {
  if (!mime.startsWith("image/") || mime === "image/svg+xml") return {};
  try {
    const sharp = (await import("sharp")).default;
    const meta = await sharp(buffer).metadata();
    return { width: meta.width, height: meta.height };
  } catch {
    return {};
  }
}

export async function validateFile(
  buffer: Buffer,
  mime: string,
  purpose: UploadPurpose,
): Promise<ValidateFileResult> {
  const allowed = ALLOWED_MIME_TYPES[purpose];
  if (!allowed.includes(mime)) {
    return { ok: false, error: `File type ${mime} is not allowed for ${purpose}.` };
  }

  const maxSize = MAX_FILE_SIZE[purpose];
  if (buffer.length > maxSize) {
    const mb = Math.round(maxSize / 1024 / 1024);
    return { ok: false, error: `File is too large. Maximum size is ${mb} MB.` };
  }

  if (!checkMagicBytes(buffer, mime)) {
    return { ok: false, error: "File contents do not match the declared type." };
  }

  if (mime.startsWith("image/") && mime !== "image/svg+xml") {
    const dims = await readImageDimensions(buffer, mime);
    const limits = MAX_IMAGE_DIMENSIONS[purpose];
    if (limits && dims.width && dims.height) {
      if (dims.width > limits.maxWidth || dims.height > limits.maxHeight) {
        return {
          ok: false,
          error: `Image dimensions exceed maximum (${limits.maxWidth}×${limits.maxHeight}).`,
          width: dims.width,
          height: dims.height,
        };
      }
    }
    return { ok: true, width: dims.width, height: dims.height };
  }

  return { ok: true };
}

export function extensionForMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
    "audio/mp4": "m4a",
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };
  return map[mime] ?? "bin";
}
