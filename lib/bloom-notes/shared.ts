export type CityTag =
  | "solo_friendly"
  | "group_vibes"
  | "laptop_friendly"
  | "first_date"
  | "meet_people"
  | "worth_it"
  | "romantic"
  | "special_occasion";

export const CITY_TAG_LABELS: Record<CityTag, string> = {
  solo_friendly: "Solo-friendly",
  group_vibes: "Group vibes",
  laptop_friendly: "Laptop ok",
  first_date: "First date",
  meet_people: "Meet people",
  worth_it: "Worth it",
  romantic: "Romantic",
  special_occasion: "Special occasion",
};

export const CITY_TAG_EMOJIS: Record<CityTag, string> = {
  solo_friendly: "🌸",
  group_vibes: "👯",
  laptop_friendly: "💻",
  first_date: "🌹",
  meet_people: "✨",
  worth_it: "💫",
  romantic: "🕯️",
  special_occasion: "🥂",
};

export type BloomNote = {
  id: string;
  author_id: string;
  author_name: string | null;
  author_avatar: string | null;
  place_slug: string;
  place_name: string | null;
  gathering_id: string | null;
  content: string;
  photo_urls: string[];
  created_at: string;
  /** Total flower-units (flower=1, bouquet=12). */
  flower_count: number;
  gave_flower: boolean;
  my_gift_kind: "flower" | "bouquet" | null;
  saved: boolean;
};
