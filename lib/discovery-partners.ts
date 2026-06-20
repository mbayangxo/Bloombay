import type { DiscoveryMoodId } from "@/lib/discovery-mood";
import { partnerPageHref } from "@/lib/partner-brand/catalog";

/** Girl-friendly partner venues (prototype seed). */
export type PartnerVenue = {
  id: string;
  title: string;
  meta: string;
  neighborhood: string;
  tag: string;
  href: string;
  moods: DiscoveryMoodId[];
  tags: string[];
};

export const PARTNER_VENUES: PartnerVenue[] = [
  {
    id: "pv1",
    title: "Bloom & Brush Studio",
    meta: "Partner · watercolor social · West Village",
    neighborhood: "West Village",
    tag: "Creative class",
    href: partnerPageHref("Bloom & Brush Studio"),
    moods: ["creative"],
    tags: ["arts", "workshop", "collab"],
  },
  {
    id: "pv2",
    title: "La Bodega Cafe",
    meta: "Partner · work-friendly · outlets · Nolita",
    neighborhood: "Nolita",
    tag: "Girl-friendly cafe",
    href: partnerPageHref("La Bodega Cafe"),
    moods: ["chill", "creative"],
    tags: ["cafe", "solo", "soft"],
  },
  {
    id: "pv3",
    title: "Sunrise Sound Bath House",
    meta: "Partner · Thursday evenings · Chelsea",
    neighborhood: "Chelsea",
    tag: "Wellness",
    href: "/member/happenings?tab=solo",
    moods: ["restore", "chill"],
    tags: ["wellness", "restore", "healing"],
  },
  {
    id: "pv4",
    title: "Pop-up Supper Club",
    meta: "Partner · women-only tables · Williamsburg",
    neighborhood: "Williamsburg",
    tag: "Pop-up dinner",
    href: "/member/happenings?tab=invitations",
    moods: ["get-out", "connect"],
    tags: ["social", "gathering", "irl"],
  },
  {
    id: "pv5",
    title: "Brooklyn Art Haus",
    meta: "Partner · gallery walk · DUMBO",
    neighborhood: "DUMBO",
    tag: "Culture",
    href: "/member/happenings",
    moods: ["explore", "creative"],
    tags: ["culture", "gem", "solo"],
  },
];
