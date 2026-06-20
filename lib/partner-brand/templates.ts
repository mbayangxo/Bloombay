import type { PartnerBrandColors, PartnerBrandTemplateId, PartnerMenuSection } from "./types";

export type PartnerBrandTemplate = {
  id: PartnerBrandTemplateId;
  name: string;
  description: string;
  emoji: string;
  defaultColors: PartnerBrandColors;
  taglineStarter: string;
  aboutStarters: { headline: string; body: string }[];
  menuStarters: PartnerMenuSection[];
};

const uid = () => `pms-${Math.random().toString(36).slice(2, 8)}`;

function section(title: string, items: { name: string; description: string; price?: string }[]): PartnerMenuSection {
  return {
    id: uid(),
    title,
    items: items.map((i) => ({ id: uid(), ...i })),
  };
}

export const PARTNER_BRAND_TEMPLATES: PartnerBrandTemplate[] = [
  {
    id: "cafe",
    name: "Café",
    description: "Warm corners, morning light, pastry-forward menus.",
    emoji: "☕",
    defaultColors: {
      accent: "#c45c26",
      accentSoft: "#f5e6d8",
      background: "#fffaf6",
      text: "#2a1810",
    },
    taglineStarter: "Work-friendly · outlets · girl-approved croissants",
    aboutStarters: [
      { headline: "Our room", body: "Soft light, big windows, and tables you can stay at for hours." },
      { headline: "Why BloomBay", body: "We hold seats for women gathering IRL — solo brunch or a full table." },
    ],
    menuStarters: [
      section("Morning", [
        { name: "Almond croissant", description: "Flaky, not too sweet", price: "$6" },
        { name: "Cortado", description: "Oat or almond milk", price: "$5" },
      ]),
      section("Afternoon", [
        { name: "Seasonal tart", description: "Rotating fruit", price: "$9" },
        { name: "House wine", description: "Glass · women-rated pick", price: "$14" },
      ]),
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Dinner rooms, tasting menus, women-rated dishes.",
    emoji: "🍽",
    defaultColors: {
      accent: "#8b1e3f",
      accentSoft: "#fce8ef",
      background: "#fff8f9",
      text: "#1a0514",
    },
    taglineStarter: "Intimate dinner · women-rated dishes · BloomBay seats",
    aboutStarters: [
      { headline: "The room", body: "Candlelight, booths, and staff who get solo diners." },
      { headline: "Host nights", body: "We partner with Club Mamas for women-only tables every month." },
    ],
    menuStarters: [
      section("To start", [
        { name: "Burrata", description: "Fire-roasted peppers, sourdough", price: "$18" },
        { name: "Market greens", description: "Citrus, pistachio", price: "$14" },
      ]),
      section("Mains", [
        { name: "Saffron pasta", description: "No-phone tables on request", price: "$32" },
        { name: "Roasted fish", description: "Seasonal, lemon butter", price: "$36" },
      ]),
    ],
  },
  {
    id: "salon",
    name: "Salon & spa",
    description: "Beauty, wellness, and appointment-based care.",
    emoji: "✨",
    defaultColors: {
      accent: "#9b5de5",
      accentSoft: "#f3ebff",
      background: "#fdfbff",
      text: "#1a1028",
    },
    taglineStarter: "Booked by women · calm rooms · BloomBay perks",
    aboutStarters: [
      { headline: "Our studio", body: "Private suites, inclusive stylists, and a tea bar while you wait." },
      { headline: "BloomBay offer", body: "Members get priority booking and a complimentary add-on each quarter." },
    ],
    menuStarters: [
      section("Services", [
        { name: "Cut & style", description: "60 min · consultation included", price: "$120" },
        { name: "Color refresh", description: "Toner gloss", price: "$85" },
      ]),
      section("Wellness", [
        { name: "Express facial", description: "30 min glow", price: "$95" },
        { name: "Scalp treatment", description: "Restore + massage", price: "$65" },
      ]),
    ],
  },
  {
    id: "studio",
    name: "Studio & class",
    description: "Workshops, pilates, art, and creative classes.",
    emoji: "🎨",
    defaultColors: {
      accent: "#2a9d8f",
      accentSoft: "#e8f6f4",
      background: "#f8fffe",
      text: "#0d2926",
    },
    taglineStarter: "Creative classes · small groups · women-forward instructors",
    aboutStarters: [
      { headline: "What we teach", body: "Watercolor socials, sound baths, and movement for every level." },
      { headline: "BloomBay tables", body: "We reserve front-row spots for women meeting women IRL." },
    ],
    menuStarters: [
      section("Classes", [
        { name: "Watercolor social", description: "90 min · materials included", price: "$48" },
        { name: "Sunrise pilates", description: "Pier deck when clear", price: "$32" },
      ]),
      section("Passes", [
        { name: "4-class pack", description: "Valid 60 days", price: "$160" },
        { name: "Private session", description: "Up to 6 guests", price: "$220" },
      ]),
    ],
  },
  {
    id: "venue",
    name: "Venue & space",
    description: "Event spaces, rooftops, galleries — any partner.",
    emoji: "🏛",
    defaultColors: {
      accent: "#e85d04",
      accentSoft: "#fff0e6",
      background: "#fffcf8",
      text: "#1a1208",
    },
    taglineStarter: "Host your gathering · women-only options · full-service",
    aboutStarters: [
      { headline: "The space", body: "Flexible layout, AV included, and a team that knows BloomBay hosts." },
      { headline: "Capacity", body: "Intimate tables or full buyouts — we scale with your club." },
    ],
    menuStarters: [
      section("Packages", [
        { name: "Half-room hold", description: "Up to 24 guests", price: "from $800" },
        { name: "Full buyout", description: "Up to 80 guests", price: "from $3,200" },
      ]),
      section("Add-ons", [
        { name: "Photo corner", description: "Polaroid + backdrop", price: "$150" },
        { name: "DJ / playlist", description: "4 hours", price: "$400" },
      ]),
    ],
  },
];

export function getBrandTemplate(id: PartnerBrandTemplateId): PartnerBrandTemplate {
  return PARTNER_BRAND_TEMPLATES.find((t) => t.id === id) ?? PARTNER_BRAND_TEMPLATES[0];
}

export function templateLabel(id: PartnerBrandTemplateId): string {
  return getBrandTemplate(id).name;
}
