/**
 * BloomBay object SVGs — import only, animate in CSS (never redraw).
 */

import type { CrestSymbolId } from "@/lib/crest-system";

const OBJECTS_BASE = "/bloom-assets/bloombay%20objects";

export const BLOOM_OBJECTS = {
  crest: `${OBJECTS_BASE}/bloom-crest.svg`,
  pin: `${OBJECTS_BASE}/bloom-pin.svg`,
  key: `${OBJECTS_BASE}/bloom-key.svg`,
  postcard: `${OBJECTS_BASE}/bloom-postcard.svg`,
  bouquet: `${OBJECTS_BASE}/bloom-bouquet.svg`,
  table: `${OBJECTS_BASE}/bloom-table.svg`,
  ticket: `${OBJECTS_BASE}/bloom-ticket.svg`,
  door: `${OBJECTS_BASE}/bloom-door.svg`,
  request: `${OBJECTS_BASE}/bloom-request.svg`,
  accent2700: `${OBJECTS_BASE}/IMG_2700.svg`,
  accent2710: `${OBJECTS_BASE}/IMG_2710.svg`,
  accent2711: `${OBJECTS_BASE}/IMG_2711.svg`,
  accent2712: `${OBJECTS_BASE}/IMG_2712.svg`,
} as const;

/** Rose motif on every generated crest (paired with primary symbol). */
export const CREST_ROSE_MOTIF = BLOOM_OBJECTS.bouquet;

export const CREST_SYMBOL_ASSETS: Record<CrestSymbolId, string> = {
  book: BLOOM_OBJECTS.postcard,
  wine: BLOOM_OBJECTS.table,
  airplane: BLOOM_OBJECTS.key,
  museum: BLOOM_OBJECTS.door,
  flower: BLOOM_OBJECTS.bouquet,
  moon: BLOOM_OBJECTS.accent2711,
  camera: BLOOM_OBJECTS.pin,
  paintbrush: BLOOM_OBJECTS.ticket,
  briefcase: BLOOM_OBJECTS.accent2710,
  crescent: BLOOM_OBJECTS.accent2712,
};

export function crestSymbolAsset(symbolId: CrestSymbolId): string {
  return CREST_SYMBOL_ASSETS[symbolId];
}

/** Happenings = ticket (brunch, dinner, walk, museum, concert, gathering, seat…). */
export const HAPPENINGS_OBJECT = BLOOM_OBJECTS.ticket;

export type BloomObjectMotion =
  | "grow"
  | "open"
  | "unfold"
  | "stamp"
  | "flag"
  | "drop"
  | "flip"
  | "pulse"
  | "none";

export function motionFromSrc(src: string): BloomObjectMotion {
  if (src.includes("bouquet")) return "grow";
  if (src.includes("door")) return "open";
  if (src.includes("request")) return "unfold";
  if (src.includes("ticket")) return "stamp";
  if (src.includes("pin")) return "drop";
  if (src.includes("postcard")) return "flip";
  if (src.includes("key")) return "drop";
  return "pulse";
}
