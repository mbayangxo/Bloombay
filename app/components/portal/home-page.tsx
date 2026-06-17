"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/auth/actions";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";
import { thumbUrl } from "@/lib/images/supabase-transform";
import { BloomSafetyButton, BloomSafetySheet } from "./bloom-safety";
import { getEvents, type Event } from "@/lib/actions/events";

const PINK = "#FF1F7D";
const INK  = "#1A0010";

function getAccentColor() {
  const h = new Date().getHours();
  if (h >= 19 && h < 23) return "#C4305E";
  if (h < 6 || h >= 23)  return "#8B1A3A";
  return PINK;
}
function getBg() {
  const h = new Date().getHours();
  return (h >= 19 || h < 6) ? "#F5EDE8" : "#F9F5ED";
}

type WeatherInfo = { temp: number; condition: string; icon: string };

function weatherIcon(code: number) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫";
  if (code <= 55) return "🌦";
  if (code <= 65) return "🌧";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦";
  return "⛈";
}
function weatherText(code: number) {
  if (code === 0) return "Clear skies";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 65) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Showers";
  return "Stormy";
}

const DAY_SHORT = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const WEEK_ORDER = [1,2,3,4,5,6,0]; // Mon-first

type Club = {
  id: string; name: string;
  primary_color: string | null;
  cover_url: string | null;
  member_count?: number;
};

// ── EditProfileSheet ───────────────────────────────────────────────────────────
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
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", color: PINK, marginBottom: 18 }}>EDIT PROFILE</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Display name" style={inputStyle} />
          <input value={editNbhd} onChange={e => setEditNbhd(e.target.value)} placeholder="Neighborhood" style={inputStyle} />
          <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Bio" rows={3} style={{ ...inputStyle, resize: "none" as const }} />
          {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
          <button onClick={handleSave} disabled={pending} style={{ background: PINK, color: "white", border: "none", borderRadius: 999, padding: "14px 0", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, cursor: "pointer", opacity: pending ? 0.6 : 1 }}>
            {pending ? "Saving…" : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Club badge — circular enamel pin ───────────────────────────────────────────
function ClubBadge({ club, index }: { club: Club; index: number }) {
  const colors = ["#FF1F7D","#D4336B","#1A0010","#8B2252","#C4005A","#FF5BAD"];
  const bg = club.primary_color ?? colors[index % colors.length];
  const initials = club.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: bg,
        boxShadow: `0 8px 28px ${bg}66, 0 3px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.22)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
      }}>
        <div style={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.25)" }} />
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />
        {club.cover_url ? (
          <Image
            src={thumbUrl(club.cover_url) ?? ""}
            alt={club.name}
            width={56} height={56}
            unoptimized
            style={{ borderRadius: "50%", objectFit: "cover", width: 56, height: 56 }}
          />
        ) : (
          <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 28, color: "white", lineHeight: 1, position: "relative" }}>{initials}</span>
        )}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25) 0%, transparent 55%)", pointerEvents: "none" }} />
      </div>
      <div style={{ textAlign: "center", maxWidth: 72 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.06em", color: INK, lineHeight: 1.3 }}>
          {club.name.toUpperCase()}
        </p>
        {club.member_count && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.35)", marginTop: 1 }}>{club.member_count} members</p>
        )}
      </div>
    </Link>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function HomePage() {
  const ACCENT = getAccentColor();
  const BG     = getBg();
  const now    = new Date();

  const [tod,          setTod]          = useState<TimeOfDay>("morning");
  const [firstName,    setFirstName]    = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [bio,          setBio]          = useState("");
  const [myClubs,      setMyClubs]      = useState<Club[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showSafety,   setShowSafety]   = useState(false);
  const [showEdit,     setShowEdit]     = useState(false);
  const [events,       setEvents]       = useState<Event[]>([]);
  const [weather,      setWeather]      = useState<WeatherInfo | null>(null);

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
    getEvents().then(evs => setEvents(evs));

    // Weather — try geolocation, fallback to NYC
    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`)
        .then(r => r.json())
        .then((d: { current_weather?: { weathercode?: number; temperature?: number } }) => {
          const code = d.current_weather?.weathercode ?? 0;
          const temp = Math.round(d.current_weather?.temperature ?? 70);
          setWeather({ temp, condition: weatherText(code), icon: weatherIcon(code) });
        })
        .catch(() => {});
    };
    if (typeof navigator !== "undefined") {
      navigator.geolocation?.getCurrentPosition(
        p => fetchWeather(p.coords.latitude, p.coords.longitude),
        () => fetchWeather(40.7128, -74.006)
      );
      if (!navigator.geolocation) fetchWeather(40.7128, -74.006);
    }

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

  // Week strip — Mon-first
  const todayIdx  = now.getDay();
  const todayWeek = todayIdx === 0 ? 6 : todayIdx - 1;
  const mondayDate = new Date(now);
  mondayDate.setDate(now.getDate() - todayWeek);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    return d.getDate();
  });
  const weekDays = WEEK_ORDER.map(d => DAY_SHORT[d]);

  // Tonight's events
  const tonightEvents = events.filter(ev => {
    const d = new Date(ev.starts_at);
    return d.toDateString() === now.toDateString();
  });

  // NEAR YOU — group events by neighborhood, fallback to demo data
  type NbhdGroup = { name: string; count: number; imageUrl?: string };
  const nbhdMap: Record<string, NbhdGroup> = {};
  events.forEach(ev => {
    const n = (ev.neighborhood ?? "NYC").trim();
    if (!nbhdMap[n]) nbhdMap[n] = { name: n, count: 0 };
    nbhdMap[n].count++;
    if (!nbhdMap[n].imageUrl && ev.image_url) nbhdMap[n].imageUrl = ev.image_url;
  });
  let neighborhoods = Object.values(nbhdMap).sort((a, b) => b.count - a.count);
  if (neighborhoods.length === 0) {
    neighborhoods = [
      { name: "SoHo",            count: 4 },
      { name: "West Village",    count: 7 },
      { name: "Williamsburg",    count: 3 },
      { name: "Upper East Side", count: 2 },
      { name: "Lower East Side", count: 5 },
    ];
  }

  // AFTER LAST NIGHT — show in the morning or afternoon
  const showAfterLastNight = tod === "morning" || tod === "afternoon";

  // Neighborhood card gradient pairs
  const nbhdGrads: [string, string][] = [
    ["#1A0028","#280020"],
    ["#0D1A2E","#0A2040"],
    ["#0F1A0A","#182A10"],
    ["#1A0A1A","#280A28"],
    ["#1A1200","#2A1E00"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, paddingBottom: 120, paddingTop: 54 }}>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .bb-scroll-x { -ms-overflow-style:none; scrollbar-width:none; }
        .bb-scroll-x::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "18px 16px 14px" }}>

        {/* Location + weather row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, color: ACCENT, letterSpacing: "0.02em" }}>
              {neighborhood || "New York"}
            </p>
            {weather && (
              <>
                <span style={{ color: "rgba(0,0,0,0.18)", fontSize: 10 }}>·</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>
                  {weather.icon} {weather.temp}°F · {weather.condition}
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => setShowEdit(true)}
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            aria-label="Edit profile"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>

        {/* Greeting */}
        <p style={{
          fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(30px,9vw,40px)", color: INK, lineHeight: 1.05, marginBottom: 18,
        }}>
          {greeting}{firstName ? `,` : "."}{" "}
          {firstName && <span>{firstName}.</span>}
        </p>

        {/* Week strip */}
        <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
          {weekDays.map((d, i) => {
            const isToday = i === todayWeek;
            const dayEvents = events.filter(ev => {
              const evDay = new Date(ev.starts_at).getDay();
              const mapped = evDay === 0 ? 6 : evDay - 1;
              return mapped === i;
            });
            const hasEvents = dayEvents.length > 0;
            return (
              <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <p style={{
                  fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isToday ? ACCENT : "rgba(0,0,0,0.28)",
                }}>{d}</p>
                <div style={{
                  width: "100%", maxWidth: 34, aspectRatio: "1",
                  borderRadius: isToday ? 10 : 7,
                  background: isToday ? ACCENT : hasEvents ? `${ACCENT}14` : "rgba(0,0,0,0.04)",
                  border: !isToday && hasEvents ? `1.5px solid ${ACCENT}30` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isToday ? `0 3px 10px ${ACCENT}44` : "none",
                }}>
                  <span style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "8.5px",
                    fontWeight: isToday ? 900 : 600,
                    color: isToday ? "white" : hasEvents ? ACCENT : "rgba(0,0,0,0.28)",
                    lineHeight: 1,
                  }}>{weekDates[i]}</span>
                </div>
                {hasEvents && !isToday && (
                  <div style={{ width: 3, height: 3, borderRadius: "50%", background: ACCENT, opacity: 0.45 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Quick-action chips */}
        <div style={{
          display: "flex", gap: 7,
          overflowX: "auto",
          msOverflowStyle: "none" as never,
          scrollbarWidth: "none" as never,
        }}>
          {[
            { label: "Tonight",      href: "/member/happenings" },
            { label: "Last Minute",  href: "/member/happenings" },
            { label: "City Guide",   href: "/member/city"       },
            { label: "My Plans",     href: "/member/plans"      },
          ].map(chip => (
            <Link key={chip.label} href={chip.href} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                padding: "7px 14px", borderRadius: 999,
                background: "white",
                border: "1.5px solid rgba(255,31,125,0.12)",
                boxShadow: "0 2px 8px rgba(255,31,125,0.06)",
                fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 700,
                color: INK, letterSpacing: "0.02em",
                whiteSpace: "nowrap" as const,
              }}>{chip.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ TONIGHT ══════════════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 16px" }}>
        <div style={{
          borderRadius: 22,
          background: "linear-gradient(155deg, #0D0010 0%, #1A0028 60%, #220020 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 0 rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.22em", color: PINK }}>✦ TONIGHT</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.38)", marginTop: 3 }}>
                {tonightEvents.length > 0
                  ? `${tonightEvents.length} happening${tonightEvents.length > 1 ? "s" : ""} tonight`
                  : "Your evening awaits"}
              </p>
            </div>
            <Link href="/member/happenings" style={{ textDecoration: "none" }}>
              <div style={{ padding: "6px 14px", borderRadius: 999, background: "rgba(255,31,125,0.15)", border: "1px solid rgba(255,31,125,0.28)" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.08em", color: PINK }}>SEE ALL →</span>
              </div>
            </Link>
          </div>

          {tonightEvents.length > 0 ? (
            <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
              {tonightEvents.slice(0, 3).map(ev => (
                <Link key={ev.id} href={`/member/happenings/${ev.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14, padding: "10px 12px",
                  }}>
                    {ev.image_url ? (
                      <Image src={ev.image_url} alt={ev.title} width={44} height={44} unoptimized style={{ borderRadius: 10, objectFit: "cover", width: 44, height: 44, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${PINK}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 20 }}>🌸</span>
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.9)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ev.title}
                      </p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: "rgba(255,255,255,0.38)", marginTop: 3 }}>
                        {new Date(ev.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        {ev.venue ? ` · ${ev.venue.split(",")[0]}` : ""}
                      </p>
                    </div>
                    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 1l4 4.5-4 4.5"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: "0 18px 20px" }}>
              {myClubs.length > 0 ? (
                <>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>YOUR CLUBS TONIGHT</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                    {myClubs.slice(0, 4).map(club => (
                      <Link key={club.id} href="/member/clubs" style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "6px 14px", borderRadius: 999,
                          background: `${club.primary_color ?? PINK}20`,
                          border: `1px solid ${club.primary_color ?? PINK}40`,
                          fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                          color: "rgba(255,255,255,0.65)",
                        }}>
                          {club.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "4px 0 6px" }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.32)", lineHeight: 1.4 }}>
                    Looks like a quiet evening.
                  </p>
                  <Link href="/member/happenings" style={{ textDecoration: "none", display: "inline-block", marginTop: 10, padding: "8px 20px", borderRadius: 999, background: PINK, fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: "white", boxShadow: `0 3px 12px ${PINK}44` }}>
                    FIND SOMETHING →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══ NEAR YOU ══════════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 16px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: INK, lineHeight: 1 }}>Near you.</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.38)", marginTop: 3 }}>
              {neighborhood ? `${neighborhood} & around` : "NYC & around"}
            </p>
          </div>
          <Link href="/member/happenings" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: ACCENT }}>See all →</Link>
        </div>

        <div style={{
          display: "flex", gap: 12,
          overflowX: "scroll",
          WebkitOverflowScrolling: "touch" as never,
          scrollSnapType: "x mandatory",
          padding: "4px 16px 24px",
          msOverflowStyle: "none" as never,
          scrollbarWidth: "none" as never,
        }}>
          {neighborhoods.slice(0, 6).map((nbhd, i) => (
            <Link
              key={nbhd.name}
              href="/member/happenings"
              style={{ textDecoration: "none", flexShrink: 0, scrollSnapAlign: "start", touchAction: "pan-x", display: "block" }}
            >
              <div style={{
                width: 140, height: 170, borderRadius: 18,
                background: `linear-gradient(145deg, ${nbhdGrads[i % nbhdGrads.length][0]} 0%, ${nbhdGrads[i % nbhdGrads.length][1]} 100%)`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.18), 0 2px 0 rgba(0,0,0,0.1)",
                overflow: "hidden",
                position: "relative",
                transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
              }}>
                {nbhd.imageUrl && (
                  <Image src={nbhd.imageUrl} alt={nbhd.name} fill unoptimized style={{ objectFit: "cover" }} sizes="140px" />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.72) 75%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px" }}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 16, color: "white", lineHeight: 1.15 }}>
                    {nbhd.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, marginTop: 4, letterSpacing: "0.04em" }}>
                    {nbhd.count} happening{nbhd.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ YOUR CLUBS ════════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 16px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: INK, lineHeight: 1 }}>Your clubs.</p>
            {myClubs.length > 0 && <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.38)", marginTop: 3 }}>{myClubs.length} joined</p>}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: ACCENT }}>See all →</Link>
        </div>

        {!loading && myClubs.length === 0 ? (
          <div style={{ margin: "0 16px", background: "white", borderRadius: 20, padding: "20px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: INK, marginBottom: 8 }}>Find your people.</p>
            <Link href="/member/clubs" style={{ textDecoration: "none", display: "inline-block", background: PINK, color: "white", borderRadius: 999, padding: "8px 20px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900 }}>
              EXPLORE CLUBS
            </Link>
          </div>
        ) : (
          <div className="bb-scroll-x" style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 16px 20px" }}>
            {myClubs.map((club, i) => (
              <ClubBadge key={club.id} club={club} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ══ AFTER LAST NIGHT ══════════════════════════════════════════════════════ */}
      {showAfterLastNight && (
        <div style={{ padding: "4px 16px 0" }}>
          <div style={{
            borderRadius: 20,
            background: "linear-gradient(155deg, #FFF0F5 0%, #FFE8EF 100%)",
            border: "1px solid rgba(255,31,125,0.12)",
            boxShadow: "0 6px 24px rgba(255,31,125,0.08)",
            padding: "18px 18px 16px",
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 8 }}>✦ AFTER LAST NIGHT</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 18, color: INK, lineHeight: 1.2, marginBottom: 6 }}>
              Last night&apos;s Girls Dinner at Carbone
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.4)", marginBottom: 16, lineHeight: 1.5 }}>
              📍 West Village · You were in a room with Amara, Bea + Leila
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/member/clubs" style={{ textDecoration: "none", flex: 1 }}>
                <div style={{
                  textAlign: "center", padding: "10px 0", borderRadius: 999,
                  background: PINK,
                  fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900,
                  color: "white", letterSpacing: "0.04em",
                  boxShadow: `0 3px 12px ${PINK}40`,
                }}>
                  START A TRADITION →
                </div>
              </Link>
              <Link href="/member/happenings" style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "10px 16px", borderRadius: 999,
                  background: "rgba(255,31,125,0.08)",
                  border: "1px solid rgba(255,31,125,0.18)",
                  fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                  color: PINK, whiteSpace: "nowrap" as const,
                }}>
                  SEND A FLOWER 🌸
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Safety */}
      {showSafety && <BloomSafetySheet onClose={() => setShowSafety(false)} />}
      {showEdit && (
        <EditProfileSheet
          name={firstName} neighborhood={neighborhood} bio={bio}
          onClose={() => setShowEdit(false)}
          onSave={(n, nb, b) => { setFirstName(n); setNeighborhood(nb); setBio(b); }}
        />
      )}
      <BloomSafetyButton onOpen={() => setShowSafety(true)} />
    </div>
  );
}
