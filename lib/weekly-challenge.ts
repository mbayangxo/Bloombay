/**
 * Rotating weekly challenge — ties Wall, Happenings, Intros.
 */

import { countCalendarEntries } from "@/lib/member-calendar-store";
import { listEventRsvps } from "@/lib/event-rsvp-store";

export type WeeklyChallenge = {
  id: string;
  weekLabel: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

const CHALLENGE: WeeklyChallenge = {
  id: "challenge-rsvp-week",
  weekLabel: "This week",
  title: "Girl Challenge: show up IRL",
  description: "RSVP to one Happening or save something to your Girl Calendar — then say hi on The Wall.",
  href: "/member/happenings?tab=gatherings",
  cta: "Find a Happening",
};

export function getWeeklyChallenge(): WeeklyChallenge {
  return CHALLENGE;
}

export function getChallengeProgress(): { done: number; target: number; complete: boolean } {
  const rsvps = typeof window !== "undefined" ? listEventRsvps().length : 0;
  const calendar = countCalendarEntries();
  const target = 1;
  const complete = rsvps > 0 || calendar > 0;
  return { done: complete ? 1 : 0, target, complete };
}
