import { generateMagazineEdition, type MagazineGenerateInput } from "./generate";
import type { MagazineEdition, MagazineSpread, MagazineTheme, MagazineThought } from "./types";

const THEME_DEEP_LINKS: Record<MagazineTheme, string> = {
  lifestyle: "/member/happenings",
  fashion: "/member/explore#eat",
  city: "/member/explore",
  clubs: "/member/clubs",
  food: "/member/eats",
};

const EDITIONS_KEY = "bb_mag_editions";
const SPREADS_KEY = "bb_mag_spreads";
const THOUGHTS_KEY = "bb_mag_thoughts";

function uid(p = "mt") {
  return `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function canStore() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canStore()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function seedEditions(): { editions: MagazineEdition[]; spreads: MagazineSpread[] } {
  const a = generateMagazineEdition({
    subject: "BloomBay Weekly",
    brief: "Women meeting women IRL — clubs, open seats, and the city we actually live in.",
    theme: "lifestyle",
    spreadCount: 5,
  });
  const b = generateMagazineEdition({
    subject: "City Style",
    brief: "Fashion in motion — what women are wearing to brunch, galleries, and rooftop seats.",
    theme: "fashion",
    spreadCount: 4,
  });
  const c = generateMagazineEdition({
    subject: "IRL Proof",
    brief: "GIFs and photos from real rooms — not staged, not corporate.",
    theme: "clubs",
    spreadCount: 4,
  });
  b.edition.coverGradient = "linear-gradient(160deg,#1a0514 0%,#ffe4ec 70%)";
  c.edition.coverGradient = "linear-gradient(160deg,#ff0055,#121212)";
  return {
    editions: [a.edition, b.edition, c.edition],
    spreads: [...a.spreads, ...b.spreads, ...c.spreads],
  };
}

function ensureSeeded() {
  const editions = readJson<MagazineEdition[]>(EDITIONS_KEY, []);
  if (editions.length) return;
  const seed = seedEditions();
  writeJson(EDITIONS_KEY, seed.editions);
  writeJson(SPREADS_KEY, seed.spreads);
}

export function listMagazineEditions(): MagazineEdition[] {
  ensureSeeded();
  return readJson<MagazineEdition[]>(EDITIONS_KEY, []).sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt)
  );
}

export function getMagazineBySlug(slug: string): MagazineEdition | null {
  return listMagazineEditions().find((e) => e.slug === slug) ?? null;
}

export function getSpreadsForMagazine(magazineId: string): MagazineSpread[] {
  ensureSeeded();
  const edition = readJson<MagazineEdition[]>(EDITIONS_KEY, []).find((e) => e.id === magazineId);
  const spreads = readJson<MagazineSpread[]>(SPREADS_KEY, [])
    .filter((s) => s.magazineId === magazineId)
    .sort((a, b) => a.pageIndex - b.pageIndex);
  if (!spreads.length || !edition) return spreads;
  const last = spreads[spreads.length - 1];
  if (last.linkHref) return spreads;
  return spreads.map((s, i) =>
    i === spreads.length - 1
      ? { ...s, linkHref: THEME_DEEP_LINKS[edition.theme] ?? "/member/happenings" }
      : s
  );
}

export function publishMagazineEdition(input: MagazineGenerateInput): MagazineEdition {
  const { edition, spreads } = generateMagazineEdition(input);
  const editions = listMagazineEditions();
  const allSpreads = readJson<MagazineSpread[]>(SPREADS_KEY, []);
  writeJson(EDITIONS_KEY, [edition, ...editions.filter((e) => e.slug !== edition.slug)]);
  writeJson(SPREADS_KEY, [...spreads, ...allSpreads.filter((s) => s.magazineId !== edition.id)]);
  return edition;
}

export function listThoughtsForSpread(spreadId: string): MagazineThought[] {
  return readJson<MagazineThought[]>(THOUGHTS_KEY, [])
    .filter((t) => t.spreadId === spreadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addMagazineThought(input: {
  magazineId: string;
  spreadId: string;
  authorName: string;
  body: string;
}): MagazineThought {
  const entry: MagazineThought = {
    id: uid(),
    magazineId: input.magazineId,
    spreadId: input.spreadId,
    authorName: input.authorName.trim() || "Reader",
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  };
  const all = readJson<MagazineThought[]>(THOUGHTS_KEY, []);
  writeJson(THOUGHTS_KEY, [entry, ...all]);
  return entry;
}
