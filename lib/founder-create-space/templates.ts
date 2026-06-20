import type { PosterTemplateType } from "@/lib/poster-templates/types";
import { saveIdea, saveTheme } from "./store";
import type { CalendarSlotId, StudioDraft, ThemeScope } from "./types";
import { IG_SLOTS, SLOT_LABELS, TIKTOK_SLOTS } from "./types";

export type CreateTemplateKind = "theme_pack" | "social" | "studio" | "calendar_day";

export type ThemeTemplateEntry = {
  scope: ThemeScope;
  label: string;
  brief: string;
  weekday?: number;
  weekIndex?: number;
  date?: string;
};

export type SocialSlotTemplate = {
  slot: CalendarSlotId;
  title: string;
  caption: string;
  shotList: string[];
};

export type CreateTemplate = {
  id: string;
  kind: CreateTemplateKind;
  name: string;
  description: string;
  tags: string[];
  themeEntries?: ThemeTemplateEntry[];
  socialSlots?: SocialSlotTemplate[];
  studio?: {
    kind: StudioDraft["kind"];
    brief: string;
    posterTemplate?: PosterTemplateType;
    bodyOutline?: string;
  };
  sampleIdeas?: { title: string; notes: string }[];
};

export const CREATE_TEMPLATES: CreateTemplate[] = [
  {
    id: "tp-irl-core",
    kind: "theme_pack",
    name: "IRL core month",
    description: "Base month + Friday night plans + Thursday soft launch.",
    tags: ["monthly", "recurring"],
    themeEntries: [
      {
        scope: "monthly",
        label: "Month theme",
        brief: "Women meeting women IRL — clubs, open seats, real rooms",
      },
      {
        scope: "weekday",
        label: "Friday IRL",
        brief: "Friday plans: happenings, open seats, bring one friend",
        weekday: 5,
      },
      {
        scope: "weekday",
        label: "Thursday tease",
        brief: "Thursday carousel: preview the weekend room",
        weekday: 4,
      },
    ],
    sampleIdeas: [
      { title: "Brunch booth energy", notes: "Corner table, shared pastry, one new face" },
      { title: "Bowling after brunch", notes: "11am brunch → 2pm lanes. Loser buys fries." },
    ],
  },
  {
    id: "tp-club-mama",
    kind: "theme_pack",
    name: "Club Mama spotlight",
    description: "Week 2 of month — host + happening proof.",
    tags: ["weekly", "clubs"],
    themeEntries: [
      {
        scope: "weekly",
        label: "Club Mama week",
        brief: "Spotlight one Club Mama, her crest, one real happening",
        weekIndex: 2,
      },
    ],
    sampleIdeas: [
      { title: "Host portrait", notes: "Candid at the door, not corporate headshot" },
      { title: "Seat count proof", notes: "Screenshot RSVP → faces in the room same night" },
    ],
  },
  {
    id: "tp-summer-rooftop",
    kind: "theme_pack",
    name: "Golden hour rooftop",
    description: "Outdoor-forward — pair with weather pivots on rainy days.",
    tags: ["seasonal", "outdoor"],
    themeEntries: [
      {
        scope: "monthly",
        label: "Rooftop season",
        brief: "Golden hour rooftop — skyline wide, clink tight, RSVP tonight",
      },
      {
        scope: "weekday",
        label: "Saturday sunset",
        brief: "Saturday rooftop or terrace — women-only table",
        weekday: 6,
      },
    ],
    sampleIdeas: [
      { title: "Skyline hero", notes: "One wide, one toast close-up — no influencer pose" },
      { title: "Rain pivot: wine bar", notes: "Same guest list, indoor booths, rainy window B-roll" },
    ],
  },
  {
    id: "soc-ig-carousel",
    kind: "social",
    name: "IG · 5-slide carousel",
    description: "Feed hero → vibe → proof → map → CTA.",
    tags: ["instagram", "carousel"],
    socialSlots: [
      {
        slot: "ig-1",
        title: "Slide 1 — Hero",
        caption: "POV: you finally found your people in the city.\n\nWomen meeting women — not another feed.",
        shotList: ["Full-bleed warm photo", "Minimal text overlay", "BloomBay object subtle"],
      },
      {
        slot: "ig-2",
        title: "Slides 2–4 — Story",
        caption: "Swipe: vibe → club crest → open seats → save for later.",
        shotList: ["Slide 2: mood", "Slide 3: happening detail", "Slide 4: map pin"],
      },
      {
        slot: "ig-3",
        title: "Slide 5 — Reel / CTA",
        caption: "Save this if you're building your girl crew this month. welovebloombay",
        shotList: ["Motion clip or GIF bloom", "End card CTA"],
      },
    ],
  },
  {
    id: "soc-tiktok-motion",
    kind: "social",
    name: "TikTok · motion pair",
    description: "Hook + GIF/trend cut — movement over manifesto.",
    tags: ["tiktok", "motion"],
    socialSlots: [
      {
        slot: "tiktok-1",
        title: "Hook + walk-in",
        caption: "The app isn't the party. The room is. · BloomBay",
        shotList: [
          "0:00 bloom stamp GIF",
          "0:02 POV walk to door",
          "0:05 faces + cheers",
          "0:08 text: Women meeting women",
        ],
      },
      {
        slot: "tiktok-2",
        title: "GIF / trend",
        caption: "Soft launch your girl crew · trending audio optional",
        shotList: ["Quick cuts on beat", "GIF-style transitions", "No lip-sync required"],
      },
    ],
  },
  {
    id: "stu-magazine",
    kind: "studio",
    name: "Magazine editorial spread",
    description: "Cover line + hero + pull quote — Vogue-adjacent, not corporate.",
    tags: ["magazine", "editorial"],
    studio: {
      kind: "magazine",
      brief: "Editorial spread — women meeting women IRL",
      bodyOutline:
        "Cover line · Hero spread · Detail crop (hands, menu, shoes) · Pull quote · Closing CTA slide",
    },
  },
  {
    id: "stu-daily-bloom",
    kind: "studio",
    name: "Daily Bloom column",
    description: "Newspaper kicker + two sentences — ivory card layout.",
    tags: ["daily bloom", "newspaper"],
    studio: {
      kind: "daily_bloom",
      brief: "Today's bloom: one invite, one seat, one hour offline",
    },
  },
  {
    id: "stu-dinner-poster",
    kind: "studio",
    name: "Event poster · Dinner",
    description: "Dinner template — women-only room, RSVP on BloomBay.",
    tags: ["poster", "event"],
    studio: {
      kind: "event_poster",
      brief: "Supper club — women meeting women",
      posterTemplate: "dinner",
    },
  },
  {
    id: "stu-walk-poster",
    kind: "studio",
    name: "Event poster · Walk",
    description: "Walk template — weather-sensitive; pivot if rainy.",
    tags: ["poster", "outdoor"],
    studio: {
      kind: "event_poster",
      brief: "Neighborhood walk + coffee after",
      posterTemplate: "walk",
    },
  },
  {
    id: "cal-proof-day",
    kind: "calendar_day",
    name: "Proof-of-life day",
    description: "All 5 slots filled with proof-from-the-room messaging.",
    tags: ["calendar", "ugc"],
    socialSlots: [
      ...IG_SLOTS.map((slot, i) => ({
        slot,
        title: SLOT_LABELS[slot],
        caption: `Real room, real faces — proof ${i + 1}. BloomBay.`,
        shotList: ["Candid from last happening", "No staged corporate", "Club crest optional"],
      })),
      ...TIKTOK_SLOTS.map((slot) => ({
        slot,
        title: SLOT_LABELS[slot],
        caption: "Movement > manifesto — show the door, the plate, the hug.",
        shotList: ["GIF bloom open", "Walk-in POV", "Quick face cuts"],
      })),
    ],
  },
];

export type ApplyTemplateResult = {
  themesAdded: number;
  ideasAdded: number;
  message: string;
};

export function applyCreateTemplate(
  template: CreateTemplate,
  monthAnchor: string,
  targetDate?: string
): ApplyTemplateResult {
  let themesAdded = 0;
  let ideasAdded = 0;

  if (template.themeEntries?.length) {
    for (const entry of template.themeEntries) {
      saveTheme({
        label: entry.label,
        brief: entry.brief,
        scope: entry.scope,
        weekday: entry.weekday,
        weekIndex: entry.weekIndex,
        date: entry.date,
        monthAnchor: entry.scope === "daily" ? undefined : monthAnchor,
      });
      themesAdded += 1;
    }
  }

  if (template.sampleIdeas?.length) {
    for (const idea of template.sampleIdeas) {
      saveIdea({ title: idea.title, notes: idea.notes, tags: ["template"] });
      ideasAdded += 1;
    }
  }

  const parts: string[] = [];
  if (themesAdded) parts.push(`${themesAdded} theme(s)`);
  if (ideasAdded) parts.push(`${ideasAdded} idea(s)`);
  if (template.socialSlots?.length && targetDate) {
    parts.push(`social slots ready for ${targetDate}`);
  }
  if (template.studio) parts.push(`studio: ${template.studio.kind}`);

  return {
    themesAdded,
    ideasAdded,
    message: parts.length ? `Applied “${template.name}” — ${parts.join(", ")}` : `Applied “${template.name}”`,
  };
}

export function socialSlotsFromTemplate(template: CreateTemplate): SocialSlotTemplate[] {
  return template.socialSlots ?? [];
}

export function templatesByKind(kind?: CreateTemplateKind): CreateTemplate[] {
  if (!kind) return CREATE_TEMPLATES;
  return CREATE_TEMPLATES.filter((t) => t.kind === kind);
}
