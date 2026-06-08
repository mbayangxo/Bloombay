/** Pick 1 accent per card — luxury motion, not a carnival. */

export type HappeningsMotionAccent = "wiggle" | "pulse" | "scan" | null;

const PULSE_META = /seats?\s*left|open\s*seat|open\s*spot|rsvp|reserve|going|spots?\s*left/i;

export function metaShouldPulse(meta: string): boolean {
  return PULSE_META.test(meta);
}

export function posterMotionAccent(index: number, meta: string): HappeningsMotionAccent {
  const slot = index % 3;
  if (slot === 0) return "wiggle";
  if (slot === 1 && metaShouldPulse(meta)) return "pulse";
  return null;
}

export function ticketMotionAccent(index: number, meta: string): HappeningsMotionAccent {
  const slot = index % 2;
  if (slot === 0) return "scan";
  if (slot === 1 && metaShouldPulse(meta)) return "pulse";
  return null;
}
