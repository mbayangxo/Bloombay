import type { UserRole } from "@/lib/auth/roles";
import { PORTAL_HOME } from "@/lib/auth/roles";

export type PortalLink = {
  id: "founder" | "club_mama" | "host" | "admin" | "partner" | "curator";
  label: string;
  href: string;
  hint: string;
};

/**
 * Portals reachable from a personal member account.
 * Only show desks the member is actually entitled to.
 */
export function portalLinksForAccount(input: {
  role: UserRole | string | null | undefined;
  ownsClub?: boolean;
  hasHosted?: boolean;
  isHost?: boolean;
}): PortalLink[] {
  const role = (input.role ?? "member") as string;
  const links: PortalLink[] = [];

  if (role === "founder") {
    links.push({
      id: "founder",
      label: "Founder portal",
      href: PORTAL_HOME.founder,
      hint: "Mission Control — your founder desk",
    });
  }

  if (role === "club_owner" || role === "founder" || input.ownsClub) {
    links.push({
      id: "club_mama",
      label: "Club Mama portal",
      href: PORTAL_HOME.club_owner,
      hint: "Run your club from here",
    });
  }

  if (input.isHost || input.hasHosted || role === "founder" || role === "club_owner") {
    links.push({
      id: "host",
      label: "Host portal",
      href: "/member/host",
      hint: "Your host desk · payouts & analytics",
    });
  }

  if (role === "admin" || role === "moderator") {
    links.push({
      id: "admin",
      label: "Admin portal",
      href: PORTAL_HOME.admin,
      hint: "Operations",
    });
  }

  if (role === "partner") {
    links.push({
      id: "partner",
      label: "Partner portal",
      href: PORTAL_HOME.partner,
      hint: "Partner desk",
    });
  }

  if (role === "curator") {
    links.push({
      id: "curator",
      label: "Curator portal",
      href: PORTAL_HOME.curator,
      hint: "Editorial desk",
    });
  }

  return links;
}

export function memberHomeFromPortal(): string {
  return "/member/home";
}
