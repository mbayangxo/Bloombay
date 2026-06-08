/** Member personal space — stamps, tickets, memories, pass, badges */

export type VaultStamp = { id: string; label: string; earnedAt: string; club?: string };
export type VaultTicket = { id: string; event: string; when: string; status: "reserved" | "used" | "cancelled" };
export type VaultMemory = { id: string; caption: string; when: string; club?: string };
export type VaultBadge = { id: string; label: string; description: string };

export const DEMO_STAMPS: VaultStamp[] = [
  { id: "s1", label: "First gathering", earnedAt: "May 12", club: "Morning Run" },
  { id: "s2", label: "10 check-ins", earnedAt: "May 20", club: "Book Club" },
  { id: "s3", label: "Bloomie IRL", earnedAt: "May 24" },
];

export const DEMO_TICKETS: VaultTicket[] = [
  { id: "t1", event: "Williamsburg Dinner Circle", when: "Fri 7:30 PM", status: "reserved" },
  { id: "t2", event: "Founders Brunch · Chelsea", when: "Sun 11:00 AM", status: "reserved" },
  { id: "t3", event: "Harlem Book Night", when: "May 18", status: "used" },
];

export const DEMO_MEMORIES: VaultMemory[] = [
  { id: "m1", caption: "Rooftop sunset with the run crew", when: "Last week", club: "Morning Run" },
  { id: "m2", caption: "First bouquet dinner", when: "May 8" },
];

export const DEMO_BADGES: VaultBadge[] = [
  { id: "b1", label: "Verified woman", description: "Identity confirmed" },
  { id: "b2", label: "Club collector", description: "3+ house crests" },
  { id: "b3", label: "Regular", description: "5+ gatherings attended" },
];

export const MEMBER_PASS = {
  name: "Maya",
  memberId: "BB-NYC-8842",
  tier: "BloomBay Member",
  verified: true,
  city: "NYC",
};
