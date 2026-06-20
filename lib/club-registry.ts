/**
 * Club discovery registry — static clubs + host/partner branding + published portal clubs.
 */

import { CLUBS, type Club } from "@/app/member/clubs/club-data";
import { getClubBranding as getOwnerBranding } from "@/lib/club-owner-store";
import { getClubBranding as getPortalBranding } from "@/lib/bloombay-events-store";
import { isClubDiscoverable } from "@/lib/club-signals";
import { clubHeroImage } from "@/lib/club-hero-images";

export type DiscoveredClub = Club & {
  heroImage: string;
  discoveryReason?: string;
  brandingUpdatedAt?: string;
};

const REGISTRY_KEY = "bb_club_discovery_registry";

export type PortalClubEntry = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  heroImageUrl: string;
  members: number;
  published: boolean;
  source: "club_owner" | "partner";
  createdAt: string;
};

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAllRegistry(): PortalClubEntry[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as PortalClubEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeRegistry(rows: PortalClubEntry[]) {
  if (!canUse()) return;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("bb-clubs-discovery-updated"));
}

export function publishClubToDiscovery(
  entry: Omit<PortalClubEntry, "createdAt" | "published"> & { published?: boolean }
) {
  const all = readAllRegistry();
  const full: PortalClubEntry = {
    ...entry,
    published: entry.published !== false,
    createdAt: new Date().toISOString(),
  };
  const idx = all.findIndex((r) => r.id === full.id);
  if (idx >= 0) all[idx] = { ...all[idx], ...full };
  else all.push(full);
  writeRegistry(all);
  return full;
}

/** Sync host branding save → discovery board when a club has visual identity. */
export function syncClubOwnerBrandingToDiscovery(clubId: string) {
  const club = CLUBS.find((c) => c.id === clubId);
  if (!club) return;
  const branding = getOwnerBranding(clubId);
  const hero = branding.bannerUrl || branding.heroImage || branding.coverImage || "";
  if (!hero && !branding.tagline) return;
  publishClubToDiscovery({
    id: clubId,
    name: club.name,
    tagline: branding.tagline || club.tagline,
    category: club.category,
    description: branding.description || club.description,
    heroImageUrl: hero || clubHeroImage(clubId),
    members: club.members,
    source: "club_owner",
  });
}

function portalEntryToClub(entry: PortalClubEntry): DiscoveredClub {
  return {
    id: entry.id,
    name: entry.name,
    tagline: entry.tagline,
    category: entry.category,
    members: entry.members,
    description: entry.description,
    gradient: "linear-gradient(135deg, #ffb7ce 0%, #ff0055 100%)",
    ownerName: "Club host",
    ownerInitial: entry.name[0] ?? "C",
    welcomeMessage: entry.description,
    upcomingEvents: [],
    vibeBoard: [],
    heroImage: entry.heroImageUrl,
    discoveryReason: entry.source === "partner" ? "New on BloomBay" : "Updated by host",
    brandingUpdatedAt: entry.createdAt,
  };
}

function enrichStaticClub(club: Club): DiscoveredClub {
  const ownerBrand = getOwnerBranding(club.id);
  const portalBrand = getPortalBranding(club.id);
  const hero =
    ownerBrand.bannerUrl ||
    ownerBrand.heroImage ||
    ownerBrand.coverImage ||
    portalBrand.bannerUrl ||
    clubHeroImage(club.id);
  const tagline = ownerBrand.tagline || portalBrand.tagline || club.tagline;
  const updated = ownerBrand.bannerUrl || ownerBrand.heroImage ? ownerBrand : null;
  return {
    ...club,
    tagline,
    description: ownerBrand.description || portalBrand.landingSubcopy || club.description,
    heroImage: hero,
    discoveryReason: updated ? "Fresh from the host" : undefined,
    brandingUpdatedAt: updated ? new Date().toISOString() : undefined,
  };
}

/** All clubs visible on /member/clubs/discover — static + portal-published, newest branding first. */
export function listDiscoveredClubs(): DiscoveredClub[] {
  const staticClubs = CLUBS.filter((c) => isClubDiscoverable(c.id)).map(enrichStaticClub);
  const registryIds = new Set(staticClubs.map((c) => c.id));
  const portalOnly = readAllRegistry()
    .filter((e) => e.published && !registryIds.has(e.id))
    .map(portalEntryToClub);

  const merged = [...portalOnly, ...staticClubs];
  return merged.sort((a, b) => {
    const aT = a.brandingUpdatedAt ?? "";
    const bT = b.brandingUpdatedAt ?? "";
    if (aT && bT) return bT.localeCompare(aT);
    if (aT) return -1;
    if (bT) return 1;
    return b.members - a.members;
  });
}
