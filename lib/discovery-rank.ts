/**
 * Discovery ranker — mood + location → picks for Happenings, Maps, Yande.
 */

import type { MemberHappeningEvent } from "@/lib/bloombay-events-member";
import {
  CITY_ALONE,
  CITY_HAPPENING_FEED,
  GATHERINGS,
  INVITATIONS,
  SEATS_VENUES,
} from "@/lib/member-portal-data";
import { EXPLORE_GIRL_GEMS, EXPLORE_WELLNESS } from "@/lib/member-explore-data";
import { PARTNER_VENUES } from "@/lib/discovery-partners";
import { moodById, type DiscoveryMoodId } from "@/lib/discovery-mood";
import { getDiscoveryMood } from "@/lib/discovery-mood-store";

export type DiscoveryContext = {
  city: string;
  neighborhood: string;
};

export type DiscoveryPick = {
  id: string;
  title: string;
  meta: string;
  href: string;
  kind: "happening" | "seat" | "partner" | "gem" | "solo" | "connect" | "club";
  score: number;
  tag: string;
  sourceId: string;
  when: string;
  neighborhood: string;
};

type Rankable = {
  id: string;
  sourceId: string;
  title: string;
  meta: string;
  href: string;
  kind: DiscoveryPick["kind"];
  tag: string;
  when: string;
  neighborhood: string;
  tags: string[];
};

function norm(s: string) {
  return s.toLowerCase().trim();
}

function locationBoost(ctx: DiscoveryContext, neighborhood: string): number {
  const hood = norm(ctx.neighborhood);
  const n = norm(neighborhood);
  const city = norm(ctx.city);
  if (!hood && !city) return 0;
  if (hood && (n.includes(hood) || hood.includes(n))) return 18;
  if (city && (n.includes(city) || city.includes("new york") || city === "nyc")) return 8;
  return 0;
}

function moodBoost(moodId: DiscoveryMoodId | null, itemTags: string[]): number {
  const mood = moodById(moodId);
  if (!mood) return 0;
  let boost = 0;
  for (const t of mood.tags) {
    if (itemTags.some((it) => it.includes(t) || t.includes(it))) boost += 12;
  }
  if (itemTags.some((t) => mood.tags.includes(t))) boost += 8;
  return boost;
}

function buildCatalog(live: MemberHappeningEvent[]): Rankable[] {
  const items: Rankable[] = [];

  for (const g of live) {
    items.push({
      id: `live-${g.id}`,
      sourceId: g.id,
      title: g.title,
      meta: `${g.date} · ${g.time} · ${g.neighborhood}`,
      href: `/member/happenings/gatherings/${g.id}`,
      kind: "happening",
      tag: g.kind === "blueday" ? "Blue Day" : "Gathering",
      when: `${g.date} · ${g.time}`,
      neighborhood: g.neighborhood,
      tags: ["gathering", "social", "irl", "tonight"],
    });
  }

  for (const g of GATHERINGS) {
    if (live.some((l) => l.id === g.id)) continue;
    items.push({
      id: `g-${g.id}`,
      sourceId: g.id,
      title: g.title,
      meta: `${g.date} · ${g.time} · ${g.neighborhood}`,
      href: `/member/happenings/gatherings/${g.id}`,
      kind: "happening",
      tag: "Gathering",
      when: `${g.date} · ${g.time}`,
      neighborhood: g.neighborhood,
      tags: ["gathering", "social", "deep", "connect"],
    });
  }

  for (const inv of INVITATIONS) {
    const gid = inv.id === "inv1" ? "g1" : "g2";
    items.push({
      id: `inv-${inv.id}`,
      sourceId: inv.id,
      title: inv.title,
      meta: `${inv.when} · ${inv.place}`,
      href: `/member/happenings/gatherings/${gid}`,
      kind: "happening",
      tag: inv.status === "new" ? "New invite" : "Invitation",
      when: inv.when,
      neighborhood: inv.place,
      tags: ["social", "gathering", "get-out", "irl", "seat"],
    });
  }

  for (const s of SEATS_VENUES) {
    items.push({
      id: `seat-${s.id}`,
      sourceId: s.id,
      title: s.name,
      meta: `${s.area} · ${s.spotsLeft} spots · ${s.capacity}`,
      href: "/member/happenings/seats",
      kind: "seat",
      tag: "Seat",
      when: "Forming now",
      neighborhood: s.area,
      tags: ["seat", "social", "irl", "tonight"],
    });
  }

  for (const c of CITY_HAPPENING_FEED) {
    items.push({
      id: `city-${c.title}`,
      sourceId: `city-${c.title}`,
      title: c.title,
      meta: `${c.when} · ${c.where}`,
      href: "/member/tonight",
      kind: "happening",
      tag: "Tonight",
      when: c.when,
      neighborhood: c.where,
      tags: ["tonight", "social", "get-out", "irl"],
    });
  }

  for (const a of CITY_ALONE) {
    items.push({
      id: `solo-${a.title}`,
      sourceId: `solo-${a.title}`,
      title: a.title,
      meta: a.hint,
      href: "/member/happenings?tab=solo",
      kind: "solo",
      tag: "Solo",
      when: "Your pace",
      neighborhood: a.hint.split("·")[0]?.trim() ?? "",
      tags: ["solo", "chill", "restore", "soft"],
    });
  }

  for (const p of PARTNER_VENUES) {
    items.push({
      id: `partner-${p.id}`,
      sourceId: p.id,
      title: p.title,
      meta: p.meta,
      href: p.href,
      kind: "partner",
      tag: p.tag,
      when: "Partner pick",
      neighborhood: p.neighborhood,
      tags: p.tags,
    });
  }

  for (const gem of [...EXPLORE_GIRL_GEMS, ...EXPLORE_WELLNESS]) {
    items.push({
      id: `gem-${gem.id}`,
      sourceId: gem.id,
      title: gem.title,
      meta: gem.meta,
      href: gem.href,
      kind: "gem",
      tag: gem.tag,
      when: "Anytime",
      neighborhood: gem.meta,
      tags: ["gem", "culture", "explore", "guide"],
    });
  }

  items.push({
    id: "connect-bloom",
    sourceId: "connect-bloom",
    title: "Send a Bloom request",
    meta: "Intros · who to meet this week",
    href: "/member/intros",
    kind: "connect",
    tag: "Intros",
    when: "This week",
    neighborhood: "",
    tags: ["connect", "1-on-1", "deep", "bloom"],
  });

  return items;
}

export function rankSuggestions(
  ctx: DiscoveryContext,
  moodId: DiscoveryMoodId | null = null,
  live: MemberHappeningEvent[] = [],
  limit = 6
): DiscoveryPick[] {
  const mood = moodId ?? (typeof window !== "undefined" ? getDiscoveryMood() : null);
  const catalog = buildCatalog(live);

  const scored = catalog.map((item) => {
    const base = item.kind === "partner" ? 14 : item.kind === "happening" ? 10 : 6;
    const score =
      base +
      locationBoost(ctx, item.neighborhood) +
      moodBoost(mood, item.tags) +
      (item.tag === "New invite" ? 6 : 0);
    return {
      id: item.id,
      sourceId: item.sourceId,
      title: item.title,
      meta: item.meta,
      href: item.href,
      kind: item.kind,
      score,
      tag: item.tag,
      when: item.when,
      neighborhood: item.neighborhood,
    };
  });

  const seen = new Set<string>();
  return scored
    .sort((a, b) => b.score - a.score)
    .filter((p) => {
      if (seen.has(p.sourceId)) return false;
      seen.add(p.sourceId);
      return true;
    })
    .slice(0, limit);
}

export function getTopDiscoveryPick(
  ctx: DiscoveryContext,
  live: MemberHappeningEvent[] = []
): DiscoveryPick | null {
  return rankSuggestions(ctx, null, live, 1)[0] ?? null;
}

export function discoveryHeadline(moodId: DiscoveryMoodId | null, top: DiscoveryPick | null): string {
  const mood = moodById(moodId);
  if (!top) return "Picks for you in the city";
  if (!mood) return `Top pick · ${top.tag}`;
  return `${mood.emoji} ${mood.label} · ${top.title}`;
}
