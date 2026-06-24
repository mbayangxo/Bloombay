export const PINK  = "#FF1F7D";
export const DARK  = "#1C1B1C";
export const BOARD = "var(--bb-page-bg, #FFF0F6)";
export const CREAM = "#FFFFFF";
export const PAPER = "#FFFFFF";

export const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

export const ROTS = [-2, 1.5, -1, 2, -1.5, 0.5, -0.8];

export const GRADS = [
  "linear-gradient(145deg,#3D0020 0%,#8B0040 60%,#C80060 100%)",
  "linear-gradient(145deg,#1A0010 0%,#5A0030 60%,#A8004C 100%)",
  "linear-gradient(145deg,#2A0018 0%,#780040 60%,#E8006A 100%)",
  "linear-gradient(145deg,#1C0012 0%,#600035 60%,#B0005A 100%)",
  "linear-gradient(145deg,#380020 0%,#980050 60%,#FF1F7D 100%)",
];

export const NEAR_YOU_GRADS = [
  "linear-gradient(135deg,#FF85C0,#FFB3D9)",
  "linear-gradient(135deg,#E8006A,#FF5BAD)",
  "linear-gradient(135deg,#C80060,#FF1F7D)",
  "linear-gradient(135deg,#FF1F7D,#FF85C0)",
  "linear-gradient(135deg,#A8004C,#E8006A)",
];

export type RealClub = {
  id: string;
  name: string;
  description: string | null;
  primary_color: string | null;
  cover_url: string | null;
  slug: string | null;
  neighborhood?: string | null;
  category?: string | null;
};

export type RealGathering = {
  id: string;
  title: string;
  starts_at: string;
  venue: string | null;
  neighborhood: string | null;
};
