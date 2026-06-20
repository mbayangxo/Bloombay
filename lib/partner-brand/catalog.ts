import { partnerMemberHref } from "./paths";

/** Static slug map for seed data (city, discovery, eats). */
export const PARTNER_BRAND_SLUGS: Record<string, string> = {
  "The Rose Room": "the-rose-room",
  "Café Gitane": "cafe-gitane",
  "Sant Ambroeus": "sant-ambroeus",
  "La Bodega Cafe": "la-bodega-cafe",
  "Bloom & Brush Studio": "bloom-brush-studio",
  "Café Lume": "cafe-lume",
  Lella: "lella",
};

export function partnerPageHref(partnerName: string): string {
  const slug = PARTNER_BRAND_SLUGS[partnerName];
  return slug ? partnerMemberHref(slug) : "/member/eats";
}
