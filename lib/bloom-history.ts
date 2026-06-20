/** Every member's Bloom history — tickets, seats, stamps, memories */

export type BloomHistoryItem = {
  id: string;
  type: "ticket" | "seat" | "event" | "polaroid" | "stamp" | "memory";
  title: string;
  when: string;
  club?: string;
};

export const DEMO_BLOOM_HISTORY: BloomHistoryItem[] = [
  { id: "1", type: "ticket", title: "Williamsburg Dinner Circle", when: "May 30", club: "Dinner Club" },
  { id: "2", type: "seat", title: "Reserved · Sound Bath", when: "Jun 2" },
  { id: "3", type: "event", title: "Checked in · Morning Run", when: "May 24", club: "Morning Run" },
  { id: "4", type: "stamp", title: "First gathering stamp", when: "May 12" },
  { id: "5", type: "polaroid", title: "Rooftop polaroid", when: "May 18" },
  { id: "6", type: "memory", title: "Met Priya IRL", when: "May 20" },
];
