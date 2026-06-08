export type ClubLayoutId = "editorial" | "salon" | "midnight";

export type ClubLayoutTemplate = {
  id: ClubLayoutId;
  label: string;
  description: string;
  /** Dark hero — affects text contrast defaults */
  darkHero: boolean;
  /** Uses full-bleed cover image in hero when available */
  coverHero: boolean;
};

export const CLUB_LAYOUTS: ClubLayoutTemplate[] = [
  {
    id: "editorial",
    label: "Editorial",
    description: "Magazine cover — big photo, bold serif title, cream story below.",
    darkHero: false,
    coverHero: true,
  },
  {
    id: "salon",
    label: "Salon",
    description: "Soft gradient, centered crest, rounded cards — warm and social.",
    darkHero: false,
    coverHero: false,
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "After-dark mood — dark hero, high contrast, accent pops.",
    darkHero: true,
    coverHero: true,
  },
];

export function getClubLayout(id: string | null | undefined): ClubLayoutTemplate {
  return CLUB_LAYOUTS.find((l) => l.id === id) ?? CLUB_LAYOUTS[1];
}
