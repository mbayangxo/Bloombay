/** Waitlist city stats — counts start at 0 until wired to a real aggregate. No prototype fake progression. */

export const WAITLIST_GOAL_NYC = 2500;

export type CityWaitlistStat = {
  city: string;
  country: string;
  count: number;
  goal?: number;
};

/** City list for waitlist UI; counts are zero until real data is available. */
export const WAITLIST_CITY_STATS: CityWaitlistStat[] = [
  { city: "New York", country: "United States", count: 0, goal: WAITLIST_GOAL_NYC },
  { city: "Los Angeles", country: "United States", count: 0 },
  { city: "Toronto", country: "Canada", count: 0 },
  { city: "London", country: "United Kingdom", count: 0 },
  { city: "Paris", country: "France", count: 0 },
  { city: "Mumbai", country: "India", count: 0 },
];

export function totalWomenOnWaitlist(): number {
  return WAITLIST_CITY_STATS.reduce((s, c) => s + c.count, 0);
}

export function nycProgress(): { current: number; goal: number; pct: number } {
  const nyc = WAITLIST_CITY_STATS.find((c) => c.city === "New York") ?? {
    count: 0,
    goal: WAITLIST_GOAL_NYC,
  };
  const goal = nyc.goal ?? WAITLIST_GOAL_NYC;
  const pct = goal > 0 ? Math.min(100, Math.round((nyc.count / goal) * 100)) : 0;
  return { current: nyc.count, goal, pct };
}
