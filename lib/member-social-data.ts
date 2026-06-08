/** Bloomies (friends) & Bouquet (12 inner circle) — UI seed */

export type Bloomie = {
  id: string;
  name: string;
  initial: string;
  met?: string;
};

export const BLOOMIES: Bloomie[] = [
  { id: "b1", name: "Amanda R.", initial: "A", met: "Williamsburg dinner" },
  { id: "b2", name: "Priya L.", initial: "P", met: "Scanned at café" },
  { id: "b3", name: "Jordan T.", initial: "J", met: "Book club" },
];

export const BOUQUET_MAX = 12;

export const BOUQUET: (Bloomie | null)[] = [
  { id: "q1", name: "Amanda R.", initial: "A" },
  { id: "q2", name: "Leila S.", initial: "L" },
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

export const BOUQUET_CANDIDATES: Bloomie[] = [
  { id: "b4", name: "Maya K.", initial: "M" },
  { id: "b5", name: "Nia S.", initial: "N" },
  { id: "b6", name: "Sofia T.", initial: "S" },
];
