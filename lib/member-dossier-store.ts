/** Member Bloom Dossier — editable fields + photo (localStorage prototype). */

export type MemberDossier = {
  name: string;
  archetype: string;
  sheIs: string;
  signatureTraits: string;
  luckyCharm: string;
  photoUrl: string | null;
  updatedAt: string;
};

const KEY = "bb_member_dossier";
const MAX_PHOTO_CHARS = 600_000;

const DEFAULTS: MemberDossier = {
  name: "",
  archetype: "The Connector",
  sheIs: "the girl who makes every room feel like home",
  signatureTraits: "Warm, curious, loyal",
  luckyCharm: "Rose lip tint",
  photoUrl: null,
  updatedAt: new Date().toISOString(),
};

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readMemberDossier(): MemberDossier {
  if (!canUse()) return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<MemberDossier>) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveMemberDossier(patch: Partial<MemberDossier>) {
  if (!canUse()) return;
  const next = { ...readMemberDossier(), ...patch, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("bb-member-dossier-updated"));
}

export function validateDossierPhoto(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Choose a photo (JPG or PNG).";
  if (file.size > 3_500_000) return "Photo must be under 3.5MB.";
  return null;
}

export function readDossierPhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      if (result.length > MAX_PHOTO_CHARS) {
        reject(new Error("Photo is too large — try a smaller image."));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}
