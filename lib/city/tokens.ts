// Shared design tokens and texture strings for the City page.
// Kept here so sub-components don't re-declare them.

export const PINK  = "#FF1F7D";
export const CREAM = "#F6F1EB";
export const PAPER = "#FEFCF7";
export const DARK  = "#1C1B1C";

export const PAPER_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
export const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
export const LINEN_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08 0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='80' height='80' fill='%23000' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

// Keyframe animations injected once via <style> in the root city component.
export const CITY_CSS = `
@keyframes trainRoll {
  0%   { transform: translateX(-140px); }
  100% { transform: translateX(calc(100vw + 60px)); }
}
@keyframes carRoll {
  0%   { transform: translateX(calc(100vw + 60px)) scaleX(-1); }
  100% { transform: translateX(-140px) scaleX(-1); }
}
@keyframes signSway {
  0%, 100% { transform: rotate(-1.5deg); }
  50%       { transform: rotate(1.5deg); }
}
@keyframes signBob {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-5px); }
}
@keyframes signGlow {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}
@keyframes flameFlicker {
  0%, 100% { transform: scaleX(1) scaleY(1); opacity: 0.9; }
  25%       { transform: scaleX(0.86) scaleY(1.12); opacity: 1; }
  50%       { transform: scaleX(1.1) scaleY(0.92); opacity: 0.82; }
  75%       { transform: scaleX(0.92) scaleY(1.07); opacity: 0.97; }
}
@keyframes tickerScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes hotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(0.97); }
}
@keyframes champFloat {
  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
  50%       { transform: translateY(-7px) rotate(1.5deg); }
}
@keyframes soloFade {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gallerySweep {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes poleAppear {
  from { transform: scaleY(0); transform-origin: top center; }
  to   { transform: scaleY(1); transform-origin: top center; }
}
`;

export type CityCategory = "landing" | "eat" | "go" | "solo" | "bloomies" | "girl_gems" | "girl_favs";

export interface Band {
  id: CityCategory;
  label: string;
  sub: string;
  icon: string;
  accentColor: string;
}
