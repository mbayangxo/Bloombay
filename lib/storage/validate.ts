"use client";

// File signature (magic bytes) validation — prevents MIME type spoofing.
// Checks the actual bytes at the start of the file, not just file.type.
// Runs client-side before upload; no external service needed.

const SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png",  bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // "RIFF" — check "WEBP" at offset 8 separately
  { mime: "image/gif",  bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
  { mime: "audio/mp4",  bytes: [0x00, 0x00, 0x00] },        // ftyp box — loose check
  { mime: "audio/webm", bytes: [0x1a, 0x45, 0xdf, 0xa3] }, // EBML header
  { mime: "audio/ogg",  bytes: [0x4f, 0x67, 0x67, 0x53] }, // OggS
];

// SVG is XML text — magic bytes don't apply; we allow it through.
const ALLOW_WITHOUT_MAGIC = new Set(["image/svg+xml"]);

export async function validateFileMagicBytes(file: File): Promise<{ ok: boolean; error?: string }> {
  if (ALLOW_WITHOUT_MAGIC.has(file.type)) return { ok: true };

  const sig = SIGNATURES.find(s => s.mime === file.type);
  if (!sig) return { ok: false, error: `File type ${file.type} is not allowed.` };

  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const matches = sig.bytes.every((b, i) => bytes[(sig.offset ?? 0) + i] === b);

  if (!matches) {
    return { ok: false, error: "File contents don't match its declared type. Please choose a real image." };
  }

  // Extra WebP check: bytes 8-11 must be "WEBP"
  if (file.type === "image/webp") {
    const webp = [0x57, 0x45, 0x42, 0x50];
    if (!webp.every((b, i) => bytes[8 + i] === b)) {
      return { ok: false, error: "File contents don't match its declared type. Please choose a real image." };
    }
  }

  return { ok: true };
}

const SIZE_LIMITS: Record<string, number> = {
  "avatars":        5  * 1024 * 1024,
  "profile-photos": 5  * 1024 * 1024,
  "verification":   15 * 1024 * 1024,
  "club-covers":    10 * 1024 * 1024,
  "event-media":    10 * 1024 * 1024,
  "hanger":         8  * 1024 * 1024,
  "avenue-media":   8  * 1024 * 1024,
  "girlmate-media": 8  * 1024 * 1024,
  "media":          8  * 1024 * 1024,
  "club-media":     8  * 1024 * 1024,
};

export function validateFileSize(file: File, bucket: string): { ok: boolean; error?: string } {
  const limit = SIZE_LIMITS[bucket] ?? 6 * 1024 * 1024;
  if (file.size > limit) {
    const mb = Math.round(limit / 1024 / 1024);
    return { ok: false, error: `File is too large. Max size for this upload is ${mb} MB.` };
  }
  return { ok: true };
}

// Full pre-upload validation: size + magic bytes.
// Plug in a real virus-scan API here when ready (VirusTotal, Cloudmersive, etc.)
export async function validateUpload(
  file: File,
  bucket: string
): Promise<{ ok: boolean; error?: string }> {
  const sizeCheck = validateFileSize(file, bucket);
  if (!sizeCheck.ok) return sizeCheck;

  const magicCheck = await validateFileMagicBytes(file);
  if (!magicCheck.ok) return magicCheck;

  // TODO: call virus scan API
  // const scanResult = await callVirusScanApi(file);
  // if (!scanResult.clean) return { ok: false, error: "File failed security scan." };

  return { ok: true };
}
