/** Member Bloom history — tickets, seats, events, polaroids, stamps, memories */

export type BloomHistoryKind = "ticket" | "seat" | "event" | "polaroid" | "stamp" | "memory";

export type BloomHistoryItem = {
  id: string;
  kind: BloomHistoryKind;
  title: string;
  when: string;
  club?: string;
  attended?: boolean;
};

export const DEMO_BLOOM_HISTORY: BloomHistoryItem[] = [
  { id: "h1", kind: "ticket", title: "Williamsburg Dinner Circle", when: "May 30", club: "Dinner Club", attended: false },
  { id: "h2", kind: "seat", title: "Reserved · Founders Brunch", when: "Jun 1", club: "Founders" },
  { id: "h3", kind: "event", title: "Harlem Book Night", when: "May 18", club: "Page Turners", attended: true },
  { id: "h4", kind: "stamp", title: "First IRL check-in", when: "May 12" },
  { id: "h5", kind: "polaroid", title: "Rooftop with run crew", when: "May 8", club: "Morning Run" },
  { id: "h6", kind: "memory", title: "Met Priya — Bloomie QR", when: "May 24" },
];

export const TRUST_BADGES = [
  { id: "verified", label: "Verified woman", description: "Identity confirmed on BloomBay" },
  { id: "attended", label: "Attended event", description: "Checked in at a real gathering" },
  { id: "hosted", label: "Hosted event", description: "Led a gathering for members" },
  { id: "leader", label: "Community leader", description: "Trusted host or curator path" },
  { id: "curator", label: "Curator", description: "Creates culture, clubs, and welcomes women" },
] as const;
