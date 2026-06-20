import { CLUBS, type Club } from "@/app/member/clubs/club-data";
import { getClubProfile } from "@/lib/club-world-data";
import { listAllEvents } from "@/lib/bloombay-events-store";
import { isClubDiscoverable } from "@/lib/club-signals";

/** When the club “launched” on BloomBay (demo). */
const LAUNCHED_AT: Record<string, string> = {
  "wander-women": "2024-08-01",
  "morning-run-club": "2024-09-15",
  "after-dark": "2024-10-01",
  "the-page-turners": "2025-01-10",
  "founders-in-the-making": "2025-02-20",
};

export type RankedClub = {
  club: Club;
  popularity: number;
  newness: number;
  activity: number;
  rating: number;
  gatherings: number;
  stamps: number;
  composite: number;
  topStampHolder: string;
  gatheringCount: number;
  avgGatheringRating: number;
};

function buildRankedClub(club: Club): RankedClub {
  const profile = getClubProfile(club.id);
  const hereNow = profile?.hereNow ?? 0;
  const moments = profile?.momentsToday ?? 0;
  const health = profile?.healthScore ?? 70;
  const events = listAllEvents().filter((e) => e.clubId === club.id);
  const liveEvents = events.filter((e) => e.status === "live");
  const gatheringCount = liveEvents.length + club.upcomingEvents.length;
  const avgGatheringRating =
    events.length > 0
      ? events.reduce((s, e) => s + e.ratingAvg, 0) / events.length
      : health / 20;

  const launched = LAUNCHED_AT[club.id] ?? "2025-03-01";
  const daysSinceLaunch = Math.max(
    1,
    (Date.now() - new Date(launched).getTime()) / (1000 * 60 * 60 * 24)
  );
  const newness = Math.round(1000 / daysSinceLaunch);

  const popularity = club.members + hereNow * 3;
  const activity = hereNow * 5 + moments + health;
  const rating = health + avgGatheringRating * 4;
  const gatherings = gatheringCount * 12 + avgGatheringRating * 10;
  const topStampHolder = club.vibeBoard[0]?.author ?? club.ownerName;
  const stamps = Math.round(club.members * 0.15 + health * 2 + hereNow);

  const composite = Math.round(
    popularity * 0.25 + activity * 0.25 + rating * 0.2 + gatherings * 0.2 + stamps * 0.1
  );

  return {
    club,
    popularity,
    newness,
    activity,
    rating,
    gatherings,
    stamps,
    composite,
    topStampHolder,
    gatheringCount,
    avgGatheringRating,
  };
}

export function getAllRankedClubs(): RankedClub[] {
  return CLUBS.filter((c) => isClubDiscoverable(c.id)).map(buildRankedClub);
}

export function sortByMetric(
  metric: keyof Pick<
    RankedClub,
    "popularity" | "newness" | "activity" | "rating" | "gatherings" | "composite" | "stamps"
  >
): RankedClub[] {
  return [...getAllRankedClubs()].sort((a, b) => b[metric] - a[metric]);
}

export const FEATURED_CLUB_SECTIONS = [
  { id: "popular", title: "Most popular", metric: "popularity" as const },
  { id: "new", title: "Newest", metric: "newness" as const },
  { id: "active", title: "Most active", metric: "activity" as const },
  { id: "rated", title: "Top rated", metric: "rating" as const },
  { id: "gatherings", title: "Top gatherings", metric: "gatherings" as const },
] as const;

export function topClubsLeaderboard(limit = 5): RankedClub[] {
  return sortByMetric("composite").slice(0, limit);
}
