import { normalizeRole, type UserRole } from "@/lib/auth/roles";

export type PortalInvitePayload = {
  role: UserRole;
  /** When set, invite only works for this email (case-insensitive). */
  email?: string;
  exp: number;
  label?: string;
};

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

export function roleLabelForInvite(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    member: "Member",
    founder: "Founder",
    admin: "Operations",
    club_owner: "Club Mama",
    partner: "Partner",
    moderator: "Moderator",
    curator: "Curator",
  };
  return labels[role] ?? role;
}

export const INVITEABLE_ROLES: UserRole[] = [
  "member",
  "club_owner",
  "partner",
  "admin",
  "moderator",
  "curator",
];

export function createPortalInvite(input: {
  role: UserRole;
  email?: string;
  label?: string;
}): PortalInvitePayload {
  return {
    role: normalizeRole(input.role),
    email: input.email?.trim().toLowerCase() || undefined,
    exp: Date.now() + INVITE_TTL_MS,
    label: input.label?.trim() || undefined,
  };
}

function toBase64Url(json: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf8").toString("base64url");
  }
  const b64 = btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
  );
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(token: string): string {
  const padded = token.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 ? "=".repeat(4 - (padded.length % 4)) : "";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded + pad, "base64").toString("utf8");
  }
  return decodeURIComponent(
    atob(padded + pad)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
}

export function encodePortalInvite(payload: PortalInvitePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodePortalInvite(token: string | null | undefined): PortalInvitePayload | null {
  if (!token?.trim()) return null;
  try {
    const raw = JSON.parse(fromBase64Url(token.trim())) as PortalInvitePayload;
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

export function inviteMatchesEmail(invite: PortalInvitePayload, email: string): boolean {
  if (!invite.email) return true;
  return invite.email === email.trim().toLowerCase();
}

export function companyLoginUrl(origin: string, opts?: { invite?: string; next?: string }): string {
  const url = new URL("/company", origin);
  if (opts?.invite) url.searchParams.set("invite", opts.invite);
  if (opts?.next) url.searchParams.set("next", opts.next);
  return url.pathname + url.search;
}

export function companySignupUrl(inviteToken: string): string {
  return `/company/create?invite=${encodeURIComponent(inviteToken)}`;
}
