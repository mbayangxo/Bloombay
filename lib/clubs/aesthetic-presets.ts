export type ClubAesthetic = {
  id: string;
  label: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  crestBg: string;
};

export const CLUB_AESTHETICS: ClubAesthetic[] = [
  {
    id: "bloombay-rose",
    label: "BloomBay Rose",
    description: "Classic hot pink — our signature house look.",
    primaryColor: "#FF1F7D",
    accentColor: "#FF69B4",
    crestBg: "#7F0030",
  },
  {
    id: "burgundy-table",
    label: "Burgundy Table",
    description: "Supper club energy — deep wine and candlelight.",
    primaryColor: "#6B1D3A",
    accentColor: "#C45C7A",
    crestBg: "#3A0A18",
  },
  {
    id: "midnight-culture",
    label: "Midnight Culture",
    description: "Museum nights, jazz, after-dark city.",
    primaryColor: "#1A0A2E",
    accentColor: "#4A6FA5",
    crestBg: "#0D0618",
  },
  {
    id: "garden-soft",
    label: "Garden Soft",
    description: "Wellness walks, slow mornings, green calm.",
    primaryColor: "#1A6B4F",
    accentColor: "#7DCEA0",
    crestBg: "#0F3D2E",
  },
  {
    id: "ivory-editorial",
    label: "Ivory Editorial",
    description: "Books, ideas, cream paper and serif type.",
    primaryColor: "#111111",
    accentColor: "#F5F0E8",
    crestBg: "#2A2A2A",
  },
  {
    id: "sunset-social",
    label: "Sunset Social",
    description: "Rooftops, aperitivo, golden hour gatherings.",
    primaryColor: "#FB923C",
    accentColor: "#F472B6",
    crestBg: "#9A3412",
  },
];

export function getAesthetic(id: string): ClubAesthetic {
  return CLUB_AESTHETICS.find((a) => a.id === id) ?? CLUB_AESTHETICS[0];
}
