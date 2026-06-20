/** Photography-driven club identities — real imagery over gradients. */

export const CLUB_HERO_IMAGES: Record<string, string> = {
  "morning-run-club": "/bloom-assets/refs/zones.jpg",
  "the-page-turners": "/bloom-assets/refs/lounge.jpg",
  "wander-women": "/bloom-assets/refs/tonight.jpg",
  "sunday-supper-society": "/bloom-assets/refs/home-hero.jpg",
  "founders-nyc": "/bloom-assets/refs/planner.jpg",
  "pilates-and-matcha": "/bloom-assets/refs/lounge.jpg",
  "museum-girls": "/bloom-assets/refs/zones.jpg",
  "faith-and-city-girls": "/bloom-assets/refs/tonight.jpg",
};

export function clubHeroImage(clubId: string, fallbackGradient?: string): string {
  return CLUB_HERO_IMAGES[clubId] ?? "/bloom-assets/refs/home-hero.jpg";
}
