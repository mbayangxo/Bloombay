/**
 * Sync founder / studio events to Supabase gatherings (open seats).
 */

import type { BloomBayEvent } from "@/lib/bloombay-events-store";

/** Push a published open-seat event to the member gatherings table. */
export async function publishGatheringFromEvent(event: BloomBayEvent): Promise<void> {
  if (event.status !== "live") return;
  if (event.kind === "blueday") return;

  const startsAt = event.startAt || new Date().toISOString();

  try {
    await fetch("/api/member/gatherings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: event.title,
        startsAt,
        area: event.neighborhood,
        neighborhood: event.neighborhood,
        venue: event.venue,
        capacity: event.capacity ?? 12,
        clubSlug: event.clubId ?? undefined,
        eventKey: event.id,
      }),
    });
  } catch {
    /* demo / offline — local store still works */
  }
}
