/** Member photos pinned to the Clubs magazine PNG (browser localStorage). */

export type ClubsBoardPhoto = {
  slotId: string;
  imageUrl: string;
  updatedAt: string;
};

const KEY = "bb_clubs_board_photos";
const MAX_IMAGE_CHARS = 600_000;

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): ClubsBoardPhoto[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ClubsBoardPhoto[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(rows: ClubsBoardPhoto[]) {
  if (!canUse()) return;
  localStorage.setItem(KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("bb-clubs-board-photos-updated"));
}

export function getClubsBoardPhoto(slotId: string): string | null {
  return readAll().find((r) => r.slotId === slotId)?.imageUrl ?? null;
}

export function setClubsBoardPhoto(slotId: string, imageUrl: string) {
  const rows = readAll().filter((r) => r.slotId !== slotId);
  rows.unshift({ slotId, imageUrl, updatedAt: new Date().toISOString() });
  writeAll(rows.slice(0, 24));
}

export function clearClubsBoardPhoto(slotId: string) {
  writeAll(readAll().filter((r) => r.slotId !== slotId));
}

export function validateClubsBoardImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Choose a photo (JPG or PNG).";
  if (file.size > 3_500_000) return "Photo must be under 3.5MB.";
  return null;
}

export function readClubsBoardImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      if (result.length > MAX_IMAGE_CHARS) {
        reject(new Error("Photo is too large — try a smaller image."));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}
