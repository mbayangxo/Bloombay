"use client";

import { HappeningEventDetail } from "@/app/components/member/happening-event-detail";

/** Full event page — RSVP here, then Plan Room unlocks. */
export function LiveGatheringDetail({ id }: { id: string }) {
  return <HappeningEventDetail id={id} />;
}
