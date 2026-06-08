import type { PortalClub } from "./types";

/**
 * Real BloomBay-operated clubs only.
 * Everything else appears when a Club Mama onboards via branding / apply flow.
 */
export const OFFICIAL_CLUBS: PortalClub[] = [
  {
    slug: "founding-mothers-nyc",
    name: "Founding Mothers NYC",
    tagline: "The first women who said yes to BloomBay.",
    description:
      "Our founding circle in New York — the women building BloomBay from the inside. Real gatherings, real introductions, no performance.",
    category: "Community",
    isOfficial: true,
    memberCount: 100,
    color: "#FF1F7D",
    accentColor: "#FF69B4",
    crestBg: "#7F0030",
    layoutKey: "salon",
    curator: "BloomBay",
    tags: ["Founding", "NYC", "Community"],
    vibe: "The room we started in.",
    coverUrl: null,
    bannerUrl: null,
    logoUrl: null,
    logoTemplate: null,
    logoText: null,
    crestImageUrl: null,
    welcomeLine: "You helped build this. Welcome home.",
    crestSymbol: "flower",
    crestAccent: "rose",
    aestheticKey: "bloombay-rose",
    defaultHappeningTemplate: null,
    source: "official",
  },
  {
    slug: "bloombay-gatherings",
    name: "BloomBay Gatherings",
    tagline: "Official dinners, walks, and city plans — hosted by us.",
    description:
      "When BloomBay hosts a happening directly — museum nights, dinner tables, Sunday walks — it lives here. Check Happenings for what's on.",
    category: "Social",
    isOfficial: true,
    memberCount: 0,
    color: "#FF69B4",
    accentColor: "#FF1F7D",
    crestBg: "#C51B7A",
    layoutKey: "editorial",
    curator: "BloomBay",
    tags: ["Dining", "Culture", "NYC"],
    vibe: "Real plans. Real women. No filler.",
    coverUrl: null,
    bannerUrl: null,
    logoUrl: null,
    logoTemplate: null,
    logoText: null,
    crestImageUrl: null,
    welcomeLine: "See what's on this week in Happenings.",
    crestSymbol: "wine",
    crestAccent: "rose",
    aestheticKey: "bloombay-rose",
    defaultHappeningTemplate: null,
    source: "official",
  },
];

export function getOfficialClub(slug: string): PortalClub | undefined {
  return OFFICIAL_CLUBS.find((c) => c.slug === slug);
}
