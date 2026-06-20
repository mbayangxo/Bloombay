import type { PartnerBrandProfile } from "@/lib/partner-brand/types";
import type { EatsFilterChip } from "@/lib/member-ui-templates";

const NYC_CLASSIC_SLUGS = new Set([
  "the-rose-room",
  "sant-ambroeus",
  "cafe-gitane",
  "cafe-lume",
]);

export function eatsCategoriesForPartner(partner: PartnerBrandProfile): EatsFilterChip[] {
  const cats: EatsFilterChip[] = [];
  if (partner.templateId === "cafe" || partner.templateId === "restaurant") {
    cats.push("Brunch");
  }
  if (partner.templateId === "cafe" || partner.slug === "cafe-lume") {
    cats.push("Late Night");
  }
  if (partner.templateId === "cafe" || partner.tagline.toLowerCase().includes("solo")) {
    cats.push("Solo");
  }
  if (NYC_CLASSIC_SLUGS.has(partner.slug)) {
    cats.push("NYC Classic");
  }
  return cats;
}

export function partnerMatchesEatsFilter(
  partner: PartnerBrandProfile,
  filter: EatsFilterChip
): boolean {
  if (filter === "All") return true;
  return eatsCategoriesForPartner(partner).includes(filter);
}

export function seedSaveCount(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash + slug.charCodeAt(i) * (i + 3)) % 97;
  }
  return 18 + hash;
}
