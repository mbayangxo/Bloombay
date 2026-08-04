// Shared NYC neighborhood list + "which neighborhood are you in" preference,
// used to filter/sort Eat, Go, Solo, and Happenings' Nearby view consistently.
export const NYC_NEIGHBORHOODS = [
  "West Village", "SoHo", "Nolita", "Williamsburg", "DUMBO", "Brooklyn Heights",
  "Park Slope", "Lower East Side", "Chelsea", "Harlem", "Astoria", "Crown Heights",
  "Upper East Side", "Bushwick", "Flushing",
] as const;

// Rough adjacency so "near me" can include next-door neighborhoods, not just
// an exact match — there's no lat/lng on these rows to compute real distance.
export const NEARBY_NEIGHBORHOODS: Record<string, string[]> = {
  "West Village": ["Chelsea", "SoHo", "Nolita"],
  "SoHo": ["Nolita", "West Village", "Lower East Side"],
  "Nolita": ["SoHo", "Lower East Side", "West Village"],
  "Williamsburg": ["Bushwick", "DUMBO", "Brooklyn Heights"],
  "DUMBO": ["Brooklyn Heights", "Williamsburg"],
  "Brooklyn Heights": ["DUMBO", "Park Slope", "Williamsburg"],
  "Park Slope": ["Brooklyn Heights", "Crown Heights"],
  "Lower East Side": ["Nolita", "SoHo", "Chelsea"],
  "Chelsea": ["West Village", "Upper East Side"],
  "Harlem": ["Upper East Side"],
  "Astoria": ["Flushing"],
  "Crown Heights": ["Park Slope", "Bushwick"],
  "Upper East Side": ["Chelsea", "Harlem"],
  "Bushwick": ["Williamsburg", "Crown Heights"],
  "Flushing": ["Astoria"],
};

const KEY = "bb-neighborhood";

export function getMyNeighborhood(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setMyNeighborhood(hood: string | null): void {
  if (typeof window === "undefined") return;
  if (hood) localStorage.setItem(KEY, hood);
  else localStorage.removeItem(KEY);
}

// True if `place` (a neighborhood string from a DB row) counts as "near"
// the member's chosen neighborhood — exact match or a known-adjacent one.
export function isNearby(myHood: string | null, place: string | null | undefined): boolean {
  if (!myHood || !place) return false;
  if (place === myHood) return true;
  return (NEARBY_NEIGHBORHOODS[myHood] ?? []).includes(place);
}
