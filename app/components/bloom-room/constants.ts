export const ROOM_WIDTH = 2800;
export const ROOM_HEIGHT = 2200;

export const FOCAL = {
  invitation: { x: 720, y: 420 },
  charter: { x: 920, y: 620 },
  clubs: { x: 1780, y: 720 },
  city: { x: 2100, y: 1100 },
  meter: { x: 1920, y: 280 },
  pin: { x: 320, y: 880 },
  reply: { x: 480, y: 920 },
} as const;

export type ObjectId = keyof typeof FOCAL;

export const CLUB_CARDS = [
  { title: "Thursday Book Circle", line: "Chelsea · Weekly" },
  { title: "Birthday Table Hosts", line: "Gatherings" },
  { title: "Running & Rosé", line: "Riverside · Saturdays" },
  { title: "New Member Welcome", line: "First Tuesdays" },
] as const;

export const LIFE_MOMENTS = [
  "Find your next book club.",
  "Meet women who actually show up.",
  "Birthday dinners without planning them.",
  "Walk into a room where someone saved you a seat.",
  "Find your people in a new city.",
] as const;

export const BLOOM_STAGES = [
  { emoji: "🌱", label: "Budding" },
  { emoji: "🌷", label: "Blooming" },
  { emoji: "🌸", label: "Nearly Ready" },
  { emoji: "💐", label: "Opening Night" },
] as const;
