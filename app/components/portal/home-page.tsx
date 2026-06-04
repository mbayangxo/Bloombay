"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

// ─── City mood by time ────────────────────────────────────────────────────────

const CITY_MOOD: Record<TimeOfDay, { weather: string; temp: string; vibe: string; women: number }> = {
  morning:   { weather: "Golden morning light",       temp: "68°", vibe: "The city is waking up. Coffee breath and good intentions.",  women: 6  },
  afternoon: { weather: "Sunny afternoon",             temp: "74°", vibe: "24 women making plans right now.",                           women: 24 },
  evening:   { weather: "Golden hour, Williamsburg",   temp: "72°", vibe: "Williamsburg is buzzing. 18 women out tonight.",             women: 18 },
  night:     { weather: "Quiet city, still alive",     temp: "64°", vibe: "17 women still looking for a plan. Still time.",            women: 17 },
};

const HERO_BG: Record<TimeOfDay, string> = {
  morning:   "linear-gradient(150deg, #FF69B4 0%, #FF1F7D 45%, #C51B7A 100%)",
  afternoon: "linear-gradient(145deg, #FF1F7D 0%, #FF69B4 50%, #FF1F7D 100%)",
  evening:   "linear-gradient(150deg, #C51B7A 0%, #FF1F7D 55%, #FF69B4 100%)",
  night:     "linear-gradient(150deg, #7F0030 0%, #C51B7A 60%, #FF1F7D 100%)",
};

const HERO_GLOW: Record<TimeOfDay, string> = {
  morning:   "radial-gradient(ellipse at 15% 20%, rgba(255,255,255,0.22) 0%, transparent 55%)",
  afternoon: "radial-gradient(ellipse at 80% 15%, rgba(255,255,255,0.18) 0%, transparent 50%)",
  evening:   "radial-gradient(ellipse at 15% 20%, rgba(255,105,180,0.3) 0%, transparent 55%)",
  night:     "radial-gradient(ellipse at 10% 20%, rgba(255,31,125,0.22) 0%, transparent 55%)",
};

// ─── Inbox counts ─────────────────────────────────────────────────────────────

const INBOX_INVITES  = 3;
const INBOX_MESSAGES = 5;
const INBOX_PINGS    = 2;
const INBOX_PLANS    = 1;

// ─── Your Week ────────────────────────────────────────────────────────────────

interface WeekDay { day: string; date: string; events: string[]; isToday?: boolean; isPast?: boolean; }

const WEEK: WeekDay[] = [
  { day: "Mon", date: "2",  events: [],                                     isPast: true  },
  { day: "Tue", date: "3",  events: [],                                     isPast: true  },
  { day: "Wed", date: "4",  events: ["Book Club"],                           isToday: true },
  { day: "Thu", date: "5",  events: ["Book Society 7PM"]                                  },
  { day: "Fri", date: "6",  events: ["Gallery Opening", "Dinner Society"]                 },
  { day: "Sat", date: "7",  events: ["Pop-Up Market", "Morning Walk"]                     },
  { day: "Sun", date: "8",  events: ["Sunday Walk"]                                       },
];

// ─── Today events by time slot ────────────────────────────────────────────────

interface TodayEvent {
  id: number; title: string; venue: string; time: string; price: string;
  slot: "now" | "afternoon" | "tonight";
}

const TODAY_EVENTS: TodayEvent[] = [
  { id: 201, title: "Chelsea Gallery Walk",  venue: "Chelsea, Manhattan",    time: "Until 6PM",   price: "Free",  slot: "now"       },
  { id: 202, title: "Afternoon Pilates",     venue: "Prospect Park",         time: "Until 2PM",   price: "$15",   slot: "now"       },
  { id: 203, title: "Open Ceramics Studio",  venue: "Brooklyn Clay",         time: "Until 5PM",   price: "$25",   slot: "now"       },
  { id: 204, title: "Pop-Up Market",         venue: "The Canvas, SoHo",      time: "2PM — 6PM",   price: "Free",  slot: "afternoon" },
  { id: 205, title: "Book Club",             venue: "McNally Jackson",        time: "3PM",         price: "Free",  slot: "afternoon" },
  { id: 206, title: "Park Picnic",           venue: "Sheep Meadow, CP",      time: "2PM",         price: "Free",  slot: "afternoon" },
  { id: 207, title: "Coffee & Catch-Up",     venue: "Blue Bottle, DUMBO",    time: "12–4PM",      price: "Free",  slot: "afternoon" },
  { id: 208, title: "Girls Dinner",          venue: "Carbone, SoHo",         time: "Tonight 7PM", price: "$65",   slot: "tonight"   },
  { id: 209, title: "Rooftop Night",         venue: "Westlight Hotel",        time: "Tonight 8PM", price: "$20",   slot: "tonight"   },
  { id: 210, title: "Gallery Opening",       venue: "The Parlor, Bushwick",  time: "Tonight 7PM", price: "Free",  slot: "tonight"   },
  { id: 211, title: "Jazz at Minton's",      venue: "Minton's, Harlem",       time: "Tonight 9PM", price: "$45",   slot: "tonight"   },
];

// ─── Club Pulse ───────────────────────────────────────────────────────────────

const CLUB_PULSE = [
  { name: "Soft Life Club NYC",   status: "12 women online · buzzing",    live: true,  color: "#FF69B4", crestBg: "#C51B7A" },
  { name: "African Girls Club",   status: "Event coming Friday",           live: false, color: "#FF1F7D", crestBg: "#7F0030" },
  { name: "Girls Who Move",       status: "5 active · planning something", live: true,  color: "#F59E0B", crestBg: "#92400E" },
];

// ─── Mini Crest ───────────────────────────────────────────────────────────────

function MiniCrest({ name, color, crestBg, size = 40 }: {
  name: string; color: string; crestBg: string; size?: number;
}) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div className="flex-shrink-0 relative rounded-full flex items-center justify-center font-bold text-white"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, ${crestBg})`,
        boxShadow: `0 3px 12px ${color}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
        fontSize: size / 3.2,
      }}>
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: "1.5px solid rgba(255,255,255,0.22)", transform: "scale(0.84)" }} />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

// ─── Girl Bar Door ────────────────────────────────────────────────────────────

function GirlBarDoor({ tod }: { tod: TimeOfDay }) {
  const deep = tod === "night";
  return (
    <div style={{
      flex: 1, minHeight: "168px",
      borderRadius: "5px 5px 3px 3px",
      background: deep ? "rgba(7,2,12,0.9)" : "rgba(14,5,22,0.84)",
      backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
      border: "1px solid rgba(255,105,180,0.22)",
      boxShadow: deep
        ? "inset 0 0 28px rgba(255,31,125,0.14), 0 0 32px rgba(255,31,125,0.22), 4px 8px 28px rgba(0,0,0,0.65)"
        : "inset 0 0 22px rgba(255,80,140,0.1), 0 0 24px rgba(255,31,125,0.18), 4px 8px 24px rgba(0,0,0,0.55)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}>
        <span className="block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF1F7D", boxShadow: "0 0 6px #FF1F7D" }} />
      </div>
      <div style={{ position: "absolute", top: "14px", left: "9px", right: "9px", height: "50px", borderRadius: "4px 4px 2px 2px", background: "radial-gradient(ellipse at 50% 40%, rgba(255,31,125,0.18) 0%, rgba(255,20,80,0.05) 70%)", border: "1px solid rgba(255,105,180,0.3)", boxShadow: "inset 0 0 16px rgba(255,31,125,0.22)" }} />
      <div style={{ position: "absolute", top: "72px", left: "9px", right: "9px", height: "52px", borderRadius: "2px", background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,105,180,0.16)" }} />
      <div style={{ position: "absolute", bottom: "26px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #D4A853 0%, #B07018 50%, #D4A853 100%)", borderRadius: "2px", padding: "2.5px 5px", boxShadow: "0 1px 4px rgba(0,0,0,0.45), 0 0 8px rgba(212,168,83,0.3)", whiteSpace: "nowrap" }}>
        <p style={{ fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.2em", color: "#1A0800", lineHeight: 1 }}>GIRL BAR</p>
      </div>
      <div style={{ position: "absolute", width: "8px", height: "8px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #F0C868, #9A6C10)", boxShadow: "0 0 8px rgba(212,168,83,0.7), 0 1px 3px rgba(0,0,0,0.6)", right: "11px", top: "46%" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "14px", background: deep ? "rgba(255,31,125,0.65)" : "rgba(255,80,130,0.55)", filter: "blur(5px)" }} />
      <div style={{ position: "absolute", bottom: "4px", left: 0, right: 0, textAlign: "center" }}>
        <p style={{ fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,105,180,0.55)" }}>ENTER</p>
      </div>
    </div>
  );
}

// ─── Inbox Object ─────────────────────────────────────────────────────────────

function InboxObject({ type, count, href, dark = false }: {
  type: "invite" | "messages" | "pings" | "plans";
  count: number; href: string; dark?: boolean;
}) {
  const configs = {
    invite: {
      label: "Invitations",
      anim: "inviteShake 3.5s ease-in-out 0.8s infinite",
      bg:     dark ? "rgba(255,31,125,0.15)" : "#FFF0F5",
      border: dark ? "rgba(255,31,125,0.35)" : "rgba(255,31,125,0.2)",
      iconColor: dark ? "rgba(255,31,125,0.85)" : "#FF1F7D",
      labelColor: dark ? "rgba(255,31,125,0.85)" : "#FF1F7D",
    },
    messages: {
      label: "Messages",
      anim: "msgBounce 4.2s ease-in-out 1.6s infinite",
      bg:     dark ? "rgba(255,105,180,0.14)" : "#FFF5F8",
      border: dark ? "rgba(255,105,180,0.35)" : "rgba(255,105,180,0.22)",
      iconColor: dark ? "rgba(255,105,180,0.85)" : "#FF69B4",
      labelColor: dark ? "rgba(255,105,180,0.85)" : "#FF69B4",
    },
    pings: {
      label: "Pings",
      anim: "pingRing 5s ease-in-out 2.5s infinite",
      bg:     dark ? "rgba(255,31,125,0.12)" : "#FFF0F5",
      border: dark ? "rgba(255,31,125,0.3)" : "rgba(255,31,125,0.18)",
      iconColor: dark ? "rgba(255,31,125,0.8)" : "#FF1F7D",
      labelColor: dark ? "rgba(255,31,125,0.8)" : "#FF1F7D",
    },
    plans: {
      label: "My Plans",
      anim: "planPulse 3s ease-in-out 3s infinite",
      bg:     dark ? "rgba(212,168,83,0.12)" : "#FFFBF0",
      border: dark ? "rgba(212,168,83,0.35)" : "rgba(212,168,83,0.25)",
      iconColor: dark ? "rgba(212,168,83,0.85)" : "#D4A853",
      labelColor: dark ? "rgba(212,168,83,0.85)" : "#C4902A",
    },
  };
  const cfg = configs[type];

  return (
    <Link href={href} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="relative transition-transform active:scale-90"
        style={{ animation: count > 0 ? cfg.anim : undefined }}>
        <div className="rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all"
          style={{ width: "80px", height: "88px", background: cfg.bg, border: `1.5px solid ${cfg.border}`, boxShadow: count > 0 ? "0 4px 16px rgba(255,31,125,0.12)" : "0 2px 8px rgba(0,0,0,0.05)" }}>

          {/* Envelope */}
          {type === "invite" && (
            <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
              <rect x="1" y="1" width="30" height="22" rx="3.5" fill={`${cfg.iconColor}18`} stroke={cfg.iconColor} strokeWidth="1.4"/>
              <path d="M1 5 L16 14.5 L31 5" stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}

          {/* Chat bubble */}
          {type === "messages" && (
            <svg width="30" height="28" viewBox="0 0 30 28" fill="none">
              <path d="M2 3C2 1.9 2.9 1 4 1H26C27.1 1 28 1.9 28 3V18C28 19.1 27.1 20 26 20H9.5L3 26V20H4C2.9 20 2 19.1 2 18V3Z"
                fill={`${cfg.iconColor}18`} stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8" y1="8" x2="22" y2="8" stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="8" y1="13" x2="17" y2="13" stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}

          {/* Bell */}
          {type === "pings" && (
            <svg width="26" height="28" viewBox="0 0 26 30" fill="none">
              <path d="M13 2C13 2 5 7.5 5 16H3C2.4 16 2 16.4 2 17C2 17.6 2.4 18 3 18H23C23.6 18 24 17.6 24 17C24 16.4 23.6 16 23 16H21C21 7.5 13 2 13 2Z"
                fill={`${cfg.iconColor}18`} stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 18C10.5 19.4 11.6 20.5 13 20.5C14.4 20.5 15.5 19.4 15.5 18"
                stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}

          {/* Map pin / plan */}
          {type === "plans" && (
            <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
              <path d="M11 1C6.6 1 3 4.6 3 9C3 15 11 27 11 27C11 27 19 15 19 9C19 4.6 15.4 1 11 1Z"
                fill={`${cfg.iconColor}18`} stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="9" r="3" stroke={cfg.iconColor} strokeWidth="1.4"/>
            </svg>
          )}

          <p className="text-[8.5px] font-bold tracking-wide text-center" style={{ color: cfg.labelColor }}>
            {cfg.label}
          </p>
        </div>

        {/* Count badge */}
        {count > 0 && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: "#FF1F7D", boxShadow: "0 0 0 2px white", border: "none" }}>
            {count}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Your Week strip ──────────────────────────────────────────────────────────

function YourWeek({ headingColor, isNight }: { headingColor: string; isNight: boolean }) {
  return (
    <div className="mb-6">
      <div className="px-5 flex items-center justify-between mb-3 md:px-8">
        <div>
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ YOUR WEEK</p>
          <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-instrument)", color: headingColor }}>Jun 2 — Jun 8</p>
        </div>
        <Link href="/member/calendar" className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>Full calendar →</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto px-5 pb-1 md:px-8" style={{ scrollbarWidth: "none" }}>
        {WEEK.map((d, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-2xl transition-all active:scale-95"
            style={d.isToday
              ? { background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.35)", minWidth: "54px" }
              : d.isPast
              ? { background: isNight ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1.5px solid ${isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, minWidth: "48px" }
              : { background: isNight ? "rgba(255,255,255,0.06)" : "white", border: "1.5px solid rgba(255,31,125,0.12)", boxShadow: isNight ? "none" : "0 2px 8px rgba(255,31,125,0.05)", minWidth: "48px" }}>
            <p className="text-[8px] font-bold uppercase tracking-wide"
              style={{ color: d.isToday ? "rgba(255,255,255,0.75)" : d.isPast ? (isNight ? "rgba(255,255,255,0.2)" : "#ccc") : (isNight ? "rgba(255,255,255,0.4)" : "#999") }}>
              {d.day}
            </p>
            <p className="text-sm font-black"
              style={{ fontFamily: "var(--font-playfair)", color: d.isToday ? "white" : d.isPast ? (isNight ? "rgba(255,255,255,0.25)" : "#ccc") : (isNight ? "rgba(255,238,220,0.85)" : "#111") }}>
              {d.date}
            </p>
            {d.events.length > 0 && (
              <div className="flex gap-0.5">
                {d.events.slice(0, 3).map((_, ei) => (
                  <span key={ei} className="w-1 h-1 rounded-full"
                    style={{ background: d.isToday ? "rgba(255,255,255,0.75)" : "#FF1F7D" }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Today Event Card (rose) ──────────────────────────────────────────────────

const SLOT_STYLE = {
  now:       { accent: "#FF1F7D", label: "RIGHT NOW"    },
  afternoon: { accent: "#FF69B4", label: "AFTERNOON"    },
  tonight:   { accent: "#C51B7A", label: "TONIGHT"      },
};

function TodayCard({ ev, isNight }: { ev: TodayEvent; isNight: boolean }) {
  const { accent, label } = SLOT_STYLE[ev.slot];
  return (
    <Link href={`/member/happenings/${ev.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="rounded-2xl overflow-hidden transition-transform active:scale-[0.97]"
        style={{
          width: "168px",
          background: isNight ? "#1A0E14" : "white",
          boxShadow: isNight ? "0 4px 18px rgba(0,0,0,0.3)" : "0 3px 14px rgba(255,31,125,0.08)",
          border: isNight ? "1px solid rgba(255,31,125,0.1)" : "1.5px solid rgba(255,31,125,0.1)",
        }}>
        <div style={{ height: "3px", background: `linear-gradient(90deg, ${accent}, #FF69B4)` }} />
        <div style={{ padding: "12px 14px 14px" }}>
          <p className="text-[8px] font-bold tracking-[0.22em] uppercase mb-1.5" style={{ color: accent }}>{label}</p>
          <h3 className="font-black leading-tight mb-2"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "13.5px", color: isNight ? "rgba(255,238,220,0.92)" : "#111", lineHeight: 1.1 }}>
            {ev.title}
          </h3>
          <p className="text-[9px] mb-0.5 truncate" style={{ color: isNight ? "rgba(255,255,255,0.28)" : "#bbb" }}>{ev.venue}</p>
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-[9px] font-semibold" style={{ color: isNight ? "rgba(255,255,255,0.38)" : "#888" }}>{ev.time}</p>
            <span className="text-[10px] font-bold" style={{ color: accent }}>{ev.price} →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Today Section Row ────────────────────────────────────────────────────────

function TodaySection({
  slot, label, sub, isNight, headingColor,
}: {
  slot: "now" | "afternoon" | "tonight"; label: string; sub: string; isNight: boolean; headingColor: string;
}) {
  const events = TODAY_EVENTS.filter(e => e.slot === slot);
  if (events.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="px-5 flex items-center justify-between mb-3 md:px-8">
        <div>
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>{label}</p>
          <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-instrument)", color: headingColor }}>{sub}</p>
        </div>
        <Link href="/member/happenings" className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>See all →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-2 md:px-8" style={{ scrollbarWidth: "none" }}>
        {events.map(ev => <TodayCard key={ev.id} ev={ev} isNight={isNight} />)}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomePage({ firstName = "there", initial = "M" }: { firstName?: string; initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("afternoon");
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
  }, []);

  const mood       = CITY_MOOD[tod];
  const isNight    = tod === "evening" || tod === "night";
  const isEvening  = tod === "evening";
  const textMuted  = isNight ? "rgba(215,175,155,0.58)" : "#888";
  const headingColor = isNight ? "rgba(255,238,220,0.92)" : "#111111";
  const cardBg     = isNight ? (isEvening ? "#1E1612" : "#15100C") : "white";
  const heroBg     = HERO_BG[tod];

  return (
    <div className="min-h-screen pb-24 md:pb-12">

      {/* ── Header ── */}
      <header className="px-5 pt-20 pb-4 md:px-8 md:pt-10">
        <p className="text-sm font-semibold tracking-[0.12em] uppercase" style={{ color: "#FF1F7D" }}>
          {mood.weather} · {mood.temp}
        </p>
        <h1 className="text-4xl font-bold leading-tight mt-1 md:text-5xl" style={{ color: headingColor }}>
          {greeting},{" "}
          <span className="italic" style={{ fontFamily: "var(--font-instrument)", color: "#FF1F7D", fontWeight: 400 }}>
            {firstName}.
          </span>
        </h1>
      </header>

      {/* ── Hero Card + Girl Bar door (evening/night) ── */}
      <div className="px-5 mb-4 md:px-8">
        <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
          <div className={`${isNight ? "flex-1 min-w-0" : "w-full"} rounded-3xl relative overflow-hidden`}
            style={{ background: heroBg, minHeight: "168px", boxShadow: isNight ? "0 10px 32px rgba(0,0,0,0.4)" : "0 10px 32px rgba(255,31,125,0.32)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_GLOW[tod] }} />
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.2))" }} />
            <div className="absolute top-4 right-4 text-right">
              <div className="text-5xl font-bold leading-none text-white" style={{ fontFamily: "var(--font-instrument)", textShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                {mood.women}
              </div>
              <div className="text-[8px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                {tod === "morning" ? "THIS MORNING" : tod === "afternoon" ? "OUT TODAY" : "TONIGHT"}
              </div>
            </div>
            <div className="relative p-5 pr-20 flex flex-col justify-between" style={{ minHeight: "168px" }}>
              <div>
                <p className="text-[8px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>
                  ✦ {tod === "morning" ? "THIS MORNING" : tod === "afternoon" ? "THIS AFTERNOON" : tod === "evening" ? "THIS EVENING" : "TONIGHT"} IN WILLIAMSBURG
                </p>
                <p className="text-white leading-snug mb-1" style={{ fontFamily: "var(--font-instrument)", fontSize: "1.2rem", fontStyle: "italic" }}>
                  {mood.vibe}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{mood.weather} · {mood.temp} · Brooklyn</p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Link href="/member/happenings"
                  className="inline-block px-5 py-2 rounded-full font-bold text-xs"
                  style={{ background: "rgba(255,255,255,0.22)", color: "white", backdropFilter: "blur(8px)" }}>
                  See what&apos;s on →
                </Link>
              </div>
            </div>
          </div>
          {isNight && (
            <Link href="/member/room?enter=girlbar" className="md:hidden flex-shrink-0"
              style={{ textDecoration: "none", width: "88px", display: "flex" }}>
              <GirlBarDoor tod={tod} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Yande pill ── */}
      <div className="px-5 mb-5 md:px-8">
        <Link href="/member/clubs/yande-picks">
          <div className="inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5" style={{ background: isNight ? "rgba(255,255,255,0.06)" : "#FFF5F8", maxWidth: "100%" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF1F7D" }}>
              <span style={{ color: "white", fontSize: "10px" }}>✦</span>
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase mr-1.5" style={{ color: "#FF1F7D" }}>Yande</span>
              <span className="text-xs" style={{ color: headingColor }}>You haven&apos;t chosen a club yet — I saved 3 that match you.</span>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* ── YOUR WEEK ── */}
      <YourWeek headingColor={headingColor} isNight={isNight} />

      {/* ── INBOX OBJECTS ── */}
      <div className="mb-6">
        <div className="px-5 flex items-center justify-between mb-3 md:px-8">
          <div>
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ CHECK IN</p>
            <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-instrument)", color: headingColor }}>What&apos;s waiting for you.</p>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 md:px-8" style={{ scrollbarWidth: "none" }}>
          <InboxObject type="invite"   count={INBOX_INVITES}  href="/member/messages?filter=invitations" dark={isNight} />
          <InboxObject type="messages" count={INBOX_MESSAGES} href="/member/messages"                    dark={isNight} />
          <InboxObject type="pings"    count={INBOX_PINGS}    href="/member/notifications"               dark={isNight} />
          <InboxObject type="plans"    count={INBOX_PLANS}    href="/member/plans"                       dark={isNight} />
        </div>
      </div>

      {/* ── YOUR SHELF ── */}
      <div className="px-5 mb-6 md:px-8">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ YOUR SHELF</p>
          <Link href="/member/lounge" className="text-[10px] font-semibold" style={{ color: "#FF1F7D" }}>Customize →</Link>
        </div>
        <div className="flex gap-3 items-end overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[
            { id: "book",    emoji: "📚", label: "Book Club",    href: "/member/clubs"      },
            { id: "candle",  emoji: "🕯️", label: "Soft Life",   href: "/member/happenings" },
            { id: "flowers", emoji: "🌸", label: "Events",       href: "/member/happenings" },
            { id: "vinyl",   emoji: "🎵", label: "Jazz & Wine",  href: "/member/clubs"      },
            { id: "camera",  emoji: "📷", label: "Lens & Light", href: "/member/clubs"      },
          ].map(obj => (
            <Link key={obj.id} href={obj.href} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all active:scale-95"
                  style={{ background: isNight ? "rgba(255,255,255,0.07)" : "white", boxShadow: isNight ? "0 2px 8px rgba(0,0,0,0.2)" : "0 3px 12px rgba(0,0,0,0.07)" }}>
                  {obj.emoji}
                </div>
                <p className="text-[9px] font-medium text-center" style={{ color: textMuted }}>{obj.label}</p>
              </div>
            </Link>
          ))}
          <Link href="/member/lounge" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "transparent", border: "1.5px dashed rgba(255,31,125,0.25)" }}>
                <span style={{ color: "#FF1F7D", fontSize: "20px", lineHeight: 1 }}>+</span>
              </div>
              <p className="text-[9px] font-medium" style={{ color: textMuted }}>Add</p>
            </div>
          </Link>
        </div>
        <div className="h-[2px] mt-2 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${isNight ? "rgba(180,140,100,0.3)" : "rgba(180,140,100,0.25)"} 50%, transparent)` }} />
      </div>

      {/* ── 2-col on desktop ── */}
      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8 md:px-10 md:items-start">

        {/* ── LEFT ── */}
        <div>

          {/* RIGHT NOW */}
          <TodaySection slot="now"       label="✦ RIGHT NOW"       sub="Open and happening this moment"   isNight={isNight} headingColor={headingColor} />

          {/* THIS AFTERNOON */}
          <TodaySection slot="afternoon" label="THIS AFTERNOON"    sub="Good things to do before 6PM"     isNight={isNight} headingColor={headingColor} />

          {/* TONIGHT */}
          <TodaySection slot="tonight"   label="TONIGHT"           sub="Plans that are still forming"     isNight={isNight} headingColor={headingColor} />

          {/* YOUR CLUBS */}
          <div className="px-5 mb-6 md:hidden">
            <div className="flex items-center justify-between mb-4 md:px-8">
              <h2 className="text-base font-bold italic" style={{ fontFamily: "var(--font-instrument)", color: headingColor, fontSize: "1.1rem" }}>
                Your clubs, right now
              </h2>
              <Link href="/member/clubs" className="text-xs font-bold" style={{ color: "#FF1F7D" }}>All →</Link>
            </div>
            <div className="flex gap-5 overflow-x-auto -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
              {CLUB_PULSE.map((club, i) => {
                const missed = [3, 0, 5][i] ?? 0;
                return (
                  <Link key={i} href="/member/clubs"
                    className="flex-shrink-0 flex flex-col items-center gap-2"
                    style={{ textDecoration: "none" }}>
                    <div className="relative" style={{ animation: club.live ? "crestGlow 2s ease-in-out infinite alternate" : undefined }}>
                      <MiniCrest name={club.name} color={club.color} crestBg={club.crestBg} size={56} />
                      {missed > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.55)" }}>
                          {missed}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-center leading-tight"
                      style={{ color: headingColor, maxWidth: "58px" }}>
                      {club.name.split(" ").slice(0, 2).join(" ")}
                    </p>
                    {club.live && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
                        <span className="text-[8px] font-bold" style={{ color: "#FF1F7D" }}>live</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="hidden md:flex flex-col gap-4">

          {/* Yande pick */}
          <div className="rounded-3xl overflow-hidden relative"
            style={{
              background: isNight ? (isEvening ? "#1E1612" : "#15100C") : "#FFF0F5",
              boxShadow: isNight ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 20px rgba(255,31,125,0.12)",
              border: isNight ? "none" : "1px solid rgba(255,31,125,0.12)",
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: isNight ? "radial-gradient(ellipse at 10% 85%, rgba(255,31,125,0.2) 0%, transparent 60%)" : "none" }} />
            <div className="relative p-5">
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: isNight ? "#FF69B4" : "#FF1F7D" }}>
                ✦ YANDE PICKED THIS
              </p>
              <p className="font-bold text-base leading-snug mb-1 italic"
                style={{ fontFamily: "var(--font-instrument)", fontWeight: 500, color: isNight ? "white" : "#111111" }}>
                Matcha morning in Williamsburg
              </p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: textMuted }}>
                Sunday 10AM · 3 seats · $1 deposit. The girls who went last week are going back.
              </p>
              <Link href="/member/happenings"
                className="inline-block px-5 py-2.5 rounded-full font-bold text-xs"
                style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 14px rgba(255,31,125,0.4)" }}>
                See the seat →
              </Link>
            </div>
          </div>

          {/* Girl Bar / Lobby card */}
          {isNight ? (
            <Link href="/member/room?enter=girlbar" className="block rounded-3xl p-5 relative overflow-hidden"
              style={{ background: "rgba(8,3,14,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,105,180,0.22)", boxShadow: "inset 0 0 28px rgba(255,31,125,0.12), 0 0 28px rgba(255,31,125,0.18), 0 6px 24px rgba(0,0,0,0.4)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 110%, rgba(255,31,125,0.4) 0%, transparent 55%)" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF69B4" }}>LIVE TONIGHT</p>
                </div>
                <p className="text-white font-bold text-sm mb-0.5" style={{ fontFamily: "var(--font-playfair)" }}>The Girl Bar</p>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
                  8 women inside · 3 new posts. The Wall is talking.
                </p>
                <span className="inline-block px-4 py-2 rounded-full text-xs font-bold" style={{ background: "#FF1F7D", color: "white", boxShadow: "0 4px 12px rgba(255,31,125,0.4)" }}>Enter →</span>
              </div>
            </Link>
          ) : (
            <Link href="/member/room" className="block rounded-3xl p-5 relative overflow-hidden"
              style={{ background: isEvening ? "#1C1410" : "#111111", boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(255,105,180,0.1) 0%, transparent 60%)" }} />
              <div className="relative">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF69B4" }}>THE LOBBY</p>
                <p className="text-white font-bold text-sm mb-1">Come inside</p>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>The Wall is live. Girl Bar opens tonight.</p>
                <span className="inline-block px-4 py-2 rounded-full text-xs font-bold" style={{ background: "#FF1F7D", color: "white" }}>Enter Lobby →</span>
              </div>
            </Link>
          )}

          {/* Your clubs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-instrument)", color: headingColor }}>Your clubs tonight</p>
              <Link href="/member/clubs" className="text-xs font-bold" style={{ color: "#FF1F7D" }}>All →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {CLUB_PULSE.map((club, i) => (
                <Link key={i} href="/member/clubs"
                  className="rounded-2xl p-3 flex items-center gap-3"
                  style={{ background: cardBg, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <MiniCrest name={club.name} color={club.color} crestBg={club.crestBg} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate" style={{ color: headingColor }}>{club.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />}
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: club.live ? "#FF1F7D" : textMuted }}>{club.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Concierge teaser */}
          <Link href="/member/match"
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: cardBg, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,31,125,0.08)" }}>
            <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg,#FF1F7D,#FF69B4)" }}>
              ✈️
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: headingColor }}>Morocco in October</p>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>7 women planning · Join via Concierge</p>
            </div>
          </Link>

        </div>
      </div>

      <style>{`
        @keyframes inviteShake {
          0%, 78%, 100% { transform: rotate(0deg); }
          79% { transform: rotate(-10deg); }
          81% { transform: rotate(8deg); }
          83% { transform: rotate(-6deg); }
          85% { transform: rotate(5deg); }
          87% { transform: rotate(-3deg); }
          89% { transform: rotate(1deg); }
          91% { transform: rotate(0deg); }
        }
        @keyframes msgBounce {
          0%, 80%, 100% { transform: translateY(0px); }
          82% { transform: translateY(-7px); }
          84% { transform: translateY(-2px); }
          86% { transform: translateY(-5px); }
          88% { transform: translateY(-1px); }
          90% { transform: translateY(0px); }
        }
        @keyframes pingRing {
          0%, 72%, 100% { transform: rotate(0deg); }
          74% { transform: rotate(-16deg); }
          77% { transform: rotate(13deg); }
          80% { transform: rotate(-9deg); }
          83% { transform: rotate(6deg); }
          86% { transform: rotate(-3deg); }
          89% { transform: rotate(1.5deg); }
          92% { transform: rotate(0deg); }
        }
        @keyframes planPulse {
          0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          50% { box-shadow: 0 0 0 4px rgba(212,168,83,0.18), 0 4px 16px rgba(212,168,83,0.25); }
        }
        @keyframes crestGlow {
          from { filter: drop-shadow(0 0 3px rgba(255,31,125,0.35)); }
          to   { filter: drop-shadow(0 0 10px rgba(255,31,125,0.75)); }
        }
      `}</style>
    </div>
  );
}
