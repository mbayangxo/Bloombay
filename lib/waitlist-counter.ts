/** Waitlist social proof counters — prototype values; wire to Supabase aggregate later. */

export const WAITLIST_GOAL_NYC = 2500;

export type CityWaitlistStat = {
  city: string;
  country: string;
  count: number;
  goal?: number;
};

/** Demo progression toward 2,500 women in NYC */
export const WAITLIST_CITY_STATS: CityWaitlistStat[] = [
  { city: "New York", country: "United States", count: 1847, goal: WAITLIST_GOAL_NYC },
  { city: "Los Angeles", country: "United States", count: 412 },
  { city: "Toronto", country: "Canada", count: 318 },
  { city: "London", country: "United Kingdom", count: 276 },
  { city: "Paris", country: "France", count: 198 },
  { city: "Mumbai", country: "India", count: 164 },
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
  const pct = Math.min(100, Math.round((nyc.count / goal) * 100));
  return { current: nyc.count, goal, pct };
}
