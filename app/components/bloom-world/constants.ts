export const WORLD_WIDTH = 2600;
export const WORLD_HEIGHT = 2000;

export const JOINED = 3482;
export const GOAL = 5000;
export const BLOOM_PROGRESS = (JOINED / GOAL) * 100;
export const REMAINING = GOAL - JOINED;

export const CLUB_FLYERS = [
  {
    id: "book",
    title: "Thursday Book Circle",
    line: "Clubs · Chelsea · Weekly",
    blurb: "A living room of women who actually finish the book — and talk about everything else after.",
  },
  {
    id: "birthday",
    title: "Birthday Table Hosts",
    line: "Gatherings · Your year, your people",
    blurb: "Reserved seats, candles, and the friends who show up like family.",
  },
  {
    id: "yande",
    title: "Meet Yande",
    line: "Your guide to your people",
    blurb: "She learns what lights you up — then points you toward women you'll genuinely click with.",
  },
  {
    id: "run",
    title: "Running & Rosé",
    line: "Clubs · Saturdays · Riverside",
    blurb: "Miles first, laughter after. New members always walk in with someone glad they came.",
  },
  {
    id: "welcome",
    title: "New Member Welcome",
    line: "Gatherings · First Tuesdays",
    blurb: "The night you're introduced to the whole beautiful mess of BloomBay.",
  },
] as const;
