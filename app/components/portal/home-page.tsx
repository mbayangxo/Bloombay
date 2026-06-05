"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

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
  { id: 1, abbr: "MG", name: "Museum Girls",  unread: 3, live: true  },
  { id: 2, abbr: "JW", name: "Jazz & Wine",   unread: 1, live: true  },
  { id: 3, abbr: "BC", name: "Book Club",     unread: 5, live: true  },
  { id: 4, abbr: "AG", name: "African Girls", unread: 2, live: true  },
];

const SHELF = [
  { id: "vogue",   emoji: "📰", href: "/member/city"       },
  { id: "bloom",   emoji: "🌸", href: "/member/happenings" },
  { id: "camera",  emoji: "📷", href: "/member/clubs"      },
  { id: "book",    emoji: "📚", href: "/member/clubs"      },
  { id: "candle",  emoji: "🕯️", href: "/member/room"      },
];

// ─── First Month Journey ──────────────────────────────────────────────────────

const FIRST_MONTH_WEEKS = [
  { week: 1, task: "Join 3 clubs",             cta: { label: "Browse clubs →",        href: "/member/clubs"      }, done: true  },
  { week: 2, task: "Attend 1 gathering",        cta: { label: "Find a gathering →",    href: "/member/happenings" }, done: false },
  { week: 3, task: "Introduce yourself",        cta: { label: "Go to Introductions →", href: "/member/match"      }, done: false },
  { week: 4, task: "Save 5 places in The City", cta: { label: "Explore The City →",    href: "/member/city"       }, done: false },
];

const CURRENT_WEEK = 2;

function FirstMonthCard({ isNight }: { isNight: boolean }) {
  const cardBg      = isNight ? "#141414" : "white";
  const headingColor = isNight ? "rgba(255,238,220,0.92)" : "#111";
  const mutedColor  = isNight ? "rgba(255,255,255,0.3)" : "#bbb";
  const dividerColor = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div className="mx-5 md:mx-8 overflow-hidden"
      style={{
        background: cardBg,
        borderRadius: "4px",
        boxShadow: isNight ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.07)",
      }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-baseline justify-between"
        style={{ borderBottom: `1px solid ${dividerColor}` }}>
        <div>
          <p className="font-bold tracking-[0.2em] uppercase mb-0.5"
            style={{ fontSize: "9px", color: PINK }}>MY FIRST MONTH</p>
          <p className="font-black italic leading-none"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: headingColor }}>
            A guided beginning.
          </p>
        </div>
        <p className="font-bold tracking-[0.15em] uppercase flex-shrink-0"
          style={{ fontSize: "9px", color: mutedColor }}>
          Week {CURRENT_WEEK} of 4
        </p>
      </div>

      {/* Weeks */}
      {FIRST_MONTH_WEEKS.map((w) => {
        const isActive   = w.week === CURRENT_WEEK && !w.done;
        const isDone     = w.done;
        const isUpcoming = !w.done && !isActive;

        return (
          <div key={w.week}
            className="px-5 py-4"
            style={{
              borderBottom: `1px solid ${dividerColor}`,
              borderLeft: isActive ? `3px solid ${PINK}` : "3px solid transparent",
              opacity: isUpcoming ? 0.4 : 1,
            }}>
            <p className="font-bold tracking-[0.18em] uppercase mb-1"
              style={{ fontSize: "8px", color: isActive ? PINK : mutedColor }}>
              WEEK {w.week}
            </p>
            <p className="font-black italic leading-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "18px",
                color: isDone ? mutedColor : headingColor,
                textDecoration: isDone ? "line-through" : "none",
                textDecorationColor: isNight ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
              }}>
              {w.task}
            </p>
            {isActive && (
              <Link href={w.cta.href}
                className="inline-block mt-2.5 font-bold"
                style={{ fontSize: "12px", color: PINK, textDecoration: "none" }}>
                {w.cta.label}
              </Link>
            )}
            {isDone && (
              <p className="mt-0.5 font-bold tracking-[0.15em] uppercase"
                style={{ fontSize: "8px", color: mutedColor }}>Done</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── This Week (social calendar layer) ───────────────────────────────────────

const THIS_WEEK_EVENTS = [
  { day: "Wednesday", club: "Book Girls NYC",   time: "7PM · BK Heights",  color: "#A855F7" },
  { day: "Friday",    club: "Dinner Club",       time: "8PM · West Village", color: "#FF1F7D" },
  { day: "Saturday",  club: "Museum Meetup",     time: "2PM · The Met, UES", color: "#0EA5E9" },
];

function ThisWeekCard({ isNight }: { isNight: boolean }) {
  const cardBg   = isNight ? "#111111" : "white";
  const divColor = isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const labelColor = isNight ? "rgba(255,255,255,0.25)" : "#ccc";
  const headColor  = isNight ? "rgba(255,238,220,0.88)" : "#111";

  return (
    <div className="mx-5 mb-2 overflow-hidden"
      style={{
        background: cardBg,
        borderRadius: "4px",
        boxShadow: isNight ? "0 8px 32px rgba(0,0,0,0.35)" : "0 2px 12px rgba(0,0,0,0.06)",
      }}>
      <div className="px-5 pt-4 pb-3 flex items-baseline justify-between"
        style={{ borderBottom: `1px solid ${divColor}` }}>
        <p className="font-bold tracking-[0.22em] uppercase" style={{ fontSize: "9px", color: PINK }}>THIS WEEK</p>
        <Link href="/member/happenings" className="text-[9px] font-bold" style={{ color: PINK, textDecoration: "none" }}>See all →</Link>
      </div>
      {THIS_WEEK_EVENTS.map((ev, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3"
          style={{
            borderBottom: i < THIS_WEEK_EVENTS.length - 1 ? `1px solid ${divColor}` : "none",
            borderLeft: `3px solid ${ev.color}`,
          }}>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wide mb-0.5" style={{ color: labelColor }}>{ev.day}</p>
            <p className="font-bold text-sm leading-tight" style={{ color: headColor }}>{ev.club}</p>
            <p className="text-[10px] mt-0.5" style={{ color: labelColor }}>{ev.time}</p>
          </div>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ev.color }} />
        </div>
      ))}
    </div>
  );
}

// ─── Social Momentum (Yande quiet observation) ───────────────────────────────

const YANDE_OBSERVATIONS = [
  { note: "You've attended three gatherings this month.", follow: "Looks like you're settling into the city.", cta: null as { label: string; href: string } | null },
  { note: "You haven't been out in a few weeks.", follow: "Want me to find something cozy this weekend?", cta: { label: "Find something →", href: "/member/happenings" } as { label: string; href: string } | null },
  { note: "You keep going to the same Book Club.", follow: "One of those women is going to become a friend.", cta: null as { label: string; href: string } | null },
];

function SocialMomentumCard({ isNight }: { isNight: boolean }) {
  const obs = YANDE_OBSERVATIONS[0];
  return (
    <div className="mx-5 mb-2 rounded-2xl px-5 py-4 flex gap-3 items-start"
      style={{
        background: isNight ? "rgba(255,31,125,0.06)" : "#FFF5F8",
        border: `1px solid ${isNight ? "rgba(255,31,125,0.12)" : "rgba(255,31,125,0.1)"}`,
      }}>
      <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>🌸</span>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: PINK }}>YANDE NOTICED</p>
        <p className="text-sm font-semibold mb-0.5"
          style={{ color: isNight ? "rgba(255,238,220,0.88)" : "#222" }}>{obs.note}</p>
        <p className="text-xs italic leading-relaxed"
          style={{ fontFamily: "var(--font-instrument)", color: isNight ? "rgba(255,255,255,0.42)" : "#888" }}>
          {obs.follow}
        </p>
        {obs.cta && (
          <Link href={obs.cta.href} className="inline-block mt-2 text-xs font-bold" style={{ color: PINK, textDecoration: "none" }}>
            {obs.cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Yande Sheet ──────────────────────────────────────────────────────────────

function YandeSheet({ onClose }: { onClose: () => void }) {
  const clubs = [
    { name: "Soft Life Club NYC",     why: "Matches your calm, intentional energy",     color: "#FF69B4", bg: "#C51B7A" },
    { name: "Chelsea Art Circle",     why: "You tagged Art & Galleries in your profile", color: "#A78BFA", bg: "#6D28D9" },
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

function InvitationCard({ inv, isNight }: {
  inv: typeof MY_INVITATIONS[0]; isNight: boolean;
}) {
  const W = 128;
  const H = 176;

  if (!inv.revealed) {
    return (
      <Link href="/member/messages?filter=invitations" style={{ textDecoration: "none", flexShrink: 0 }}>
        <div className="relative overflow-hidden transition-transform active:scale-[0.97]"
          style={{ width: `${W}px`, height: `${H}px`,
            background: isNight ? "#252525" : "#F5E8D5",
            borderRadius: "3px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.16)" }}>
          {/* Envelope flap */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 0,
            borderLeft: `${W / 2}px solid transparent`,
            borderRight: `${W / 2}px solid transparent`,
            borderTop: `${Math.round(H * 0.38)}px solid ${isNight ? "#2E2E2E" : "#E2C99A"}`,
          }} />
          {/* Bottom triangle */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 0,
            borderLeft: `${W / 2}px solid transparent`,
            borderRight: `${W / 2}px solid transparent`,
            borderBottom: `${Math.round(H * 0.34)}px solid ${isNight ? "#252525" : "#EBCFA0"}`,
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
            style={{ fontSize: "8px", color: isNight ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)", zIndex: 2 }}>
            OPEN ME
          </p>
        </div>
      </Link>
    );
  }

  const cardBg = isNight ? "#1E1E1E" : "white";
  const textMain = isNight ? "rgba(255,238,220,0.92)" : "#111";
  const textMuted = isNight ? "rgba(255,255,255,0.32)" : "#aaa";

  return (
    <Link href="/member/messages?filter=invitations" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="relative overflow-hidden transition-transform active:scale-[0.97]"
        style={{ width: `${W}px`, height: `${H}px`, background: cardBg,
          borderRadius: "3px", boxShadow: "0 6px 24px rgba(0,0,0,0.12)" }}>
        {/* Inner decorative border */}
        <div className="absolute pointer-events-none"
          style={{ inset: "8px", border: `0.5px solid ${isNight ? "rgba(255,31,125,0.18)" : "rgba(0,0,0,0.07)"}` }} />
        <div className="relative flex flex-col justify-between h-full px-4 py-[14px]">
          <p className="font-black italic" style={{ fontFamily: "var(--font-playfair)", fontSize: "12px", color: PINK }}>BB.</p>
          <div>
            <p className="font-black leading-none whitespace-pre-line uppercase"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: textMain,
                lineHeight: 0.88, letterSpacing: "-0.01em" }}>
              {inv.title}
            </p>
            <p className="font-bold tracking-[0.16em] uppercase mt-2"
              style={{ fontSize: "9px", color: textMuted }}>
              {inv.venue}
            </p>
          </div>
          <div>
            <p className="font-semibold" style={{ fontSize: "9px", color: textMuted, lineHeight: 1.6 }}>{inv.date}</p>
            <p className="font-semibold" style={{ fontSize: "9px", color: textMuted }}>{inv.time}</p>
            {inv.seats && (
              <p className="font-bold mt-1" style={{ fontSize: "9px", color: PINK }}>{inv.seats}</p>
            )}
            <p className="mt-2 font-black italic"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "14px",
                color: isNight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)" }}>
              BB.
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Tonight Card ─────────────────────────────────────────────────────────────

function TonightCard({ isNight }: { isNight: boolean }) {
  const [going, setGoing] = useState(false);
  const ev = TONIGHT_EVENT;
  const cardBg = isNight ? "#181818" : "white";
  const titleColor = isNight ? "rgba(255,238,220,0.95)" : "#111";
  const mutedColor = isNight ? "rgba(255,255,255,0.35)" : "#aaa";

  return (
    <div className="mx-5 overflow-hidden flex"
      style={{ background: cardBg, borderRadius: "4px",
        boxShadow: isNight ? "0 8px 32px rgba(0,0,0,0.45)" : "0 6px 24px rgba(0,0,0,0.1)",
        minHeight: "148px" }}>
      {/* Left: photo area */}
      <div className="relative overflow-hidden flex-shrink-0"
        style={{ width: "42%",
          background: isNight
            ? "linear-gradient(160deg, #282828 0%, #1A1A1A 100%)"
            : "linear-gradient(160deg, #2E0010 0%, #FF1F7D18 100%)" }}>
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
              style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", color: titleColor, lineHeight: 0.92 }}>
              {ev.title1}
            </p>
            <p className="italic leading-none"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", color: titleColor, fontWeight: 400, lineHeight: 1 }}>
              {ev.title2}
            </p>
            <p className="mt-1.5" style={{ fontSize: "9px", color: mutedColor }}>{ev.seats}</p>
          </div>
          {/* Avatars */}
          <div className="flex items-center">
            {ev.avatars.map((a, i) => (
              <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                style={{ background: a.c, marginLeft: i > 0 ? "-5px" : "0",
                  border: `2px solid ${isNight ? "#181818" : "white"}` }}>
                {a.i}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white"
              style={{ background: "#111", marginLeft: "-5px",
                border: `2px solid ${isNight ? "#181818" : "white"}` }}>
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
            borderRadius: "4px",
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

function ClubCrest({ club, isNight }: {
  club: typeof MY_CLUBS[0]; isNight: boolean;
}) {
  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="flex flex-col items-center gap-1.5 transition-transform active:scale-95">
        <div className="relative">
          <div className="w-14 h-14 flex flex-col items-center justify-center relative"
            style={{
              background: isNight ? "rgba(255,31,125,0.07)" : "white",
              border: `1.5px solid ${isNight ? "rgba(255,31,125,0.28)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: "4px",
              boxShadow: isNight ? "none" : "0 2px 8px rgba(0,0,0,0.07)",
            }}>
            {/* Inner border */}
            <div className="absolute pointer-events-none"
              style={{ inset: "4px", border: `0.5px solid ${isNight ? "rgba(255,31,125,0.18)" : "rgba(0,0,0,0.06)"}` }} />
            {/* Mini crown */}
            <svg style={{ marginBottom: "1px" }} width="14" height="7" viewBox="0 0 24 12">
              <path d="M1 12 L3 5 L7 9 L12 1 L17 9 L21 5 L23 12 Z"
                fill={isNight ? PINK : "#111"} fillOpacity={isNight ? "0.7" : "0.75"} />
            </svg>
            <p className="relative z-10 font-black leading-none"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "13px",
                color: isNight ? "rgba(255,238,220,0.9)" : "#111",
                letterSpacing: "0.04em" }}>
              {club.abbr}
            </p>
          </div>
          {club.unread > 0 && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
              style={{ background: PINK, boxShadow: "0 1px 6px rgba(255,31,125,0.5)" }}>
              {club.unread}
            </div>
          )}
        </div>
        <p className="text-center font-semibold leading-tight"
          style={{ fontSize: "9px", color: isNight ? "rgba(255,255,255,0.5)" : "#555", maxWidth: "56px" }}>
          {club.name.split(" ").slice(0, 2).join(" ")}
        </p>
        {club.live && (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PINK }} />
            <span className="font-bold" style={{ fontSize: "8px", color: PINK }}>live</span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomePage({ firstName = "May", initial = "M" }: { firstName?: string; initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("afternoon");
  const [greeting, setGreeting] = useState("Good afternoon");
  const [dayLabel, setDayLabel] = useState("TODAY");
  const [showYande, setShowYande] = useState(false);

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
    setDayLabel(new Date().toLocaleDateString("en-US", { weekday: "short" }).toUpperCase());
  }, []);

  const mood      = CITY_MOOD[tod];
  const isNight   = tod === "evening" || tod === "night";
  const pageBg    = isNight ? "#111111" : "#FDF4EC";
  const headingColor  = isNight ? "rgba(255,238,220,0.95)" : "#111";
  const mutedColor    = isNight ? "rgba(255,255,255,0.38)" : "#999";
  const sectionLabel  = isNight ? "rgba(255,255,255,0.42)" : "#888";
  const dividerColor  = isNight ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const cardBg        = isNight ? "#181818" : "white";

  const tonightLabel =
    tod === "morning" ? "COMING UP TONIGHT" :
    tod === "night"   ? "RIGHT NOW"         : "TONIGHT";

  return (
    <div className="min-h-screen pb-28" style={{ background: pageBg }}>

      {/* ── GREETING BLOCK ── */}
      <div className="px-5 pt-24 pb-1 md:px-8 md:pt-12">

        {/* Day row */}
        <div className="flex items-start gap-5 mb-3">
          {/* Big day-of-week */}
          <p className="font-black leading-none"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "82px", color: PINK,
              lineHeight: 0.86, letterSpacing: "-0.04em" }}>
            {dayLabel}
          </p>
          {/* Weather label */}
          <div className="pt-2.5 flex flex-col gap-1">
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{WEATHER_ICON[tod]}</span>
            <p className="font-bold tracking-[0.18em] uppercase leading-snug"
              style={{ fontSize: "10px", color: sectionLabel }}>
              {mood.weather}<br/>{mood.line2}
            </p>
          </div>
        </div>

        {/* "Good afternoon," */}
        <p className="leading-none"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "30px",
            color: headingColor, fontWeight: 500 }}>
          {greeting},
        </p>

        {/* "May." + Yande flower */}
        <div className="flex items-center gap-3 mt-0.5">
          <p className="font-black italic leading-none"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "58px", color: PINK,
              lineHeight: 0.88, letterSpacing: "-0.02em" }}>
            {firstName}.
          </p>
          <button
            onClick={() => setShowYande(true)}
            className="transition-transform active:scale-90 flex-shrink-0"
            style={{ animation: "flowerPulse 3s ease-in-out 2.5s infinite" }}
            aria-label="Yande">
            <span style={{
              fontSize: "34px", lineHeight: 1,
              filter: isNight ? "drop-shadow(0 0 10px rgba(255,31,125,0.7))" : "none",
            }}>🌸</span>
          </button>
        </div>

        {/* City vibe */}
        <p className="mt-2.5 italic leading-snug"
          style={{ fontFamily: "var(--font-instrument)", fontSize: "15px", color: mutedColor }}>
          {mood.vibe}
        </p>
      </div>

      {/* ── THIS WEEK (social calendar layer) ── */}
      <ThisWeekCard isNight={isNight} />

      {/* ── SOCIAL MOMENTUM (Yande quiet observation) ── */}
      <SocialMomentumCard isNight={isNight} />

      {/* ── SHORTCUTS: DAILY BLOOM + THE LOBBY ── */}
      <div className="px-5 pt-5 pb-6 md:px-8">
        <div className="flex items-stretch gap-3">
          {[
            { label: "DAILY BLOOM", emoji: "📰", href: "/member/city"  },
            { label: "THE LOBBY",   emoji: "🚪", href: "/member/room"  },
          ].map(sc => (
            <Link key={sc.label} href={sc.href} style={{ textDecoration: "none", flex: 1 }}>
              <div className="flex items-center justify-center gap-3 py-4 transition-transform active:scale-[0.97]"
                style={{
                  background: isNight ? "rgba(255,31,125,0.07)" : "white",
                  border: `1px solid ${dividerColor}`,
                  borderRadius: "4px",
                  boxShadow: isNight ? "none" : "0 2px 10px rgba(0,0,0,0.05)",
                }}>
                <span style={{ fontSize: "22px" }}>{sc.emoji}</span>
                <p className="font-bold tracking-[0.2em] uppercase"
                  style={{ fontSize: "9px", color: sectionLabel }}>{sc.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── MY FIRST MONTH ── */}
      <div className="mb-6">
        <FirstMonthCard isNight={isNight} />
      </div>

      {/* ── YOUR INVITATIONS ── */}
      <div className="mb-6">
        <div className="px-5 flex items-center justify-between mb-3 md:px-8">
          <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: "10px", color: sectionLabel }}>
            YOUR INVITATIONS
          </p>
          <Link href="/member/messages?filter=invitations"
            className="font-semibold" style={{ fontSize: "11px", color: PINK, textDecoration: "none" }}>
            See all →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 px-5 md:px-8" style={{ scrollbarWidth: "none" }}>
          {MY_INVITATIONS.map(inv => (
            <InvitationCard key={inv.id} inv={inv} isNight={isNight} />
          ))}
        </div>
      </div>

      {/* ── TONIGHT ── */}
      <div className="mb-6">
        <div className="px-5 flex items-center justify-between mb-3 md:px-8">
          <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: "10px", color: sectionLabel }}>
            {tonightLabel}
          </p>
          <Link href="/member/happenings"
            className="font-semibold" style={{ fontSize: "11px", color: PINK, textDecoration: "none" }}>
            View details →
          </Link>
        </div>
        <TonightCard isNight={isNight} />
      </div>

      {/* ── YOUR SHELF ── */}
      <div className="px-5 mb-6 md:px-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: "10px", color: sectionLabel }}>
            YOUR SHELF
          </p>
          <Link href="/member/lounge"
            className="font-semibold" style={{ fontSize: "11px", color: PINK, textDecoration: "none" }}>
            Edit →
          </Link>
        </div>
        <div className="relative">
          {/* Objects */}
          <div className="flex items-end justify-between pb-2 overflow-x-auto"
            style={{ scrollbarWidth: "none", gap: "12px" }}>
            {SHELF.map(obj => (
              <Link key={obj.id} href={obj.href} style={{ textDecoration: "none", flexShrink: 0 }}>
                <div className="transition-all active:scale-90">
                  <span style={{ fontSize: "30px", lineHeight: 1, display: "block" }}>{obj.emoji}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* Shelf plank */}
          <div style={{
            height: "10px", borderRadius: "2px",
            background: isNight
              ? "linear-gradient(180deg, #5C3018 0%, #3A1C0A 100%)"
              : "linear-gradient(180deg, #C8A070 0%, #A87848 100%)",
            boxShadow: isNight ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 14px rgba(0,0,0,0.18)",
          }} />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-6" style={{ height: "1px", background: dividerColor }} />

      {/* ── YOUR CLUBS ── */}
      <div className="mb-10">
        <div className="px-5 flex items-center justify-between mb-4 md:px-8">
          <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: "10px", color: sectionLabel }}>
            YOUR CLUBS
          </p>
          <Link href="/member/clubs"
            className="font-semibold" style={{ fontSize: "11px", color: PINK, textDecoration: "none" }}>
            See all →
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto px-5 pb-2 md:px-8" style={{ scrollbarWidth: "none" }}>
          {MY_CLUBS.map(club => (
            <ClubCrest key={club.id} club={club} isNight={isNight} />
          ))}
          {/* Join a Club */}
          <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 flex items-center justify-center"
                style={{
                  border: `1.5px dashed ${isNight ? "rgba(255,31,125,0.28)" : "rgba(0,0,0,0.12)"}`,
                  borderRadius: "4px",
                }}>
                <span style={{ fontSize: "22px", color: isNight ? "rgba(255,31,125,0.45)" : "rgba(0,0,0,0.18)" }}>+</span>
              </div>
              <p className="text-center font-semibold" style={{ fontSize: "9px", color: mutedColor, maxWidth: "56px" }}>
                Join a Club
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Yande sheet */}
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
