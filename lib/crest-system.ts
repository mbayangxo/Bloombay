/**
 * BloomBay Crest System — Harry Potter / flag style identity.
 * Hosts pick ONE symbol + ONE accent; BloomBay generates the crest. No custom layout.
 */

import { CLUBS } from "@/app/member/clubs/club-data";

/** Primary club symbol (curated — not a free-form canvas). */
export type CrestSymbolId =
  | "book"
  | "wine"
  | "airplane"
  | "museum"
  | "flower"
  | "moon"
  | "camera"
  | "paintbrush"
  | "briefcase"
  | "crescent";

/** House-style accent color (tints shield + rose ribbon). */
export type CrestAccentId = "rose" | "burgundy" | "navy" | "emerald" | "ivory";

export type ClubCrestConfig = {
  symbolId: CrestSymbolId;
  accentId: CrestAccentId;
};

export type MemberCrest = {
  clubId: string;
  clubName: string;
  symbolId: CrestSymbolId;
  accentId: CrestAccentId;
  designation: string;
  earnedAt: string;
};

export const CREST_SYMBOLS: {
  id: CrestSymbolId;
  label: string;
  description: string;
  example: string;
}[] = [
  { id: "book", label: "Book", description: "Literary & reading clubs", example: "Book club + rose" },
  { id: "wine", label: "Wine", description: "Dining, supper clubs, tastings", example: "Wine glass + rose" },
  { id: "airplane", label: "Airplane", description: "Travel & adventure", example: "Airplane + rose" },
  { id: "museum", label: "Museum", description: "Culture & exhibitions", example: "Museum + rose" },
  { id: "flower", label: "Flower", description: "Bloom & social gardens", example: "Flower + rose" },
  { id: "moon", label: "Moon", description: "Evenings & nightlife", example: "Crescent sky + rose" },
  { id: "camera", label: "Camera", description: "Photo walks & creators", example: "Camera + rose" },
  { id: "paintbrush", label: "Paintbrush", description: "Arts & making", example: "Paintbrush + rose" },
  { id: "briefcase", label: "Briefcase", description: "Founders & careers", example: "Briefcase + rose" },
  { id: "crescent", label: "Crescent", description: "Wellness & slow living", example: "Crescent + rose" },
];

export const CREST_ACCENTS: {
  id: CrestAccentId;
  label: string;
  hex: string;
  band: string;
}[] = [
  { id: "rose", label: "Rose", hex: "#e8007a", band: "#ffb7ce" },
  { id: "burgundy", label: "Burgundy", hex: "#6b1d3a", band: "#c45c7a" },
  { id: "navy", label: "Navy", hex: "#1a0a2e", band: "#4a6fa5" },
  { id: "emerald", label: "Emerald", hex: "#1a6b4f", band: "#7dcea0" },
  { id: "ivory", label: "Ivory", hex: "#f5f0e8", band: "#e8dfd0" },
];

const CREST_PREFIX = "bb_club_crest_";
const MEMBER_CRESTS_KEY = "bb_member_crests";

const LEGACY_SYMBOL_MAP: Record<string, CrestSymbolId> = {
  bloom: "flower",
  run: "crescent",
  plate: "wine",
  compass: "airplane",
  spark: "flower",
  founders: "briefcase",
  leaf: "crescent",
  palette: "paintbrush",
};

const LEGACY_CATEGORY_ACCENT: Record<string, CrestAccentId> = {
  fitness: "emerald",
  books: "burgundy",
  travel: "navy",
  wellness: "ivory",
  food: "rose",
  nightlife: "navy",
  entrepreneurship: "burgundy",
  arts: "rose",
};

export function designationFromCategory(category?: string): string {
  if (!category?.trim()) return "Club";
  return category.trim();
}

export function getClubDesignation(clubId: string, category?: string): string {
  if (category) return designationFromCategory(category);
  const club = CLUBS.find((c) => c.id === clubId);
  return club?.category ?? "Club";
}

export function defaultCrestForCategory(category: string): ClubCrestConfig {
  const c = category.toLowerCase();
  let symbolId: CrestSymbolId = "flower";
  if (c.includes("book") || c.includes("ideas")) symbolId = "book";
  else if (c.includes("dining") || c.includes("food")) symbolId = "wine";
  else if (c.includes("travel") || c.includes("adventure")) symbolId = "airplane";
  else if (c.includes("art") || c.includes("culture")) symbolId = "museum";
  else if (c.includes("wellness") || c.includes("movement")) symbolId = "crescent";
  else if (c.includes("career") || c.includes("growth")) symbolId = "briefcase";
  else if (c.includes("social") || c.includes("lifestyle")) symbolId = "flower";
  else if (c.includes("night")) symbolId = "moon";
  else if (c.includes("photo") || c.includes("creative")) symbolId = "camera";

  let accentId: CrestAccentId = "rose";
  if (c.includes("book")) accentId = "burgundy";
  else if (c.includes("travel") || c.includes("culture")) accentId = "navy";
  else if (c.includes("wellness") || c.includes("movement")) accentId = "emerald";
  else if (c.includes("social")) accentId = "ivory";

  return { symbolId, accentId };
}

export function getAccentMeta(id: CrestAccentId) {
  return CREST_ACCENTS.find((a) => a.id === id) ?? CREST_ACCENTS[0];
}

export function getSymbolMeta(id: CrestSymbolId) {
  return CREST_SYMBOLS.find((s) => s.id === id) ?? CREST_SYMBOLS[0];
}

export function defaultCrestForClub(clubId: string): ClubCrestConfig {
  const club = CLUBS.find((c) => c.id === clubId);
  if (!club) return { symbolId: "flower", accentId: "rose" };
  const c = club.category.toLowerCase();
  let symbolId: CrestSymbolId = "flower";
  if (c.includes("book")) symbolId = "book";
  else if (c.includes("food")) symbolId = "wine";
  else if (c.includes("travel")) symbolId = "airplane";
  else if (c.includes("art")) symbolId = "paintbrush";
  else if (c.includes("night")) symbolId = "moon";
  else if (c.includes("entrepreneur")) symbolId = "briefcase";
  else if (c.includes("fitness")) symbolId = "crescent";
  else if (c.includes("wellness")) symbolId = "crescent";

  let accentId: CrestAccentId = "rose";
  if (c.includes("book")) accentId = "burgundy";
  else if (c.includes("travel") || c.includes("night")) accentId = "navy";
  else if (c.includes("fitness") || c.includes("wellness")) accentId = "emerald";
  else if (c.includes("wellness")) accentId = "ivory";

  return { symbolId, accentId };
}

function normalizeConfig(raw: Record<string, unknown>): ClubCrestConfig | null {
  if (typeof raw.symbolId === "string" && typeof raw.accentId === "string") {
    const sym = raw.symbolId as CrestSymbolId;
    const acc = raw.accentId as CrestAccentId;
    if (CREST_SYMBOLS.some((s) => s.id === sym) && CREST_ACCENTS.some((a) => a.id === acc)) {
      return { symbolId: sym, accentId: acc };
    }
  }
  if (typeof raw.symbolId === "string") {
    let sym = raw.symbolId as string;
    if (!(CREST_SYMBOLS as { id: string }[]).some((s) => s.id === sym)) {
      sym = LEGACY_SYMBOL_MAP[sym] ?? "flower";
    }
    const cat = typeof raw.categoryId === "string" ? raw.categoryId : "";
    const accentId = LEGACY_CATEGORY_ACCENT[cat] ?? "rose";
    return { symbolId: sym as CrestSymbolId, accentId };
  }
  return null;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getClubCrestConfig(clubId: string): ClubCrestConfig {
  if (!canUseStorage()) return defaultCrestForClub(clubId);
  const raw = localStorage.getItem(`${CREST_PREFIX}${clubId}`);
  if (!raw) return defaultCrestForClub(clubId);
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const normalized = normalizeConfig(parsed);
    if (normalized) return normalized;
  } catch {
    /* fall through */
  }
  return defaultCrestForClub(clubId);
}

export function saveClubCrestConfig(clubId: string, config: ClubCrestConfig) {
  if (!canUseStorage()) return;
  localStorage.setItem(`${CREST_PREFIX}${clubId}`, JSON.stringify(config));
}

function readMemberCrests(): MemberCrest[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(MEMBER_CRESTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as MemberCrest[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeMemberCrests(list: MemberCrest[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(MEMBER_CRESTS_KEY, JSON.stringify(list));
}

export function awardMemberCrest(clubId: string, clubName?: string) {
  const config = getClubCrestConfig(clubId);
  const name = clubName ?? CLUBS.find((c) => c.id === clubId)?.name ?? "Club";
  const list = readMemberCrests();
  const idx = list.findIndex((c) => c.clubId === clubId);
  const entry: MemberCrest = {
    clubId,
    clubName: name,
    symbolId: config.symbolId,
    accentId: config.accentId,
    designation: getClubDesignation(clubId),
    earnedAt: new Date().toISOString(),
  };
  if (idx >= 0) list[idx] = entry;
  else list.unshift(entry);
  writeMemberCrests(list);
}

export function listMemberCrests(): MemberCrest[] {
  return readMemberCrests().sort(
    (a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  );
}

export function removeMemberCrest(clubId: string) {
  writeMemberCrests(readMemberCrests().filter((c) => c.clubId !== clubId));
}

export function syncCrestsFromJoinedClubs() {
  if (typeof window === "undefined") return;
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith("bb_club_member_") && sessionStorage.getItem(key) === "1") {
      const clubId = key.replace("bb_club_member_", "");
      awardMemberCrest(clubId);
    }
  }
}
