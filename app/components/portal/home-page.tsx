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

// ─── Club Pulse ───────────────────────────────────────────────────────────────

const CLUB_PULSE = [
  { name: "Soft Life Club NYC",   status: "12 women online · buzzing",    live: true,  color: "#FF69B4", crestBg: "#C51B7A" },
  { name: "African Girls Club",   status: "Event coming Friday",           live: false, color: "#FF1F7D", crestBg: "#7F0030" },
  { name: "Girls Who Move",       status: "5 active · planning something", live: true,  color: "#F59E0B", crestBg: "#92400E" },
];

// ─── Your interests (from profile) ───────────────────────────────────────────

const MY_INTERESTS = [
  { tag: "Books",       emoji: "📚", href: "/member/clubs",      label: "Book Club →"          },
  { tag: "Art & Galleries", emoji: "🎨", href: "/member/city",   label: "Gallery Walk →"       },
  { tag: "Pilates",     emoji: "🧘", href: "/member/happenings", label: "Morning Class →"      },
  { tag: "Girls Dinner",emoji: "🍷", href: "/member/happenings", label: "Tables for tonight →" },
];

// ─── Mini Notification Badge ──────────────────────────────────────────────────

function MiniNotif({ type, count, href }: { type: "invite" | "messages" | "pings" | "plans"; count: number; href: string }) {
  const cfg = {
    invite:   { color: "#FF1F7D", anim: "inviteShake 3.5s ease-in-out 0.8s infinite" },
    messages: { color: "#FF69B4", anim: "msgBounce 4.2s ease-in-out 1.6s infinite"  },
    pings:    { color: "#FF1F7D", anim: "pingRing 5s ease-in-out 2.5s infinite"      },
    plans:    { color: "#D4A853", anim: "planPulse 3s ease-in-out 3s infinite"       },
  }[type];
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="relative transition-transform active:scale-90"
        style={{ animation: count > 0 ? cfg.anim : undefined }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.15)" }}>
          {type === "invite" && (
            <svg width="14" height="11" viewBox="0 0 32 24" fill="none">
              <rect x="1" y="1" width="30" height="22" rx="3.5" stroke={cfg.color} strokeWidth="2"/>
              <path d="M1 5 L16 14.5 L31 5" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          {type === "messages" && (
            <svg width="14" height="13" viewBox="0 0 30 28" fill="none">
              <path d="M2 3C2 1.9 2.9 1 4 1H26C27.1 1 28 1.9 28 3V18C28 19.1 27.1 20 26 20H9.5L3 26V20H4C2.9 20 2 19.1 2 18V3Z"
                stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {type === "pings" && (
            <svg width="13" height="14" viewBox="0 0 26 30" fill="none">
              <path d="M13 2C13 2 5 7.5 5 16H3C2.4 16 2 16.4 2 17C2 17.6 2.4 18 3 18H23C23.6 18 24 17.6 24 17C24 16.4 23.6 16 23 16H21C21 7.5 13 2 13 2Z"
                stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 18C10.5 19.4 11.6 20.5 13 20.5C14.4 20.5 15.5 19.4 15.5 18"
                stroke={cfg.color} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          {type === "plans" && (
            <svg width="11" height="14" viewBox="0 0 22 28" fill="none">
              <path d="M11 1C6.6 1 3 4.6 3 9C3 15 11 27 11 27C11 27 19 15 19 9C19 4.6 15.4 1 11 1Z"
                stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="9" r="3" stroke={cfg.color} strokeWidth="2"/>
            </svg>
          )}
        </div>
        {count > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
            style={{ background: cfg.color, boxShadow: "0 0 0 1.5px white" }}>
            {count}
          </div>
        )}
      </div>
    </Link>
  );
}

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

// ─── Yande Popup ──────────────────────────────────────────────────────────────

function YandeSheet({ onClose }: { onClose: () => void }) {
  const clubs = [
    { name: "Soft Life Club NYC",    why: "Matches your calm, intentional energy",    color: "#FF69B4", crestBg: "#C51B7A" },
    { name: "Chelsea Art Circle",    why: "You tagged Art & Galleries in your profile", color: "#A78BFA", crestBg: "#6D28D9" },
    { name: "Williamsburg Book Soc.", why: "Books are your thing. This club is active.", color: "#FF1F7D", crestBg: "#7F0030" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10"
        style={{ background: "#FDFAF6", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="px-5 pb-2 flex items-center gap-2 mb-4">
          <span style={{ fontSize: "22px" }}>🌸</span>
          <div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>YANDE</p>
            <p className="text-base font-black italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
              I found 3 clubs for you.
            </p>
          </div>
        </div>
        <p className="px-5 text-sm mb-5 leading-relaxed" style={{ fontFamily: "var(--font-instrument)", color: "#888", fontStyle: "italic" }}>
          You haven&apos;t chosen a club yet. Based on your profile, these match you best.
        </p>
        <div className="flex flex-col gap-3 px-5">
          {clubs.map((club, i) => (
            <div key={i} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "#FFF5F8", border: "1px solid rgba(255,31,125,0.1)" }}>
              <MiniCrest name={club.name} color={club.color} crestBg={club.crestBg} size={42} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight" style={{ color: "#111" }}>{club.name}</p>
                <p className="text-[11px] mt-0.5 italic" style={{ fontFamily: "var(--font-instrument)", color: "#FF1F7D" }}>{club.why}</p>
              </div>
              <button className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: "#FF1F7D" }}>
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
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
      iconColor: "#FF1F7D",
      labelColor: "#FF1F7D",
    },
    messages: {
      label: "Messages",
      anim: "msgBounce 4.2s ease-in-out 1.6s infinite",
      bg:     dark ? "rgba(255,105,180,0.14)" : "#FFF5F8",
      border: dark ? "rgba(255,105,180,0.35)" : "rgba(255,105,180,0.22)",
      iconColor: "#FF69B4",
      labelColor: "#FF69B4",
    },
    pings: {
      label: "Pings",
      anim: "pingRing 5s ease-in-out 2.5s infinite",
      bg:     dark ? "rgba(255,31,125,0.12)" : "#FFF0F5",
      border: dark ? "rgba(255,31,125,0.3)" : "rgba(255,31,125,0.18)",
      iconColor: "#FF1F7D",
      labelColor: "#FF1F7D",
    },
    plans: {
      label: "My Plans",
      anim: "planPulse 3s ease-in-out 3s infinite",
      bg:     dark ? "rgba(212,168,83,0.12)" : "#FFFBF0",
      border: dark ? "rgba(212,168,83,0.35)" : "rgba(212,168,83,0.25)",
      iconColor: "#D4A853",
      labelColor: "#C4902A",
    },
  };
  const cfg = configs[type];

  return (
    <Link href={href} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="relative transition-transform active:scale-90"
        style={{ animation: count > 0 ? cfg.anim : undefined }}>
        <div className="rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all"
          style={{ width: "80px", height: "88px", background: cfg.bg, border: `1.5px solid ${cfg.border}`, boxShadow: count > 0 ? "0 4px 16px rgba(255,31,125,0.12)" : "0 2px 8px rgba(0,0,0,0.05)" }}>

          {type === "invite" && (
            <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
              <rect x="1" y="1" width="30" height="22" rx="3.5" fill={`${cfg.iconColor}18`} stroke={cfg.iconColor} strokeWidth="1.4"/>
              <path d="M1 5 L16 14.5 L31 5" stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}
          {type === "messages" && (
            <svg width="30" height="28" viewBox="0 0 30 28" fill="none">
              <path d="M2 3C2 1.9 2.9 1 4 1H26C27.1 1 28 1.9 28 3V18C28 19.1 27.1 20 26 20H9.5L3 26V20H4C2.9 20 2 19.1 2 18V3Z"
                fill={`${cfg.iconColor}18`} stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8" y1="8" x2="22" y2="8" stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="8" y1="13" x2="17" y2="13" stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}
          {type === "pings" && (
            <svg width="26" height="28" viewBox="0 0 26 30" fill="none">
              <path d="M13 2C13 2 5 7.5 5 16H3C2.4 16 2 16.4 2 17C2 17.6 2.4 18 3 18H23C23.6 18 24 17.6 24 17C24 16.4 23.6 16 23 16H21C21 7.5 13 2 13 2Z"
                fill={`${cfg.iconColor}18`} stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 18C10.5 19.4 11.6 20.5 13 20.5C14.4 20.5 15.5 19.4 15.5 18"
                stroke={cfg.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}
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

        {count > 0 && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: "#FF1F7D", boxShadow: "0 0 0 2px white" }}>
            {count}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Upcoming Ticket ──────────────────────────────────────────────────────────

function UpcomingTicket({ isNight }: { isNight: boolean }) {
  return (
    <Link href="/member/tickets" style={{ textDecoration: "none", display: "block" }}>
      <div className="relative overflow-hidden rounded-2xl transition-transform active:scale-[0.98]"
        style={{
          background: isNight ? "#1A0E14" : "white",
          boxShadow: isNight ? "0 4px 20px rgba(0,0,0,0.35)" : "0 4px 20px rgba(255,31,125,0.12)",
          border: "1.5px solid rgba(255,31,125,0.14)",
        }}>
        {/* Pink top bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #FF1F7D, #FF69B4)" }} />

        {/* Ticket body */}
        <div className="flex items-stretch">
          {/* Left accent */}
          <div className="w-1.5 flex-shrink-0" style={{ background: "#FF1F7D" }} />

          <div className="flex-1 px-4 py-4">
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
              ✦ YOUR TICKET
            </p>
            <h3 className="font-black leading-tight mb-0.5"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "16px", color: isNight ? "rgba(255,238,220,0.95)" : "#111" }}>
              Book Club
            </h3>
            <p className="text-[11px] mb-3" style={{ color: isNight ? "rgba(255,255,255,0.38)" : "#999" }}>
              Wednesday · 6PM · McNally Jackson, Nolita
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#FF1F7D", color: "white" }}>
                Confirmed ✓
              </span>
              <span className="text-[10px] font-semibold" style={{ color: isNight ? "rgba(255,255,255,0.28)" : "#bbb" }}>
                Free · Seat reserved
              </span>
            </div>
          </div>

          {/* Right stub */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center px-4 gap-1"
            style={{
              borderLeft: "1.5px dashed rgba(255,31,125,0.2)",
              minWidth: "60px",
            }}>
            <p className="text-[18px] font-black text-center leading-none"
              style={{ fontFamily: "var(--font-playfair)", color: "#FF1F7D" }}>
              Wed
            </p>
            <p className="text-[9px] font-bold" style={{ color: isNight ? "rgba(255,255,255,0.35)" : "#bbb" }}>
              Jun 4
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── For You section ──────────────────────────────────────────────────────────

function ForYouCard({ interest, isNight }: { interest: typeof MY_INTERESTS[0]; isNight: boolean }) {
  return (
    <Link href={interest.href} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div className="rounded-2xl overflow-hidden transition-transform active:scale-[0.97]"
        style={{
          width: "136px",
          background: isNight ? "#1A0E14" : "white",
          boxShadow: isNight ? "0 3px 14px rgba(0,0,0,0.28)" : "0 3px 14px rgba(255,31,125,0.08)",
          border: "1.5px solid rgba(255,31,125,0.1)",
        }}>
        <div className="flex items-center justify-center"
          style={{ height: "72px", background: "linear-gradient(135deg, #FFF0F5, #FFE0EE)" }}>
          <span style={{ fontSize: "32px" }}>{interest.emoji}</span>
        </div>
        <div className="p-3">
          <p className="text-[9px] font-bold tracking-wider uppercase mb-0.5" style={{ color: "#FF1F7D" }}>
            {interest.tag}
          </p>
          <p className="text-[11px] font-semibold" style={{ color: isNight ? "rgba(255,255,255,0.55)" : "#888" }}>
            {interest.label}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomePage({ firstName = "there", initial = "M" }: { firstName?: string; initial?: string }) {
  const [tod, setTod] = useState<TimeOfDay>("afternoon");
  const [greeting, setGreeting] = useState("Good afternoon");
  const [showYande, setShowYande] = useState(false);

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

      {/* ── Header row: Yande flower · Greeting · Girl Bar ── */}
      <header className="px-5 pt-20 pb-4 md:px-8 md:pt-10">
        <div className="flex items-start justify-between gap-3">

          {/* Yande flower icon */}
          <button
            onClick={() => setShowYande(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-transform active:scale-90"
            style={{
              background: isNight ? "rgba(255,31,125,0.18)" : "#FFF0F5",
              border: "1.5px solid rgba(255,31,125,0.25)",
              animation: "yandePulse 3s ease-in-out 2s infinite",
            }}
            aria-label="Yande"
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>🌸</span>
          </button>

          {/* Greeting */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: "#FF1F7D" }}>
              {mood.weather} · {mood.temp}
            </p>
            <h1 className="font-bold leading-tight mt-0.5 md:text-5xl" style={{ fontSize: "clamp(26px,7vw,36px)", color: headingColor }}>
              {greeting},{" "}
              <span className="italic" style={{ fontFamily: "var(--font-instrument)", color: "#FF1F7D", fontWeight: 400 }}>
                {firstName}.
              </span>
            </h1>
          </div>

          {/* Right column: notification grid + Girl Bar */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2 mt-1">
            {/* 2×2 compact notification grid */}
            <div className="grid grid-cols-2 gap-1.5">
              <MiniNotif type="invite"   count={INBOX_INVITES}  href="/member/messages?filter=invitations" />
              <MiniNotif type="messages" count={INBOX_MESSAGES} href="/member/messages" />
              <MiniNotif type="pings"    count={INBOX_PINGS}    href="/member/notifications" />
              <MiniNotif type="plans"    count={INBOX_PLANS}    href="/member/plans" />
            </div>
            {/* Girl Bar */}
            <Link
              href="/member/room?enter=girlbar"
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
            >
              <div className="w-[66px] h-7 rounded-xl flex items-center justify-center gap-1.5 relative"
                style={{
                  background: "linear-gradient(135deg, #1A0410, #3D0820)",
                  border: "1px solid rgba(255,31,125,0.35)",
                  boxShadow: "0 0 10px rgba(255,31,125,0.25)",
                }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                  style={{ background: "#FF1F7D", boxShadow: "0 0 4px #FF1F7D" }} />
                <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: "#FF69B4" }}>Bar</span>
                <span style={{ fontSize: "12px" }}>🍸</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Card ── */}
      <div className="px-5 mb-4 md:px-8">
        <div className="w-full rounded-3xl relative overflow-hidden"
          style={{ background: heroBg, minHeight: "148px", boxShadow: isNight ? "0 10px 32px rgba(0,0,0,0.4)" : "0 10px 32px rgba(255,31,125,0.32)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_GLOW[tod] }} />
          <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.2))" }} />
          <div className="absolute top-4 right-4 text-right">
            <div className="text-4xl font-bold leading-none text-white" style={{ fontFamily: "var(--font-instrument)", textShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              {mood.women}
            </div>
            <div className="text-[7px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              {tod === "morning" ? "THIS MORNING" : tod === "afternoon" ? "OUT TODAY" : "TONIGHT"}
            </div>
          </div>
          <div className="relative p-5 pr-20 flex flex-col justify-between" style={{ minHeight: "148px" }}>
            <div>
              <p className="text-[8px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                ✦ {tod === "morning" ? "THIS MORNING" : tod === "afternoon" ? "THIS AFTERNOON" : tod === "evening" ? "THIS EVENING" : "TONIGHT"} IN WILLIAMSBURG
              </p>
              <p className="text-white leading-snug mb-1" style={{ fontFamily: "var(--font-instrument)", fontSize: "1.1rem", fontStyle: "italic" }}>
                {mood.vibe}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <Link href="/member/happenings"
                className="inline-block px-4 py-2 rounded-full font-bold text-xs"
                style={{ background: "rgba(255,255,255,0.22)", color: "white", backdropFilter: "blur(8px)" }}>
                See what&apos;s on →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── UPCOMING TICKET ── */}
      <div className="px-5 mb-6 md:px-8">
        <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FF1F7D" }}>✦ COMING UP</p>
        <UpcomingTicket isNight={isNight} />
      </div>

      {/* ── FOR YOU — based on your interests ── */}
      <div className="mb-6">
        <div className="px-5 flex items-center justify-between mb-3 md:px-8">
          <div>
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ FOR YOU</p>
            <p className="text-sm font-bold italic" style={{ fontFamily: "var(--font-instrument)", color: headingColor }}>Based on your interests.</p>
          </div>
          <Link href="/member/lounge" className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>Edit tags →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 md:px-8" style={{ scrollbarWidth: "none" }}>
          {MY_INTERESTS.map((interest, i) => (
            <ForYouCard key={i} interest={interest} isNight={isNight} />
          ))}
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

        {/* ── LEFT: Your Clubs ── */}
        <div>
          <div className="px-5 mb-6 md:hidden">
            <div className="flex items-center justify-between mb-4">
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
        </div>
      </div>

      {/* ── Yande sheet ── */}
      {showYande && <YandeSheet onClose={() => setShowYande(false)} />}

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
        @keyframes yandePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,31,125,0); }
          50% { box-shadow: 0 0 0 5px rgba(255,31,125,0.15); }
        }
      `}</style>
    </div>
  );
}
