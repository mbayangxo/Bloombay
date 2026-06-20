/**
 * BloomBay space moods — cinematography, not dashboards.
 * Each place has a feeling before it has a feature list.
 */

export type SpaceMoodId =
  | "home"
  | "happenings"
  | "tonight"
  | "room"
  | "lounge"
  | "connect"
  | "explore"
  | "club-museum"
  | "club-dinner"
  | "club-books"
  | "club-wellness"
  | "club-night"
  | "club-founders"
  | "club-default";

export type SpaceMood = {
  id: SpaceMoodId;
  /** One-line atmosphere for the space */
  tagline: string;
  /** Opening scene when you enter */
  scene: string;
  /** Whisper under the scene */
  whisper?: string;
};

const MOODS: Record<SpaceMoodId, SpaceMood> = {
  home: {
    id: "home",
    tagline: "The city is awake",
    scene: "Someone is already getting ready.",
    whisper: "BloomBay · members only",
  },
  happenings: {
    id: "happenings",
    tagline: "Tonight",
    scene: "Possibility in every neighborhood.",
    whisper: "Seats · invitations · the city",
  },
  tonight: {
    id: "tonight",
    tagline: "Right now",
    scene: "Girls are out. The night is young.",
    whisper: "Are you coming?",
  },
  room: {
    id: "room",
    tagline: "The Lobby",
    scene: "Someone is still awake.",
    whisper: "Wall · New Keys · Bulletin — pick a room",
  },
  lounge: {
    id: "lounge",
    tagline: "Your apartment",
    scene: "Your bouquet. Your memories. Your door.",
    whisper: "Only you live here",
  },
  connect: {
    id: "connect",
    tagline: "Between you and her",
    scene: "A text you were hoping to get.",
    whisper: "Moments, not menus — who is already moving toward you?",
  },
  explore: {
    id: "explore",
    tagline: "Wander",
    scene: "Girl-tested corners of the city.",
    whisper: "Not your calendar — your universe",
  },
  "club-museum": {
    id: "club-museum",
    tagline: "Gallery hours",
    scene: "Marble halls. Programs in hand. Intellectual girls in good shoes.",
    whisper: "Culture Crawl · openings & museum nights",
  },
  "club-dinner": {
    id: "club-dinner",
    tagline: "The table is set",
    scene: "Candlelight. Invitations. Hostess energy.",
    whisper: "Sunday Supper · reservations matter",
  },
  "club-books": {
    id: "club-books",
    tagline: "After the last page",
    scene: "Wine rings on the table. Opinions worth staying for.",
    whisper: "The Page Turners",
  },
  "club-wellness": {
    id: "club-wellness",
    tagline: "Exhale",
    scene: "Soft light. Honest bodies. No performance.",
    whisper: "Wellness Circle · breath & release",
  },
  "club-night": {
    id: "club-night",
    tagline: "Late",
    scene: "Heels on pavement. Laughter spilling onto the sidewalk.",
    whisper: "Nightlife · the city after dark",
  },
  "club-founders": {
    id: "club-founders",
    tagline: "Build in public",
    scene: "Velvet chairs. Sharp ideas. Women who ship.",
    whisper: "Founders · operators · allies",
  },
  "club-default": {
    id: "club-default",
    tagline: "Inside the club",
    scene: "Your people are already here.",
    whisper: "Wall · moments · happenings",
  },
};

/** Map club ids to distinct cinematography. */
export function clubMoodId(clubId: string, category?: string): SpaceMoodId {
  if (clubId === "culture-crawl") return "club-museum";
  if (clubId === "sunday-supper-club") return "club-dinner";
  if (clubId === "the-page-turners") return "club-books";
  if (clubId === "the-wellness-circle" || clubId === "slow-living-society") return "club-wellness";
  if (clubId === "founders-in-the-making" || category === "Entrepreneurship") return "club-founders";
  if (category === "Nightlife") return "club-night";
  return "club-default";
}

export function getSpaceMood(id: SpaceMoodId): SpaceMood {
  return MOODS[id] ?? MOODS["club-default"];
}

export function clubSceneLine(clubId: string, clubName: string, hereNow: number): string {
  const mood = getSpaceMood(clubMoodId(clubId));
  if (hereNow > 0) return `${hereNow} women are inside ${clubName} right now.`;
  return mood.scene;
}
