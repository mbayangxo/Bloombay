/** Member Plan Room — host plan visible after RSVP (merged BB designs). */

export type PlanRoomAttendee = {
  id: string;
  name: string;
  status: "host" | "confirmed" | "pending";
  badge?: string;
};

export type PlanRoomVoiceNote = {
  id: string;
  from: string;
  duration: string;
};

export type PlanRoomChatMessage = {
  id: string;
  from: string;
  text: string;
  mine?: boolean;
  reaction?: string;
};

export type PlanRoomData = {
  eventId: string;
  planTitle: string;
  planFor: string;
  dateLine: string;
  venueLine: string;
  iconicLine: string;
  iconicAccent: string;
  polaroidCaption: string;
  stickyNote: string;
  planSteps: { icon: string; label: string }[];
  dressCode?: string;
  voiceNote?: { from: string; duration: string };
  countdown?: { days: number; hours: number; minutes: number };
  advanceOrderBlurb: string;
  outfitCheckBlurb: string;
  attendees: PlanRoomAttendee[];
  voiceNotes: PlanRoomVoiceNote[];
  chat: PlanRoomChatMessage[];
};

const DEFAULT_PLAN: Omit<PlanRoomData, "eventId" | "planFor"> = {
  planTitle: "Let's make it",
  iconicLine: "Let's make it",
  iconicAccent: "iconic",
  dateLine: "May 24 · 8:00 PM · Lafayette House, NYC",
  venueLine: "Soho · members table",
  polaroidCaption: "this is going to be so good ♡",
  stickyNote: "notes from Maya",
  planSteps: [
    { icon: "🍽", label: "Dinner at Lafayette House" },
    { icon: "🍸", label: "Drinks after at Dante" },
    { icon: "👠", label: "Late night girls' walk ♡" },
  ],
  dressCode: "Dress code: The main character.",
  voiceNote: { from: "Maya", duration: "0:28" },
  countdown: { days: 2, hours: 7, minutes: 48 },
  advanceOrderBlurb: "Skip the line. Pre-order your favorites.",
  outfitCheckBlurb: "Help each other decide what to wear",
  attendees: [
    { id: "you", name: "You", status: "host", badge: "Host" },
    { id: "maya", name: "Maya", status: "confirmed" },
    { id: "teni", name: "Teni", status: "confirmed", badge: "♡" },
    { id: "aisha", name: "Aisha", status: "confirmed" },
    { id: "zara", name: "Zara", status: "confirmed" },
    { id: "noor", name: "Noor", status: "pending" },
    { id: "inv", name: "+2 Invited", status: "pending" },
  ],
  voiceNotes: [
    { id: "v1", from: "Maya", duration: "0:36" },
    { id: "v2", from: "Teni", duration: "0:22" },
    { id: "v3", from: "Aisha", duration: "0:41" },
  ],
  chat: [
    {
      id: "c1",
      from: "Maya",
      text: "I found the cutest vintage top that would be perfect",
      reaction: "♡",
    },
    {
      id: "c2",
      from: "You",
      text: "Obsessed! Can't wait to see everyone",
      mine: true,
      reaction: "✓✓",
    },
  ],
};

export function getPlanRoomData(eventId: string, eventTitle?: string): PlanRoomData {
  const planFor = eventTitle ?? "Saturday in Soho";
  return {
    eventId,
    planFor,
    ...DEFAULT_PLAN,
    iconicLine: planFor === "Saturday in Soho" ? "Let's make it" : "The plan",
    planTitle: planFor === "Saturday in Soho" ? "Let's make it" : planFor,
  };
}
