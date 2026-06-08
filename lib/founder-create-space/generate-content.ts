import type { PosterTemplateType } from "@/lib/poster-templates/types";
import type { CalendarSlotId, CreateIdea, GenerateKind, IdeaVariant } from "./types";
import { SLOT_LABELS, slotFormat } from "./types";
import type { DayWeather } from "./weather";
import { weatherPivotAdvice } from "./weather";

export type GenerateInput = {
  kind: GenerateKind;
  brief: string;
  ideaNotes?: string;
  pinterestUrl?: string;
  slot?: CalendarSlotId;
  posterTemplate?: PosterTemplateType;
  monthTheme?: string;
  themeLayers?: string[];
  referenceIdeas?: Pick<CreateIdea, "title" | "notes" | "imageUrl">[];
  weather?: DayWeather;
  dateIso?: string;
};

export type GenerateOutput = {
  title: string;
  caption: string;
  hashtags: string[];
  shotList: string[];
  body?: string;
  excerpt?: string;
  dailyBloomHeadline?: string;
  dailyBloomBody?: string;
  posterTitle?: string;
  posterDate?: string;
  posterLocation?: string;
  weatherNote?: string;
  ideaVariants?: IdeaVariant[];
};

const BASE_TAGS = [
  "#BloomBay",
  "#WomenWhoMeetWomen",
  "#IRLNotURL",
  "#GirlsWhoGather",
  "#CityForWomen",
];

const ACTIVITY_VARIANTS: { title: string; notes: string; indoor: boolean }[] = [
  { title: "Sunday brunch date", notes: "Corner booth, shared pastry plate, one friend you met last month — no phones for the first 20 min.", indoor: true },
  { title: "Brunch → bowling arc", notes: "Start soft at 11am, roll into Brooklyn Bowl by 2pm. Loser buys the next round of fries.", indoor: true },
  { title: "Rainy-day pottery & wine", notes: "Hands messy, laughter loud. Book 6 seats, not 12 — intimacy scales better.", indoor: true },
  { title: "Golden-hour rooftop (clear sky)", notes: "One wide shot of the skyline, one tight shot of clinking glasses. CTA: open seats tonight.", indoor: false },
  { title: "Run club → juice stop", notes: "Mile 2 group photo, post-run matcha toast. Tag the club mama.", indoor: false },
  { title: "Book club living room", notes: "Throw blanket, wine, one controversial chapter. Film the 'wait, what?!' face.", indoor: true },
  { title: "Gallery walk + espresso", notes: "Three stops max. End at a café with big windows for carousel slide 4.", indoor: false },
  { title: "Cozy supper club", notes: "Candlelight, prix fixe, women-only table. Shot list: menu detail, toast, exit hug.", indoor: true },
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function hook(brief: string): string {
  const b = brief.trim() || "women meeting women in the city";
  return b.charAt(0).toUpperCase() + b.slice(1);
}

function seedFrom(input: GenerateInput): number {
  return `${input.brief} ${input.ideaNotes ?? ""} ${input.dateIso ?? ""} ${input.themeLayers?.join(" ") ?? ""}`.length;
}

function referenceLine(ideas?: GenerateInput["referenceIdeas"]): string {
  if (!ideas?.length) return "";
  const ref = ideas[0];
  return ref.notes ? `Inspired by your board: ${ref.title} — ${ref.notes}` : `Inspired by: ${ref.title}`;
}

export function generateIdeaVariants(brief: string, weather?: DayWeather, count = 5): IdeaVariant[] {
  const seed = brief.length;
  const pool = weather?.isOutdoorRisk
    ? ACTIVITY_VARIANTS.filter((v) => v.indoor)
    : ACTIVITY_VARIANTS;
  const out: IdeaVariant[] = [];
  for (let i = 0; i < count; i++) {
    const v = pick(pool, seed + i);
    out.push({
      title: v.title,
      notes: v.notes,
      hook: `${hook(brief)} · ${v.title}`,
      indoor: v.indoor,
    });
  }
  return out;
}

export function generateCreateContent(input: GenerateInput): GenerateOutput {
  const brief = input.brief.trim() || "BloomBay — clubs, gatherings, and women who show up IRL";
  const layered =
    input.themeLayers?.filter(Boolean).length
      ? input.themeLayers!.join(" · ")
      : input.monthTheme?.trim() || brief;
  const notes = input.ideaNotes?.trim();
  const ref = referenceLine(input.referenceIdeas);
  const seed = seedFrom(input);
  const weatherNote = input.weather ? weatherPivotAdvice(input.weather, layered) : undefined;

  if (input.kind === "idea_variants") {
    const variants = generateIdeaVariants(layered, input.weather, 6);
    return {
      title: "Theme idea spins",
      caption: variants.map((v) => `• ${v.title}: ${v.notes}`).join("\n"),
      hashtags: BASE_TAGS,
      shotList: variants.map((v) => v.hook),
      ideaVariants: variants,
      weatherNote,
    };
  }

  if (input.kind === "instagram") {
    const slot = input.slot ?? "ig-1";
    const format = slotFormat(slot);
    const hooks = [
      `POV: you finally found your people in the city.`,
      `The app isn't the party. The room is.`,
      `BloomBay is where women plan the week they actually want.`,
    ];
    const weatherLine = input.weather?.isRainy
      ? `\n\n☔ Rain day edit: cozy indoor energy — booths, candles, rainy-window B-roll.`
      : "";
    const variant = pick(ACTIVITY_VARIANTS.filter((v) => !input.weather?.isOutdoorRisk || v.indoor), seed);
    const caption = `${pick(hooks, seed)}\n\n${hook(layered)}\n\n${variant.title}: ${variant.notes}${weatherLine}\n\n${ref ? `${ref}\n\n` : ""}${format === "carousel" ? "Swipe for: vibe → clubs → this week's seats → save for later." : format === "reel" ? "Save this if you're building your girl crew this month." : "Tap link in bio · welovebloombay"}`;
    return {
      title: SLOT_LABELS[slot],
      caption,
      hashtags: [...BASE_TAGS, "#BloomBayNYC", pick(["#GirlCrew", "#SundayPlans", "#RunClub", "#BookClub"], seed)],
      shotList: [
        input.referenceIdeas?.[0]?.imageUrl ? "Match mood to saved reference image" : "Hero: warm pink hour, women laughing at a table",
        weatherNote ?? "Outdoor or indoor per forecast",
        "Insert BloomBay object (bouquet / ticket) as subtle brand mark",
        format === "carousel" ? "Slides 2–4: club crest, happening seat count, map pin" : "Single strong frame + text overlay",
      ],
      weatherNote,
    };
  }

  if (input.kind === "tiktok") {
    const slot = input.slot ?? "tiktok-1";
    const variant = pick(ACTIVITY_VARIANTS, seed);
    return {
      title: SLOT_LABELS[slot],
      caption: `${hook(layered)} · ${variant.title}. Movement > manifesto.${input.weather?.isRainy ? " Rain pivot: indoor montage." : ""}`,
      hashtags: [...BASE_TAGS, "#TikTokNYC", "#WomenInTheCity", pick(["#DayInMyLife", "#SoftLaunch", "#IRL"], seed)],
      shotList: [
        "0:00 — GIF-style bloom object stamp (grow animation)",
        input.weather?.isRainy ? "0:02 — rainy window → door opening to cozy room" : "0:02 — walking POV into neighborhood / club door",
        `0:05 — ${variant.title}: quick cuts`,
        "0:08 — on-screen text: 'BloomBay. Women meeting women.'",
        slot === "tiktok-2" ? "Use trending audio; GIF energy on beat drops" : "End on CTA: welovebloombay",
      ],
      weatherNote,
    };
  }

  if (input.kind === "blog") {
    return {
      title: hook(layered),
      caption: hook(layered),
      excerpt: `Why ${layered.toLowerCase()} matters for women building real community — not another feed.`,
      body: `## ${hook(layered)}\n\n${notes ? `${notes}\n\n` : ""}${ref ? `${ref}\n\n` : ""}${weatherNote ? `> ${weatherNote}\n\n` : ""}BloomBay exists because the city was never designed for how women actually socialize. We built clubs, open seats, and gatherings so showing up feels intentional — not awkward.\n\n### What we're seeing\n- Women want **repeat rooms**, not one-off events\n- Hosts (Club Mamas) want tools, not group chats\n- The best marketing is **proof of life** — photos from real rooms\n\n### Try this week\nPick one club. One happening. Bring one friend. That's the whole thesis.\n\n— BloomBay editorial`,
      hashtags: BASE_TAGS,
      shotList: ["Feature image: editorial photo + serif headline", "Pull quote for IG cross-post"],
      weatherNote,
    };
  }

  if (input.kind === "magazine") {
    const refTitles = input.referenceIdeas?.map((i) => i.title).join(" · ") || layered;
    return {
      title: hook(layered),
      caption: `Editorial spread — ${refTitles}`,
      excerpt: `A magazine-style post weaving your theme with saved references.`,
      body: `### Cover line\n${hook(layered)}\n\n### Spread 1 — Hero\n${ref || "Drop your reference images into the mood board for this theme."}\n\n### Spread 2 — The plan\n${pick(ACTIVITY_VARIANTS, seed).title}: ${pick(ACTIVITY_VARIANTS, seed).notes}\n\n### Spread 3 — Pull quote\n"The city is softer when you have a room to return to."\n\n### Caption for social\nSave this layout — carousel slide 1 = full bleed photo, slide 2 = serif headline on ivory, slide 3 = CTA.`,
      hashtags: [...BASE_TAGS, "#Editorial", "#MagazineLayout"],
      shotList: [
        "Full-bleed photo (reference image or shoot)",
        "Serif headline on ivory — Vogue-adjacent, not corporate",
        "Detail crop: hands, menu, shoes, bouquet object",
        "Closing slide: BloomBay wordmark + RSVP",
      ],
      weatherNote,
    };
  }

  if (input.kind === "daily_bloom") {
    return {
      title: "Daily Bloom",
      dailyBloomHeadline: pick(
        ["The city is softer when you have a plan", "Your girl crew is an infrastructure project", "Show up small, belong big"],
        seed
      ),
      dailyBloomBody: `${hook(layered)}. ${notes ?? "Today's bloom: one invite, one seat, one hour offline."}${weatherNote ? ` ${weatherNote}` : ""} — Yande & the BloomBay desk`,
      caption: "",
      hashtags: ["#DailyBloom", ...BASE_TAGS],
      shotList: ["Newspaper column layout · ivory card", "One line kicker + 2 sentences max"],
      weatherNote,
    };
  }

  if (input.kind === "event_poster") {
    const tpl = input.posterTemplate ?? "party";
    const indoor = input.weather?.isRainy ? " · Indoor" : "";
    return {
      title: "Event poster copy",
      posterTitle: hook(layered),
      posterDate: input.dateIso
        ? new Date(`${input.dateIso}T12:00:00`).toLocaleDateString("default", { weekday: "long", month: "short", day: "numeric" })
        : "This Friday · 7:30 PM",
      posterLocation: pick(["SoHo", "Williamsburg", "West Village", "Brooklyn"], seed) + indoor,
      caption: `You're invited — ${layered}. Women-only room. RSVP on BloomBay.`,
      hashtags: BASE_TAGS,
      shotList: [`Use ${tpl} poster template`, "Export PNG from Create Space preview", "Print + IG slide 1"],
      body: `Poster fields ready — drop into Events studio when you publish.`,
      weatherNote,
    };
  }

  return {
    title: "Month outline",
    caption: `Month theme: ${input.monthTheme ?? layered}`,
    hashtags: BASE_TAGS,
    shotList: ["Week 1: origin story", "Week 2: club mama spotlight", "Week 3: happenings proof", "Week 4: member love + CTA"],
    body: input.monthTheme ?? layered,
  };
}
