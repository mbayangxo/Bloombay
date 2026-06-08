/** Explore — neighborhoods as places women enter. */

export type ExplorePlace = {
  id: string;
  name: string;
  vibe: string;
  href: string;
};

export const EXPLORE_PLACES: ExplorePlace[] = [
  { id: "williamsburg", name: "Williamsburg", vibe: "Coffee, supper clubs, art walks", href: "/member/explore?place=williamsburg" },
  { id: "soho", name: "SoHo", vibe: "Galleries, date nights, founder tables", href: "/member/explore?place=soho" },
  { id: "harlem", name: "Harlem", vibe: "Wellness, books, slow Sundays", href: "/member/explore?place=harlem" },
  { id: "west-village", name: "West Village", vibe: "Hidden gems, intimate dinners", href: "/member/explore?place=west-village" },
  { id: "dumbo", name: "DUMBO", vibe: "Waterfront walks, creators", href: "/member/explore?place=dumbo" },
  { id: "chelsea", name: "Chelsea", vibe: "Nightlife, culture, river light", href: "/member/explore?place=chelsea" },
];
