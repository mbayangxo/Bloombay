"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/auth/actions";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";
import { thumbUrl } from "@/lib/images/supabase-transform";
import { BloomSafetyButton, BloomSafetySheet } from "./bloom-safety";
import { HostDashCard } from "./host-dash-card";
import { HostRecapCard } from "./host-recap-card";
import { getEvents, type Event } from "@/lib/actions/events";
import { getMyLastNightRecap, type LastNightRecap } from "@/lib/actions/happenings";
import { EventObjectCard } from "./event-object-cards";
import { BloomRecapCard } from "./bloom-recap-card";
import { MorningAfterCard } from "./morning-after-card";
import { ThisOrThatCard } from "./this-or-that-card";
import { useTheme } from "@/lib/theme/theme-context";
import { ThemeToggle } from "./theme-toggle";

// ── Time-aware accent ──────────────────────────────────────────────────────────
function getAccentColor() {
  const h = new Date().getHours();
  if (h >= 19 && h < 23) return "#D4336B";
  if (h < 6 || h >= 23)  return "#A82050";
  return "#FF1F7D";
}
function getBg() {
  const h = new Date().getHours();
  return (h >= 19 || h < 6) ? "#FFF0EE" : "#FFF5F7";
}

const MONTHS_S = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

type Club = { id: string; name: string; slug: string; primary_color: string | null; cover_url: string | null; member_count?: number };
type ClubBuzz = { id: string; club_name: string; club_color: string | null; media_type: "photo" | "voice_note"; public_url: string; caption: string | null; created_at: string };

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
    width: "100%", border: "1.5px solid rgba(255,31,125,0.25)",
    borderRadius: 12, padding: "12px 14px", outline: "none",
    fontFamily: "var(--font-jost)", fontSize: 14, color: "#111111",
    background: "#FFF5F8", boxSizing: "border-box",
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101, background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "24px 24px 48px", boxShadow: "0 -8px 40px rgba(255,31,125,0.15)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,31,125,0.2)", margin: "0 auto 20px" }} />
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

// ── Club badge — circular enamel pin aesthetic ─────────────────────────────────
function ClubBadge({ club, index }: { club: Club; index: number }) {
  const PINK = "#FF1F7D";
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
        {/* Outer ring */}
        <div style={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.25)" }} />
        {/* Inner ring */}
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
        {/* Badge shimmer */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25) 0%, transparent 55%)", pointerEvents: "none" }} />
      </div>
      <div style={{ textAlign: "center", maxWidth: 72 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.06em", color: "#1A0010", lineHeight: 1.3 }}>
          {club.name.toUpperCase()}
        </p>
        {club.member_count && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.35)", marginTop: 1 }}>{club.member_count} members</p>
        )}
      </div>
    </Link>
  );
}

// ── WEEK_DATA util ────────────────────────────────────────────────────────────
const DAY_SHORT = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

// ── Main Component ─────────────────────────────────────────────────────────────
export function HomePage() {
  const PINK = getAccentColor();
  const BG   = getBg();
  const { palette, toggle, mode } = useTheme();
  const now   = new Date();
  const month = MONTHS_S[now.getMonth()];
  const day   = now.getDate();

  const [tod,                   setTod]                   = useState<TimeOfDay>("morning");
  const [firstName,             setFirstName]             = useState("");
  const [neighborhood,          setNeighborhood]          = useState("");
  const [bio,                   setBio]                   = useState("");
  const [myClubs,               setMyClubs]               = useState<Club[]>([]);
  const [clubBuzz,              setClubBuzz]              = useState<ClubBuzz[]>([]);
  const [loading,               setLoading]               = useState(true);
  const [showSafety,            setShowSafety]            = useState(false);
  const [showEdit,              setShowEdit]              = useState(false);
  const [upNextIdx,             setUpNextIdx]             = useState(0);
  const [events,                setEvents]                = useState<Event[]>([]);
  const [recap,                 setRecap]                 = useState<LastNightRecap | null>(null);
  const [showPreferencesBanner, setShowPreferencesBanner] = useState(false);
  const [weather, setWeather] = useState<{ temp: number; icon: string; desc: string } | null>(null);

  useEffect(() => {
    const currentTod = getTimeOfDay(new Date().getHours());
    setTod(currentTod);
    getEvents().then(evs => setEvents(evs));
    getMyLastNightRecap().then(r => setRecap(r)).catch(() => setRecap(null));

    // Fetch weather via Open-Meteo (free, no API key)
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&current_weather=true&temperature_unit=fahrenheit`
          );
          if (!res.ok) return;
          const data = await res.json() as { current_weather: { weathercode: number; temperature: number; is_day: number } };
          const { weathercode: code, temperature, is_day } = data.current_weather;
          const temp = Math.round(temperature);
          let icon: string, desc: string;
          if (code === 0)            { icon = is_day ? "☀️" : "🌙"; desc = is_day ? "Clear skies" : "Clear night"; }
          else if (code <= 3)        { icon = is_day ? "⛅" : "🌤"; desc = "Partly cloudy"; }
          else if (code <= 48)       { icon = "🌫"; desc = "Foggy"; }
          else if (code <= 55)       { icon = "🌦"; desc = "Drizzle"; }
          else if (code <= 67)       { icon = "🌧"; desc = "Rainy"; }
          else if (code <= 77)       { icon = "🌨"; desc = "Snowy"; }
          else if (code <= 82)       { icon = "🌦"; desc = "Showers"; }
          else                       { icon = "⛈"; desc = "Stormy"; }
          setWeather({ temp, icon, desc });
        } catch { /* geolocation denied or network issue — skip silently */ }
      }, () => { /* permission denied — skip silently */ });
    }
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const [{ data: profile }, { data: memberships }] = await Promise.all([
        supabase.from("profiles").select("first_name, neighborhood, bio").eq("id", user.id).single(),
        supabase.from("club_memberships").select("club_slug").eq("user_id", user.id).limit(10),
      ]);
      if (profile) {
        const p = profile as { first_name: string | null; neighborhood: string | null; bio: string | null };
        setFirstName(p.first_name ?? "");
        setNeighborhood(p.neighborhood ?? "");
        setBio(p.bio ?? "");
      }
      if (memberships?.length) {
        const slugs = (memberships as { club_slug: string }[]).map(m => m.club_slug);
        const { data: clubs } = await supabase
          .from("clubs")
          .select("id, name, slug, primary_color, cover_url, member_count")
          .in("slug", slugs)
          .limit(8);
        const loaded = (clubs ?? []) as Club[];
        setMyClubs(loaded);

        // Fetch recent media from these clubs for the activity strip
        if (loaded.length) {
          const clubIds = loaded.map(c => c.id);
          const { data: media } = await supabase
            .from("club_media")
            .select("id, club_id, media_type, public_url, caption, created_at")
            .in("club_id", clubIds)
            .order("created_at", { ascending: false })
            .limit(12);
          if (media?.length) {
            const buzz: ClubBuzz[] = (media as Array<{ id: string; club_id: string; media_type: "photo" | "voice_note"; public_url: string; caption: string | null; created_at: string }>).map(m => {
              const club = loaded.find(c => c.id === m.club_id);
              return { ...m, club_name: club?.name ?? "", club_color: club?.primary_color ?? null };
            });
            setClubBuzz(buzz);
          }
        }
      }
      setLoading(false);

      // Secondary fetch: check if preferences are empty
      fetch("/api/member/preferences")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d) return;
          const hasAgeGroup = !!d.age_group;
          const hasLifestyleTags = Array.isArray(d.lifestyle_tags) && d.lifestyle_tags.length > 0;
          if (!hasAgeGroup && !hasLifestyleTags) {
            setShowPreferencesBanner(true);
          }
        })
        .catch(() => undefined);
    })();
  }, []);

  const greeting  = getGreeting(tod);
  const todayIdx  = now.getDay(); // 0=Sun
  // Build 7-day week starting Monday
  const weekDays  = [1,2,3,4,5,6,0].map(d => DAY_SHORT[d]);
  const todayWeek = todayIdx === 0 ? 6 : todayIdx - 1; // Mon=0..Sun=6

  // Stats from events
  const dinnerCount = events.filter(e => {
    const t = (e.event_type ?? "").toLowerCase() + e.title.toLowerCase();
    return t.includes("dinner") || t.includes("supper") || t.includes("dining");
  }).length;
  const danceCount = events.filter(e => {
    const t = (e.event_type ?? "").toLowerCase() + e.title.toLowerCase();
    return t.includes("dance") || t.includes("night") || t.includes("party");
  }).length;

  const upNextEvents = events.slice(0, 5);
  const upNextEv     = upNextEvents[upNextIdx] ?? null;

  return (
    <div style={{ minHeight: "100vh", background: palette.pageBg, paddingBottom: 120, paddingTop: 54 }}>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .bb-scroll-x { -ms-overflow-style:none; scrollbar-width:none; }
        .bb-scroll-x::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ══ TODAY'S BLOOM ══════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.22em", color: PINK }}>TODAY&apos;S BLOOM ✦</p>
          <ThemeToggle />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
          {/* Left */}
          <div>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(26px,7vw,34px)", color: palette.textPrimary, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 10 }}>
              {greeting}{firstName ? `, ${firstName}` : ""}.
            </p>

            {/* Weather + city vibes strip */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" as const }}>
              {weather && (
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 600, color: palette.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 14 }}>{weather.icon}</span>
                  <span>{weather.temp}° · {weather.desc}</span>
                </span>
              )}
              {weather && <span style={{ color: "rgba(0,0,0,0.18)", fontSize: 10 }}>·</span>}
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: "12px", color: palette.textMuted, fontStyle: "italic" }}>
                {events.length === 0
                  ? (tod === "night" ? "Easy evening 🌙" : "Slow day in the city")
                  : events.length <= 3
                  ? (tod === "night" || tod === "evening" ? "A few things tonight ✨" : "Light day out there")
                  : events.length <= 7
                  ? (tod === "night" || tod === "evening" ? "Good energy tonight ✦" : "Things are picking up today")
                  : "Packed night in the city 🔥"}
              </span>
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12, background: palette.card, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(255,31,125,0.08)" }}>
              {[
                { v: String(dinnerCount),     label: "DINNER"       },
                { v: String(danceCount),      label: "DANCE"        },
                { v: String(myClubs.length),  label: "MY CLUBS"     },
              ].map((s, i, arr) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRight: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 24, color: PINK, lineHeight: 1 }}>{s.v}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.1em", color: "rgba(0,0,0,0.35)", marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Yande note */}
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: palette.textMuted, lineHeight: 1.4 }}>
              {tod === "evening" || tod === "night" ? "Tonight is your busiest evening this week." : "Your week is looking lively."}{" "}
              <span style={{ color: PINK }}>— Yande</span>
            </p>
          </div>

          {/* Right — Next up card (real: the soonest published gathering; no
              personalization claim since attendance-similarity isn't computed) */}
          {events[0] && (
            <Link href={`/member/happenings/${events[0].id}`} style={{ textDecoration: "none" }}>
              <div style={{ width: 118, background: PINK, borderRadius: 16, padding: "12px 10px", boxShadow: `0 12px 36px ${PINK}44, 0 3px 0 rgba(180,0,70,0.4)`, flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.65)", marginBottom: 6 }}>COMING UP</p>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "white", lineHeight: 1.2, marginBottom: 4 }}>
                  {events[0].title}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
                  {new Date(events[0].starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {events[0].venue ? ` · ${events[0].venue.split(",")[0]}` : ""}
                </p>
                <div style={{ marginTop: 10 }}>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "4px 10px", display: "inline-block" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.12em" }}>VIEW →</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* ══ PREFERENCES BANNER — shown when preferences are empty ═══════════ */}
      {showPreferencesBanner && (
        <div style={{ margin: "16px 16px 0" }}>
          <div style={{
            background: "rgba(255,31,125,0.08)",
            border: "1px solid rgba(255,31,125,0.2)",
            borderRadius: 16,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.18em", color: "#FF1F7D", marginBottom: 6 }}>
                ✦ YANDE WANTS TO KNOW YOU
              </p>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 16, color: "#111111", lineHeight: 1.3, marginBottom: 10 }}>
                Tell us who you are. Better matches start here.
              </p>
              <Link href="/member/preferences" style={{ textDecoration: "none", display: "inline-block" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "#FF1F7D" }}>
                  Complete your profile →
                </span>
              </Link>
            </div>
            <button
              onClick={() => setShowPreferencesBanner(false)}
              style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,31,125,0.15)", background: "rgba(255,31,125,0.04)", cursor: "pointer", fontSize: 14, color: "#FF1F7D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ══ THIS OR THAT — weekly Yande game ══════════════════════════════ */}
      <div style={{ margin: "16px 16px 0" }}>
        <ThisOrThatCard />
      </div>

      {/* ══ MORNING AFTER — only in the morning, and only if she actually
          checked into something in the last 48h with real co-attendees ══ */}
      {tod === "morning" && recap && (
        <MorningAfterCard
          gatheringId={recap.gatheringId}
          happeningTitle={recap.title}
          happeningVenue={recap.venue}
          women={recap.companions.map(c => ({ userId: c.userId, name: c.name, avatarUrl: c.avatarUrl }))}
        />
      )}

      {/* ══ BLOOM RECAP — monthly stats card ═════════════════════════════════ */}
      <BloomRecapCard />

      {/* Host cards */}
      <div style={{ padding: "0 16px" }}>
        <HostDashCard />
        <HostRecapCard />
      </div>

      {/* ══ UP NEXT ════════════════════════════════════════════════════════════ */}
      {upNextEv && (
        <div style={{ padding: "24px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: palette.textPrimary }}>UP NEXT</p>
            <Link href="/member/happenings" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>SEE ALL →</Link>
          </div>

          {/* Two-column: dark moody card + TONIGHT ticket */}
          <div style={{ display: "flex", gap: 10 }}>
            {/* Main event card — dark */}
            <div
              style={{ flex: 1, minWidth: 0, borderRadius: 20, overflow: "hidden", position: "relative", minHeight: 200, background: "#1A0010", boxShadow: "0 20px 52px rgba(0,0,0,0.38)", cursor: "pointer" }}
              onTouchStart={e => { (e.currentTarget as HTMLElement).dataset.tx = String(e.touches[0].clientX); }}
              onTouchEnd={e => {
                const sx = Number((e.currentTarget as HTMLElement).dataset.tx ?? 0);
                const dx = e.changedTouches[0].clientX - sx;
                if (Math.abs(dx) > 40) setUpNextIdx(p => dx < 0 ? Math.min(p + 1, upNextEvents.length - 1) : Math.max(p - 1, 0));
              }}
            >
              <Link href="/member/happenings" style={{ textDecoration: "none", display: "block", position: "relative", height: "100%" }}>
                {upNextEv.image_url && (
                  <Image src={upNextEv.image_url} alt={upNextEv.title} fill unoptimized style={{ objectFit: "cover", objectPosition: "center" }} sizes="60vw" />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.82) 90%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px" }}>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 20, color: "white", lineHeight: 1.1, marginBottom: 4 }}>
                    {upNextEv.title} ♡
                  </p>
                  {upNextEv.venue && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>
                      📍 {upNextEv.venue}
                    </p>
                  )}
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: PINK }}>
                    {new Date(upNextEv.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </p>
                  {/* Attendee count */}
                  {upNextEv.attending_count > 0 && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                      {upNextEv.attending_count} women going
                    </p>
                  )}
                </div>
                {/* Carousel dots */}
                {upNextEvents.length > 1 && (
                  <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4 }}>
                    {upNextEvents.map((_, i) => (
                      <div key={i} style={{ width: i === upNextIdx ? 14 : 4, height: 4, borderRadius: 999, background: i === upNextIdx ? "white" : "rgba(255,255,255,0.3)", transition: "all 0.2s" }} />
                    ))}
                  </div>
                )}
              </Link>
            </div>

            {/* TONIGHT ticket — styled card */}
            <div style={{ width: 100, flexShrink: 0 }}>
              <EventObjectCard ev={upNextEv} size="sm" rotation={2} />
            </div>
          </div>
        </div>
      )}

      {/* ══ YOUR WEEK ══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: palette.textPrimary }}>YOUR WEEK</p>
          <Link href="/member/plans" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>PLANS →</Link>
        </div>
        <div style={{ background: palette.card, borderRadius: 20, padding: "14px 12px 16px", boxShadow: "0 6px 24px rgba(255,31,125,0.07), 0 2px 0 rgba(0,0,0,0.03)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {weekDays.map((d, i) => {
              const isToday = i === todayWeek;
              // Find events on this day (simplified: distribute events across week)
              const dayEvents = events.filter(ev => {
                const evDay = new Date(ev.starts_at).getDay();
                const mapped = evDay === 0 ? 6 : evDay - 1;
                return mapped === i;
              });
              return (
                <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.08em", color: isToday ? PINK : "rgba(0,0,0,0.3)" }}>{d}</p>
                  <div style={{
                    width: 30, height: 30, borderRadius: isToday ? 10 : 8,
                    background: isToday ? PINK : dayEvents.length > 0 ? `${PINK}18` : "rgba(0,0,0,0.04)",
                    border: isToday ? "none" : dayEvents.length > 0 ? `1.5px solid ${PINK}35` : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: isToday ? `0 4px 14px ${PINK}44` : "none",
                  }}>
                    {dayEvents.length > 0 && (
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "9.5px", fontWeight: 900, color: isToday ? "white" : PINK }}>{dayEvents.length}</span>
                    )}
                  </div>
                  {dayEvents[0] && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", color: isToday ? PINK : "rgba(0,0,0,0.38)", textAlign: "center", lineHeight: 1.2, fontWeight: isToday ? 700 : 500, maxWidth: 36, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {dayEvents[0].title.split(" ")[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.38)" }}>This week looks balanced ✦</p>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["FRIENDS","CULTURE","YOU"].map(t => (
                <div key={t} style={{ padding: "2px 7px", borderRadius: 999, background: `${PINK}12`, fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, color: PINK, letterSpacing: "0.07em" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ YOUR CLUBS — circular badge pins ══════════════════════════════════ */}
      <div style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 16px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: palette.textPrimary }}>YOUR CLUBS</p>
            {myClubs.length > 0 && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.35)", marginTop: 2 }}>{myClubs.length} joined</p>}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>SEE ALL →</Link>
        </div>

        {!loading && myClubs.length === 0 ? (
          /* Empty state */
          <div style={{ margin: "0 16px", background: palette.card, borderRadius: 20, padding: "20px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: palette.textPrimary, marginBottom: 8 }}>Find your people.</p>
            <Link href="/member/clubs" style={{ textDecoration: "none", display: "inline-block", background: "#FF1F7D", color: "white", borderRadius: 999, padding: "8px 20px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900 }}>
              EXPLORE CLUBS
            </Link>
          </div>
        ) : (
          /* Badge carousel */
          <div className="bb-scroll-x" style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 16px 20px" }}>
            {myClubs.map((club, i) => (
              <ClubBadge key={club.id} club={club} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ══ CLUBS BUZZ — recent photos & voice notes from joined clubs ════════ */}
      {clubBuzz.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 16px", marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: palette.textPrimary }}>CLUBS BUZZ</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.35)", marginTop: 2 }}>latest from your clubs</p>
            </div>
            <Link href="/member/clubs" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>CLUBS →</Link>
          </div>
          <div className="bb-scroll-x" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 16px 20px" }}>
            {clubBuzz.map(item => (
              <div key={item.id} style={{ flexShrink: 0, width: 110, borderRadius: 16, overflow: "hidden", background: palette.card, boxShadow: "0 6px 22px rgba(0,0,0,0.1)", position: "relative" }}>
                {item.media_type === "photo" ? (
                  <div style={{ position: "relative", width: 110, height: 110 }}>
                    <Image src={item.public_url} alt={item.caption ?? ""} fill unoptimized style={{ objectFit: "cover" }} sizes="110px" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
                  </div>
                ) : (
                  <div style={{ width: 110, height: 110, background: item.club_color ?? PINK, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.15)" />
                      <path d="M10 8l6 4-6 4V8z" fill="white" />
                    </svg>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>VOICE NOTE</p>
                  </div>
                )}
                <div style={{ padding: "8px 8px 10px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.1em", color: item.club_color ?? PINK, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.club_name.toUpperCase()}
                  </p>
                  {item.caption && (
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: palette.textSecondary, lineHeight: 1.3, overflow: "hidden", maxHeight: 30 }}>
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ AROUND THE CITY — real event objects ══════════════════════════════ */}
      {events.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 16px", marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: palette.textPrimary }}>AROUND THE CITY</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.35)", marginTop: 2 }}>NYC</p>
            </div>
            <Link href="/member/happenings" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)" }}>SEE ALL →</Link>
          </div>

          {/* Each event renders as its matching physical object — no boxes */}
          <div className="bb-scroll-x" style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 16px 28px", alignItems: "flex-start" }}>
            {events.map((ev, i) => (
              <Link key={ev.id} href="/member/happenings" style={{ textDecoration: "none", flexShrink: 0, display: "block" }}>
                <EventObjectCard ev={ev} size="sm" rotation={i % 2 === 0 ? -1.5 : 1.5} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══ LAST NIGHT memory card — only when she actually attended
          something recently; stats are real (recap.companions), no
          fabricated hours/friendship counts or invented quotes ══ */}
      {recap && (
        <div style={{ margin: "8px 16px 0" }}>
          <div style={{
            borderRadius: 20, background: "#1A0010",
            border: "1px solid rgba(255,31,125,0.15)",
            padding: "20px",
            boxShadow: "0 10px 36px rgba(0,0,0,0.22)",
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.22em", color: `${PINK}BB`, marginBottom: 8 }}>LAST NIGHT</p>

            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 18, color: "white", lineHeight: 1.15, marginBottom: 14 }}>
              {recap.title} ♡
            </p>
            <div>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 26, color: PINK, lineHeight: 1 }}>
                {recap.companions.length + 1}
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                WOMEN IN THE ROOM
              </p>
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
