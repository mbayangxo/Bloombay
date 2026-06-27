import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  bucketForPurpose,
  isPublicBucket,
  type UploadPurpose,
} from "./buckets";
import { extensionForMime, validateFile } from "./validate-file";
import { stripExif } from "./strip-exif";
import { toBuffer } from "./parse-input";

export interface UploadFileOptions {
  userId: string;
  purpose: UploadPurpose;
  file: Buffer | Blob;
  mimeType: string;
  /** Optional subfolder within the user prefix, e.g. `clubs/{clubId}` */
  subpath?: string;
  metadata?: Record<string, unknown>;
}

export interface UploadFileResult {
  path: string;
  bucket: string;
  publicUrl?: string;
}

function buildStoragePath(userId: string, subpath: string | undefined, ext: string): string {
  const filename = `${randomUUID()}.${ext}`;
  if (subpath) {
    const clean = subpath.replace(/^\/+|\/+$/g, "");
    return `${userId}/${clean}/${filename}`;
  }
  return `${userId}/${filename}`;
}

function publicObjectUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

async function writeUploadAuditLog(opts: {
  userId: string;
  bucket: string;
  path: string;
  mimeType: string;
  purpose: UploadPurpose;
  sizeBytes: number;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const db = createAdminClient();
    const row: Record<string, unknown> = {
      user_id:         opts.userId,
      file_type:       opts.mimeType,
      bucket:          opts.bucket,
      path:            opts.path,
      purpose:         opts.purpose,
      file_size_bytes: opts.sizeBytes,
      metadata:        opts.metadata ?? {},
    };
    await db.from("upload_audit_logs").insert(row);
  } catch {
    // Audit failure must not block upload
  }
}

export async function uploadFile(opts: UploadFileOptions): Promise<UploadFileResult> {
  const bucket = bucketForPurpose(opts.purpose);
  let buffer = await toBuffer(opts.file);
  let mimeType = opts.mimeType;

  const validation = await validateFile(buffer, mimeType, opts.purpose);
  if (!validation.ok) {
    throw new Error(validation.error ?? "File validation failed.");
  }

  if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") {
    buffer = await stripExif(buffer, mimeType);
    mimeType = mimeType === "image/png" ? "image/png" : mimeType === "image/webp" ? "image/webp" : "image/jpeg";
  }

  const ext = extensionForMime(mimeType);
  const path = buildStoragePath(opts.userId, opts.subpath, ext);

  const db = createAdminClient();
  const { error } = await db.storage.from(bucket).upload(path, buffer, {
    upsert: false,
    contentType: mimeType,
  });

  if (error) {
    throw new Error(error.message);
  }

  await writeUploadAuditLog({
    userId: opts.userId,
    bucket,
    path,
    mimeType,
    purpose: opts.purpose,
    sizeBytes: buffer.length,
    metadata: opts.metadata,
  });

  const result: UploadFileResult = { path, bucket };
  if (isPublicBucket(bucket)) {
    result.publicUrl = publicObjectUrl(bucket, path);
  }
  return result;
}

export function normalizeLegacyVerificationPath(storedValue: string): { bucket: string; path: string } {
  if (storedValue.startsWith("http")) {
    throw new Error("Legacy public URL stored for private file.");
  }
  // Already a storage path
  if (storedValue.includes("/")) {
    // If path was uploaded to legacy `verification` bucket
    return { bucket: "verification", path: storedValue };
  }
  return { bucket: "verification-selfies", path: storedValue };
}
