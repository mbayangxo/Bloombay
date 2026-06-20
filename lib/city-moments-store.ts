/**
 * The City — member-uploaded moments (photo + place pin).
 */

import { CITY_MOMENTS, type CityMoment } from "@/lib/the-city-data";
import { tieHref, type CityMomentTie } from "@/lib/city-moment-ties";

export type UploadedCityMoment = CityMoment & {
  imageUrl: string;
  neighborhood?: string;
  createdAt: string;
  memberId: string;
};

const KEY = "bb_city_moments_uploads";
const MAX_IMAGE_CHARS = 900_000;

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readUploads(): UploadedCityMoment[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as (UploadedCityMoment & { tie?: CityMomentTie })[];
    if (!Array.isArray(arr)) return [];
    return arr.map((row) => {
      if (row.tie) return row as UploadedCityMoment;
      return {
        ...row,
        tie: {
          kind: "place" as const,
          label: row.place?.split("·")[0]?.trim() || row.place || "Somewhere in the city",
        },
      };
    });
  } catch {
    return [];
  }
}

function writeUploads(rows: UploadedCityMoment[]) {
  if (!canUse()) return;
  localStorage.setItem(KEY, JSON.stringify(rows.slice(0, 48)));
  window.dispatchEvent(new CustomEvent("bb-city-moments-updated"));
}

export function listUploadedCityMoments(): UploadedCityMoment[] {
  return readUploads().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type CityMomentView = CityMoment & { imageUrl?: string };

/** Seed moments + member uploads (uploads first). */
export function listAllCityMoments(): CityMomentView[] {
  const uploads = listUploadedCityMoments();
  const seed = CITY_MOMENTS.map((m) => ({ ...m, imageUrl: undefined as string | undefined }));
  return [...uploads, ...seed];
}

export function addCityMomentUpload(input: {
  place: string;
  caption: string;
  imageDataUrl: string;
  neighborhood?: string;
  tie: CityMomentTie;
}): UploadedCityMoment {
  const name =
    (canUse() ? sessionStorage.getItem("gf_name") : null)?.split(" ")[0] ?? "You";
  const id = `cm-${Date.now()}`;
  const row: UploadedCityMoment = {
    id,
    place: input.place.trim(),
    caption: input.caption.trim(),
    author: name,
    when: "Just now",
    href: tieHref(input.tie),
    imageUrl: input.imageDataUrl.slice(0, MAX_IMAGE_CHARS),
    neighborhood: input.neighborhood?.trim(),
    tie: input.tie,
    createdAt: new Date().toISOString(),
    memberId: "member-self",
  };
  writeUploads([row, ...readUploads()]);
  return row;
}
