/** Focal points (world px) — center of each object cluster for seal navigation */
export const FOCAL = {
  founding: { x: 780, y: 480, zoom: 1 },
  invite: { x: 780, y: 480, zoom: 1 },
  rsvp: { x: 520, y: 980, zoom: 1.05 },
  board: { x: 1680, y: 380, zoom: 1 },
  meter: { x: 1920, y: 320, zoom: 1.08 },
  charter: { x: 780, y: 480, zoom: 1 },
  celebrate: { x: 1200, y: 1100, zoom: 1 },
} as const;

export type FocalKey = keyof typeof FOCAL;

export function getInitialOffset(viewW: number, viewH: number) {
  const target = FOCAL.founding;
  return {
    x: viewW * 0.5 - target.x,
    y: viewH * 0.5 - target.y,
  };
}
