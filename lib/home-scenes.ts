/**
 * Home opens on scenes, not dashboards.
 * Lines pull from real member concepts: seats, witnesses, gatherings, clubs, Yande.
 */

import type { MemberHappeningEvent } from "@/lib/bloombay-events-member";
import type { YandeMemberState } from "@/lib/yande-member-state";
import { INVITATIONS } from "@/lib/member-portal-data";

export type BloomScene = {
  id: string;
  line: string;
  whisper?: string;
  href: string;
  /** Visual pulse on the scene line */
  tone?: "pulse" | "warm" | "witness" | "seat";
};

const WITNESS_KEY = "bb_witness_today";

export function markWitnessToday() {
  if (typeof window === "undefined") return;
  localStorage.setItem(WITNESS_KEY, new Date().toDateString());
}

export function hadWitnessToday(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(WITNESS_KEY) === new Date().toDateString();
}

/** Demo soul line — flip off when real witness feed ships. */
const DEMO_WITNESS_SCENE = true;

export function showWitnessScene(): boolean {
  return DEMO_WITNESS_SCENE || hadWitnessToday();
}

export function buildHomeScenes(
  live: MemberHappeningEvent[],
  state: YandeMemberState,
  name?: string
): BloomScene[] {
  const scenes: BloomScene[] = [];
  const firstName = name?.trim() || "you";

  const womenTonight =
    live.length > 0
      ? live.reduce((n, g) => n + Math.max(4, g.attendees.length + g.extra), 0)
      : 18;

  scenes.push({
    id: "gathering-tonight",
    line: `${womenTonight} women are gathering tonight.`,
    whisper: `${state.city} · tables filling`,
    href: "/member/tonight",
    tone: "pulse",
  });

  const nextInv = INVITATIONS[0];
  if (nextInv) {
    scenes.push({
      id: "invitation",
      line: `${nextInv.title} — envelope on your stack.`,
      whisper: `${nextInv.when} · ${nextInv.host} is hosting`,
      href: `/member/happenings/gatherings/${nextInv.id === "inv1" ? "g1" : "g2"}`,
      tone: "warm",
    });
  }

  const museumOpens = live.find((g) => g.title.toLowerCase().includes("museum")) ?? live[0];
  if (museumOpens) {
    scenes.push({
      id: "club-opens",
      line: `Culture Crawl opens in ${museumOpens.time || "a few hours"}.`,
      whisper: "Gallery program · good shoes",
      href: "/member/clubs/culture-crawl/world",
      tone: "warm",
    });
  } else {
    scenes.push({
      id: "club-opens",
      line: "Culture Crawl opens in 3 hours.",
      whisper: "MoMA late night · members on the list",
      href: "/member/clubs/culture-crawl/world",
      tone: "warm",
    });
  }

  scenes.push({
    id: "seat-saved",
    line: "Sofia saved you a seat at Sunday Supper.",
    whisper: "Reply in Happenings · table almost full",
    href: "/member/happenings/seats",
    tone: "seat",
  });

  if (showWitnessScene()) {
    scenes.push({
      id: "witness",
      line: `Someone witnessed ${firstName} this morning.`,
      whisper: "The Gathering saw you · bloom energy",
      href: "/member/vault?tab=stamps",
      tone: "witness",
    });
  }

  if (state.bouquetFilled < state.bouquetMax) {
    scenes.push({
      id: "bouquet",
      line: `${state.bouquetMax - state.bouquetFilled} spots left in your bouquet.`,
      whisper: "Your inner circle · your apartment",
      href: "/member/bouquet",
      tone: "warm",
    });
  }

  return scenes.slice(0, 5);
}
