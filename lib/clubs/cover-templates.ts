import { MEMBER_UI_REFS } from "@/lib/member-ui-assets";
import { HAPPENING_POSTER_TEMPLATES } from "@/lib/member-ui-templates";

export type CoverTemplate = {
  id: string;
  label: string;
  url: string;
  group: "bloom" | "poster";
};

/** Starter covers — upload your own or pick one of these */
export const CLUB_COVER_TEMPLATES: CoverTemplate[] = [
  { id: "hero", label: "City golden hour", url: MEMBER_UI_REFS.homeHero, group: "bloom" },
  { id: "tonight", label: "Tonight out", url: MEMBER_UI_REFS.tonight, group: "bloom" },
  { id: "lounge", label: "Lounge warm", url: MEMBER_UI_REFS.lounge, group: "bloom" },
  { id: "zones", label: "Neighborhood", url: MEMBER_UI_REFS.zones, group: "bloom" },
  ...HAPPENING_POSTER_TEMPLATES.slice(0, 6).map((url, i) => ({
    id: `poster-${i}`,
    label: `Poster style ${i + 1}`,
    url,
    group: "poster" as const,
  })),
];
