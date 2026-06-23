"use client";

// useYandeSignal — fire a learning signal from any feature on the client side.
// Usage:
//   const signal = useYandeSignal();
//   signal("girlmate", "profile_viewed", { target_id: listing.user_id, object_id: listing.id });
//   signal("girlmate", "message_sent",   { target_id: userId, meta: { compat_score: 87 } });
//   signal("introductions", "bloom_request_accepted", { target_id: senderId });

export type YandeFeature =
  | "girlmate"
  | "introductions"
  | "clubs"
  | "avenue"
  | "passport"
  | "happenings";

export type YandeEvent =
  // GirlMate
  | "profile_viewed" | "message_sent" | "accepted" | "declined_kindly"
  | "ghosted" | "moved_in_confirmed" | "quiz_completed" | "listing_posted"
  // Introductions
  | "bloom_request_sent" | "bloom_request_accepted" | "bloom_request_declined"
  | "came_with_me" | "met_at_event"
  // Clubs
  | "joined" | "attended_event" | "co_attended"
  // Avenue
  | "post_saved" | "post_flowers" | "post_ignored"
  // Yande feedback
  | "recommendation_acted_on" | "recommendation_ignored";

interface SignalOptions {
  target_id?: string;   // user being interacted with
  object_id?: string;   // listing, post, club, event id
  object_type?: string;
  meta?: Record<string, unknown>;
  app?: string;         // defaults to "bloombay"
}

export function sendYandeSignal(
  feature: YandeFeature,
  event_type: YandeEvent,
  options: SignalOptions = {},
): void {
  // Fire and forget — never blocks the UI
  fetch("/api/yande/signal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feature, event_type, ...options }),
  }).catch(() => undefined); // silently ignore network errors
}

// React hook version
export function useYandeSignal() {
  return sendYandeSignal;
}

// Convenience: report a match outcome (when someone confirms they moved in, met, etc.)
export function reportMatchOutcome(
  userBId: string,
  feature: "girlmate" | "introductions",
  outcome: "connected" | "met_in_person" | "moved_in" | "ghosted" | "declined_kindly" | "no_response",
  meta?: { compat_score?: number; field_overlaps?: string[] },
): void {
  fetch("/api/yande/outcome", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_b_id: userBId, feature, outcome, ...meta }),
  }).catch(() => undefined);
}
