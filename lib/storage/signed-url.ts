import { createAdminClient } from "@/lib/supabase/admin";
import {
  GOVERNMENT_ID_BUCKET,
  PRIVATE_SIGNED_URL_TTL,
  VERIFICATION_BUCKET,
  type UploadPurpose,
} from "./buckets";
import { normalizeLegacyVerificationPath } from "./upload-file";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = PRIVATE_SIGNED_URL_TTL,
): Promise<string> {
  const db = createAdminClient();
  const { data, error } = await db.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Could not generate signed URL.");
  }
  return data.signedUrl;
}

const STAFF_ROLES = new Set(["admin", "founder", "moderator"]);

async function assertStaffRole(actorId: string): Promise<{ role: string }> {
  const db = createAdminClient();
  const { data: actor } = await db
    .from("profiles")
    .select("role")
    .eq("id", actorId)
    .single();

  if (!actor?.role || !STAFF_ROLES.has(actor.role)) {
    throw new Error("Forbidden");
  }
  return { role: actor.role };
}

export async function getPrivateFileUrl(
  purpose: UploadPurpose,
  storedPath: string,
  actorId: string,
  opts?: { targetUserId?: string; req?: import("next/server").NextRequest },
): Promise<string> {
  const { role } = await assertStaffRole(actorId);

  let bucket: string;
  let path: string;

  if (purpose === "government_id") {
    bucket = GOVERNMENT_ID_BUCKET;
    path = storedPath;
  } else if (purpose === "verification_selfie") {
    const resolved = normalizeLegacyVerificationPath(storedPath);
    bucket = resolved.bucket === "verification" ? "verification" : VERIFICATION_BUCKET;
    path = resolved.path;
  } else {
    throw new Error("Signed URL not available for this purpose.");
  }

  const url = await getSignedUrl(bucket, path, PRIVATE_SIGNED_URL_TTL);

  await writeAdminAuditLog({
    actorId,
    actorRole: role,
    action: "private_file_access",
    resourceType: purpose,
    resourceId: opts?.targetUserId ?? path,
    metadata: { bucket, path, expiresIn: PRIVATE_SIGNED_URL_TTL },
    req: opts?.req,
  });

  return url;
}

export async function getVerificationSelfieUrl(
  storedPath: string,
  actorId: string,
  opts?: { targetUserId?: string; req?: import("next/server").NextRequest },
): Promise<{ url: string; expiresIn: number }> {
  const url = await getPrivateFileUrl("verification_selfie", storedPath, actorId, opts);
  return { url, expiresIn: PRIVATE_SIGNED_URL_TTL };
}

export async function getGovernmentIdUrl(
  storedPath: string,
  actorId: string,
  opts?: { targetUserId?: string; req?: import("next/server").NextRequest },
): Promise<{ url: string; expiresIn: number }> {
  const url = await getPrivateFileUrl("government_id", storedPath, actorId, opts);
  return { url, expiresIn: PRIVATE_SIGNED_URL_TTL };
}
