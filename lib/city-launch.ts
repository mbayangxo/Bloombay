/** City launch — bloom score & readiness */

export type CityLaunch = {
  city: string;
  bloomScore: number;
  women: number;
  clubs: number;
  hosts: number;
  partners: number;
  safety: number;
  activity: number;
  verdict: "Launch" | "Grow" | "Wait";
};

export const CITY_LAUNCHES: CityLaunch[] = [
  { city: "New York City", bloomScore: 87, women: 8750, clubs: 42, hosts: 110, partners: 58, safety: 92, activity: 84, verdict: "Launch" },
  { city: "London", bloomScore: 42, women: 1204, clubs: 8, hosts: 12, partners: 6, safety: 88, activity: 38, verdict: "Wait" },
  { city: "Atlanta", bloomScore: 31, women: 641, clubs: 3, hosts: 5, partners: 2, safety: 90, activity: 28, verdict: "Wait" },
  { city: "Toronto", bloomScore: 41, women: 882, clubs: 5, hosts: 9, partners: 4, safety: 91, activity: 35, verdict: "Wait" },
];

export type BloomRequest = {
  id: string;
  label: string;
  city: string;
  count: number;
  kind: "club_seed" | "event_seed" | "buddy";
};

export const BLOOM_REQUESTS: BloomRequest[] = [
  { id: "br1", label: "Museum girls", city: "NYC", count: 186, kind: "club_seed" },
  { id: "br2", label: "Brunch girls", city: "NYC", count: 412, kind: "club_seed" },
  { id: "br3", label: "Travel buddies", city: "NYC", count: 221, kind: "buddy" },
  { id: "br4", label: "Running partners", city: "Brooklyn", count: 164, kind: "buddy" },
  { id: "br5", label: "Founder friends", city: "NYC", count: 289, kind: "club_seed" },
];
