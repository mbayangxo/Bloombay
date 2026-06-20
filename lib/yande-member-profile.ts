/** Full member profile blob for Yande / founder review (prototype localStorage). */

export type YandeMemberProfile = {
  email: string;
  firstName: string;
  city: string;
  country: string;
  neighborhood: string;
  ageRange: string;
  interests: string[];
  about: string;
  locale: string;
  updatedAt: string;
};

const KEY = "bb_yande_member_profile";

export function saveYandeMemberProfile(profile: Omit<YandeMemberProfile, "updatedAt">) {
  if (typeof window === "undefined") return;
  const row: YandeMemberProfile = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(row));
}

export function readYandeMemberProfile(): YandeMemberProfile | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null") as YandeMemberProfile | null;
  } catch {
    return null;
  }
}
