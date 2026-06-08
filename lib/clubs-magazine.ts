/** Clubs magazine page — PNG mockup + invisible hotspot map (percent of frame). */

export const CLUBS_MAGAZINE_BG = "/clubs/clubs-page-mockup.png";

export type ClubsMagazineHotspot = {
  id: string;
  label: string;
  href: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

/** Polaroid / photo frames on the PNG — tap to upload your photo. */
export type ClubsMagazinePhotoSlot = {
  id: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

export const CLUBS_MAGAZINE_PHOTO_SLOTS: ClubsMagazinePhotoSlot[] = [
  { id: "hero-polaroid", label: "Pin your photo — your new favorite room", top: 7.5, left: 58, width: 36, height: 11 },
  { id: "connect-polaroid", label: "Pin your moment — real connections", top: 41.5, left: 35, width: 30, height: 13 },
  { id: "spotlight-you", label: "Pin your face — members going", top: 62.5, left: 78, width: 18, height: 7 },
  { id: "near-soho-photo", label: "Your SoHo snap", top: 87, left: 4, width: 16, height: 6.5 },
  { id: "near-west-village-photo", label: "Your West Village snap", top: 87, left: 23, width: 16, height: 6.5 },
  { id: "near-williamsburg-photo", label: "Your Williamsburg snap", top: 87, left: 42, width: 16, height: 6.5 },
  { id: "near-brooklyn-heights-photo", label: "Your Brooklyn Heights snap", top: 87, left: 61, width: 16, height: 6.5 },
  { id: "near-harlem-photo", label: "Your Harlem snap", top: 87, left: 80, width: 16, height: 6.5 },
];

/** Featured clubs shown in the mockup carousel (left → right). */
export const CLUBS_MAGAZINE_FEATURED = [
  {
    id: "sunday-supper-club",
    displayName: "Brunch Girls",
    vibe: "Long dinners, new friends, good wine.",
    members: "1.2K",
    tradition: "First Sunday Brunch",
    href: "/member/clubs/sunday-supper-club",
  },
  {
    id: "morning-run-club",
    displayName: "Running Girls",
    vibe: "Sunrise miles & post-run smoothies.",
    members: "842",
    tradition: "Sunrise Saturday Run",
    href: "/member/clubs/morning-run-club",
  },
  {
    id: "culture-crawl",
    displayName: "Museum Girls",
    vibe: "Gallery hops & culture nights.",
    members: "1.1K",
    tradition: "Gallery Girls Friday",
    href: "/member/clubs/culture-crawl",
  },
  {
    id: "the-page-turners",
    displayName: "Book Girls",
    vibe: "One book, deep talk, better wine.",
    members: "687",
    tradition: "Cozy Book Night",
    href: "/member/clubs/the-page-turners",
  },
  {
    id: "slow-living-society",
    displayName: "Soft Life Girls",
    vibe: "Slow mornings & unhurried joy.",
    members: "534",
    tradition: "Sunday Reset Walk",
    href: "/member/clubs/slow-living-society",
  },
  {
    id: "founders-in-the-making",
    displayName: "Founder Girls",
    vibe: "Build loud, support louder.",
    members: "412",
    tradition: "Monthly Wins Night",
    href: "/member/clubs/founders-in-the-making",
  },
  {
    id: "after-dark",
    displayName: "Night Out Girls",
    vibe: "Rooftops, galleries, nights out.",
    members: "923",
    tradition: "Friday Night Out",
    href: "/member/clubs/after-dark",
  },
  {
    id: "the-wellness-circle",
    displayName: "Wellness Girls",
    vibe: "Breathwork, rest, real care.",
    members: "756",
    tradition: "Wednesday Reset",
    href: "/member/clubs/the-wellness-circle",
  },
] as const;

export const CLUBS_MAGAZINE_TRADITIONS = [
  { label: "First Sunday Brunch", href: "/member/clubs/sunday-supper-club" },
  { label: "Sunrise Saturday Run", href: "/member/clubs/morning-run-club" },
  { label: "Monthly Wins Night", href: "/member/clubs/founders-in-the-making" },
  { label: "Gallery Girls Friday", href: "/member/clubs/culture-crawl" },
  { label: "Cozy Book Night", href: "/member/clubs/the-page-turners" },
] as const;

export const CLUBS_MAGAZINE_ONBOARDING = [
  { week: "Week 1", task: "Join 3 clubs", href: "/member/clubs/discover" },
  { week: "Week 2", task: "Save 5 places", href: "/member/maps" },
  { week: "Week 3", task: "Attend 1 gathering", href: "/member/happenings?tab=invitations" },
  { week: "Week 4", task: "Introduce yourself", href: "/member/intros" },
] as const;

export const CLUBS_MAGAZINE_NEIGHBORHOODS = [
  { name: "SoHo", clubs: 12, href: "/member/explore" },
  { name: "West Village", clubs: 9, href: "/member/explore" },
  { name: "Williamsburg", clubs: 14, href: "/member/explore" },
  { name: "Brooklyn Heights", clubs: 7, href: "/member/explore" },
  { name: "Harlem", clubs: 11, href: "/member/explore" },
] as const;

export const CLUBS_MAGAZINE_VIBES = [
  { label: "creative", href: "/member/clubs/discover" },
  { label: "wellness", href: "/member/clubs/the-wellness-circle" },
  { label: "adventure", href: "/member/clubs/wander-women" },
  { label: "career", href: "/member/clubs/founders-in-the-making" },
  { label: "night out", href: "/member/clubs/after-dark" },
  { label: "faith", href: "/member/clubs/discover" },
  { label: "fashion", href: "/member/clubs/discover" },
  { label: "foodie", href: "/member/clubs/sunday-supper-club" },
] as const;

/**
 * Hotspots aligned to clubs-page-mockup.png (485×1024).
 * Positions are % of the image frame — tweak here when the PNG updates.
 */
export const CLUBS_MAGAZINE_HOTSPOTS: ClubsMagazineHotspot[] = [
  { id: "hero", label: "Find your girls through clubs", href: "/member/clubs/discover", top: 3, left: 2, width: 58, height: 15 },

  { id: "see-all", label: "See all clubs", href: "/member/clubs/discover", top: 18.5, left: 70, width: 28, height: 4 },

  { id: "featured-supper", label: "Brunch Girls — join", href: "/member/clubs/sunday-supper-club", top: 23.5, left: 2, width: 19, height: 15 },
  { id: "featured-run", label: "Running Girls — join", href: "/member/clubs/morning-run-club", top: 23.5, left: 21, width: 19, height: 15 },
  { id: "featured-museum", label: "Museum Girls — join", href: "/member/clubs/culture-crawl", top: 23.5, left: 40, width: 19, height: 15 },
  { id: "featured-book", label: "Book Girls — join", href: "/member/clubs/the-page-turners", top: 23.5, left: 59, width: 19, height: 15 },
  { id: "featured-soft", label: "Soft Life Girls — join", href: "/member/clubs/slow-living-society", top: 23.5, left: 78, width: 20, height: 15 },

  { id: "tradition-brunch", label: "First Sunday Brunch", href: "/member/clubs/sunday-supper-club", top: 42.5, left: 3, width: 28, height: 3.2 },
  { id: "tradition-picnic", label: "Sunset Picnic gathering", href: "/member/happenings?tab=gatherings", top: 45.8, left: 3, width: 28, height: 3.2 },
  { id: "tradition-vinyl", label: "Vinyl & Wine night", href: "/member/happenings?tab=city", top: 49, left: 3, width: 28, height: 3.2 },
  { id: "tradition-rooftop", label: "Rooftop Sessions", href: "/member/happenings?tab=city", top: 52.2, left: 3, width: 28, height: 3.2 },
  { id: "tradition-book", label: "Cozy Book Night", href: "/member/clubs/the-page-turners", top: 55.4, left: 3, width: 28, height: 3.2 },
  { id: "happenings-calendar", label: "See full calendar", href: "/member/calendar", top: 58.5, left: 3, width: 28, height: 3 },

  { id: "onboard-1", label: "Week 1 — Join 3 clubs", href: "/member/clubs/discover", top: 44, left: 70, width: 26, height: 3.5 },
  { id: "onboard-2", label: "Week 2 — Save 5 places", href: "/member/maps", top: 47.5, left: 70, width: 26, height: 3.5 },
  { id: "onboard-3", label: "Week 3 — Attend 1 gathering", href: "/member/happenings?tab=invitations", top: 51, left: 70, width: 26, height: 3.5 },
  { id: "onboard-4", label: "Week 4 — Introduce yourself", href: "/member/intros", top: 54.5, left: 70, width: 26, height: 3.5 },
  { id: "onboard-start", label: "Start your journey", href: "/member/onboarding", top: 58, left: 70, width: 26, height: 3.5 },

  { id: "spotlight", label: "Museum Girls at The Met", href: "/member/clubs/culture-crawl", top: 57, left: 2, width: 96, height: 14 },
  { id: "spotlight-im-in", label: "I'm in — Museum Girls", href: "/member/clubs/culture-crawl", top: 64, left: 4, width: 22, height: 4.5 },

  { id: "vibe-creative", label: "Creative clubs", href: "/member/clubs/the-creative-studio", top: 73.5, left: 4, width: 14, height: 4 },
  { id: "vibe-wellness", label: "Wellness clubs", href: "/member/clubs/the-wellness-circle", top: 73.5, left: 19, width: 14, height: 4 },
  { id: "vibe-adventure", label: "Adventure clubs", href: "/member/clubs/wander-women", top: 73.5, left: 34, width: 14, height: 4 },
  { id: "vibe-career", label: "Career clubs", href: "/member/clubs/founders-in-the-making", top: 78.5, left: 4, width: 14, height: 4 },
  { id: "vibe-night", label: "Night out clubs", href: "/member/clubs/after-dark", top: 78.5, left: 19, width: 14, height: 4 },
  { id: "vibe-faith", label: "Faith clubs", href: "/member/clubs/discover", top: 78.5, left: 34, width: 14, height: 4 },
  { id: "vibe-fashion", label: "Fashion clubs", href: "/member/clubs/discover", top: 78.5, left: 49, width: 14, height: 4 },
  { id: "vibe-foodie", label: "Foodie clubs", href: "/member/clubs/sunday-supper-club", top: 78.5, left: 64, width: 14, height: 4 },
  { id: "vibe-all", label: "All vibes", href: "/member/clubs/discover", top: 78.5, left: 80, width: 16, height: 4 },

  { id: "near-soho", label: "Clubs near SoHo", href: "/member/explore", top: 86, left: 3, width: 18, height: 9 },
  { id: "near-west-village", label: "Clubs near West Village", href: "/member/explore", top: 86, left: 22, width: 18, height: 9 },
  { id: "near-williamsburg", label: "Clubs near Williamsburg", href: "/member/explore", top: 86, left: 41, width: 18, height: 9 },
  { id: "near-brooklyn-heights", label: "Clubs near Brooklyn Heights", href: "/member/explore", top: 86, left: 60, width: 18, height: 9 },
  { id: "near-harlem", label: "Clubs near Harlem", href: "/member/explore", top: 86, left: 79, width: 18, height: 9 },

  { id: "club-board", label: "BloomBay club board", href: "/member/clubs/board", top: 18.5, left: 2, width: 30, height: 4 },
];
