/**
 * Member photo + profile verification queue (founder portal).
 * Prototype: localStorage until Supabase profiles + storage exist.
 */

export type MemberVerificationStatus = "pending" | "approved" | "rejected";

export type MemberVerificationProfile = {
  id: string;
  email: string;
  firstName: string;
  city: string;
  country: string;
  neighborhood: string;
  ageRange: string;
  interests: string[];
  about: string;
  photoUrl: string;
  locale: string;
  genderConfirmed: boolean;
  status: MemberVerificationStatus;
  createdAt: string;
  reviewedAt?: string;
};

const KEY = "bb_member_verifications";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `mvp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function listMemberVerifications(): MemberVerificationProfile[] {
  if (!canUseStorage()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as MemberVerificationProfile[];
  } catch {
    return [];
  }
}

export function saveMemberVerification(
  input: Omit<MemberVerificationProfile, "id" | "status" | "createdAt" | "reviewedAt"> & {
    id?: string;
  }
): MemberVerificationProfile {
  const all = listMemberVerifications();
  const row: MemberVerificationProfile = {
    ...input,
    id: input.id ?? uid(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const idx = all.findIndex((r) => r.email === input.email);
  if (idx >= 0) all[idx] = { ...all[idx], ...row, status: "pending" };
  else all.unshift(row);
  if (canUseStorage()) localStorage.setItem(KEY, JSON.stringify(all));
  return row;
}

export function updateMemberVerificationStatus(id: string, status: MemberVerificationStatus) {
  const all = listMemberVerifications();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return;
  all[idx] = {
    ...all[idx],
    status,
    reviewedAt: new Date().toISOString(),
  };
  if (canUseStorage()) localStorage.setItem(KEY, JSON.stringify(all));
  if (status === "approved" && typeof window !== "undefined") {
    sessionStorage.setItem("bb_member_verified", "1");
  }
}

export function listPendingMemberVerifications() {
  return listMemberVerifications().filter((r) => r.status === "pending");
}
