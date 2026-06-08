/**
 * Member Plans — RSVPs and saved outings (header badge + /member/plans).
 */

import { listEventRsvps } from "@/lib/event-rsvp-store";
import { getMemberHappeningById } from "@/lib/bloombay-events-member";

const SELF_ID = "member-self";

export type MemberPlanItem = {
  rsvpId: string;
  eventId: string;
  title: string;
  when: string;
  place: string;
  href: string;
  createdAt: string;
};

export function countMemberPlans(): number {
  return listEventRsvps().filter((r) => r.memberId === SELF_ID).length;
}

/** First RSVP plan room, or null if none yet. */
export function primaryPlanHref(): string | null {
  return listMemberPlans()[0]?.href ?? null;
}

export function listMemberPlans(): MemberPlanItem[] {
  return listEventRsvps()
    .filter((r) => r.memberId === SELF_ID)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => {
      const g = getMemberHappeningById(r.eventId);
      return {
        rsvpId: r.id,
        eventId: r.eventId,
        title: g?.title ?? "Gathering",
        when: g ? `${g.date} · ${g.time}` : "Date TBA",
        place: g ? `${g.venue} · ${g.neighborhood}` : "",
        href: `/member/plan/${r.eventId}`,
        createdAt: r.createdAt,
      };
    });
}
