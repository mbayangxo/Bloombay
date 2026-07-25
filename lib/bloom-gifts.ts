/** BloomBay gifts — flower (1) or bouquet (12). */

export type GiftKind = "flower" | "bouquet";

export const FLOWER_UNITS = 1;
export const BOUQUET_UNITS = 12;

export function unitsForKind(kind: GiftKind): number {
  return kind === "bouquet" ? BOUQUET_UNITS : FLOWER_UNITS;
}

/** Convert raw flower-units into bouquets + leftover flowers for display. */
export function splitBloomGifts(totalUnits: number): {
  bouquets: number;
  flowers: number;
  totalUnits: number;
} {
  const safe = Math.max(0, Math.floor(totalUnits));
  return {
    bouquets: Math.floor(safe / BOUQUET_UNITS),
    flowers: safe % BOUQUET_UNITS,
    totalUnits: safe,
  };
}

export function formatBloomGiftLabel(totalUnits: number): string {
  const { bouquets, flowers } = splitBloomGifts(totalUnits);
  const parts: string[] = [];
  if (bouquets > 0) parts.push(`${bouquets} bouquet${bouquets === 1 ? "" : "s"}`);
  if (flowers > 0) parts.push(`${flowers} flower${flowers === 1 ? "" : "s"}`);
  return parts.length ? parts.join(" · ") : "0";
}
