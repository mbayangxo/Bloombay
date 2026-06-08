import { CLUBS } from "@/app/member/clubs/club-data";

/** BloomBay portal roles — profiles.role in Supabase */

export const USER_ROLES = [
  "member",
  "founder",
  "admin",
  "club_owner",
  "partner",
  "moderator",
  "curator",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type PortalId = "member" | "founder" | "admin" | "club_owner" | "partner" | "curator";

/** Staff & partners — founders, Club Mamas, ops (not members). */
export const COMPANY_LOGIN = "/company";

export const MEMBER_LOGIN = "/member/login";

export const PORTAL_LOGIN: Record<PortalId, string> = {
  member: MEMBER_LOGIN,
  founder: COMPANY_LOGIN,
  admin: COMPANY_LOGIN,
  club_owner: COMPANY_LOGIN,
  partner: COMPANY_LOGIN,
  curator: COMPANY_LOGIN,
};

export const PORTAL_HOME: Record<PortalId, string> = {
  member: "/member/home",
  founder: "/founder/dashboard",
  admin: "/admin/dashboard",
  club_owner: "/club-owner/dashboard",
  partner: "/partner",
  curator: "/curator/dashboard",
};

export const ROLE_HOME: Record<UserRole, string> = {
  member: PORTAL_HOME.member,
  founder: PORTAL_HOME.founder,
  admin: PORTAL_HOME.admin,
  club_owner: PORTAL_HOME.club_owner,
  partner: PORTAL_HOME.partner,
  moderator: PORTAL_HOME.admin,
  curator: PORTAL_HOME.curator,
};

/** Each portal is isolated — separate login URL per portal. */
export const PORTAL_ALLOWED: Record<PortalId, UserRole[]> = {
  member: ["member"],
  founder: ["founder"],
  admin: ["admin", "moderator"],
  club_owner: ["club_owner"],
  partner: ["partner"],
  curator: ["curator"],
};

export function portalFromPath(pathname: string): PortalId | null {
  if (pathname.startsWith("/member")) return "member";
  if (pathname.startsWith("/founder")) return "founder";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/club-owner")) return "club_owner";
  if (pathname.startsWith("/partner")) return "partner";
  if (pathname.startsWith("/curator")) return "curator";
  return null;
}

export function loginPathForRole(role: UserRole): string {
  return role === "member" ? MEMBER_LOGIN : COMPANY_LOGIN;
}

export function roleToPortal(role: UserRole): PortalId {
  if (role === "club_owner") return "club_owner";
  if (role === "partner") return "partner";
  if (role === "member") return "member";
  if (role === "founder") return "founder";
  if (role === "curator") return "curator";
  if (role === "admin" || role === "moderator") return "admin";
  return "member";
}

export function canAccessPortal(role: UserRole, portal: PortalId): boolean {
  return PORTAL_ALLOWED[portal].includes(role);
}

export function homeForRole(role: UserRole): string {
  return ROLE_HOME[role] ?? PORTAL_HOME.member;
}

const ROLE_ALIASES: Record<string, UserRole> = {
  club_mama: "club_owner",
  "club-mama": "club_owner",
  clubmama: "club_owner",
  club_host: "club_owner",
  host: "club_owner",
  clubhouse: "club_owner",
};

export function normalizeRole(raw: string | null | undefined): UserRole {
  if (!raw) return "member";
  const key = raw.trim().toLowerCase();
  if (ROLE_ALIASES[key]) return ROLE_ALIASES[key];
  if (USER_ROLES.includes(key as UserRole)) return key as UserRole;
  return "member";
}

export function portalLabel(portal: PortalId): string {
  const labels: Record<PortalId, string> = {
    member: "Member",
    founder: "Founder",
    admin: "Admin",
    club_owner: "Clubhouse",
    partner: "Partner",
    curator: "Curator",
  };
  return labels[portal];
}

/** Subdomains → role (optional; main pattern is {club}@bloombay.app). */
export const BLOOMBAY_EMAIL_DOMAIN_ROLES: Record<string, UserRole> = {
  "clubmama.bloombay.app": "club_owner",
  "clubhouse.bloombay.app": "club_owner",
  "partner.bloombay.app": "partner",
};

const CLUB_SLUGS = new Set(CLUBS.map((c) => c.id));

/** Reserved locals on @bloombay.app — not club slugs. */
const BLOOMBAY_RESERVED_LOCALS: Record<string, UserRole> = {
  founder: "founder",
  admin: "admin",
  ops: "admin",
  operations: "admin",
  moderator: "moderator",
  mod: "moderator",
  curator: "curator",
  partner: "partner",
  member: "member",
  members: "member",
  host: "club_owner",
  clubmama: "club_owner",
  "club-mama": "club_owner",
  support: "admin",
};

const BLOOMBAY_TEST_EMAIL_ROLES: Record<string, UserRole> = {
  "founder@bloombay.app": "founder",
  "admin@bloombay.app": "admin",
  "host@bloombay.app": "club_owner",
  "clubmama@bloombay.app": "club_owner",
  "club-mama@bloombay.app": "club_owner",
  "clubowner@bloombay.app": "club_owner",
  "partner@bloombay.app": "partner",
  "curator@bloombay.app": "curator",
  "moderator@bloombay.app": "moderator",
  "member@bloombay.app": "member",
};

/**
 * Infer role from email when profiles.role is missing.
 * Prefer invite + DB profile in production; domain routing helps Club Mama addresses.
 */
export function roleFromEmailAddress(email: string): UserRole | null {
  const lower = email.trim().toLowerCase();
  if (!lower.includes("@")) return null;

  const exact = BLOOMBAY_TEST_EMAIL_ROLES[lower];
  if (exact) return exact;

  const [local, domain] = lower.split("@");
  if (!local || !domain) return null;

  if (domain === "bloombay.app") {
    return roleFromBloombayLocal(local);
  }

  if (BLOOMBAY_EMAIL_DOMAIN_ROLES[domain]) {
    return BLOOMBAY_EMAIL_DOMAIN_ROLES[domain];
  }

  return null;
}

function roleFromBloombayLocal(local: string): UserRole | null {
  if (BLOOMBAY_RESERVED_LOCALS[local]) {
    return BLOOMBAY_RESERVED_LOCALS[local];
  }

  if (local.startsWith("mama.")) {
    const slug = local.slice(5);
    if (CLUB_SLUGS.has(slug)) return "club_owner";
  }

  if (local.startsWith("club.")) {
    const slug = local.slice(5);
    if (CLUB_SLUGS.has(slug)) return "club_owner";
  }

  if (local.startsWith("partner.")) {
    return "partner";
  }

  /** e.g. morning-run-club@bloombay.app */
  if (CLUB_SLUGS.has(local)) {
    return "club_owner";
  }

  return null;
}

/** @deprecated Use roleFromEmailAddress */
export function devRoleFromEmail(email: string): UserRole | null {
  return roleFromEmailAddress(email);
}

/** Normalize a club name to a slug-style local part. */
export function clubSlugFromName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "club"
  );
}

/**
 * Preferred Club Mama email: mama.{clubslug}@bloombay.app
 * Alternate: {clubslug}@bloombay.app (also recognized).
 */
export function suggestClubMamaEmail(clubNameOrSlug: string): string {
  const raw = clubNameOrSlug.trim().toLowerCase();
  const slug = CLUB_SLUGS.has(raw) ? raw : clubSlugFromName(raw);
  return `mama.${slug}@bloombay.app`;
}
