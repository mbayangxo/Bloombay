import type { PosterTemplateType } from "@/lib/poster-templates/types";

export type HappeningEventType = {
  type: PosterTemplateType;
  label: string;
  description: string;
  categoryLabel: string;
};

export type HappeningVariant = {
  id: string;
  label: string;
  accentColor: string;
  /** Default photo when member skips upload */
  stockImageUrl: string;
  /** PNG thumbnail for template picker */
  previewPng: string;
};

export const HAPPENING_EVENT_TYPES: HappeningEventType[] = [
  {
    type: "party",
    label: "Party",
    description: "Nightlife, launches, celebrations — bold poster energy.",
    categoryLabel: "Nightlife · Party",
  },
  {
    type: "dinner",
    label: "Dinner",
    description: "Supper clubs, restaurant tables, girls' night out.",
    categoryLabel: "Supper Club · Dinner",
  },
  {
    type: "museum",
    label: "Museum & Culture",
    description: "Galleries, film nights, exhibitions, after-hours culture.",
    categoryLabel: "Gallery · Culture",
  },
  {
    type: "walk",
    label: "Walk & Explore",
    description: "Neighborhood walks, coffee after, city adventures.",
    categoryLabel: "Walk · Explore",
  },
  {
    type: "wellness",
    label: "Wellness",
    description: "Pilates, matcha mornings, restore and reset.",
    categoryLabel: "Wellness · Restore",
  },
  {
    type: "club",
    label: "Club Gathering",
    description: "Official club happenings — crest-forward, members-first.",
    categoryLabel: "Club · BloomBay",
  },
];

const STOCK = {
  party:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  dinner:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  museum:
    "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=80",
  walk:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
  wellness:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
  club:
    "https://images.unsplash.com/photo-1476480862122-209bfaa8efa1?auto=format&fit=crop&w=900&q=80",
};

/** 2–3 poster variants per event type — distinct accent + stock photo */
export const HAPPENING_VARIANTS: Record<PosterTemplateType, HappeningVariant[]> = {
  party: [
    {
      id: "party-neon",
      label: "Neon Night",
      accentColor: "#ff2d6f",
      stockImageUrl: STOCK.party,
      previewPng: "/happenings/posters/01_Girls_Night.png",
    },
    {
      id: "party-dance",
      label: "Dance Floor",
      accentColor: "#c4006a",
      stockImageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/06_Dance_All_Night.png",
    },
    {
      id: "party-rooftop",
      label: "Rooftop Session",
      accentColor: "#ff69b4",
      stockImageUrl:
        "https://images.unsplash.com/photo-1519671482749-fd09fef7d5be?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/08_Rooftop_Sessions.png",
    },
  ],
  dinner: [
    {
      id: "dinner-aperitivo",
      label: "Aperitivo",
      accentColor: "#c9a66b",
      stockImageUrl: STOCK.dinner,
      previewPng: "/happenings/posters/02_Save_The_Date_Aperitivo.png",
    },
    {
      id: "dinner-society",
      label: "Dinner Society",
      accentColor: "#8b4513",
      stockImageUrl:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/04_Italian_Dinner_Society.png",
    },
    {
      id: "dinner-brunch",
      label: "Sunday Table",
      accentColor: "#e8a4b8",
      stockImageUrl:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/07_Sunday_Brunch_Club.png",
    },
  ],
  museum: [
    {
      id: "museum-film",
      label: "Film Club",
      accentColor: "#2a2a32",
      stockImageUrl: STOCK.museum,
      previewPng: "/happenings/posters/05_Film_Club.png",
    },
    {
      id: "museum-jazz",
      label: "Vinyl & Jazz",
      accentColor: "#4a6fa5",
      stockImageUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/03_Vinyl_Night_Jazz.png",
    },
  ],
  walk: [
    {
      id: "walk-books",
      label: "Bagels & Books",
      accentColor: "#7eb8a4",
      stockImageUrl: STOCK.walk,
      previewPng: "/happenings/posters/09_Bagels_And_Books.png",
    },
    {
      id: "walk-roadtrip",
      label: "City Wander",
      accentColor: "#1a6b4f",
      stockImageUrl:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/10_Ladies_First_Road_Trip.png",
    },
  ],
  wellness: [
    {
      id: "wellness-matcha",
      label: "Matcha Morning",
      accentColor: "#d4a5c8",
      stockImageUrl: STOCK.wellness,
      previewPng: "/happenings/posters/07_Sunday_Brunch_Club.png",
    },
    {
      id: "wellness-restore",
      label: "Restore",
      accentColor: "#9b7eb8",
      stockImageUrl:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/09_Bagels_And_Books.png",
    },
  ],
  club: [
    {
      id: "club-house",
      label: "House Crest",
      accentColor: "#e85d8a",
      stockImageUrl: STOCK.club,
      previewPng: "/happenings/posters/04_Italian_Dinner_Society.png",
    },
    {
      id: "club-gathering",
      label: "Member Table",
      accentColor: "#ff1f7d",
      stockImageUrl:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
      previewPng: "/happenings/posters/01_Girls_Night.png",
    },
  ],
};

export function getEventTypeMeta(type: PosterTemplateType): HappeningEventType {
  return HAPPENING_EVENT_TYPES.find((e) => e.type === type) ?? HAPPENING_EVENT_TYPES[0];
}

export function getVariantsForType(type: PosterTemplateType): HappeningVariant[] {
  return HAPPENING_VARIANTS[type] ?? HAPPENING_VARIANTS.dinner;
}

export function getVariant(type: PosterTemplateType, variantId: string): HappeningVariant {
  return (
    getVariantsForType(type).find((v) => v.id === variantId) ?? getVariantsForType(type)[0]
  );
}
