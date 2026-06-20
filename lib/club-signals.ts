import { CLUBS, type Club } from "@/app/member/clubs/club-data";
import { getClubProfile } from "@/lib/club-world-data";
import { getClubBranding } from "@/lib/bloombay-events-store";
import { listAllEvents } from "@/lib/bloombay-events-store";

export type ClubSignals = {
  clubId: string;
  seatsHosted: number;
  attendanceRate: number;
  returnRate: number;
  activeThisMonth: boolean;
  hostResponsive: "fast" | "steady" | "slow";
  daysSinceLastGathering: number;
  womenWaiting: number;
  discoverable: boolean;
  decayWarning?: string;
};

const LAST_GATHERING_DAYS: Record<string, number> = {
  "morning-run-club": 4,
  "wander-women": 12,
  "the-page-turners": 28,
  "after-dark": 7,
  "founders-in-the-making": 18,
  "the-creative-studio": 14,
};

export function getClubSignals(clubId: string): ClubSignals {
  const club = CLUBS.find((c) => c.id === clubId);
  const events = listAllEvents().filter((e) => e.clubId === clubId);
  const hosted = events.length + (club?.upcomingEvents.length ?? 0);
  const daysSince = LAST_GATHERING_DAYS[clubId] ?? 20;
  const activeThisMonth = daysSince <= 30;
  const discoverable = daysSince < 45;
  const womenWaiting = daysSince >= 30 && daysSince < 45 ? Math.floor(Math.random() * 4) + 1 : 0;

  let decayWarning: string | undefined;
  if (daysSince >= 45) {
    decayWarning = "Hidden from discovery — no gathering in 45+ days.";
  } else if (daysSince >= 35) {
    decayWarning = `Quiet for ${daysSince} days — ${womenWaiting || 2} women waiting for the next event.`;
  }

  return {
    clubId,
    seatsHosted: hosted * 8 + 12,
    attendanceRate: Math.min(98, 72 + (club?.members ?? 0) / 10),
    returnRate: Math.min(94, 65 + (100 - daysSince)),
    activeThisMonth,
    hostResponsive: daysSince < 10 ? "fast" : daysSince < 25 ? "steady" : "slow",
    daysSinceLastGathering: daysSince,
    womenWaiting,
    discoverable,
    decayWarning,
  };
}

export function isClubDiscoverable(clubId: string): boolean {
  return getClubSignals(clubId).discoverable;
}

export function getClubOwnerExcerpt(clubId: string): string {
  const branding = getClubBranding(clubId);
  if (branding.landingSubcopy) return branding.landingSubcopy;
  const profile = getClubProfile(clubId);
  return profile?.description?.slice(0, 200) ?? "";
}
