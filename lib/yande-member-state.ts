/**
 * Lightweight member state for Yande rule-based nudges (MVP).
 * Replace read paths with API/profile later — keep this interface stable.
 */

import { BOUQUET, BOUQUET_MAX } from "@/lib/member-social-data";
import { countCalendarEntries } from "@/lib/member-calendar-store";

export type YandeMemberState = {
  verified: boolean;
  clubsJoinedCount: number;
  bouquetFilled: number;
  bouquetMax: number;
  city: string;
  neighborhood: string;
  upcomingPlansCount: number;
  onboardingComplete: boolean;
};

const VERIFIED_KEY = "bb_member_verified";
const CITY_KEY = "gf_city";
const NEIGHBORHOOD_KEY = "gf_neighborhood";
const ONBOARDING_KEY = "gf_onboarding_done";
const BOUQUET_KEY = "bb_bouquet";
const CLUBS_PICKED_KEY = "bb_clubs_picked";

function canUseSession() {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function canUseLocal() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function countJoinedClubs(): number {
  if (!canUseSession()) return 0;
  let n = 0;
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith("bb_club_member_") && sessionStorage.getItem(key) === "1") {
      n++;
    }
  }
  return n;
}

function countClubsPicked(): number {
  if (!canUseLocal()) return 0;
  try {
    const raw = localStorage.getItem(CLUBS_PICKED_KEY);
    if (!raw) return 0;
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

function bouquetFilledCount(): number {
  if (canUseLocal()) {
    try {
      const raw = localStorage.getItem(BOUQUET_KEY);
      if (raw) {
        const slots = JSON.parse(raw) as unknown[];
        if (Array.isArray(slots)) return slots.filter(Boolean).length;
      }
    } catch {
      /* use default */
    }
  }
  return BOUQUET.filter(Boolean).length;
}

/** Read current member context from browser storage (client only). */
export function readYandeMemberState(): YandeMemberState {
  const verified = canUseSession() && sessionStorage.getItem(VERIFIED_KEY) === "1";
  const onboardingComplete =
    canUseSession() && sessionStorage.getItem(ONBOARDING_KEY) === "1";
  const clubsJoinedCount = countJoinedClubs();
  const clubsPicked = countClubsPicked();

  return {
    verified,
    clubsJoinedCount: Math.max(clubsJoinedCount, clubsPicked),
    bouquetFilled: bouquetFilledCount(),
    bouquetMax: BOUQUET_MAX,
    city: (canUseSession() && sessionStorage.getItem(CITY_KEY)) || "New York",
    neighborhood:
      (canUseSession() && sessionStorage.getItem(NEIGHBORHOOD_KEY)) || "Williamsburg",
    upcomingPlansCount: countCalendarEntries(),
    onboardingComplete,
  };
}

export function setMemberVerified(value: boolean) {
  if (!canUseSession()) return;
  if (value) sessionStorage.setItem(VERIFIED_KEY, "1");
  else sessionStorage.removeItem(VERIFIED_KEY);
}

export function persistOnboardingLocation(city: string, neighborhood: string) {
  if (!canUseSession()) return;
  sessionStorage.setItem(CITY_KEY, city.trim());
  if (neighborhood.trim()) sessionStorage.setItem(NEIGHBORHOOD_KEY, neighborhood.trim());
  sessionStorage.setItem(ONBOARDING_KEY, "1");
}

export function trackClubPicked(clubId: string) {
  if (!canUseLocal()) return;
  try {
    const raw = localStorage.getItem(CLUBS_PICKED_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    if (!arr.includes(clubId)) arr.push(clubId);
    localStorage.setItem(CLUBS_PICKED_KEY, JSON.stringify(arr));
  } catch {
    localStorage.setItem(CLUBS_PICKED_KEY, JSON.stringify([clubId]));
  }
}
