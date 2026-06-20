import { PARTNER_PROFILE } from "@/lib/partner-portal-data";
import { getBrandTemplate } from "./templates";
import type {
  PartnerAboutSlide,
  PartnerBrandProfile,
  PartnerBrandTemplateId,
  PartnerMenuSection,
} from "./types";
import { partnerMemberHref, slugifyPartnerName } from "./paths";

const STORAGE_KEY = "bb_partner_brands";
const SESSION_PARTNER_SLUG = "the-rose-room";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid(prefix = "pb") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAll(): PartnerBrandProfile[] {
  if (!canUseStorage()) return seedProfiles();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeds = seedProfiles();
      writeAll(seeds);
      return seeds;
    }
    return JSON.parse(raw) as PartnerBrandProfile[];
  } catch {
    return seedProfiles();
  }
}

function writeAll(profiles: PartnerBrandProfile[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

function slide(headline: string, body: string, imageUrl?: string): PartnerAboutSlide {
  return { id: uid("pas"), headline, body, imageUrl };
}

function seedProfiles(): PartnerBrandProfile[] {
  const rose = getBrandTemplate("restaurant");
  const cafe = getBrandTemplate("cafe");
  const studio = getBrandTemplate("studio");

  return [
    {
      id: "pb-rose",
      slug: "the-rose-room",
      name: "The Rose Room",
      businessType: "Restaurant",
      tagline: "Intimate dinner · women-rated dishes · BloomBay seats",
      heroCaption: "Women-rated burrata · Friday BloomBay tables · West Village",
      neighborhood: "West Village",
      address: PARTNER_PROFILE.address,
      templateId: "restaurant",
      colors: rose.defaultColors,
      heroImageUrl: "/bloom-assets/refs/tonight.jpg",
      aboutSlides: [
        slide("A room for women", "Candlelight, booths, and a menu built for long conversations — not quick turns."),
        slide("BloomBay nights", "We hold tables for Club Mamas and open seats every Friday. Women-only options on request."),
        slide("Women-rated dish", "Burrata & fire-roasted peppers — the plate everyone photographs."),
      ],
      menuSections: rose.menuStarters,
      published: true,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pb-gitane",
      slug: "cafe-gitane",
      name: "Café Gitane",
      businessType: "Café",
      tagline: "Morning light · almond croissant · Nolita corner",
      neighborhood: "Nolita",
      templateId: "cafe",
      colors: cafe.defaultColors,
      aboutSlides: [
        slide("Morning ritual", "Big windows, Moroccan tiles, and the almond croissant women rate every week."),
        slide("Solo-friendly", "Counter seats for one — staff won't rush you."),
      ],
      menuSections: cafe.menuStarters,
      published: true,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pb-ambroeus",
      slug: "sant-ambroeus",
      name: "Sant Ambroeus",
      businessType: "Restaurant",
      tagline: "Saturday seats · SoHo brunch institution",
      neighborhood: "SoHo",
      templateId: "restaurant",
      colors: { accent: "#1a0514", accentSoft: "#ffe4ec", background: "#fff8f9", text: "#1a0514" },
      aboutSlides: [
        slide("Since 1936", "European café energy in SoHo — best corner banquette for solo brunch."),
        slide("BloomBay seats", "Saturday open seats for women gathering — reserve through BloomBay."),
      ],
      menuSections: rose.menuStarters,
      published: true,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pb-bodega",
      slug: "la-bodega-cafe",
      name: "La Bodega Cafe",
      businessType: "Café",
      tagline: "Work-friendly · outlets · soft jazz",
      neighborhood: "Nolita",
      templateId: "cafe",
      colors: { accent: "#2d6a4f", accentSoft: "#e8f5e9", background: "#fafff9", text: "#1b2e1f" },
      aboutSlides: [
        slide("Your desk away from home", "Outlets at every table, refill policy, and a back room for small groups."),
        slide("Girl-friendly hours", "Opens early for run clubs, stays late for wine & debrief."),
      ],
      menuSections: cafe.menuStarters,
      published: true,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pb-studio",
      slug: "bloom-brush-studio",
      name: "Bloom & Brush Studio",
      businessType: "Studio",
      tagline: "Watercolor socials · West Village",
      neighborhood: "West Village",
      templateId: "studio",
      colors: studio.defaultColors,
      aboutSlides: [
        slide("Paint together", "Small classes, big tables, wine optional — beginners always welcome."),
        slide("BloomBay perk", "Members get first pick on Thursday watercolor socials."),
      ],
      menuSections: studio.menuStarters,
      published: true,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pb-lume",
      slug: "cafe-lume",
      name: "Café Lume",
      businessType: "Café",
      tagline: "Wine & girl talk · Williamsburg",
      neighborhood: "Williamsburg",
      templateId: "cafe",
      colors: { accent: "#ff2d8a", accentSoft: "#ffe4ec", background: "#fff8fb", text: "#1a0514" },
      aboutSlides: [
        slide("After-work glow", "Pink hour lighting, natural wine list, and booths for four."),
      ],
      menuSections: cafe.menuStarters,
      published: true,
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function listPartnerBrands(publishedOnly = false): PartnerBrandProfile[] {
  const all = readAll();
  return publishedOnly ? all.filter((p) => p.published) : all;
}

export function getPartnerBrandBySlug(slug: string): PartnerBrandProfile | null {
  return readAll().find((p) => p.slug === slug) ?? null;
}

export function getPartnerBrandByName(name: string): PartnerBrandProfile | null {
  const slug = slugifyPartnerName(name);
  return getPartnerBrandBySlug(slug) ?? readAll().find((p) => p.name === name) ?? null;
}

/** Logged-in partner portal session — demo anchors to The Rose Room. */
export function getActivePartnerBrand(): PartnerBrandProfile {
  const existing = getPartnerBrandBySlug(SESSION_PARTNER_SLUG);
  if (existing) return existing;
  const tpl = getBrandTemplate("restaurant");
  return {
    id: uid(),
    slug: SESSION_PARTNER_SLUG,
    name: PARTNER_PROFILE.name,
    businessType: PARTNER_PROFILE.type,
    tagline: tpl.taglineStarter,
    neighborhood: "West Village",
    address: PARTNER_PROFILE.address,
    templateId: "restaurant",
    colors: tpl.defaultColors,
    aboutSlides: tpl.aboutStarters.map((s) => slide(s.headline, s.body)),
    menuSections: tpl.menuStarters.map((s) => ({ ...s, id: uid("pms"), items: s.items.map((i) => ({ ...i, id: uid("pmi") })) })),
    published: false,
    updatedAt: new Date().toISOString(),
  };
}

export function savePartnerBrand(patch: PartnerBrandProfile): PartnerBrandProfile {
  const all = readAll();
  const entry: PartnerBrandProfile = {
    ...patch,
    slug: patch.slug || slugifyPartnerName(patch.name),
    updatedAt: new Date().toISOString(),
  };
  const idx = all.findIndex((p) => p.id === entry.id || p.slug === entry.slug);
  const next = idx >= 0 ? all.map((p, i) => (i === idx ? entry : p)) : [...all, entry];
  writeAll(next);
  return entry;
}

export function applyBrandTemplate(
  profile: PartnerBrandProfile,
  templateId: PartnerBrandTemplateId
): PartnerBrandProfile {
  const tpl = getBrandTemplate(templateId);
  return {
    ...profile,
    templateId,
    colors: { ...tpl.defaultColors },
    tagline: profile.tagline || tpl.taglineStarter,
    aboutSlides:
      profile.aboutSlides.length > 0
        ? profile.aboutSlides
        : tpl.aboutStarters.map((s) => slide(s.headline, s.body)),
    menuSections:
      profile.menuSections.length > 0
        ? profile.menuSections
        : tpl.menuStarters.map((s) => ({
            ...s,
            id: uid("pms"),
            items: s.items.map((i) => ({ ...i, id: uid("pmi") })),
          })),
  };
}

export function partnerHrefForName(name: string): string {
  const brand = getPartnerBrandByName(name);
  return brand?.published ? partnerMemberHref(brand.slug) : "/member/eats";
}

export { SESSION_PARTNER_SLUG };
