import { createHmac, timingSafeEqual } from "crypto";
import type { PortalInvitePayload } from "@/lib/auth/portal-invites";
import { normalizeRole } from "@/lib/auth/roles";

const PRIVILEGED_ROLES = new Set([
  "founder",
  "admin",
  "club_owner",
  "partner",
  "moderator",
  "curator",
]);

function inviteSecret(): string | null {
  const secret = process.env.PORTAL_INVITE_SECRET?.trim();
  return secret || null;
}

function toBase64Url(json: string): string {
  return Buffer.from(json, "utf8").toString("base64url");
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 ? "=".repeat(4 - (padded.length % 4)) : "";
  return Buffer.from(padded + pad, "base64").toString("utf8");
}

function sign(encoded: string, secret: string): string {
  return createHmac("sha256", secret).update(encoded).digest("base64url");
}

/** Server-only: sign a portal invite for company/staff onboarding. */
export function signPortalInviteToken(payload: PortalInvitePayload): string {
  const secret = inviteSecret();
  if (!secret) {
    throw new Error("PORTAL_INVITE_SECRET is not configured");
  }
  const encoded = toBase64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

function parsePayload(encoded: string): PortalInvitePayload | null {
  try {
    const raw = JSON.parse(fromBase64Url(encoded)) as PortalInvitePayload;
    if (!raw?.role || !raw.exp) return null;
    if (Date.now() > raw.exp) return null;
    return {
      ...raw,
      role: normalizeRole(raw.role),
      email: raw.email?.toLowerCase(),
    };
  } catch {
    return null;
  }
}

/**
 * Server-only: verify signed invite token.
 * Rejects unsigned tokens for privileged roles (founder/admin/club_owner/etc.).
 */
export function verifyPortalInviteToken(token: string | null | undefined): PortalInvitePayload | null {
  if (!token?.trim()) return null;

  const parts = token.trim().split(".");
  if (parts.length !== 2) return null;

  const [encoded, sig] = parts;
  const secret = inviteSecret();
  if (!secret) return null;

  const expected = sign(encoded, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  const payload = parsePayload(encoded);
  if (!payload) return null;

  if (PRIVILEGED_ROLES.has(payload.role)) {
    return payload;
  }

  return payload;
}
