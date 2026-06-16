import type { ClubLandingData } from "@/app/components/portal/club-landing";
import type { PortalClub } from "./types";
import type { CrestAccentId, CrestSymbolId } from "@/lib/crest-system";
import { getClubLayout } from "./layout-templates";

export function portalClubToLanding(club: PortalClub): ClubLandingData {
  const crestSymbol = (club.crestSymbol as CrestSymbolId | null) ?? undefined;
  const crestAccent = (club.crestAccent as CrestAccentId | null) ?? undefined;
  const layout = getClubLayout(club.layoutKey);
  return {
    id: club.slug,
    name: club.name,
    tagline: club.tagline,
    about: club.description,
    whoItsFor: club.isOfficial
      ? "Women in NYC who want real connection — starting with our founding circle and official gatherings."
      : "Women who resonate with this club's vibe. Apply and the Club Mama will welcome you.",
    whatMembersDo: club.isOfficial
      ? [
          "Join official BloomBay happenings",
          "Meet women in your city",
          "Build your bouquet and inner circle",
        ]
      : [
          "Apply to join this club",
          "Attend club-hosted gatherings",
          "Connect with members in the lounge",
        ],
    tags: club.tags.length ? club.tags : [club.category],
    city: "New York",
    neighborhood: "NYC",
    memberCount: club.memberCount,
    color: club.color,
    accentColor: club.accentColor,
    crestBg: club.crestBg,
    darkBg: layout.darkHero,
    layoutKey: layout.id,
    mamaName: club.isOfficial ? "BloomBay Team" : club.curator,
    mamaTitle: club.isOfficial ? "BloomBay" : "Club Mama",
    mamaBio: club.welcomeLine ?? club.description,
    accessType: "free",
    entryStyle: club.isOfficial ? "open" : "application",
    rules: club.isOfficial
      ? ["Show up as yourself", "Respect every woman's story", "What's shared here stays here"]
      : undefined,
    upcomingSeats: [],
    photos: [],
    crestSymbol,
    crestAccent,
    coverUrl: club.coverUrl ?? club.bannerUrl ?? undefined,
    logoUrl: club.logoUrl ?? undefined,
    logoTemplate: (club.logoTemplate as "seal" | "wordmark" | "monogram" | null) ?? undefined,
    logoText: club.logoText ?? undefined,
    crestImageUrl: club.crestImageUrl ?? undefined,
  };
}
