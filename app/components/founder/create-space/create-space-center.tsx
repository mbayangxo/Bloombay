"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import {
  POSTER_TEMPLATE_TYPES,
  posterTemplateLabel,
  type PosterTemplateType,
} from "@/lib/poster-templates/types";
import { generateCreateContent } from "@/lib/founder-create-space/generate-content";
import {
  daysInMonth,
  deleteCalendarPost,
  deleteIdea,
  deleteTheme,
  ensureDaySlots,
  linkIdeaToTheme,
  listCalendarPosts,
  listIdeas,
  listStudioDrafts,
  listThemes,
  saveIdea,
  saveStudioDraft,
  saveTheme,
  upsertCalendarPost,
} from "@/lib/founder-create-space/store";
import {
  linkedIdeasForDate,
  resolveThemesForDate,
  scopeLabel,
  WEEKDAY_LABELS,
} from "@/lib/founder-create-space/themes";
import {
  IG_SLOTS,
  SLOT_LABELS,
  TIKTOK_SLOTS,
  type CalendarPost,
  type CalendarSlotId,
  type CreateIdea,
  type CreateTheme,
  type IdeaVariant,
  type StudioDraft,
  type ThemeScope,
} from "@/lib/founder-create-space/types";
import {
  applyCreateTemplate,
  CREATE_TEMPLATES,
  type CreateTemplate,
  type CreateTemplateKind,
} from "@/lib/founder-create-space/templates";
import { publishMagazineEdition } from "@/lib/magazine-room/store";
import { fetchWeatherForecast, type DayWeather, type WeatherForecast } from "@/lib/founder-create-space/weather";

type Tab = "templates" | "themes" | "calendar" | "ideas" | "studio";

function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

const DEFAULT_BRIEF = "Women meeting women — clubs, open seats, real rooms";

const TEMPLATE_KIND_LABELS: Record<CreateTemplateKind, string> = {
  theme_pack: "Theme packs",
  social: "Social posts",
  studio: "Studio",
  calendar_day: "Calendar day",
};

function TemplatesPanel({
  selectedDate,
  onApply,
}: {
  selectedDate: string;
  onApply: (t: CreateTemplate) => void;
}) {
  const [filter, setFilter] = useState<CreateTemplateKind | "all">("all");
  const shown =
    filter === "all" ? CREATE_TEMPLATES : CREATE_TEMPLATES.filter((t) => t.kind === filter);

  return (
    <div className="fcs-templates">
      <p className="fcs-templates__intro">
        Starter packs for themes, IG/TikTok slot structures, magazine spreads, and event posters. Social
        and calendar templates apply to <strong>{selectedDate}</strong> (change day on Calendar tab first).
      </p>
      <div className="fcs-templates__filters">
        {(["all", "theme_pack", "social", "studio", "calendar_day"] as const).map((k) => (
          <button
            key={k}
            type="button"
            className={filter === k ? "fcs-tabs__btn fcs-tabs__btn--on" : "fcs-tabs__btn"}
            onClick={() => setFilter(k)}
          >
            {k === "all" ? "All" : TEMPLATE_KIND_LABELS[k]}
          </button>
        ))}
      </div>
      <ul className="fcs-templates__grid">
        {shown.map((t) => (
          <li key={t.id} className="fcs-template-card">
            <span className="fcs-template-card__kind">{TEMPLATE_KIND_LABELS[t.kind]}</span>
            <strong>{t.name}</strong>
            <p>{t.description}</p>
            <div className="fcs-template-card__tags">
              {t.tags.map((tag) => (
                <span key={tag} className="fcs-linked-ideas__chip">
                  {tag}
                </span>
              ))}
            </div>
            <button type="button" className="fcs-btn fcs-btn--hot fcs-btn--sm" onClick={() => onApply(t)}>
              Apply template
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CreateSpaceCenter() {
  const [tab, setTab] = useState<Tab>("themes");
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [ideas, setIdeas] = useState<CreateIdea[]>([]);
  const [themes, setThemes] = useState<CreateTheme[]>([]);
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [drafts, setDrafts] = useState<StudioDraft[]>([]);
  const [weather, setWeather] = useState<WeatherForecast>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [fallbackBrief, setFallbackBrief] = useState(DEFAULT_BRIEF);
  const [studioPreset, setStudioPreset] = useState<CreateTemplate["studio"] | null>(null);
  const consumeStudioPreset = useCallback(() => setStudioPreset(null), []);

  const anchor = monthKey(year, month);

  const refresh = useCallback(() => {
    setIdeas(listIdeas());
    setThemes(listThemes(anchor));
    setPosts(listCalendarPosts(anchor));
    setDrafts(listStudioDrafts());
  }, [anchor]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const days = useMemo(() => daysInMonth(year, month), [year, month]);

  useEffect(() => {
    let cancelled = false;
    fetchWeatherForecast(days).then((f) => {
      if (!cancelled) setWeather(f);
    });
    return () => {
      cancelled = true;
    };
  }, [days]);

  function shiftMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function resolvedFor(date: string) {
    return resolveThemesForDate(themes, date, fallbackBrief);
  }

  function buildGenerateInput(date: string, slot?: CalendarSlotId, kind?: "instagram" | "tiktok") {
    const r = resolvedFor(date);
    const refs = linkedIdeasForDate(themes, ideas, date);
    const w = weather[date];
    return {
      kind: kind ?? ("instagram" as const),
      brief: r.combinedBrief,
      themeLayers: r.layers.map((t) => t.brief),
      monthTheme: fallbackBrief,
      referenceIdeas: refs,
      weather: w,
      dateIso: date,
      slot,
      ideaNotes: refs.map((i) => i.notes).join(" "),
    };
  }

  function confirmRainyOutdoor(date: string): boolean {
    const w = weather[date];
    if (!w?.isOutdoorRisk) return true;
    const r = resolvedFor(date);
    const outdoorish = /outdoor|run|rooftop|walk|park|golden/i.test(r.combinedBrief);
    if (!outdoorish) return true;
    return window.confirm(
      `${w.summary} forecast for ${date} (~${w.precipitationMm}mm). Your theme sounds outdoor-heavy. Generate anyway with a rainy-day pivot?`
    );
  }

  function generateSlot(slot: CalendarSlotId) {
    if (!confirmRainyOutdoor(selectedDate)) return;
    setBusy(true);
    setMsg(null);
    const kind = slot.startsWith("ig") ? "instagram" : "tiktok";
    const out = generateCreateContent({ ...buildGenerateInput(selectedDate, slot, kind), kind });
    const ref = linkedIdeasForDate(themes, ideas, selectedDate)[0];
    upsertCalendarPost({
      date: selectedDate,
      slot,
      title: out.title,
      caption: out.caption,
      hashtags: out.hashtags,
      shotList: out.shotList,
      imageUrl: ref?.imageUrl,
      ideaId: ref?.id,
      status: "draft",
    });
    refresh();
    setMsg(out.weatherNote ? `Generated · ${out.weatherNote}` : `Generated ${SLOT_LABELS[slot]}`);
    setBusy(false);
  }

  function fillMonth() {
    if (
      !window.confirm(
        `Fill ${days.length} days with 5 posts each using layered themes (month + weekly + weekday + daily)?`
      )
    ) {
      return;
    }
    setBusy(true);
    for (const date of days) {
      ensureDaySlots(date);
      for (const slot of [...IG_SLOTS, ...TIKTOK_SLOTS]) {
        const kind = slot.startsWith("ig") ? "instagram" : "tiktok";
        const out = generateCreateContent({ ...buildGenerateInput(date, slot, kind), kind });
        const ref = linkedIdeasForDate(themes, ideas, date)[0];
        upsertCalendarPost({
          date,
          slot,
          title: out.title,
          caption: out.caption,
          hashtags: out.hashtags,
          shotList: out.shotList,
          imageUrl: ref?.imageUrl,
          ideaId: ref?.id,
          status: "draft",
        });
      }
    }
    refresh();
    setBusy(false);
    setMsg(`Filled ${days.length} days · themes + weather pivots applied`);
  }

  function applyTemplate(template: CreateTemplate) {
    const result = applyCreateTemplate(template, anchor, selectedDate);
    if (template.socialSlots?.length) {
      ensureDaySlots(selectedDate);
      for (const s of template.socialSlots) {
        upsertCalendarPost({
          date: selectedDate,
          slot: s.slot,
          title: s.title,
          caption: s.caption,
          shotList: s.shotList,
          hashtags: ["#BloomBay", "#WomenWhoMeetWomen", "#IRLNotURL"],
          status: "draft",
        });
      }
    }
    if (template.studio) {
      setStudioPreset(template.studio);
      setTab("studio");
    }
    if (template.themeEntries?.length && !template.socialSlots?.length) {
      setTab("themes");
    }
    refresh();
    setMsg(result.message);
  }

  const rainAlerts = useMemo(() => {
    const alerts: { date: string; scheduled: number }[] = [];
    for (const date of days) {
      const w = weather[date];
      if (!w?.isRainy) continue;
      const scheduled = posts.filter((p) => p.date === date && p.status === "scheduled").length;
      if (scheduled > 0) alerts.push({ date, scheduled });
    }
    return alerts;
  }, [days, posts, weather]);

  return (
    <div className="fcs">
      <p className="fcs-prototype-note" role="status">
        Prototype — drafts save on this device until HQ syncs to the cloud.
      </p>
      <nav className="fcs-tabs" aria-label="Create space">
        {(
          [
            ["templates", "Templates"],
            ["themes", "Themes"],
            ["calendar", "Monthly calendar"],
            ["ideas", "Ideas & images"],
            ["studio", "Studio"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "fcs-tabs__btn fcs-tabs__btn--on" : "fcs-tabs__btn"}
            onClick={() => {
              setTab(id);
              refresh();
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {rainAlerts.length ? (
        <div className="fcs-alert" role="status">
          <strong>Weather heads-up:</strong>{" "}
          {rainAlerts.map((a) => `${a.scheduled} scheduled post(s) on rainy ${a.date}`).join(" · ")} — consider
          indoor pivots.
        </div>
      ) : null}

      {tab === "templates" ? (
        <TemplatesPanel
          selectedDate={selectedDate}
          onApply={applyTemplate}
        />
      ) : null}

      {tab === "themes" ? (
        <ThemesPanel
          anchor={anchor}
          themes={themes}
          ideas={ideas}
          fallbackBrief={fallbackBrief}
          onFallbackChange={setFallbackBrief}
          onRefresh={refresh}
        />
      ) : null}

      {tab === "calendar" ? (
        <>
          <div className="fcs-toolbar">
            <span className="fcs-theme-chip">{resolvedFor(selectedDate).label}</span>
            <button type="button" className="fcs-btn fcs-btn--hot" disabled={busy} onClick={fillMonth}>
              {busy ? "Generating…" : "Fill month (template drafts)"}
            </button>
          </div>
          <CalendarPanel
            year={year}
            month={month}
            days={days}
            posts={posts}
            selectedDate={selectedDate}
            weather={weather}
            themeLabel={resolvedFor(selectedDate).label}
            linkedIdeas={linkedIdeasForDate(themes, ideas, selectedDate)}
            busy={busy}
            onShiftMonth={shiftMonth}
            onSelectDate={(d) => {
              setSelectedDate(d);
              ensureDaySlots(d);
              refresh();
            }}
            onGenerate={generateSlot}
            onSavePost={(patch) => {
              upsertCalendarPost(patch);
              refresh();
            }}
            onDeletePost={(id) => {
              deleteCalendarPost(id);
              refresh();
            }}
            onSpinIdeas={() => {
              const out = generateCreateContent({
                ...buildGenerateInput(selectedDate),
                kind: "idea_variants",
              });
              setMsg(out.caption.replace(/\n/g, " "));
            }}
          />
        </>
      ) : null}

      {msg ? <p className="fcs-msg">{msg}</p> : null}

      {tab === "ideas" ? (
        <IdeasPanel
          ideas={ideas}
          themes={themes}
          anchor={anchor}
          onRefresh={refresh}
          onUseIdea={(idea) => {
            setSelectedDate(today.toISOString().slice(0, 10));
            setTab("calendar");
            setMsg(`Using idea: ${idea.title}`);
          }}
          onSpinVariants={(themeId) => {
            const theme = themes.find((t) => t.id === themeId);
            const brief = theme?.brief ?? fallbackBrief;
            const out = generateCreateContent({
              kind: "idea_variants",
              brief,
              themeLayers: theme ? [theme.brief] : undefined,
            });
            return out.ideaVariants ?? [];
          }}
        />
      ) : null}

      {tab === "studio" ? (
        <StudioPanel
          drafts={drafts}
          themes={themes}
          ideas={ideas}
          selectedDate={selectedDate}
          weather={weather[selectedDate]}
          resolvedBrief={resolvedFor(selectedDate).combinedBrief}
          referenceIdeas={linkedIdeasForDate(themes, ideas, selectedDate)}
          studioPreset={studioPreset}
          onPresetConsumed={consumeStudioPreset}
          onRefresh={refresh}
          busy={busy}
          setBusy={setBusy}
        />
      ) : null}
    </div>
  );
}

function ThemesPanel({
  anchor,
  themes,
  ideas,
  fallbackBrief,
  onFallbackChange,
  onRefresh,
}: {
  anchor: string;
  themes: CreateTheme[];
  ideas: CreateIdea[];
  fallbackBrief: string;
  onFallbackChange: (v: string) => void;
  onRefresh: () => void;
}) {
  const monthly = themes.find((t) => t.scope === "monthly");

  function ensureMonthly() {
    if (monthly) {
      saveTheme({ ...monthly, brief: fallbackBrief, label: "Month theme" });
    } else {
      saveTheme({
        label: "Month theme",
        brief: fallbackBrief,
        scope: "monthly",
        monthAnchor: anchor,
      });
    }
    onRefresh();
  }

  function addScoped(scope: ThemeScope, extra: Partial<CreateTheme>) {
    const label =
      extra.label?.trim() ||
      (scope === "weekday" && extra.weekday != null
        ? `Every ${WEEKDAY_LABELS[extra.weekday]}`
        : scope === "weekly"
          ? `Week ${extra.weekIndex ?? "all"}`
          : scope === "daily"
            ? extra.date ?? "One day"
            : "Theme");
    const brief = extra.brief?.trim();
    if (!brief) return;
    saveTheme({
      label,
      brief,
      scope,
      monthAnchor: anchor,
      weekday: extra.weekday,
      date: extra.date,
      weekIndex: extra.weekIndex,
    });
    onRefresh();
  }

  return (
    <div className="fcs-themes">
      <p className="fcs-themes__intro">
        Stack themes: <strong>month</strong> sets the base, <strong>week</strong> narrows by week-of-month,{" "}
        <strong>recurring</strong> pins every Thursday/Friday, <strong>day</strong> overrides one date. Generation
        blends all layers + linked ideas + weather.
      </p>

      <section className="fcs-themes__block">
        <h3>Monthly theme</h3>
        <textarea
          className="fcs-input fcs-input--area"
          rows={2}
          value={fallbackBrief}
          onChange={(e) => onFallbackChange(e.target.value)}
        />
        <button type="button" className="fcs-btn fcs-btn--hot" onClick={ensureMonthly}>
          Save month theme
        </button>
      </section>

      <section className="fcs-themes__block">
        <h3>Recurring weekday</h3>
        <WeekdayThemeForm onAdd={(weekday, label, brief) => addScoped("weekday", { weekday, label, brief })} />
      </section>

      <section className="fcs-themes__block">
        <h3>Weekly (week of month)</h3>
        <WeeklyThemeForm onAdd={(weekIndex, label, brief) => addScoped("weekly", { weekIndex, label, brief })} />
      </section>

      <section className="fcs-themes__block">
        <h3>One-day override</h3>
        <DailyThemeForm onAdd={(date, label, brief) => addScoped("daily", { date, label, brief })} />
      </section>

      <ul className="fcs-themes__list">
        {themes.map((t) => (
          <li key={t.id} className="fcs-theme-card">
            <span className="fcs-theme-card__scope">{scopeLabel(t.scope)}</span>
            <strong>{t.label}</strong>
            <p>{t.brief}</p>
            <span className="fcs-theme-card__meta">
              {t.scope === "weekday" && t.weekday != null ? WEEKDAY_LABELS[t.weekday] : null}
              {t.scope === "weekly" && (t.weekIndex ? `Week ${t.weekIndex}` : "Every week")}
              {t.scope === "daily" && t.date}
              {t.ideaIds.length ? ` · ${t.ideaIds.length} linked idea(s)` : ""}
            </span>
            <button
              type="button"
              className="fcs-btn fcs-btn--ghost"
              onClick={() => {
                deleteTheme(t.id);
                onRefresh();
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {themes.length ? (
        <p className="fcs-themes__hint">
          Link ideas to themes on the Ideas tab — {ideas.filter((i) => i.themeId).length} idea(s) tagged so far.
        </p>
      ) : null}
    </div>
  );
}

function WeekdayThemeForm({
  onAdd,
}: {
  onAdd: (weekday: number, label: string, brief: string) => void;
}) {
  const [weekday, setWeekday] = useState(5);
  const [label, setLabel] = useState("Friday IRL");
  const [brief, setBrief] = useState("Women meeting women — Friday night plans, open seats, real rooms");

  return (
    <div className="fcs-themes__row">
      <select className="fcs-input" value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
        {WEEKDAY_LABELS.map((d, i) => (
          <option key={d} value={i}>
            Every {d}
          </option>
        ))}
      </select>
      <input className="fcs-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
      <input className="fcs-input" value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Theme brief" />
      <button type="button" className="fcs-btn" onClick={() => onAdd(weekday, label, brief)}>
        Add
      </button>
    </div>
  );
}

function WeeklyThemeForm({
  onAdd,
}: {
  onAdd: (weekIndex: number | undefined, label: string, brief: string) => void;
}) {
  const [weekIndex, setWeekIndex] = useState<string>("");
  const [label, setLabel] = useState("Club spotlight week");
  const [brief, setBrief] = useState("Spotlight one Club Mama + her happening");

  return (
    <div className="fcs-themes__row">
      <select className="fcs-input" value={weekIndex} onChange={(e) => setWeekIndex(e.target.value)}>
        <option value="">Every week this month</option>
        {[1, 2, 3, 4, 5].map((w) => (
          <option key={w} value={w}>
            Week {w} only
          </option>
        ))}
      </select>
      <input className="fcs-input" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input className="fcs-input" value={brief} onChange={(e) => setBrief(e.target.value)} />
      <button
        type="button"
        className="fcs-btn"
        onClick={() => onAdd(weekIndex ? Number(weekIndex) : undefined, label, brief)}
      >
        Add
      </button>
    </div>
  );
}

function DailyThemeForm({ onAdd }: { onAdd: (date: string, label: string, brief: string) => void }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [label, setLabel] = useState("Launch day");
  const [brief, setBrief] = useState("Big happening push — RSVP deadline");

  return (
    <div className="fcs-themes__row">
      <input className="fcs-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input className="fcs-input" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input className="fcs-input" value={brief} onChange={(e) => setBrief(e.target.value)} />
      <button type="button" className="fcs-btn" onClick={() => onAdd(date, label, brief)}>
        Add
      </button>
    </div>
  );
}

function CalendarPanel({
  year,
  month,
  days,
  posts,
  selectedDate,
  weather,
  themeLabel,
  linkedIdeas,
  busy,
  onShiftMonth,
  onSelectDate,
  onGenerate,
  onSavePost,
  onDeletePost,
  onSpinIdeas,
}: {
  year: number;
  month: number;
  days: string[];
  posts: CalendarPost[];
  selectedDate: string;
  weather: WeatherForecast;
  themeLabel: string;
  linkedIdeas: CreateIdea[];
  busy: boolean;
  onShiftMonth: (d: number) => void;
  onSelectDate: (d: string) => void;
  onGenerate: (slot: CalendarSlotId) => void;
  onSavePost: (patch: Partial<CalendarPost> & { date: string; slot: CalendarSlotId }) => void;
  onDeletePost: (id: string) => void;
  onSpinIdeas: () => void;
}) {
  const monthLabel = new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });
  const postsForDay = posts.filter((p) => p.date === selectedDate);
  const allSlots = [...IG_SLOTS, ...TIKTOK_SLOTS];
  const dayWeather = weather[selectedDate];

  async function copyCaption(text: string) {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="fcs-calendar">
      <header className="fcs-calendar__head">
        <button type="button" className="fcs-btn" onClick={() => onShiftMonth(-1)}>
          ←
        </button>
        <h2>{monthLabel}</h2>
        <button type="button" className="fcs-btn" onClick={() => onShiftMonth(1)}>
          →
        </button>
        <span className="fcs-calendar__legend">3 Instagram + 2 TikTok · themes stack per day</span>
      </header>

      <div className="fcs-calendar__grid">
        {days.map((date) => {
          const count = posts.filter((p) => p.date === date && p.caption).length;
          const isSel = date === selectedDate;
          const w = weather[date];
          return (
            <button
              key={date}
              type="button"
              className={isSel ? "fcs-day fcs-day--on" : w?.isRainy ? "fcs-day fcs-day--rain" : "fcs-day"}
              onClick={() => onSelectDate(date)}
            >
              <span className="fcs-day__num">{Number(date.slice(8))}</span>
              <span className="fcs-day__dots">{w?.isRainy ? "☔" : count > 0 ? `${count}/5` : "·"}</span>
            </button>
          );
        })}
      </div>

      <section className="fcs-day-panel">
        <h3>
          {new Date(selectedDate + "T12:00:00").toLocaleDateString("default", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </h3>
        <p className="fcs-day-theme">{themeLabel}</p>
        {dayWeather ? (
          <p className={dayWeather.isRainy ? "fcs-weather fcs-weather--rain" : "fcs-weather"}>
            Forecast: {dayWeather.summary} · ~{dayWeather.tempMaxF}°
            {dayWeather.isRainy ? " — indoor pivot recommended" : ""}
          </p>
        ) : null}
        {linkedIdeas.length ? (
          <div className="fcs-linked-ideas">
            <span>Linked references:</span>
            {linkedIdeas.map((i) => (
              <span key={i.id} className="fcs-linked-ideas__chip">
                {i.title}
              </span>
            ))}
          </div>
        ) : null}
        <button type="button" className="fcs-btn fcs-btn--sm" onClick={onSpinIdeas}>
          Spin similar ideas (brunch, bowling…)
        </button>

        <div className="fcs-slots">
          {allSlots.map((slot) => {
            const post = postsForDay.find((p) => p.slot === slot);
            return (
              <article key={slot} className="fcs-slot">
                <header className="fcs-slot__head">
                  <strong>{SLOT_LABELS[slot]}</strong>
                  <button
                    type="button"
                    className="fcs-btn fcs-btn--sm"
                    disabled={busy}
                    onClick={() => onGenerate(slot)}
                  >
                    Suggest caption
                  </button>
                </header>
                <textarea
                  className="fcs-input fcs-input--area"
                  rows={4}
                  placeholder="Caption…"
                  value={post?.caption ?? ""}
                  onChange={(e) =>
                    onSavePost({
                      date: selectedDate,
                      slot,
                      caption: e.target.value,
                      title: post?.title ?? SLOT_LABELS[slot],
                      hashtags: post?.hashtags ?? [],
                      shotList: post?.shotList ?? [],
                    })
                  }
                />
                {post?.caption ? (
                  <button
                    type="button"
                    className="fcs-btn fcs-btn--ghost fcs-btn--sm"
                    onClick={() => copyCaption(post.caption ?? "")}
                  >
                    Copy caption
                  </button>
                ) : null}
                <input
                  className="fcs-input"
                  placeholder="Image URL or upload reference"
                  value={post?.imageUrl ?? ""}
                  onChange={(e) =>
                    onSavePost({
                      date: selectedDate,
                      slot,
                      imageUrl: e.target.value,
                      caption: post?.caption ?? "",
                      title: post?.title ?? SLOT_LABELS[slot],
                      hashtags: post?.hashtags ?? [],
                      shotList: post?.shotList ?? [],
                    })
                  }
                />
                {post?.shotList?.length ? (
                  <ul className="fcs-shot-list">
                    {post.shotList.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="fcs-slot__foot">
                  <select
                    className="fcs-input"
                    value={post?.status ?? "draft"}
                    onChange={(e) =>
                      onSavePost({
                        date: selectedDate,
                        slot,
                        status: e.target.value as CalendarPost["status"],
                        caption: post?.caption ?? "",
                        title: post?.title ?? SLOT_LABELS[slot],
                        hashtags: post?.hashtags ?? [],
                        shotList: post?.shotList ?? [],
                      })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="posted">Posted</option>
                  </select>
                  {post?.id ? (
                    <button type="button" className="fcs-btn fcs-btn--ghost" onClick={() => onDeletePost(post.id)}>
                      Clear
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function IdeasPanel({
  ideas,
  themes,
  anchor,
  onRefresh,
  onUseIdea,
  onSpinVariants,
}: {
  ideas: CreateIdea[];
  themes: CreateTheme[];
  anchor: string;
  onRefresh: () => void;
  onUseIdea: (idea: CreateIdea) => void;
  onSpinVariants: (themeId: string) => IdeaVariant[];
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [pinterestUrl, setPinterestUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [themeId, setThemeId] = useState("");
  const [filterTheme, setFilterTheme] = useState("");
  const [variants, setVariants] = useState<IdeaVariant[]>([]);

  const monthThemes = themes.filter((t) => !t.monthAnchor || t.monthAnchor === anchor);

  function addIdea(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const idea = saveIdea({
      title,
      notes,
      pinterestUrl,
      imageUrl,
      tags: ["marketing"],
      themeId: themeId || undefined,
    });
    if (themeId) linkIdeaToTheme(themeId, idea.id);
    setTitle("");
    setNotes("");
    setPinterestUrl("");
    setImageUrl("");
    onRefresh();
  }

  function onImageFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const shown = filterTheme ? ideas.filter((i) => i.themeId === filterTheme) : ideas;

  return (
    <div className="fcs-ideas">
      <form onSubmit={addIdea} className="fcs-ideas__form">
        <input className="fcs-input" placeholder="Idea title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className="fcs-input fcs-input--area"
          rows={3}
          placeholder="Brunch date vibe, bowling after, Pinterest board…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <select className="fcs-input" value={themeId} onChange={(e) => setThemeId(e.target.value)}>
          <option value="">Attach to theme (optional)</option>
          {monthThemes.map((t) => (
            <option key={t.id} value={t.id}>
              {scopeLabel(t.scope)} · {t.label}
            </option>
          ))}
        </select>
        <input
          className="fcs-input"
          placeholder="Pinterest URL (optional)"
          value={pinterestUrl}
          onChange={(e) => setPinterestUrl(e.target.value)}
        />
        <input className="fcs-input" type="file" accept="image/*" onChange={(e) => onImageFile(e.target.files?.[0])} />
        <button type="submit" className="fcs-btn fcs-btn--hot">
          Save idea
        </button>
      </form>

      <div className="fcs-ideas__toolbar">
        <select className="fcs-input" value={filterTheme} onChange={(e) => setFilterTheme(e.target.value)}>
          <option value="">All ideas</option>
          {monthThemes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {filterTheme ? (
          <button
            type="button"
            className="fcs-btn"
            onClick={() => setVariants(onSpinVariants(filterTheme))}
          >
            Spin similar ideas for this theme
          </button>
        ) : null}
      </div>

      {variants.length ? (
        <ul className="fcs-variants">
          {variants.map((v) => (
            <li key={v.title}>
              <strong>{v.title}</strong>
              <p>{v.notes}</p>
              <button
                type="button"
                className="fcs-btn fcs-btn--sm"
                onClick={() => {
                  saveIdea({
                    title: v.title,
                    notes: v.notes,
                    tags: ["spin"],
                    themeId: filterTheme || undefined,
                  });
                  onRefresh();
                }}
              >
                Save as idea
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="fcs-ideas__list">
        {shown.map((idea) => (
          <li key={idea.id} className="fcs-idea-card">
            {idea.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={idea.imageUrl} alt="" className="fcs-idea-card__img" />
            ) : null}
            <div>
              <strong>{idea.title}</strong>
              <p>{idea.notes}</p>
              {idea.themeId ? (
                <span className="fcs-idea-card__theme">
                  {monthThemes.find((t) => t.id === idea.themeId)?.label ?? "Theme"}
                </span>
              ) : null}
              {idea.pinterestUrl ? (
                <a href={idea.pinterestUrl} target="_blank" rel="noopener noreferrer">
                  Pinterest →
                </a>
              ) : null}
              <div className="fcs-idea-card__actions">
                <button type="button" className="fcs-btn fcs-btn--sm" onClick={() => onUseIdea(idea)}>
                  Open calendar
                </button>
                <button
                  type="button"
                  className="fcs-btn fcs-btn--ghost"
                  onClick={() => {
                    deleteIdea(idea.id);
                    onRefresh();
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StudioPanel({
  drafts,
  themes,
  ideas,
  selectedDate,
  weather,
  resolvedBrief,
  referenceIdeas,
  studioPreset,
  onPresetConsumed,
  onRefresh,
  busy,
  setBusy,
}: {
  drafts: StudioDraft[];
  themes: CreateTheme[];
  ideas: CreateIdea[];
  selectedDate: string;
  weather?: DayWeather;
  resolvedBrief: string;
  referenceIdeas: CreateIdea[];
  studioPreset: CreateTemplate["studio"] | null;
  onPresetConsumed: () => void;
  onRefresh: () => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
}) {
  const [kind, setKind] = useState<StudioDraft["kind"]>("magazine");
  const [brief, setBrief] = useState(resolvedBrief);
  const [posterTemplate, setPosterTemplate] = useState<PosterTemplateType>("party");
  const [active, setActive] = useState<StudioDraft | null>(null);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [magSubject, setMagSubject] = useState("BloomBay Weekly");
  const [publishMsg, setPublishMsg] = useState<string | null>(null);

  useEffect(() => {
    setBrief(resolvedBrief);
  }, [resolvedBrief]);

  useEffect(() => {
    if (!studioPreset) return;
    setKind(studioPreset.kind);
    setBrief(studioPreset.brief);
    if (studioPreset.posterTemplate) setPosterTemplate(studioPreset.posterTemplate);
    onPresetConsumed();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- consume once per preset
  }, [studioPreset]);

  const refs = [
    ...referenceIdeas,
    ...ideas.filter((i) => pickedIds.includes(i.id)),
  ].filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);

  function generate() {
    if (weather?.isOutdoorRisk && kind === "event_poster") {
      if (!window.confirm(`${weather.summary} on ${selectedDate}. Poster will note indoor pivot — continue?`)) return;
    }
    setBusy(true);
    const genKind =
      kind === "event_poster"
        ? "event_poster"
        : kind === "daily_bloom"
          ? "daily_bloom"
          : kind === "magazine"
            ? "magazine"
            : "blog";
    const out = generateCreateContent({
      kind: genKind,
      brief,
      posterTemplate,
      referenceIdeas: refs,
      weather,
      dateIso: selectedDate,
      themeLayers: themes.map((t) => t.brief),
    });
    const draft = saveStudioDraft({
      kind,
      title: out.title || out.dailyBloomHeadline || out.posterTitle || brief,
      body: out.body ?? out.dailyBloomBody ?? out.caption,
      excerpt: out.excerpt,
      hashtags: out.hashtags,
      posterTemplate: kind === "event_poster" ? posterTemplate : undefined,
      posterTitle: out.posterTitle,
      posterDate: out.posterDate,
      posterLocation: out.posterLocation,
      imageUrl: refs[0]?.imageUrl,
    });
    setActive(draft);
    onRefresh();
    setBusy(false);
  }

  function publishToMagazineRoom() {
    const edition = publishMagazineEdition({
      subject: magSubject.trim() || brief,
      brief,
      referenceImages: refs.map((r) => ({
        title: r.title,
        notes: r.notes,
        imageUrl: r.imageUrl,
      })),
      spreadCount: 5,
    });
    setPublishMsg(`Published “${edition.title}” to Lobby → The Magazine (${edition.slug})`);
  }

  return (
    <div className="fcs-studio">
      <p className="fcs-studio__hint">
        Uses layered themes for <strong>{selectedDate}</strong>
        {weather ? ` · ${weather.summary}` : ""}. Feed reference images below.
      </p>
      {publishMsg ? <p className="fcs-msg">{publishMsg}</p> : null}
      <div className="fcs-studio__form">
        <select className="fcs-input" value={kind} onChange={(e) => setKind(e.target.value as StudioDraft["kind"])}>
          <option value="magazine">Magazine-style post</option>
          <option value="blog">Blog article</option>
          <option value="daily_bloom">Daily Bloom newspaper</option>
          <option value="event_poster">Event poster</option>
        </select>
        {kind === "event_poster" ? (
          <select
            className="fcs-input"
            value={posterTemplate}
            onChange={(e) => setPosterTemplate(e.target.value as PosterTemplateType)}
          >
            {POSTER_TEMPLATE_TYPES.map((t) => (
              <option key={t} value={t}>
                {posterTemplateLabel(t)}
              </option>
            ))}
          </select>
        ) : null}
        <textarea
          className="fcs-input fcs-input--area"
          rows={2}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder={kind === "magazine" ? "Subject & story — what this edition is about…" : undefined}
        />
        {kind === "magazine" ? (
          <input
            className="fcs-input"
            value={magSubject}
            onChange={(e) => setMagSubject(e.target.value)}
            placeholder="Magazine title (e.g. City Style, BloomBay Weekly)"
          />
        ) : null}
        <fieldset className="fcs-ref-pick">
          <legend>Reference images & ideas</legend>
          {ideas.slice(0, 12).map((i) => (
            <label key={i.id} className="fcs-ref-pick__item">
              <input
                type="checkbox"
                checked={pickedIds.includes(i.id) || referenceIdeas.some((r) => r.id === i.id)}
                disabled={referenceIdeas.some((r) => r.id === i.id)}
                onChange={(e) => {
                  setPickedIds((prev) =>
                    e.target.checked ? [...prev, i.id] : prev.filter((id) => id !== i.id)
                  );
                }}
              />
              {i.title}
            </label>
          ))}
        </fieldset>
        <button type="button" className="fcs-btn fcs-btn--hot" disabled={busy} onClick={generate}>
          {busy ? "Writing…" : "AI draft from theme + references"}
        </button>
        {kind === "magazine" ? (
          <button type="button" className="fcs-btn" disabled={busy} onClick={publishToMagazineRoom}>
            Publish edition to Magazine Room →
          </button>
        ) : null}
      </div>

      {active ? (
        <div className="fcs-studio__preview">
          <h3>{active.title}</h3>
          {active.kind === "daily_bloom" ? (
            <div className="fcs-daily-bloom">
              <span className="fcs-daily-bloom__kicker">Daily Bloom</span>
              <p>{active.body}</p>
            </div>
          ) : null}
          {active.kind === "magazine" ? (
            <div className="fcs-magazine">
              {active.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.imageUrl} alt="" className="fcs-magazine__hero" />
              ) : null}
              <pre className="fcs-blog">{active.body}</pre>
            </div>
          ) : null}
          {active.kind === "blog" ? (
            <pre className="fcs-blog">{active.body}</pre>
          ) : null}
          {active.kind === "event_poster" && active.posterTemplate ? (
            <div className="fcs-poster-wrap">
              <PosterRenderer
                data={{
                  id: active.id,
                  template: active.posterTemplate,
                  title: active.posterTitle ?? active.title,
                  category: posterTemplateLabel(active.posterTemplate),
                  date: active.posterDate ?? "Friday",
                  time: "7:30 PM",
                  location: active.posterLocation ?? "NYC",
                  hostName: "BloomBay",
                  ctaLabel: "RSVP",
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <ul className="fcs-drafts">
        {drafts.slice(0, 8).map((d) => (
          <li key={d.id}>
            <button type="button" className="fcs-draft-link" onClick={() => setActive(d)}>
              {d.kind} · {d.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
