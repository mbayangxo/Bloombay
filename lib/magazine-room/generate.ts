import type { MagazineEdition, MagazineSpread, MagazineTheme } from "./types";

export type MagazineGenerateInput = {
  subject: string;
  brief: string;
  theme?: MagazineTheme;
  referenceImages?: { title?: string; notes?: string; imageUrl?: string }[];
  spreadCount?: number;
};

const THEMES: MagazineTheme[] = ["lifestyle", "fashion", "city", "clubs", "food"];

function uid(p: string) {
  return `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

const COVER_GRADIENTS: Record<MagazineTheme, string> = {
  lifestyle: "linear-gradient(145deg,#1a0514,#ff0055)",
  fashion: "linear-gradient(145deg,#ffe4ec,#1a0514)",
  city: "linear-gradient(145deg,#ffb7ce,#121212)",
  clubs: "linear-gradient(145deg,#ff2d8a,#1a0514)",
  food: "linear-gradient(145deg,#c45c26,#ffe4ec)",
};

function pickHeadlines(subject: string, brief: string, count: number): { headline: string; caption: string; body: string }[] {
  const seed = `${subject}${brief}`.length;
  const pools = [
    { headline: "The room is the story", caption: "IRL beats the feed", body: `${brief} — BloomBay HQ` },
    { headline: "Golden hour, girl crew", caption: "Swipe for the table", body: "Women meeting women — proof from last weekend." },
    { headline: "What we're wearing", caption: "City uniform, softened", body: "Linen, vintage denim, one hot pink accent. Always." },
    { headline: "Table for six", caption: "Open seats still matter", body: subject },
    { headline: "Soft launch your social life", caption: "One club · one night", body: brief },
    { headline: "GIF energy", caption: "Movement > manifesto", body: "Door opening · plates landing · real laughter." },
    { headline: "Neighborhood pulse", caption: "Where women go this week", body: "SoHo brunch · Williamsburg wine · West Village supper." },
  ];
  const out: { headline: string; caption: string; body: string }[] = [];
  for (let i = 0; i < count; i++) {
    const p = pools[(seed + i) % pools.length];
    out.push({
      headline: i === 0 ? subject : p.headline,
      caption: p.caption,
      body: i === 0 ? brief : p.body,
    });
  }
  return out;
}

export function generateMagazineEdition(input: MagazineGenerateInput): {
  edition: MagazineEdition;
  spreads: MagazineSpread[];
} {
  const theme = input.theme ?? THEMES[input.subject.length % THEMES.length];
  const magazineId = uid("mag");
  const slug = slugify(input.subject) || `edition-${Date.now()}`;
  const count = input.spreadCount ?? 5;
  const copy = pickHeadlines(input.subject.trim() || "BloomBay", input.brief.trim() || "Women in the city", count);
  const refs = input.referenceImages?.filter((r) => r.imageUrl) ?? [];

  const spreads: MagazineSpread[] = copy.map((c, i) => ({
    id: uid("spr"),
    magazineId,
    pageIndex: i,
    headline: c.headline,
    caption: c.caption,
    body: c.body,
    imageUrl: refs[i % Math.max(refs.length, 1)]?.imageUrl,
    kind: i % 3 === 2 ? "gif" : "photo",
    linkHref:
      i === count - 1
        ? ({
            lifestyle: "/member/happenings",
            fashion: "/member/explore#eat",
            city: "/member/explore",
            clubs: "/member/clubs",
            food: "/member/eats",
          } satisfies Record<MagazineTheme, string>)[theme]
        : undefined,
  }));

  const edition: MagazineEdition = {
    id: magazineId,
    slug,
    title: input.subject.trim() || "BloomBay Weekly",
    subtitle: input.brief.trim().slice(0, 120) || "Lifestyle · fashion · IRL",
    theme,
    coverImageUrl: refs[0]?.imageUrl,
    coverGradient: COVER_GRADIENTS[theme],
    publishedAt: new Date().toISOString(),
    spreadIds: spreads.map((s) => s.id),
  };

  return { edition, spreads };
}
