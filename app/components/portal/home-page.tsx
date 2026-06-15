"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/auth/actions";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";
import { BBLogo } from "./bb-logo";
import { thumbUrl } from "@/lib/images/supabase-transform";
import { MorningAfterCard } from "./morning-after-card";
import { BloomRecapCard } from "./bloom-recap-card";
import { BloomSafetyButton, BloomSafetySheet } from "./bloom-safety";
import { HostDashCard } from "./host-dash-card";
import { HostRecapCard } from "./host-recap-card";
import { getEvents, type Event } from "@/lib/actions/events";

// ── Time-aware accent ──────────────────────────────────────────────────────────
function getAccentColor(): string {
  const h = new Date().getHours();
  if (h >= 19 && h < 23) return "#D4336B";  // evening
  if (h < 6 || h >= 23)  return "#A82050";  // night
  return "#FF1F7D";                           // day
}
function getBg(): string {
  const h = new Date().getHours();
  return (h >= 19 || h < 6) ? "#FFF0EE" : "#FFF5F7";
}

const MONTHS_S = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const WEEK_DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

type Club = { id: string; name: string; primary_color: string | null; cover_url: string | null };

// Club section fallback images (real club template designs)
const CLUB_IMAGES = [
  { image: "/club gatherings,casual gatherings templates/Event_Museum_Girls.png",   name: "Museum Girls",   href: "/member/clubs" },
  { image: "/club gatherings,casual gatherings templates/Event_Book_Society.png",   name: "Book Society",   href: "/member/clubs" },
  { image: "/club gatherings,casual gatherings templates/Event_Sunday_Walk.png",    name: "Sunday Walk",    href: "/member/clubs" },
  { image: "/club gatherings,casual gatherings templates/Event_Dinner_Society.png", name: "Dinner Society", href: "/member/clubs" },
];

// Swipeable stat cards — first section
const STAT_CARDS = [
  { label: "DINNER",       value: "1", sub: "tonight",    emoji: "🍷" },
  { label: "DANCE",        value: "1", sub: "tonight",    emoji: "💃" },
  { label: "ACTIVE CLUBS", value: "3", sub: "joined",     emoji: "✦"  },
  { label: "PLANS",        value: "2", sub: "this week",  emoji: "📅" },
  { label: "INVITATIONS",  value: "1", sub: "waiting",    emoji: "💌" },
  { label: "TRADITIONS",   value: "2", sub: "you follow", emoji: "🌸" },
];

// 7-day week data (illustrative)
const WEEK_DATA = [
  { day: "MON", events: 0 },
  { day: "TUE", events: 1, label: "Free" },
  { day: "WED", events: 1, label: "Book Club" },
  { day: "THU", events: 0 },
  { day: "FRI", events: 2, label: "Plans" },
  { day: "SAT", events: 1, label: "Picnic" },
  { day: "SUN", events: 1, label: "Walk" },
];

// ── EditProfileSheet ────────────────────────────────────────────────────────────
function EditProfileSheet({ name, neighborhood, bio, onClose, onSave }: {
  name: string; neighborhood: string; bio: string;
  onClose: () => void; onSave: (n: string, nb: string, b: string) => void;
}) {
  const [editName, setEditName] = useState(name);
  const [editNbhd, setEditNbhd] = useState(neighborhood);
  const [editBio,  setEditBio]  = useState(bio);
  const [pending,  setPending]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSave() {
    setPending(true); setError(null);
    const fd = new FormData();
    fd.set("first_name", editName.trim());
    fd.set("neighborhood", editNbhd.trim());
    fd.set("bio", editBio.trim());
    const result = await updateProfile(fd);
    setPending(false);
    if (result.error) setError(result.error);
    else { onSave(editName.trim(), editNbhd.trim(), editBio.trim()); onClose(); }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid rgba(255,31,125,0.18)",
    borderRadius: 12, padding: "12px 14px", outline: "none",
    fontFamily: "var(--font-jost)", fontSize: 14, color: "#111",
    background: "#FFF5F7", boxSizing: "border-box",
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101, background: "#FEFCF7", borderRadius: "24px 24px 0 0", padding: "24px 24px 48px", boxShadow: "0 -8px 40px rgba(0,0,0,0.16)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)", margin: "0 auto 20px" }} />
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", color: "#FF1F7D", marginBottom: 18 }}>EDIT PROFILE</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Display name" style={inputStyle} />
          <input value={editNbhd} onChange={e => setEditNbhd(e.target.value)} placeholder="Neighborhood" style={inputStyle} />
          <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Bio" rows={3} style={{ ...inputStyle, resize: "none" as const }} />
          {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
          <button onClick={handleSave} disabled={pending} style={{ background: "#FF1F7D", color: "white", border: "none", borderRadius: 999, padding: "14px 0", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, cursor: "pointer", opacity: pending ? 0.6 : 1 }}>
            {pending ? "Saving…" : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function HomePage() {
  const PINK = getAccentColor();
  const BG   = getBg();

  const now   = new Date();
  const month = MONTHS_S[now.getMonth()];
  const day   = now.getDate();

  const [tod,              setTod]              = useState<TimeOfDay>("morning");
  const [firstName,        setFirstName]        = useState("");
  const [neighborhood,     setNeighborhood]     = useState("");
  const [bio,              setBio]              = useState("");
  const [myClubs,          setMyClubs]          = useState<Club[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [showSafety,       setShowSafety]       = useState(false);
  const [showEdit,         setShowEdit]         = useState(false);
  const [showRecap,        setShowRecap]        = useState(false);
  const [showMorningAfter, setShowMorningAfter] = useState(false);
  const [tonightIdx,       setTonightIdx]       = useState(0);
  const [events,           setEvents]           = useState<Event[]>([]);

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
    // Load real events
    getEvents().then(evs => setEvents(evs.filter(e => e.image_url)));
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const [{ data: profile }, { data: memberships }] = await Promise.all([
        supabase.from("profiles").select("first_name, neighborhood, bio").eq("id", user.id).single(),
        supabase.from("club_members").select("club_id").eq("user_id", user.id).limit(10),
      ]);
      if (profile) {
        const p = profile as { first_name: string | null; neighborhood: string | null; bio: string | null };
        setFirstName(p.first_name ?? "");
        setNeighborhood(p.neighborhood ?? "");
        setBio(p.bio ?? "");
      }
      if (memberships?.length) {
        const ids = (memberships as { club_id: string }[]).map(m => m.club_id);
        const { data: clubs } = await supabase.from("clubs").select("id, name, primary_color, cover_url").in("id", ids).limit(8);
        setMyClubs((clubs ?? []) as Club[]);
      }
      setLoading(false);
    })();
  }, []);

  const greeting = getGreeting(tod);

  // Map JS day (0=Sun…6=Sat) to WEEK_DATA index (0=Mon…6=Sun)
  const todayJS = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const todayWeekDataIdx = todayJS === 0 ? 6 : todayJS - 1; // Mon=0 … Sun=6

  return (
    <div style={{ minHeight: "100vh", background: BG, paddingBottom: 120, paddingTop: 54 }}>

      {/* ── Inject animations ── */}
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pinkPulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms!important; transition-duration:.01ms!important; } }
      `}</style>

      {/* ══════════════════════════════════ HERO / GREETING ════════════════════════════════════ */}
      <div style={{ padding: "22px 20px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>
          TODAY&apos;S BLOOM ✦
        </p>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: 30, color: "#1A0010", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              {greeting}{firstName ? `, ${firstName}` : ""}.
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.35)", marginTop: 4 }}>
              {WEEK_DAYS[now.getDay()]} &middot; {month} {day}
            </p>
          </div>
          {/* Date chip */}
          <div style={{ textAlign: "center", background: "white", borderRadius: 14, padding: "8px 14px", boxShadow: "0 4px 16px rgba(255,31,125,0.12)", border: `1.5px solid ${PINK}22`, flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 28, color: PINK, lineHeight: 1 }}>{day}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.35)", marginTop: 2 }}>{month}</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════ SWIPEABLE STAT CARDS ════════════════════════════════════ */}
      <div style={{ marginTop: 18 }}>
        <div style={{
          display: "flex", gap: 10, overflowX: "auto",
          padding: "4px 20px 12px",
          scrollbarWidth: "none" as const,
          scrollSnapType: "x mandatory",
        }}>
          {STAT_CARDS.map((s, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 110,
              background: "white",
              borderRadius: 18,
              padding: "18px 14px 16px",
              boxShadow: `0 8px 28px rgba(255,31,125,0.10), 0 2px 0 rgba(0,0,0,0.04)`,
              border: `1.5px solid ${PINK}18`,
              scrollSnapAlign: "start",
              animation: `slideUp 0.35s ease ${i * 0.06}s both`,
            }}>
              <p style={{ fontSize: 20, marginBottom: 8 }}>{s.emoji}</p>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 40, color: PINK, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 900, letterSpacing: "0.14em", color: "#1A0010", marginTop: 6 }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.32)", marginTop: 2 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════ HOST + MORNING CARDS ════════════════════════════════════ */}
      <HostDashCard />
      <HostRecapCard />
      {showRecap        && <BloomRecapCard onDismiss={() => setShowRecap(false)} />}
      {showMorningAfter && <MorningAfterCard happeningTitle="Girls Dinner" happeningVenue="Carbone · West Village" onDismiss={() => setShowMorningAfter(false)} />}

      {/* ══════════════════════════════════ UP NEXT — real event posters ════════════════════════════════════ */}
      {events.length > 0 && (
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: "#1A0010" }}>UP NEXT</p>
            <Link href="/member/happenings" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.35)" }}>SEE ALL →</Link>
          </div>
          {/* Carousel dots */}
          {events.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 12 }}>
              {events.slice(0, 5).map((_, i) => (
                <div key={i} onClick={() => setTonightIdx(i)} style={{ cursor: "pointer", height: 5, borderRadius: 999, background: i === tonightIdx ? PINK : `${PINK}30`, width: i === tonightIdx ? 20 : 5, transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }} />
              ))}
            </div>
          )}
          {/* Event poster — shown at FULL natural dimensions, no box clipping */}
          {(() => {
            const ev = events[Math.min(tonightIdx, events.length - 1)];
            const accent = ev.accent_color ?? PINK;
            return (
              <div
                style={{ touchAction: "pan-y" }}
                onTouchStart={e => { (e.currentTarget as HTMLElement).dataset.tx = String(e.touches[0].clientX); }}
                onTouchEnd={e => {
                  const sx = Number((e.currentTarget as HTMLElement).dataset.tx ?? 0);
                  const dx = e.changedTouches[0].clientX - sx;
                  if (Math.abs(dx) > 40) setTonightIdx(p => dx < 0 ? Math.min(p + 1, events.length - 1) : Math.max(p - 1, 0));
                }}
              >
                <Link href="/member/happenings" style={{ textDecoration: "none", display: "block", position: "relative" }}>
                  {/* The event image IS the poster — show it at full width, natural height */}
                  <Image
                    src={ev.image_url!}
                    alt={ev.title}
                    width={0}
                    height={0}
                    sizes="(max-width: 520px) calc(100vw - 40px), 480px"
                    priority
                    unoptimized
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: 20,
                      filter: `drop-shadow(0 28px 56px rgba(0,0,0,0.40)) drop-shadow(0 6px 14px ${accent}44)`,
                      transform: "translateZ(0)",
                    }}
                  />
                  {/* JOIN pill over the poster */}
                  <div style={{ position: "absolute", bottom: 20, right: 20 }}>
                    <div style={{ background: accent, borderRadius: 999, padding: "11px 22px", boxShadow: `0 3px 0 rgba(0,0,0,0.3), 0 8px 22px ${accent}77` }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900, color: "white", letterSpacing: "0.06em" }}>JOIN →</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════════════════════════════ YOUR WEEK — mini calendar ════════════════════════════════════ */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: "#1A0010" }}>YOUR WEEK</p>
          <Link href="/member/plans" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>PLANS →</Link>
        </div>
        <div style={{ background: "white", borderRadius: 20, padding: "16px 12px", boxShadow: "0 6px 24px rgba(255,31,125,0.08), 0 2px 0 rgba(0,0,0,0.04)", border: `1px solid ${PINK}12` }}>
          {/* Days row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {WEEK_DATA.map((d, i) => {
              const isToday = i === todayWeekDataIdx;
              return (
                <div key={d.day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.1em", color: isToday ? PINK : "rgba(0,0,0,0.32)" }}>{d.day}</p>
                  <div style={{
                    width: 32, height: 32, borderRadius: isToday ? 10 : 8,
                    background: isToday ? PINK : d.events > 0 ? `${PINK}15` : "rgba(0,0,0,0.04)",
                    border: isToday ? "none" : d.events > 0 ? `1.5px solid ${PINK}30` : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: isToday ? `0 4px 14px ${PINK}44` : "none",
                  }}>
                    {d.events > 0 && (
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900, color: isToday ? "white" : PINK }}>{d.events}</span>
                    )}
                  </div>
                  {"label" in d && d.label && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", color: isToday ? PINK : "rgba(0,0,0,0.4)", textAlign: "center", lineHeight: 1.2, fontWeight: isToday ? 700 : 500 }}>
                      {d.label}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {/* Week vibe */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.4)" }}>This week looks balanced ✦</p>
            <div style={{ display: "flex", gap: 6 }}>
              {["FRIENDS", "CULTURE", "YOU"].map(tag => (
                <div key={tag} style={{ padding: "3px 8px", borderRadius: 999, background: `${PINK}12`, fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>{tag}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════ YOUR CLUBS — REAL IMAGES ════════════════════════════════════ */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: "#1A0010" }}>YOUR CLUBS</p>
            {!loading && myClubs.length > 0 && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.38)", marginTop: 2 }}>{myClubs.length} joined</p>}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>SEE ALL →</Link>
        </div>
        {/* Club images shown as physical cards at natural dimensions — drop-shadow, slight tilt */}
        <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "8px 20px 20px", scrollbarWidth: "none" as const }}>
          {/* Supabase clubs with cover art first */}
          {myClubs.filter(c => c.cover_url).map((club, i) => (
            <Link key={club.id} href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0, display: "block" }}>
              <div style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg) translateZ(0)` }}>
                <Image
                  src={thumbUrl(club.cover_url!) ?? ""}
                  alt={club.name}
                  width={0}
                  height={0}
                  sizes="155px"
                  unoptimized
                  style={{
                    width: 155,
                    height: "auto",
                    display: "block",
                    borderRadius: 16,
                    filter: "drop-shadow(0 18px 44px rgba(0,0,0,0.30)) drop-shadow(0 4px 8px rgba(0,0,0,0.14))",
                  }}
                />
              </div>
            </Link>
          ))}
          {/* Template fallbacks when no Supabase clubs */}
          {myClubs.filter(c => c.cover_url).length === 0 && CLUB_IMAGES.map((c, i) => (
            <Link key={i} href={c.href} style={{ textDecoration: "none", flexShrink: 0, display: "block" }}>
              <div style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg) translateZ(0)` }}>
                <Image
                  src={c.image}
                  alt={c.name}
                  width={0}
                  height={0}
                  sizes="155px"
                  style={{
                    width: 155,
                    height: "auto",
                    display: "block",
                    borderRadius: 16,
                    filter: "drop-shadow(0 18px 44px rgba(0,0,0,0.28)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════ AROUND THE CITY — real event posters ════════════════════════════════════ */}
      {events.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: "#1A0010" }}>AROUND THE CITY</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.38)", marginTop: 2 }}>NYC</p>
            </div>
            <Link href="/member/happenings" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>SEE ALL →</Link>
          </div>
          {/* Each event image is the poster — no container box, no text strip, just the real poster with shadow */}
          <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 20px 28px", scrollbarWidth: "none" as const }}>
            {events.map((ev, i) => (
              <Link key={ev.id} href="/member/happenings" style={{ textDecoration: "none", flexShrink: 0, display: "block" }}>
                <div style={{
                  transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg) translateZ(0)`,
                  transition: "transform 0.18s ease",
                }}>
                  <Image
                    src={ev.image_url!}
                    alt={ev.title}
                    width={0}
                    height={0}
                    sizes="145px"
                    unoptimized
                    style={{
                      width: 145,
                      height: "auto",
                      display: "block",
                      borderRadius: 12,
                      filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.42)) drop-shadow(0 4px 8px rgba(0,0,0,0.18))",
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════ LAST NIGHT ════════════════════════════════════ */}
      <div style={{ margin: "8px 20px 0" }}>
        <div style={{
          borderRadius: 20, overflow: "hidden",
          background: "#1A0010",
          border: "1px solid rgba(255,31,125,0.18)",
          padding: "22px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.22em", color: `${PINK}BB`, marginBottom: 8 }}>LAST NIGHT</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 22, color: "white", lineHeight: 1.15, marginBottom: 16 }}>Carbone Girls Dinner</p>
          <div style={{ display: "flex", gap: 20 }}>
            {[["4", "WOMEN"], ["3", "HOURS"], ["1", "FRIENDSHIP"]].map(([n, label]) => (
              <div key={label}>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 32, color: PINK, lineHeight: 1 }}>{n}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 12, lineHeight: 1.5 }}>
            &ldquo;Last night felt very important and somehow beautiful could be called.&rdquo;
          </p>
        </div>
      </div>

      {/* Safety sheet */}
      {showSafety && <BloomSafetySheet onClose={() => setShowSafety(false)} />}

      {/* Edit profile sheet */}
      {showEdit && (
        <EditProfileSheet
          name={firstName} neighborhood={neighborhood} bio={bio}
          onClose={() => setShowEdit(false)}
          onSave={(n, nb, b) => { setFirstName(n); setNeighborhood(nb); setBio(b); }}
        />
      )}

      {/* Safety FAB */}
      <BloomSafetyButton onOpen={() => setShowSafety(true)} />

    </div>
  );
}
