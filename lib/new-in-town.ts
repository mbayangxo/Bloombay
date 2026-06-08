/**
 * New in town — member state (not nav). First 30 days + first win within 14 days.
 */

export type NewInTownProgram = {
  active: boolean;
  city: string;
  startedAt: string;
  day: number;
  welcomeSeatHref: string;
  newInTownClubId: string;
  starterEventHref: string;
};

const KEY = "bb_new_in_town";
const FIRST_WIN_KEY = "bb_first_win_day";

export function isNewInTown(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function setNewInTown(value: boolean, city = "New York") {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(KEY, "1");
    localStorage.setItem("bb_new_in_town_city", city);
    localStorage.setItem(FIRST_WIN_KEY, new Date().toISOString());
  } else {
    localStorage.removeItem(KEY);
  }
}

export function getNewInTownProgram(): NewInTownProgram | null {
  if (!isNewInTown()) return null;
  const started = localStorage.getItem(FIRST_WIN_KEY) ?? new Date().toISOString();
  const day = Math.min(
    30,
    Math.floor((Date.now() - new Date(started).getTime()) / (86400000)) + 1
  );
  const city = localStorage.getItem("bb_new_in_town_city") ?? "New York";

  return {
    active: true,
    city,
    startedAt: started,
    day,
    welcomeSeatHref: "/member/happenings/seats",
    newInTownClubId: "wander-women",
    starterEventHref: "/member/happenings",
  };
}

export const NEW_IN_TOWN_PERKS = [
  { label: "Welcome seat", sub: "Reserved open seat for new arrivals", href: "/member/happenings/seats" },
  { label: "New in town club", sub: "Starter community for your first month", href: "/member/clubs/wander-women" },
  { label: "Starter events", sub: "Curated first gatherings", href: "/member/happenings" },
  { label: "Girl-tested places", sub: "Hidden gems & safe favorites", href: "/member/explore#girl-gems" },
  { label: "New arrivals circle", sub: "Meet women who just landed", href: "/member/room?space=wall" },
] as const;

export const FIRST_WIN_ACTIONS = [
  { id: "seat", label: "Book a welcome seat", href: "/member/happenings/seats", done: false },
  { id: "club", label: "Join a club", href: "/member/clubs", done: false },
  { id: "event", label: "RSVP to a gathering", href: "/member/happenings", done: false },
  { id: "meet", label: "Accept a bloom request", href: "/member/intros/bloom-requests", done: false },
] as const;
