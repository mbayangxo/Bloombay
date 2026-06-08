"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeMode = "day" | "evening" | "night";

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK = "#FF1F7D";

const CITY_MOOD: Record<TimeOfDay, { weather: string; line2: string; vibe: string }> = {
  morning:   { weather: "SUNNY",  line2: "MORNING",   vibe: "The city is waking up."        },
  afternoon: { weather: "SUNNY",  line2: "AFTERNOON", vibe: "The city feels busy today."    },
  evening:   { weather: "CLEAR",  line2: "EVENING",   vibe: "The city feels alive tonight." },
  night:     { weather: "CLEAR",  line2: "NIGHT",     vibe: "The city is still going."      },
};

const WEATHER_ICON: Record<TimeOfDay, string> = {
  morning: "☀️", afternoon: "🌤", evening: "🌙", night: "🌙",
};

const MY_INVITATIONS = [
  { id: 1, title: "DINNER\nSOCIETY", venue: "CARBONE",         date: "THIS FRIDAY",   time: "7:30PM",  seats: "4 SEATS", revealed: true  },
  { id: 2, title: "MUSEUM\nGIRLS",   venue: "BROOKLYN MUSEUM", date: "THIS SATURDAY", time: "11:00AM", seats: null,      revealed: false },
  { id: 3, title: "WALK\n& COFFEE",  venue: "WEST VILLAGE",    date: "THIS SUNDAY",   time: "10:00AM", seats: null,      revealed: true  },
];

const TONIGHT_EVENT = {
  time: "7:30PM", neighborhood: "WEST VILLAGE",
  title1: "Girls Dinner", title2: "· Carbone",
  seats: "4 SEATS · INDIVIDUAL PAY",
  avatars: [
    { i: "A", c: "#FF1F7D" }, { i: "S", c: "#FF69B4" },
    { i: "K", c: "#C0185F" }, { i: "N", c: "#FF69B4" },
  ],
  extra: 1,
};

const MY_CLUBS = [
  { id: 1, abbr: "MG", name: "Museum Girls",  unread: 3, live: true, grad: "linear-gradient(145deg,#FF1F7D,#8B0040)"  },
  { id: 2, abbr: "JW", name: "Jazz & Wine",   unread: 1, live: true, grad: "linear-gradient(145deg,#7C3AED,#4C1D95)"  },
  { id: 3, abbr: "BC", name: "Book Club",     unread: 5, live: true, grad: "linear-gradient(145deg,#EC4899,#9D174D)"  },
  { id: 4, abbr: "AG", name: "African Girls", unread: 2, live: true, grad: "linear-gradient(145deg,#F97316,#9A3412)"  },
];

const TODAY_EVENTS = [
  { id: 1, time: "9:00 AM",  name: "Pilates Class",    location: "Brooklyn Studio · Crown Heights", color: "#FF1F7D", isNext: true  },
  { id: 2, time: "1:00 PM",  name: "Lunch with Sofia", location: "Café Mogador · East Village",     color: "#FF69B4", isNext: false },
  { id: 3, time: "7:30 PM",  name: "Girls Dinner",     location: "Carbone · West Village",          color: "#C084FC", isNext: false },
];

const WEEK_EVENT_COUNTS = [0, 1, 0, 2, 0, 3, 1]; // Sun–Sat

const SHELF = [
  { id: "vogue",   emoji: "📰", href: "/member/city"       },
  { id: "bloom",   emoji: "🌸", href: "/member/happenings" },
  { id: "camera",  emoji: "📷", href: "/member/clubs"      },
  { id: "book",    emoji: "📚", href: "/member/clubs"      },
  { id: "candle",  emoji: "🕯️", href: "/member/room"      },
];

// ─── Theme Tokens ─────────────────────────────────────────────────────────────
// All hex values are exact from the user's three sent palettes.
// Palette 1: #DADCDF #F79EAF #FC4E88 #B70239 #65011A #1C1B1C
// Palette 2: #4A202A #D86487 #EEAAC3 #F1DFDD #76172C
// Palette 3: #191B37 #AE0849 #E21C70 #F966AB #E9CFE8

const THEME = {
  // ── DAY: Pale Pink page · white cards · Eerie Black text ──────────────────────
  // #F1DFDD page, #EEAAC3 Yande, #F79EAF envelope, #D86487 labels, #1C1B1C headings
  day: {
    pageBg:            "#F1DFDD",   // Pale Pink (P2)
    pageGlow:          null as string | null,
    cardBg:            "#FFFFFF",
    cardShadow:        "0 4px 20px rgba(74,32,42,0.1)",
    headingColor:      "#1C1B1C",   // Eerie Black (P1)
    mutedColor:        "#D86487",   // Blush (P2)
    sectionLabel:      "#D86487",   // Blush (P2)
    dividerColor:      "rgba(238,170,195,0.35)",  // Metallic Pink (P2) at opacity
    yandeBg:           "#EEAAC3",   // Metallic Pink (P2)
    yandeBorder:       "rgba(216,100,135,0.3)",   // Blush (P2)
    yandeText:         "#1C1B1C",   // Eerie Black (P1)
    yandeFollow:       "#4A202A",   // Brown Coffee (P2)
    shortcutBg:        "#FFFFFF",
    shortcutBorder:    "rgba(238,170,195,0.5)",   // Metallic Pink (P2)
    clubBox:           "#FFFFFF",
    clubBorder:        "rgba(216,100,135,0.3)",   // Blush (P2)
    clubInner:         "rgba(238,170,195,0.45)",  // Metallic Pink (P2)
    clubAbbr:          "#1C1B1C",   // Eerie Black (P1)
    clubCrown:         "#4A202A",   // Brown Coffee (P2)
    clubCrownOpacity:  "0.75",
    shelfPlank:        "linear-gradient(180deg, #D86487 0%, #4A202A 100%)",  // Blush → Brown Coffee (P2)
    shelfShadow:       "0 4px 14px rgba(74,32,42,0.25)",
    glowFilter:        "none",
    invEnvelopeBg:     "#EEAAC3",   // Metallic Pink (P2)
    invFlapColor:      "#F79EAF",   // Sweet 60 (P1)
    invBottomColor:    "#F1DFDD",   // Pale Pink (P2)
    invCardBg:         "#FFFFFF",
    invCardBorder:     "rgba(238,170,195,0.5)",   // Metallic Pink (P2)
    invText:           "#1C1B1C",   // Eerie Black (P1)
    invMuted:          "#D86487",   // Blush (P2)
    invWatermark:      "rgba(28,27,28,0.08)",
    avatarBorder:      "#FFFFFF",
    overflowAvatar:    "#1C1B1C",   // Eerie Black (P1)
    joinDash:          "rgba(238,170,195,0.55)",  // Metallic Pink (P2)
    joinPlus:          "rgba(216,100,135,0.45)",  // Blush (P2)
    tonightLeft:       "linear-gradient(160deg, #65011A 0%, rgba(252,78,136,0.1) 100%)",  // Claret (P1)
    strikeMuted:       "rgba(28,27,28,0.18)",
  },

  // ── EVENING: Claret page · Brown Coffee cards · Pale Pink text ────────────────
  // #65011A page, #4A202A cards, #F1DFDD headings, #D86487 labels, #FC4E88 accents
  evening: {
    pageBg:            "#65011A",   // Claret (P1)
    pageGlow:          "radial-gradient(ellipse at 50% 0%, rgba(183,2,57,0.45) 0%, transparent 60%)" as string | null,  // Warlock Red (P1)
    cardBg:            "#4A202A",   // Brown Coffee (P2)
    cardShadow:        "0 8px 32px rgba(0,0,0,0.5)",
    headingColor:      "#F1DFDD",   // Pale Pink (P2)
    mutedColor:        "#D86487",   // Blush (P2)
    sectionLabel:      "#D86487",   // Blush (P2)
    dividerColor:      "rgba(183,2,57,0.3)",      // Warlock Red (P1)
    yandeBg:           "rgba(74,32,42,0.65)",     // Brown Coffee (P2)
    yandeBorder:       "rgba(252,78,136,0.3)",    // French Rose (P1)
    yandeText:         "#F1DFDD",   // Pale Pink (P2)
    yandeFollow:       "#D86487",   // Blush (P2)
    shortcutBg:        "rgba(74,32,42,0.7)",      // Brown Coffee (P2)
    shortcutBorder:    "rgba(252,78,136,0.22)",   // French Rose (P1)
    clubBox:           "rgba(252,78,136,0.13)",   // French Rose (P1)
    clubBorder:        "rgba(252,78,136,0.32)",   // French Rose (P1)
    clubInner:         "rgba(252,78,136,0.17)",
    clubAbbr:          "#F79EAF",   // Sweet 60 (P1)
    clubCrown:         "#FC4E88",   // French Rose (P1)
    clubCrownOpacity:  "0.75",
    shelfPlank:        "linear-gradient(180deg, #B70239 0%, #65011A 100%)",  // Warlock Red → Claret (P1)
    shelfShadow:       "0 4px 16px rgba(0,0,0,0.55)",
    glowFilter:        "drop-shadow(0 0 10px rgba(252,78,136,0.72))",  // French Rose (P1)
    invEnvelopeBg:     "#4A202A",   // Brown Coffee (P2)
    invFlapColor:      "#65011A",   // Claret (P1)
    invBottomColor:    "#76172C",   // Claret (P2)
    invCardBg:         "#4A202A",   // Brown Coffee (P2)
    invCardBorder:     "rgba(252,78,136,0.22)",   // French Rose (P1)
    invText:           "#F1DFDD",   // Pale Pink (P2)
    invMuted:          "#D86487",   // Blush (P2)
    invWatermark:      "rgba(241,223,221,0.07)",
    avatarBorder:      "#4A202A",   // Brown Coffee (P2)
    overflowAvatar:    "#65011A",   // Claret (P1)
    joinDash:          "rgba(252,78,136,0.3)",    // French Rose (P1)
    joinPlus:          "rgba(252,78,136,0.48)",   // French Rose (P1)
    tonightLeft:       "linear-gradient(160deg, #B70239 0%, #65011A 100%)",  // Warlock Red → Claret (P1)
    strikeMuted:       "rgba(241,223,221,0.22)",
  },

  // ── NIGHT: Eerie Black page · Brown Coffee cards · Metallic Pink text ─────────
  // #1C1B1C page, #4A202A cards, #EEAAC3 headings, #D86487 labels, #FC4E88 accents
  night: {
    pageBg:            "#1C1B1C",   // Eerie Black (P1)
    pageGlow:          "radial-gradient(ellipse at 50% 0%, rgba(101,1,26,0.55) 0%, transparent 60%)" as string | null,  // Claret (P1)
    cardBg:            "#4A202A",   // Brown Coffee (P2) — wine-pink cards on black
    cardShadow:        "0 8px 32px rgba(0,0,0,0.65)",
    headingColor:      "#EEAAC3",   // Metallic Pink (P2)
    mutedColor:        "#D86487",   // Blush (P2)
    sectionLabel:      "#D86487",   // Blush (P2)
    dividerColor:      "rgba(101,1,26,0.45)",     // Claret (P1)
    yandeBg:           "rgba(74,32,42,0.75)",     // Brown Coffee (P2)
    yandeBorder:       "rgba(252,78,136,0.25)",   // French Rose (P1)
    yandeText:         "#EEAAC3",   // Metallic Pink (P2)
    yandeFollow:       "#D86487",   // Blush (P2)
    shortcutBg:        "rgba(74,32,42,0.72)",     // Brown Coffee (P2)
    shortcutBorder:    "rgba(101,1,26,0.45)",     // Claret (P1)
    clubBox:           "rgba(252,78,136,0.1)",    // French Rose (P1)
    clubBorder:        "rgba(252,78,136,0.25)",   // French Rose (P1)
    clubInner:         "rgba(252,78,136,0.13)",
    clubAbbr:          "#EEAAC3",   // Metallic Pink (P2)
    clubCrown:         "#FC4E88",   // French Rose (P1)
    clubCrownOpacity:  "0.7",
    shelfPlank:        "linear-gradient(180deg, #65011A 0%, #1C1B1C 100%)",  // Claret → Eerie Black (P1)
    shelfShadow:       "0 4px 16px rgba(0,0,0,0.65)",
    glowFilter:        "drop-shadow(0 0 12px rgba(252,78,136,0.78))",  // French Rose (P1)
    invEnvelopeBg:     "#4A202A",   // Brown Coffee (P2)
    invFlapColor:      "#65011A",   // Claret (P1)
    invBottomColor:    "#76172C",   // Claret (P2)
    invCardBg:         "#4A202A",   // Brown Coffee (P2)
    invCardBorder:     "rgba(252,78,136,0.22)",   // French Rose (P1)
    invText:           "#EEAAC3",   // Metallic Pink (P2)
    invMuted:          "#D86487",   // Blush (P2)
    invWatermark:      "rgba(238,170,195,0.06)",
    avatarBorder:      "#4A202A",   // Brown Coffee (P2)
    overflowAvatar:    "#1C1B1C",   // Eerie Black (P1)
    joinDash:          "rgba(101,1,26,0.45)",     // Claret (P1)
    joinPlus:          "rgba(252,78,136,0.42)",   // French Rose (P1)
    tonightLeft:       "linear-gradient(160deg, #65011A 0%, #1C1B1C 100%)",  // Claret → Eerie Black (P1)
    strikeMuted:       "rgba(238,170,195,0.22)",
  },
};

// ─── First Month Journey ──────────────────────────────────────────────────────

const FIRST_MONTH_WEEKS = [
  { week: 1, task: "Join 3 clubs",             cta: { label: "Browse clubs →",        href: "/member/clubs"      }, done: true  },
  { week: 2, task: "Attend 1 gathering",        cta: { label: "Find a gathering →",    href: "/member/happenings" }, done: false },
  { week: 3, task: "Introduce yourself",        cta: { label: "Go to Introductions →", href: "/member/match"      }, done: false },
  { week: 4, task: "Save 5 places in The City", cta: { label: "Explore The City →",    href: "/member/city"       }, done: false },
];

const CURRENT_WEEK = 2;

function FirstMonthCard({ mode }: { mode: TimeMode }) {
  const [open, setOpen] = useState(false);
  const th = THEME[mode];
  const activeWeek = FIRST_MONTH_WEEKS.find(w => w.week === CURRENT_WEEK);

  return (
    <div className="mx-5 md:mx-8 overflow-hidden" style={{ background: th.cardBg, borderRadius: "20px", boxShadow: th.cardShadow, transform: "rotate(-0.6deg)", position: "relative" }}>
      {/* Tape decoration */}
      <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%) rotate(-1deg)", width: 44, height: 14, background: "rgba(255,218,100,0.45)", borderRadius: 2, zIndex: 1, pointerEvents: "none" }} />
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all">
        <div className="flex-1 min-w-0">
          <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: "9px", color: PINK }}>MY FIRST MONTH</p>
          {!open && activeWeek && (
            <p className="font-semibold text-xs mt-0.5 truncate" style={{ color: th.headingColor }}>
              Week {CURRENT_WEEK}: {activeWeek.task}
            </p>
          )}
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5 items-center flex-shrink-0">
          {FIRST_MONTH_WEEKS.map(w => (
            <div key={w.week} style={{
              width: w.week === CURRENT_WEEK ? 8 : 6, height: w.week === CURRENT_WEEK ? 8 : 6,
              borderRadius: "50%", flexShrink: 0,
              background: w.done ? PINK : w.week === CURRENT_WEEK ? PINK : th.dividerColor,
              opacity: w.week > CURRENT_WEEK ? 0.3 : 1,
            }} />
          ))}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={th.mutedColor} strokeWidth="2.5" strokeLinecap="round">
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
        </svg>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${th.dividerColor}` }}>
          {FIRST_MONTH_WEEKS.map((w) => {
            const isActive   = w.week === CURRENT_WEEK && !w.done;
            const isDone     = w.done;
            const isUpcoming = !w.done && !isActive;
            return (
              <div key={w.week} className="px-5 py-3"
                style={{ borderBottom: `1px solid ${th.dividerColor}`, borderLeft: isActive ? `3px solid ${PINK}` : "3px solid transparent", opacity: isUpcoming ? 0.4 : 1 }}>
                <p style={{ fontSize: "8px", fontWeight: 800, color: isActive ? PINK : th.mutedColor }}>WEEK {w.week}</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: "16px", fontWeight: 900, fontStyle: "italic", color: isDone ? th.mutedColor : th.headingColor, textDecoration: isDone ? "line-through" : "none", textDecorationColor: th.strikeMuted }}>
                  {w.task}
                </p>
                {isActive && (
                  <Link href={w.cta.href} className="inline-block mt-1.5 font-bold" style={{ fontSize: "11px", color: PINK, textDecoration: "none" }}>{w.cta.label}</Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── This Week (social calendar layer) ───────────────────────────────────────

const THIS_WEEK_EVENTS = [
  {
    day: "Wednesday", club: "Book Girls NYC", time: "7PM", location: "BK Heights", color: "#FF69B4",
    todos: [
      "Finish this month's chapter",
      "Bring a snack to share",
      "Message the host to confirm",
      "Figure out the subway route",
    ],
  },
  {
    day: "Friday", club: "Dinner Club", time: "8PM", location: "West Village", color: "#FF1F7D",
    todos: [
      "Confirm reservation with the group",
      "Decide on outfit tonight",
      "Venmo your share after dinner",
      "Tag the restaurant in your Bloom",
    ],
  },
  {
    day: "Saturday", club: "Museum Meetup", time: "2PM", location: "The Met, UES", color: "#E8A0C9",
    todos: [
      "Check out the current exhibition online",
      "Arrive 10 min early at the main steps",
      "Bring a small notebook",
      "Save the museum to your City spots",
    ],
  },
];

type WeekEvent = typeof THIS_WEEK_EVENTS[number];

function PlanDetailSheet({ ev, onClose, mode }: { ev: WeekEvent; onClose: () => void; mode: TimeMode }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const th = THEME[mode];

  function toggle(i: number) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  const done = checked.size;
  const total = ev.todos.length;

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
        style={{ background: th.cardBg, boxShadow: "0 -8px 48px rgba(0,0,0,0.25)", maxHeight: "88vh" }}>

        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: th.dividerColor }} />
        </div>

        <div className="px-6 pt-3 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${th.dividerColor}` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: ev.color }}>{ev.day} · {ev.time} · {ev.location}</p>
              <h2 className="font-black leading-tight" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "26px", color: th.headingColor }}>
                {ev.club}
              </h2>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all active:scale-90"
              style={{ background: th.dividerColor }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={th.mutedColor} strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: th.dividerColor }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${total > 0 ? (done / total) * 100 : 0}%`, background: ev.color }} />
            </div>
            <span className="text-[10px] font-bold flex-shrink-0" style={{ color: ev.color }}>{done}/{total}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: th.mutedColor }}>
            TODAY&apos;S CHECKLIST
          </p>
          <div className="flex flex-col gap-3">
            {ev.todos.map((todo, i) => {
              const on = checked.has(i);
              return (
                <button key={i} onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 text-left transition-all active:scale-[0.98]"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                    style={{ border: `2px solid ${on ? ev.color : th.mutedColor}`, background: on ? ev.color : "transparent" }}>
                    {on && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium flex-1"
                    style={{ color: on ? th.mutedColor : th.headingColor, textDecoration: on ? "line-through" : "none" }}>
                    {todo}
                  </span>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color: on ? "transparent" : ev.color }}>
                    {ev.time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 pb-8 pt-4 flex-shrink-0" style={{ borderTop: `1px solid ${th.dividerColor}` }}>
          <Link href="/member/plans"
            className="w-full py-4 rounded-full font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98]"
            style={{ background: ev.color, color: "white", textDecoration: "none", boxShadow: `0 4px 18px ${ev.color}44` }}>
            Open full plan room →
          </Link>
        </div>
      </div>
    </>
  );
}

function ThisWeekCard({ mode }: { mode: TimeMode }) {
  const [open, setOpen] = useState(false);
  const [openEvent, setOpenEvent] = useState<WeekEvent | null>(null);
  const th = THEME[mode];
  const next = THIS_WEEK_EVENTS[0];

  return (
    <>
      <div className="mx-5 overflow-hidden" style={{ background: th.cardBg, borderRadius: "20px", boxShadow: th.cardShadow, transform: "rotate(0.5deg)", position: "relative" }}>
        <button onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all">
          <div className="flex-1 min-w-0">
            <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: "9px", color: PINK }}>
              THIS WEEK · {THIS_WEEK_EVENTS.length} EVENTS
            </p>
            {!open && (
              <p className="font-semibold text-xs mt-0.5 truncate" style={{ color: th.headingColor }}>
                {next.day} · {next.club}
              </p>
            )}
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={th.mutedColor} strokeWidth="2.5" strokeLinecap="round">
            <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
          </svg>
        </button>
        {open && (
          <div style={{ borderTop: `1px solid ${th.dividerColor}` }}>
            {THIS_WEEK_EVENTS.map((ev, i) => (
              <button key={i}
                onClick={() => setOpenEvent(ev)}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all active:scale-[0.99]"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  borderLeft: `3px solid ${ev.color}`,
                  borderBottom: i < THIS_WEEK_EVENTS.length - 1 ? `1px solid ${th.dividerColor}` : "none",
                }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase" style={{ color: th.mutedColor }}>{ev.day}</p>
                  <p className="font-bold text-xs" style={{ color: th.headingColor }}>{ev.club}</p>
                  <p className="text-[10px]" style={{ color: th.mutedColor }}>{ev.time} · {ev.location}</p>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ev.color} strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ))}
            <div className="px-5 py-2.5" style={{ borderTop: `1px solid ${th.dividerColor}` }}>
              <Link href="/member/happenings" className="text-[10px] font-bold" style={{ color: PINK, textDecoration: "none" }}>See all happenings →</Link>
            </div>
          </div>
        )}
      </div>

      {openEvent && <PlanDetailSheet ev={openEvent} onClose={() => setOpenEvent(null)} mode={mode} />}
    </>
  );
}

// ─── Social Momentum (Yande quiet observation) ───────────────────────────────

const YANDE_OBSERVATIONS = [
  { note: "You've attended three gatherings this month.", follow: "Looks like you're settling into the city.", cta: null as { label: string; href: string } | null },
  { note: "You haven't been out in a few weeks.", follow: "Want me to find something cozy this weekend?", cta: { label: "Find something →", href: "/member/happenings" } as { label: string; href: string } | null },
  { note: "You keep going to the same Book Club.", follow: "One of those women is going to become a friend.", cta: null as { label: string; href: string } | null },
];

function YandeNoticed({ mode }: { mode: TimeMode }) {
  const [open, setOpen] = useState(false);
  const th = THEME[mode];
  const obs = YANDE_OBSERVATIONS[0];
  return (
    <div className="mx-5">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left transition-all active:scale-[0.97]"
        style={{ animation: !open ? "flowerPulse 4s ease-in-out 3s infinite" : undefined }}>
        <span style={{ fontSize: "16px", lineHeight: 1 }}>🌸</span>
        <p className="flex-1 font-bold tracking-[0.2em] uppercase" style={{ fontSize: "8px", color: PINK }}>YANDE NOTICED</p>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={th.mutedColor} strokeWidth="2.5" strokeLinecap="round">
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
        </svg>
      </button>
      {open && (
        <div className="pl-6 pt-2 pb-1">
          <p className="text-sm font-semibold mb-0.5" style={{ color: th.yandeText }}>{obs.note}</p>
          <p className="text-xs italic leading-relaxed" style={{ fontFamily: "var(--font-instrument)", color: th.yandeFollow }}>{obs.follow}</p>
          {obs.cta && (
            <Link href={obs.cta.href} className="inline-block mt-2 text-xs font-bold" style={{ color: PINK, textDecoration: "none" }}>{obs.cta.label}</Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Yande Sheet ──────────────────────────────────────────────────────────────

function YandeSheet({ onClose }: { onClose: () => void }) {
  const clubs = [
    { name: "Soft Life Club NYC",     why: "Matches your calm, intentional energy",     color: "#FF69B4", bg: "#C51B7A" },
    { name: "Chelsea Art Circle",     why: "You tagged Art & Galleries in your profile", color: "#FF8FB8", bg: "#8B1A50" },
    { name: "Williamsburg Book Soc.", why: "Books are your thing. This club is active.", color: PINK,      bg: "#7F0030" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10"
        style={{ background: "#FDF4EC", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex justify-center pt-3 pb-3">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="px-5 flex items-center gap-2 mb-3">
          <span style={{ fontSize: "22px" }}>🌸</span>
          <div>
            <p className="font-bold tracking-[0.22em] uppercase" style={{ fontSize: "9px", color: PINK }}>YANDE</p>
            <p className="font-black italic leading-tight" style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "#111" }}>
              I found 3 clubs for you.
            </p>
          </div>
        </div>
        <p className="px-5 italic mb-5 leading-relaxed" style={{ fontFamily: "var(--font-instrument)", fontSize: "14px", color: "#888" }}>
          You haven&apos;t chosen a club yet. These match your profile best.
        </p>
        <div className="flex flex-col gap-3 px-5">
          {clubs.map((club, i) => (
            <div key={i} className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "white", border: "1px solid rgba(255,31,125,0.1)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-xs flex-shrink-0"
                style={{ background: `radial-gradient(circle at 35% 35%, ${club.color}, ${club.bg})` }}>
                {club.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#111" }}>{club.name}</p>
                <p className="italic mt-0.5" style={{ fontFamily: "var(--font-instrument)", fontSize: "11px", color: PINK }}>{club.why}</p>
              </div>
              <button className="px-3 py-1.5 rounded-full font-bold text-white flex-shrink-0"
                style={{ background: PINK, fontSize: "10px" }}>Join</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Invitation Card ──────────────────────────────────────────────────────────

function InvitationCard({ inv, mode }: {
  inv: typeof MY_INVITATIONS[0]; mode: TimeMode;
}) {
  const th = THEME[mode];
  const W = 128;
  const H = 176;

  if (!inv.revealed) {
    return (
      <Link href={`/member/invitations/${inv.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
        <div className="relative overflow-hidden transition-transform active:scale-[0.97]"
          style={{ width: `${W}px`, height: `${H}px`,
            background: th.invEnvelopeBg,
            borderRadius: "8px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.22)" }}>
          {/* Envelope flap */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 0,
            borderLeft: `${W / 2}px solid transparent`,
            borderRight: `${W / 2}px solid transparent`,
            borderTop: `${Math.round(H * 0.38)}px solid ${th.invFlapColor}`,
          }} />
          {/* Bottom triangle */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 0,
            borderLeft: `${W / 2}px solid transparent`,
            borderRight: `${W / 2}px solid transparent`,
            borderBottom: `${Math.round(H * 0.34)}px solid ${th.invBottomColor}`,
          }} />
          {/* Wax seal */}
          <div className="absolute flex items-center justify-center"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "52px", height: "52px", borderRadius: "50%", zIndex: 2,
              background: "radial-gradient(circle at 35% 35%, #FF1F7D, #7F0030)",
              boxShadow: "0 3px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
            <span className="font-black italic text-white"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "15px", letterSpacing: "-0.01em" }}>BB</span>
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center font-bold tracking-[0.24em] uppercase"
            style={{ fontSize: "8px", color: th.invMuted, zIndex: 2 }}>
            OPEN ME
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/member/invitations/${inv.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="relative overflow-hidden transition-transform active:scale-[0.97]"
        style={{ width: `${W}px`, height: `${H}px`, background: th.invCardBg,
          borderRadius: "8px", boxShadow: "0 6px 24px rgba(0,0,0,0.16)" }}>
        {/* Inner decorative border */}
        <div className="absolute pointer-events-none"
          style={{ inset: "8px", border: `0.5px solid ${th.invCardBorder}` }} />
        <div className="relative flex flex-col justify-between h-full px-4 py-[14px]">
          <p className="font-black italic" style={{ fontFamily: "var(--font-playfair)", fontSize: "12px", color: PINK }}>BB.</p>
          <div>
            <p className="font-black leading-none whitespace-pre-line uppercase"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: th.invText,
                lineHeight: 0.88, letterSpacing: "-0.01em" }}>
              {inv.title}
            </p>
            <p className="font-bold tracking-[0.16em] uppercase mt-2"
              style={{ fontSize: "9px", color: th.invMuted }}>
              {inv.venue}
            </p>
          </div>
          <div>
            <p className="font-semibold" style={{ fontSize: "9px", color: th.invMuted, lineHeight: 1.6 }}>{inv.date}</p>
            <p className="font-semibold" style={{ fontSize: "9px", color: th.invMuted }}>{inv.time}</p>
            {inv.seats && (
              <p className="font-bold mt-1" style={{ fontSize: "9px", color: PINK }}>{inv.seats}</p>
            )}
            <p className="mt-2 font-black italic"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", color: th.invWatermark }}>
              BB.
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Tonight Card ─────────────────────────────────────────────────────────────

function TonightCard({ mode }: { mode: TimeMode }) {
  const [going, setGoing] = useState(false);
  const th = THEME[mode];
  const ev = TONIGHT_EVENT;

  return (
    <div className="mx-5 overflow-hidden flex"
      style={{ background: th.cardBg, borderRadius: "24px",
        boxShadow: th.cardShadow,
        minHeight: "148px" }}>
      {/* Left: photo area */}
      <div className="relative overflow-hidden flex-shrink-0"
        style={{ width: "42%", background: th.tonightLeft }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: "56px", opacity: 0.65 }}>🍷</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-14"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.55))" }} />
      </div>
      {/* Right: info */}
      <div className="flex-1 flex" style={{ padding: "14px 12px 14px 14px" }}>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <p className="font-bold tracking-[0.18em] uppercase" style={{ fontSize: "8px", color: PINK }}>
              {ev.time} · {ev.neighborhood}
            </p>
            <p className="font-black leading-none mt-1.5"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", color: th.headingColor, lineHeight: 0.92 }}>
              {ev.title1}
            </p>
            <p className="italic leading-none"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", color: th.headingColor, fontWeight: 400, lineHeight: 1 }}>
              {ev.title2}
            </p>
            <p className="mt-1.5" style={{ fontSize: "9px", color: th.mutedColor }}>{ev.seats}</p>
          </div>
          {/* Avatars */}
          <div className="flex items-center">
            {ev.avatars.map((a, i) => (
              <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                style={{ background: a.c, marginLeft: i > 0 ? "-5px" : "0",
                  border: `2px solid ${th.avatarBorder}` }}>
                {a.i}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white"
              style={{ background: th.overflowAvatar, marginLeft: "-5px",
                border: `2px solid ${th.avatarBorder}` }}>
              +{ev.extra}
            </div>
          </div>
        </div>
        {/* I'M IN ticket button */}
        <button
          onClick={() => setGoing(g => !g)}
          className="flex-shrink-0 flex flex-col items-center justify-between rounded transition-all active:scale-[0.96] ml-3"
          style={{ width: "46px", padding: "10px 0 7px",
            background: going ? "#C0185F" : PINK,
            borderRadius: "12px",
            boxShadow: `0 4px 16px ${PINK}55` }}>
          <div className="flex flex-col items-center justify-center gap-0.5" style={{ flex: 1 }}>
            <span className="font-black text-white leading-none" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>I&apos;M</span>
            <span className="font-black text-white leading-none" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>IN</span>
            {going && (
              <svg className="mt-0.5" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="2 6 5 9 10 3"/>
              </svg>
            )}
          </div>
          {/* Barcode stub */}
          <div className="flex gap-[1.5px] items-end" style={{ marginTop: "6px" }}>
            {[2,1,3,1,2,1,1,3,2,1].map((w, i) => (
              <div key={i} style={{ width: `${w}px`, height: "12px",
                background: "rgba(255,255,255,0.45)", borderRadius: "0.5px" }} />
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Club Crest ───────────────────────────────────────────────────────────────

function ClubCrest({ club }: { club: typeof MY_CLUBS[0] }) {
  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="relative transition-transform active:scale-[0.96]"
        style={{ width: "104px", height: "136px", borderRadius: "20px", background: club.grad, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.28)" }}>

        {/* Highlight sheen */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 75% 18%, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />

        {/* Unread badge */}
        {club.unread > 0 && (
          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{ background: "white", color: PINK, boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>
            {club.unread}
          </div>
        )}

        {/* Big abbreviation centred */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: "-10px" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: "30px", fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,0.96)", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {club.abbr}
          </p>
        </div>

        {/* Footer bar */}
        <div className="absolute bottom-0 inset-x-0 px-3 py-2.5"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}>
          <p className="font-bold truncate" style={{ fontSize: "8px", color: "rgba(255,255,255,0.92)", letterSpacing: "0.04em" }}>{club.name}</p>
          {club.live && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4ADE80" }} />
              <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>live</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Club data with photo backgrounds ────────────────────────────────────────

const CLUBS_PHOTO = [
  { abbr: "MG", name: "Museum Girls",   unread: 3, live: true, img: "/Event_Museum_Girls.png"  },
  { abbr: "BC", name: "Book Club",       unread: 5, live: true, img: "/Event_Book_Society.png"  },
  { abbr: "RC", name: "Run Club",        unread: 2, live: true, img: "/Event_Sunday_Walk.png"   },
  { abbr: "NG", name: "Night Out Girls", unread: 1, live: true, img: "/01_Girls_Night.png"      },
  { abbr: "CG", name: "Coffee Gang",     unread: 0, live: true, img: null                       },
];

const NEIGHBORHOODS = [
  { name: "SoHo",         clubs: "12 clubs", color: "#D4B5A0" },
  { name: "West Village", clubs: "18 clubs", color: "#C4A8A0" },
  { name: "Williamsburg", clubs: "16 clubs", color: "#C0B0A8" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomePage({ firstName = "May", initial = "M" }: { firstName?: string; initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("afternoon");
  const [greeting, setGreeting] = useState("Good afternoon");
  const [showYande, setShowYande] = useState(false);

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
  }, []);

  const today = new Date();
  const todayDow = today.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    return {
      abbr: ["SUN","MON","TUE","WED","THU","FRI","SAT"][i],
      date: d.getDate(),
      isToday: i === todayDow,
      events: WEEK_EVENT_COUNTS[i],
    };
  });

  const greetingTime = tod === "morning" ? "MORNING" : tod === "evening" || tod === "night" ? "EVENING" : "AFTERNOON";

  return (
    <div style={{ background: "#F6F1EB", minHeight: "100vh", paddingBottom: "104px", overflowX: "hidden" }}>

      {/* ═══ HEADER ═══ */}
      <div style={{ position: "relative", background: "#F6F1EB", paddingTop: 44, paddingBottom: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/homepage-objects/EBACE242-70AB-4C83-B40D-485A01CBB332.PNG" alt=""
          style={{ position: "absolute", top: 0, left: -6, width: "108%", pointerEvents: "none", zIndex: 0 }} />

        {/* Nav: BB* + bell on left, shortcuts on right */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 20, paddingRight: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: 22, color: "#FF1F7D" }}>BB*</span>
            <svg width="9" height="20" viewBox="0 0 9 20" fill="none">
              <ellipse cx="4.5" cy="3.5" rx="2.6" ry="3.1" stroke="#999" strokeWidth="1.1" fill="none"/>
              <line x1="4.5" y1="6.6" x2="4.5" y2="17.6" stroke="#999" strokeWidth="1.1" strokeLinecap="round"/>
              <circle cx="4.5" cy="18.1" r="1.3" stroke="#999" strokeWidth="1" fill="none"/>
            </svg>
            <div style={{ position: "relative", marginLeft: 2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div style={{ position: "absolute", top: -3, right: -3, width: 12, height: 12, borderRadius: "50%", background: "#FF1F7D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6px", fontWeight: 900, color: "white" }}>0</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/member/city" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: 14 }}>🌸</span>
                <span style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>BLOOM</span>
              </div>
            </Link>
            <Link href="/member/room" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: 14 }}>🏛</span>
                <span style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>LOBBY</span>
              </div>
            </Link>
            <button onClick={() => setShowYande(true)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: 14 }}>🌷</span>
                <span style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>YANDE</span>
              </div>
            </button>
          </div>
        </div>

        {/* Greeting (left) + 22BF0D14 portrait (right) */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-start", paddingLeft: 20 }}>
          <div style={{ flex: 1, paddingRight: 6, paddingBottom: 10 }}>
            <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "#FF1F7D", marginBottom: 3 }}>GOOD {greetingTime}</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 27, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.05 }}>{greeting},</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 29, fontWeight: 900, fontStyle: "italic", color: "#FF1F7D", lineHeight: 0.95 }}>{firstName}. ♡</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#aaa", marginTop: 5 }}>you belong here</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#bbb", marginTop: 2 }}>soft life, strong mind ♡</p>
          </div>
          {/* 22BF0D14 — PNG is the card, container has no background */}
          <div style={{ width: 240, flexShrink: 0, marginRight: -4, marginTop: -12, position: "relative" }}>
            <p style={{ position: "absolute", top: "24%", left: "12%", right: "12%", textAlign: "center", zIndex: 4,
              fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C" }}>
              {firstName}
            </p>
            <p style={{ position: "absolute", top: "42%", left: "12%", right: "12%", textAlign: "center", zIndex: 4,
              fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888", lineHeight: 1.2 }}>
              {TODAY_EVENTS[0]?.name}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/homepage-objects/22BF0D14-A676-4B45-A133-EE13D17845F8.PNG" alt=""
              style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
      </div>

      {/* ═══ CALENDAR STRIP ═══ */}
      <div style={{ position: "relative", marginBottom: 2 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(255,31,125,0.07)",
          borderTop: "1px solid rgba(255,31,125,0.12)", borderBottom: "1px solid rgba(255,31,125,0.12)",
          padding: "6px 16px", paddingRight: 74,
        }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <span style={{ fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.06em", color: d.isToday ? "#FF1F7D" : "#ccc" }}>{d.abbr}</span>
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: d.isToday ? "#FF1F7D" : "transparent",
                boxShadow: d.isToday ? "0 2px 8px rgba(255,31,125,0.35)" : "none" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: d.isToday ? "white" : "#666" }}>{d.date}</span>
              </div>
              {d.events > 0 && !d.isToday && (
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,31,125,0.4)" }} />
              )}
            </div>
          ))}
        </div>
        {/* FE40EAB6 "this is the week" sticky — positioned above the strip band, not overlapping it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/homepage-objects/FE40EAB6-EBC5-474A-9170-B1893920E0B1.PNG" alt=""
          style={{ position: "absolute", right: 6, top: -8, width: 68, transform: "rotate(3deg)", zIndex: 3, pointerEvents: "none" }} />
      </div>

      {/* ═══ THREE CARDS — all visible at once ═══ */}
      <div style={{ display: "flex", padding: "4px 14px 12px", gap: 8 }}>

        <Link href="/member/plans" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/homepage-objects/C806CD84-83E7-4147-B213-BEC3CE92DE10.PNG" alt=""
              style={{ width: "100%", height: "auto", display: "block" }} />
            <div style={{ position: "absolute", top: "7%", left: "8%", right: "4%", zIndex: 2 }}>
              <p style={{ fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.14em", color: "#FF1F7D", marginBottom: 2 }}>MY FIRST MONTH</p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 2, marginBottom: 4 }}>
                <span style={{ fontSize: 8, lineHeight: 1.4 }}>⭐</span>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.2 }}>Week 2:<br/>Attend 1<br/>gathering</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ flex: 1, height: 2, borderRadius: 999, background: "rgba(255,31,125,0.15)", overflow: "hidden" }}>
                  <div style={{ width: "75%", height: "100%", background: "#FF1F7D", borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: "6px", fontWeight: 700, color: "#bbb" }}>3/4</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/member/happenings" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/homepage-objects/C4C93D7A-408F-4F2D-B125-CE81AC7C30C1.PNG" alt=""
              style={{ width: "100%", height: "auto", display: "block" }} />
            <div style={{ position: "absolute", top: "7%", left: "8%", right: "4%", zIndex: 2 }}>
              <p style={{ fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.14em", color: "#FF1F7D", marginBottom: 2 }}>THIS WEEK · 3 EVENTS</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1C1B1C", lineHeight: 1.2 }}>Book Girls NYC</p>
              <p style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Wednesday</p>
            </div>
          </div>
        </Link>

        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/homepage-objects/930F0AEE-4D93-4733-B19D-B6937EE076F8.PNG" alt=""
              style={{ width: "100%", height: "auto", display: "block" }} />
            <div style={{ position: "absolute", bottom: "10%", left: "8%", right: "4%", zIndex: 2 }}>
              <p style={{ fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.14em", color: "#FF1F7D", marginBottom: 1 }}>CITY VIBES</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#555", lineHeight: 1.2 }}>Crown Heights</p>
              <p style={{ fontSize: 10, color: "#aaa" }}>9 spots ♡</p>
            </div>
          </div>
        </Link>

      </div>

      {/* ═══ TODAY + TONIGHT ═══ */}
      <div style={{ display: "flex", gap: 10, padding: "0 14px 14px", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/homepage-objects/029131C9-6891-4053-A980-F8F436DBA8AB.PNG" alt=""
          style={{ position: "absolute", right: 130, top: -14, width: 32, transform: "rotate(22deg)", zIndex: 5, pointerEvents: "none" }} />

        {/* Today events */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "#FF1F7D", marginBottom: 8 }}>
            TODAY · {TODAY_EVENTS.length} EVENTS
          </p>
          {TODAY_EVENTS.map((ev, i) => (
            <Link key={ev.id} href="/member/schedule" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 7,
                padding: "6px 0",
                paddingLeft: ev.isNext ? 7 : 0,
                borderBottom: i < TODAY_EVENTS.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                borderLeft: ev.isNext ? "3px solid #FF1F7D" : "3px solid transparent",
              }}>
                <div style={{ flexShrink: 0, minWidth: 44 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#1C1B1C", lineHeight: 1 }}>{ev.time}</p>
                  {ev.isNext && <p style={{ fontSize: "6px", fontWeight: 800, color: "#FF1F7D", letterSpacing: "0.1em", marginTop: 1 }}>NEXT</p>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.1 }}>{ev.name}</p>
                  <p style={{ fontSize: "7.5px", color: "#bbb", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.location}</p>
                </div>
              </div>
            </Link>
          ))}
          <Link href="/member/schedule" style={{ textDecoration: "none" }}>
            <p style={{ fontSize: "7.5px", fontWeight: 700, color: "#FF1F7D", letterSpacing: "0.08em", marginTop: 8 }}>VIEW FULL SCHEDULE →</p>
          </Link>
        </div>

        {/* Tonight card */}
        <div style={{ width: 118, flexShrink: 0 }}>
          <div style={{ background: "linear-gradient(160deg, #2A0008 0%, #3D0018 100%)", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}>
            <div style={{ padding: "11px 10px 8px" }}>
              <p style={{ fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,105,180,0.8)", marginBottom: 4 }}>{TONIGHT_EVENT.time} · WEST VILLAGE</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: "#F1DFDD", lineHeight: 0.98 }}>{TONIGHT_EVENT.title1}</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#D86487", lineHeight: 1, marginTop: 2 }}>{TONIGHT_EVENT.title2}</p>
              <p style={{ fontSize: "6px", color: "rgba(241,223,221,0.45)", marginTop: 5, lineHeight: 1.3 }}>{TONIGHT_EVENT.seats}</p>
            </div>
            <div style={{ padding: "0 10px 10px" }}>
              <button style={{ width: "100%", background: "#FF1F7D", color: "white", border: "none", borderRadius: 10, padding: "7px 0", fontSize: "10px", fontWeight: 900, letterSpacing: "0.08em", cursor: "pointer" }}>
                I&apos;M IN
              </button>
            </div>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: "5px 10px 8px" }}>
              <p style={{ fontSize: "6.5px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>THIS EVENING →</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ YOUR CLUBS — photo cards ═══ */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 8px" }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "#FF1F7D" }}>YOUR CLUBS</p>
          <Link href="/member/clubs" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#bbb" }}>See all →</span>
          </Link>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "0 16px 4px", gap: 8, scrollbarWidth: "none" as const }}>
          {CLUBS_PHOTO.map((club, i) => (
            <Link key={i} href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{ position: "relative", width: 90, height: 118, borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,0.2)" }}>
                {club.img ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={club.img} alt="" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.58) 100%)" }} />
                  </>
                ) : (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(145deg, #e8d5cc, #d4b8b0)" }} />
                )}
                <p style={{ position: "absolute", top: 8, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,0.96)", textShadow: "0 1px 6px rgba(0,0,0,0.5)", zIndex: 2 }}>
                  {club.abbr}
                </p>
                {club.unread > 0 && (
                  <div style={{ position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 900, color: "#FF1F7D", zIndex: 3 }}>
                    {club.unread}
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.32)", backdropFilter: "blur(3px)", padding: "4px 6px 6px", zIndex: 2 }}>
                  <p style={{ fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.9)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{club.name}</p>
                  {club.live && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 1 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
                      <span style={{ fontSize: "6px", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>live</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ NEAR YOU + INSPIRATION ═══ */}
      <div style={{ display: "flex", gap: 10, padding: "0 14px 20px", alignItems: "flex-start" }}>

        {/* Near You */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "#FF1F7D", marginBottom: 3 }}>NEAR YOU</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888", marginBottom: 8 }}>SoHo, NYC</p>
          <Link href="/member/city" style={{ textDecoration: "none", display: "block" }}>
            <div style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/homepage-objects/5F82AF10-AC61-49F3-AA6B-4392FBB2D387.PNG" alt=""
                style={{ width: "100%", height: "auto", display: "block" }} />
              <div style={{ position: "absolute", top: "6%", left: "4%", right: "4%", zIndex: 2, display: "flex", justifyContent: "space-between" }}>
                {NEIGHBORHOODS.map((n, i) => (
                  <div key={i} style={{ textAlign: "center", width: "32%" }}>
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9, fontWeight: 700, color: "#555", lineHeight: 1.2 }}>{n.name}</p>
                    <p style={{ fontSize: "6px", color: "#aaa" }}>{n.clubs}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>
          <Link href="/member/city" style={{ textDecoration: "none" }}>
            <div style={{ marginTop: 8, background: "#FF1F7D", borderRadius: 10, padding: "7px 10px", textAlign: "center" }}>
              <p style={{ fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.1em", color: "white" }}>EXPLORE MAP →</p>
            </div>
          </Link>
        </div>

        {/* Inspiration */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "#FF1F7D", marginBottom: 3 }}>INSPIRATION FOR YOU</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0)", marginBottom: 8 }}>·</p>
          <div style={{ transform: "rotate(1deg)" }}>
            <Link href="/member/happenings" style={{ textDecoration: "none" }}>
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/homepage-objects/38417C11-72A8-4D3D-950A-B335CDFC2CB5.PNG" alt=""
                  style={{ width: "100%", height: "auto", display: "block" }} />
                <div style={{ position: "absolute", bottom: "18%", left: "10%", right: "10%", zIndex: 3 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 700, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.4 }}>&ldquo;Collect moments,<br/>not things.&rdquo;</p>
                </div>
              </div>
            </Link>
          </div>
          <Link href="/member/happenings" style={{ textDecoration: "none" }}>
            <div style={{ marginTop: 8, background: "white", border: "1px solid rgba(255,31,125,0.18)", borderRadius: 10, padding: "7px 10px", textAlign: "center" }}>
              <p style={{ fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.1em", color: "#FF1F7D" }}>DISCOVER PLACES →</p>
            </div>
          </Link>
        </div>

      </div>

      {showYande && <YandeSheet onClose={() => setShowYande(false)} />}

      <style>{`
        @keyframes flowerPulse {
          0%,  100% { transform: scale(1) rotate(0deg);   }
          45%        { transform: scale(1.14) rotate(10deg); }
          90%        { transform: scale(1.04) rotate(-4deg); }
        }
      `}</style>
    </div>
  );
}
