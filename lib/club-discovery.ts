/** Member club discovery — browse, interests, recommendations, trending, nearby, public events. */

import { CLUBS, type Club } from "@/app/member/clubs/club-data";
import { listDiscoveredClubs } from "@/lib/club-registry";
import { getClubProfile } from "@/lib/club-world-data";
import { isClubDiscoverable } from "@/lib/club-signals";
import { sortByMetric } from "@/lib/member-club-rankings";
import { listAllEvents } from "@/lib/bloombay-events-store";
import { readYandeMemberProfile } from "@/lib/yande-member-profile";

export type DiscoveryClub = Club & { reason?: string };

export function getDiscoverableClubs(): Club[] {
  if (typeof window !== "undefined") {
    return listDiscoveredClubs();
  }
  return CLUBS.filter((c) => isClubDiscoverable(c.id));
}

export function searchClubsByInterests(query: string, interests: string[]): Club[] {
  const q = query.trim().toLowerCase();
  let list = getDiscoverableClubs();
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q)
    );
  }
  if (interests.length) {
    list = list.filter((c) =>
      interests.some((i) => c.category.toLowerCase().includes(i.toLowerCase()) || c.tagline.toLowerCase().includes(i.toLowerCase()))
    );
  }
  return list.sort((a, b) => b.members - a.members);
}

export function getRecommendedClubs(limit = 6): DiscoveryClub[] {
  const profile = typeof window !== "undefined" ? readYandeMemberProfile() : null;
  const interests = profile?.interests ?? [];
  const ranked = sortByMetric("composite").map((r) => r.club);
  const discoverable = ranked.filter((c) => isClubDiscoverable(c.id));
  return discoverable.slice(0, limit).map((c) => ({
    ...c,
    reason:
      interests.length && interests.some((i) => c.category.toLowerCase().includes(i.toLowerCase()))
        ? `Matches your interests`
        : "Popular with women in your city",
  }));
}

export function getTrendingClubs(limit = 5): DiscoveryClub[] {
  return sortByMetric("activity")
    .filter((r) => isClubDiscoverable(r.club.id))
    .slice(0, limit)
    .map((r) => ({ ...r.club, reason: "Trending this week" }));
}

export function getNearbyClubs(city = "New York", limit = 5): DiscoveryClub[] {
  const cityNeedle = city.toLowerCase().split(",")[0] ?? city;
  return getDiscoverableClubs()
    .filter((c) => {
      const profileCity = getClubProfile(c.id)?.city ?? "New York";
      return profileCity.toLowerCase().includes(cityNeedle.toLowerCase());
    })
    .slice(0, limit)
    .map((c) => ({ ...c, reason: `Active in ${city}` }));
}

export type PublicClubEvent = {
  id: string;
  title: string;
  clubId: string;
  clubName: string;
  date: string;
  href: string;
};

export function getUpcomingPublicEvents(limit = 8): PublicClubEvent[] {
  const events = listAllEvents().filter(
    (e) => e.status === "live" && e.visibility === "all" && e.clubId
  );
  return events.slice(0, limit).map((e) => {
    const club = CLUBS.find((c) => c.id === e.clubId);
    return {
      id: e.id,
      title: e.title,
      clubId: e.clubId!,
      clubName: club?.name ?? "Club",
      date: e.startAt?.slice(0, 10) ?? "Soon",
      href: `/member/happenings/gatherings/${e.id}`,
    };
  });
}
