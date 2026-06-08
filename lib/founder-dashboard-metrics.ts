/** Founder launch intelligence — update as markets scale */

export const LAUNCH_THRESHOLD_PERCENT = 80;

export const LAUNCH_NEIGHBORHOODS = [
  "Williamsburg",
  "Chelsea",
  "Upper East Side",
  "Harlem",
  "Hoboken",
  "Jersey City",
] as const;

export const LAUNCH_READINESS = [
  { city: "NYC", percent: 84 },
  { city: "London", percent: 52 },
  { city: "Toronto", percent: 41 },
  { city: "Atlanta", percent: 41 },
] as const;

/** Hero geography — NYC first */
export const NYC_GEOGRAPHY_HERO = {
  cityLabel: "NEW YORK",
  totalWomen: 4211,
  boroughs: [
    { name: "Brooklyn", count: 1204 },
    { name: "Manhattan", count: 973 },
    { name: "Queens", count: 881 },
  ],
  neighborhoods: [
    { name: "Williamsburg", percent: 88 },
    { name: "Chelsea", percent: 82 },
    { name: "Harlem", percent: 77 },
  ],
} as const;

/** Launch Radar — global cities */
export const LAUNCH_RADAR = [
  { city: "NYC", percent: 84 },
  { city: "London", percent: 52 },
  { city: "Toronto", percent: 41 },
  { city: "Atlanta", percent: 41 },
] as const;

export function isLaunchReady(percent: number): boolean {
  return percent >= LAUNCH_THRESHOLD_PERCENT;
}

/** Club requests — what women are asking for */
export const CLUB_REQUESTS = [
  "Black Women Founders",
  "Book Club",
  "Muslim Women NYC",
  "Pilates Girls",
  "Creative Women",
] as const;

/** Waiting to Bloom — unmet club demand */
export const WAITING_TO_BLOOM = [
  { club: "Faith Club", count: 23 },
  { club: "Travel Club", count: 41 },
  { club: "Founders Club", count: 17 },
] as const;

/** Velocity fallbacks when DB is empty */
export const MEMBER_VELOCITY_FALLBACK = {
  today: 48,
  thisWeek: 312,
} as const;

/** Overview queue fallbacks when Supabase is empty */
export const PORTAL_QUEUE_FALLBACK = {
  verification: 127,
  clubHostsPending: 18,
  partnersPending: 9,
} as const;

/** Markets page — NYC metro breakdown */
export const NYC_MARKET_AREAS = [
  { name: "New York", count: 4211 },
  { name: "Brooklyn", count: 1832 },
  { name: "Manhattan", count: 811 },
  { name: "Queens", count: 744 },
  { name: "Bronx", count: 521 },
  { name: "Hoboken", count: 143 },
] as const;

export const LAUNCH_PROGRESS = [
  { city: "NYC", percent: 84 },
  { city: "London", percent: 52 },
  { city: "Toronto", percent: 41 },
] as const;

export const CLUB_DEMAND = [
  { id: "book-clubs", label: "Book Clubs", count: 1204 },
  { id: "dinner-clubs", label: "Dinner Clubs", count: 998 },
  { id: "wellness", label: "Wellness", count: 882 },
  { id: "travel", label: "Travel", count: 641 },
  { id: "entrepreneurship", label: "Entrepreneurship", count: 611 },
] as const;

export const PARTNER_APPLICATION_TYPES = [
  "cafés",
  "restaurants",
  "venues",
  "brands",
  "creators",
] as const;

export const TOP_CITIES_RANKED = [
  { rank: 1, city: "NYC", count: 4211, medal: "🥇" },
  { rank: 2, city: "London", count: 1843, medal: "🥈" },
  { rank: 3, city: "Toronto", count: 1002, medal: "🥉" },
  { rank: 4, city: "Atlanta", count: 721, medal: "4." },
  { rank: 5, city: "Paris", count: 611, medal: "5." },
] as const;

export const SIGNUP_MIX = {
  joined: 10432,
  members: 8750,
  clubHosts: 1100,
  partners: 582,
} as const;

export const MEMBERSHIP_FUNNEL = [
  { key: "joined", label: "Joined", value: 10432 },
  { key: "completed", label: "Completed", value: 7891 },
  { key: "verified", label: "Verified", value: 5233 },
  { key: "invited", label: "Invited", value: 2104 },
  { key: "active", label: "Active", value: 614 },
] as const;

export const VERIFICATION_LEVELS = [
  { petals: 1, label: "Applied" },
  { petals: 2, label: "Verified" },
  { petals: 3, label: "Community Verified" },
  { petals: 4, label: "Club Host" },
  { petals: 5, label: "Founding Woman" },
] as const;

export const BLOOM_TRUST_LINE =
  "A woman joins BloomBay because she believes: “The women here are real.” Not because there’s another event calendar." as const;

export function funnelConversionRate(
  current: number,
  previous: number
): number {
  if (previous <= 0) return 0;
  return Math.round((current / previous) * 100);
}
