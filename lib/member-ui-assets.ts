/** Public paths for member portal imagery (from your UI mockups) */

export { BLOOM_OBJECTS, CREST_SYMBOL_ASSETS, crestSymbolAsset } from "@/lib/bloom-object-assets";
export { BB_BRAND, BB_HOT, BB_INK } from "@/lib/bloom-brand";

/** Live refs in public/bloom-assets/refs — design boards in app/member/bloombaymemberui & app/memberportalui */
export {
  EATS_CARD_TEMPLATES,
  EATS_FILTER_CHIPS,
  HAPPENING_POSTER_TEMPLATES,
  PROFILE_TEMPLATES,
  SEAT_TICKET_TEMPLATES,
  templateAt,
} from "@/lib/member-ui-templates";

export const MEMBER_UI_REFS = {
  homeHero: "/bloom-assets/refs/home-hero.jpg",
  tonight: "/bloom-assets/refs/tonight.jpg",
  lounge: "/bloom-assets/refs/lounge.jpg",
  zones: "/bloom-assets/refs/zones.jpg",
  planner: "/bloom-assets/refs/planner.jpg",
} as const;
