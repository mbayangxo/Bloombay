"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/auth/actions";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";
import { BBLogo } from "./bb-logo";
import { MorningAfterCard } from "./morning-after-card";
import { BloomRecapCard } from "./bloom-recap-card";
import { BloomSafetyButton, BloomSafetySheet } from "./bloom-safety";

// Inject pulse keyframe once
if (typeof document !== "undefined") {
  if (!document.getElementById("bb-home-style")) {
    const s = document.createElement("style");
    s.id = "bb-home-style";
    s.textContent = `
      @keyframes cardPulse {
        0%,100%{ box-shadow:0 2px 0 rgba(0,0,0,0.9),0 10px 40px rgba(0,0,0,0.4),0 0 0 0 rgba(255,31,125,0); }
        50%{ box-shadow:0 2px 0 rgba(0,0,0,0.9),0 10px 40px rgba(0,0,0,0.4),0 0 0 10px rgba(255,31,125,0.12); }
      }
      @keyframes pinkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(s);
  }
}

const PINK = "#FF1F7D";
const MONTHS_S = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const WEEK_DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

type Club = { id: string; name: string; primary_color: string | null; cover_url: string | null };
type Gathering = { id: string; title: string; starts_at: string; venue: string | null; neighborhood: string | null };

const SUNDAY_STACK_WOMEN = [
  { name: "Aaliya",  initial: "A", vibes: ["books", "brunch", "jazz"],        bg: "#FFFBF0" },
  { name: "Mira",    initial: "M", vibes: ["gallery", "ceramics"],             bg: "#F0FFF8" },
  { name: "Soleil",  initial: "S", vibes: ["pilates", "coffee bars"],          bg: "#FFF0F8" },
  { name: "Chioma",  initial: "C", vibes: ["fashion", "night out"],            bg: "#F0F4FF" },
  { name: "Reva",    initial: "R", vibes: ["botanical", "slow mornings"],      bg: "#FFFAF0" },
];

const FIRST_MONTH_TASKS = [
  { week: 1, task: "Join 3 clubs",             href: "/member/clubs"    },
  { week: 2, task: "Attend 1 gathering",        href: "/member/discover" },
  { week: 3, task: "Introduce yourself",        href: "/member/match"    },
  { week: 4, task: "Save 5 places in The City", href: "/member/city"     },
];

const DAILY_EVENTS: Record<number, { time: string; label: string; name: string; loc: string }[]> = {
  0: [ // Sunday
    { time: "10:00 AM", label: "NEXT",    name: "Sunday Walk",          loc: "Brooklyn Bridge Park · DUMBO"    },
    { time: "1:00 PM",  label: "",        name: "Brunch at Diner",       loc: "Diner · Williamsburg"            },
  ],
  1: [ // Monday
    { time: "7:00 AM",  label: "NEXT",    name: "Morning Run",           loc: "Prospect Park · Brooklyn"        },
    { time: "7:30 PM",  label: "TONIGHT", name: "Book Club",             loc: "McNally Jackson · Nolita"        },
  ],
  2: [ // Tuesday
    { time: "12:00 PM", label: "NEXT",    name: "Museum Girls",          loc: "MoMA · Midtown"                  },
  ],
  3: [ // Wednesday
    { time: "9:00 AM",  label: "NEXT",    name: "Pilates Class",         loc: "Brooklyn Studio · Carroll Gardens" },
    { time: "1:00 PM",  label: "",        name: "Lunch with Sofia",      loc: "Café Auguste · East Village"     },
    { time: "7:30 PM",  label: "TONIGHT", name: "Girls Dinner",          loc: "Carbone · West Village"          },
  ],
  4: [ // Thursday
    { time: "6:00 PM",  label: "NEXT",    name: "Gallery Opening",       loc: "Gagosian · Chelsea"              },
    { time: "9:00 PM",  label: "",        name: "Rooftop Sessions",      loc: "Hotel Rooftop · SoHo"            },
  ],
  5: [ // Friday
    { time: "12:30 PM", label: "NEXT",    name: "Lunch Run",             loc: "Sweetgreen · West Village"       },
    { time: "7:00 PM",  label: "TONIGHT", name: "Jazz Night",            loc: "Smalls · West Village"           },
    { time: "10:00 PM", label: "",        name: "Dance Night",           loc: "Elsewhere · Bushwick"            },
  ],
  6: [ // Saturday
    { time: "9:00 AM",  label: "NEXT",    name: "Pilates + Matcha",      loc: "Studio Bloom · Williamsburg"     },
    { time: "2:00 PM",  label: "",        name: "MoMA + Froyo",          loc: "MoMA · Midtown"                  },
    { time: "7:30 PM",  label: "TONIGHT", name: "Italian Dinner",        loc: "Lilia · Williamsburg"            },
  ],
};

const TONIGHT_CARDS = [
  {
    image: "/happenings/posters/04_Italian_Dinner_Society.png",
    time: "TONIGHT · 7:30 PM",
    venue: "WEST VILLAGE · CARBONE",
    title: "Girls Dinner.",
    sub: "4 seats remaining",
    href: "/member/happenings",
  },
  {
    image: "/happenings/posters/01_Pilates_Pop_Up.png",
    time: "TONIGHT · 6:00 PM",
    venue: "SOHO · MOVEMENT STUDIO",
    title: "Pilates Pop‑Up.",
    sub: "8 spots left",
    href: "/member/happenings",
  },
  {
    image: "/happenings/posters/03_Jazz_Night.png",
    time: "TONIGHT · 9:00 PM",
    venue: "WEST VILLAGE · SMALLS",
    title: "Jazz Night.",
    sub: "Open doors · free entry",
    href: "/member/happenings",
  },
];

// ── White card base ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 20,
  border: "1.5px solid rgba(255,31,125,0.09)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
};

// ── Washi/clear tape strip ─────────────────────────────────────────────────────
function Tape({ style, rotate = 0, width = 56, pink = false }: { style?: React.CSSProperties; rotate?: number; width?: number; pink?: boolean }) {
  return (
    <div style={{
      position: "absolute",
      width, height: 18,
      background: pink ? "rgba(255,180,225,0.62)" : "rgba(255,242,195,0.74)",
      borderRadius: 2,
      transform: `rotate(${rotate}deg)`,
      backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.03) 4px, rgba(0,0,0,0.03) 5px)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.5)",
      zIndex: 10, pointerEvents: "none",
      ...style,
    }} />
  );
}

// ── Push pin ───────────────────────────────────────────────────────────────────
function PushPin({ color = PINK, style }: { color?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", zIndex: 10, pointerEvents: "none", ...style }}>
      <div style={{ width: 13, height: 13, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, white 0%, ${color} 40%)`, boxShadow: `0 2px 6px ${color}55, 0 1px 2px rgba(0,0,0,0.22)` }} />
      <div style={{ width: 2, height: 7, background: "rgba(0,0,0,0.2)", margin: "0 auto", borderRadius: "0 0 1px 1px" }} />
    </div>
  );
}

// ── Pink sticky note ───────────────────────────────────────────────────────────
function StickyNote({ text, author, rotate = 2 }: { text: string; author?: string; rotate?: number }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #FFF0F8 0%, #FFE4F3 100%)",
      padding: "9px 11px 10px",
      borderRadius: 4,
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 2px 10px rgba(255,31,125,0.15), 0 1px 4px rgba(0,0,0,0.08)",
      maxWidth: 118,
      border: "1px solid rgba(255,31,125,0.13)",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 9, height: 9, borderRadius: "50%", background: PINK, boxShadow: "0 1px 5px rgba(255,31,125,0.55)" }} />
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#1A0010", lineHeight: 1.45 }}>{text}</p>
      {author && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(200,0,100,0.5)", marginTop: 4 }}>— {author}</p>}
    </div>
  );
}

// ── Club Activity Row ─────────────────────────────────────────────────────────

const CLUB_ACTIVITY_ITEMS = [
  { abbr: "MG", name: "Museum Girls",  msg: "Amara posted in the chat",       unread: 3, color: "#FF1F7D"  },
  { abbr: "BC", name: "Book Club",     msg: "5 new messages",                 unread: 5, color: "#EC4899"  },
  { abbr: "AG", name: "African Girls", msg: "Temi dropped a new playlist 🎵", unread: 2, color: "#F97316"  },
];

function ClubActivityRow() {
  return (
    <div style={{ padding: "20px 16px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.38)" }}>CLUB ACTIVITY</p>
        <Link href="/member/clubs" style={{ textDecoration: "none", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.28)" }}>see all →</Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CLUB_ACTIVITY_ITEMS.map((c, i) => (
          <Link key={i} href="/member/clubs" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "11px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "white", flexShrink: 0 }}>{c.abbr}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: 2 }}>{c.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.36)", overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{c.msg}</p>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "white", flexShrink: 0, boxShadow: `0 2px 8px ${PINK}66` }}>{c.unread}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Club cover ─────────────────────────────────────────────────────────────────
function ClubCover({ club }: { club: Club }) {
  const abbr = club.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
        <div style={{ width: 62, height: 62, borderRadius: 17, overflow: "hidden", boxShadow: "0 4px 16px rgba(255,31,125,0.2)" }}>
          {club.cover_url
            ? <img src={club.cover_url} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${club.primary_color ?? PINK}, #FF5BAD)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "white" }}>{abbr}</p>
              </div>
          }
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(255,255,255,0.65)", maxWidth: 66, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "center" }}>{club.name}</p>
      </div>
    </Link>
  );
}

// ── Edit Profile Sheet ────────────────────────────────────────────────────────
function EditProfileSheet({
  name, neighborhood, bio, onClose, onSave,
}: {
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

  return (
    <>
      <div className="fixed inset-0 z-[200]" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[201] rounded-t-3xl" style={{ background: "#FEFCF7", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div className="flex justify-center pt-3 pb-2"><div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} /></div>
        <div className="px-6 pb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: PINK }}>EDIT PROFILE</p>
            <p className="text-lg font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>Your details.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        <div className="px-6 pb-10 flex flex-col gap-4 mt-4">
          {[
            { label: "NAME",         value: editName, set: setEditName, placeholder: "Your first name"   },
            { label: "NEIGHBORHOOD", value: editNbhd, set: setEditNbhd, placeholder: "Your neighborhood" },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>{f.label}</p>
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111" }} />
            </div>
          ))}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>BIO</p>
            <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="A few words about you" rows={3}
              className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
              style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111", lineHeight: 1.6 }} />
          </div>
          {error && <p className="text-xs" style={{ color: "#e53e3e" }}>{error}</p>}
          <button onClick={handleSave} disabled={pending} className="w-full py-4 rounded-2xl font-bold text-sm"
            style={{ background: pending ? "#FFB6D0" : PINK, color: "white" }}>
            {pending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── HomePage ───────────────────────────────────────────────────────────────────
export function HomePage() {
  const [tod,        setTod]       = useState<TimeOfDay>("afternoon");
  const [greeting,   setGreeting]  = useState("Good afternoon");
  const [firstName,  setFirstName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [bio,        setBio]       = useState("");
  const [myClubs,    setMyClubs]   = useState<Club[]>([]);
  const [weekGatherings, setWeekGatherings] = useState<Gathering[]>([]);
  const [joinedAt,   setJoinedAt]  = useState<string | null>(null);
  const [loading,    setLoading]   = useState(true);
  const [tonightIdx, setTonightIdx] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMorningAfter, setShowMorningAfter] = useState(true);
  const [showRecap, setShowRecap] = useState(true);
  const [showSafety, setShowSafety] = useState(false);

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
  }, []);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: profile } = await supabase.from("profiles").select("full_name, first_name, avatar_url, created_at, neighborhood, bio").eq("id", user.id).single();
      if (profile) {
        setFirstName((profile.full_name || profile.first_name) ?? "");
        setNeighborhood(profile.neighborhood || "");
        setBio(profile.bio || "");
        setJoinedAt(profile.created_at || null);
      }
      const { data: uc } = await supabase.from("club_memberships").select("club_slug").eq("user_id", user.id).limit(10);
      if (uc && uc.length > 0) {
        const slugs = uc.map((r: { club_slug: string }) => r.club_slug);
        const { data: clubRows } = await supabase.from("clubs").select("id, name, primary_color, cover_url").in("slug", slugs);
        if (clubRows) setMyClubs(clubRows as Club[]);
      }

      // Fetch this week's gatherings for the calendar
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      const { data: gRows } = await supabase
        .from("gatherings")
        .select("id, title, starts_at, venue, neighborhood")
        .gte("starts_at", weekStart.toISOString())
        .lt("starts_at", weekEnd.toISOString())
        .order("starts_at", { ascending: true });
      if (gRows) setWeekGatherings(gRows as Gathering[]);
      setLoading(false);
    }
    load();
  }, []);

  const today      = new Date();
  const todayDow   = today.getDay();
  const weekDays   = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - todayDow + i);
    return { abbr: WEEK_DAYS[i], date: d.getDate(), isToday: i === todayDow };
  });
  const weeksIn    = joinedAt ? Math.min(4, Math.floor((Date.now() - new Date(joinedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1) : 1;
  const task       = FIRST_MONTH_TASKS[Math.min(weeksIn - 1, 3)];
  const displayName    = firstName || (loading ? "…" : "you");
  const displayInitial = firstName[0]?.toUpperCase() ?? "✦";
  const monthShort     = MONTHS_S[today.getMonth()];
  const dayOfMonth     = today.getDate();
  const dayAbbr        = WEEK_DAYS[todayDow];
  void tod;

  const activeDayIdx   = selectedDay ?? todayDow;
  const activeDayEvents = weekGatherings
    .filter(g => new Date(g.starts_at).getDay() === activeDayIdx)
    .map(g => {
      const d = new Date(g.starts_at);
      const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const isTonight = activeDayIdx === todayDow && d.getHours() >= 17;
      return {
        time: timeStr,
        label: isTonight ? "TONIGHT" : "",
        name: g.title,
        loc: [g.venue, g.neighborhood].filter(Boolean).join(" · ") || "New York City",
      };
    });

  const _hour = new Date().getHours();
  const slab = _hour >= 5 && _hour < 12 ? "morning"
    : _hour >= 12 && _hour < 17 ? "afternoon"
    : _hour >= 17 && _hour < 21 ? "evening"
    : "tonight";

  function getHomeBg(): string {
    if (slab === "morning")   return "linear-gradient(160deg, #FF5BAD 0%, #FF1F7D 45%, #FFB3D9 80%, #FFF5FA 100%)";
    if (slab === "afternoon") return "linear-gradient(160deg, #FF1F7D 0%, #E8006A 50%, #FF5BAD 82%, #FFD0E8 100%)";
    if (slab === "evening")   return "linear-gradient(160deg, #C4005A 0%, #8B0036 50%, #C4005A 82%, #FF5BAD 100%)";
    return "linear-gradient(160deg, #1C0018 0%, #380028 42%, #6A003C 75%, #C4005A 100%)";
  }

  function getHeaderDark(): boolean {
    return slab === "evening" || slab === "tonight";
  }

  return (
    <div style={{
      background: getHomeBg(),
      minHeight: "100vh",
      paddingBottom: 112,
      overflowX: "hidden",
    }}>

      {/* ── TOP gradient fade (sits below BottomNav top bar at z-50) ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        height: "calc(env(safe-area-inset-top, 0px) + 58px)",
        background: "linear-gradient(180deg, rgba(28,0,24,0.72) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* ── BLOOM SAFETY button (fixed top-right) ── */}
      <BloomSafetyButton onOpen={() => setShowSafety(true)} />
      {showSafety && <BloomSafetySheet onClose={() => setShowSafety(false)} />}

      {/* ── EDIT PROFILE SHEET ── */}
      {showEditProfile && (
        <EditProfileSheet
          name={firstName}
          neighborhood={neighborhood}
          bio={bio}
          onClose={() => setShowEditProfile(false)}
          onSave={(n, nb, b) => { setFirstName(n); setNeighborhood(nb); setBio(b); }}
        />
      )}

      {/* ══ HEADER SHELL ═════════════════════════════════════════════════════════ */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 70px)",
        paddingLeft: 16, paddingRight: 16, paddingBottom: 14,
      }}>

        {/* ── COMPACT GREETING ROW (not a big dark card) ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "9px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>
              {greeting.toUpperCase()},
            </p>
            <p style={{
              fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300,
              fontSize: loading ? 32 : Math.max(26, 42 - Math.max(0, (displayName.length - 5) * 3)),
              color: "white", lineHeight: 0.9, letterSpacing: "-0.02em",
            }}>{loading ? "…" : `${displayName}.`}</p>
          </div>
          {/* Date badge */}
          <div style={{
            background: getHeaderDark() ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 10, padding: "6px 10px", textAlign: "center" as const,
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "9px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.88)" }}>{dayAbbr}</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 24, color: "white", lineHeight: 0.9, marginTop: 1 }}>{dayOfMonth}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: "7px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{monthShort}</p>
          </div>
        </div>

        {/* Tiny calendar week strip */}
        <div style={{ display: "flex", gap: 3, marginBottom: 14, marginTop: 8 }}>
          {weekDays.map((d, i) => {
            const hasEvent = (DAILY_EVENTS[i] ?? []).length > 0;
            const isSelected = i === activeDayIdx;
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}
              >
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, color: isSelected ? "white" : "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}>{d.abbr}</p>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: isSelected ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.07)", border: isSelected ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: isSelected ? 800 : 500, color: isSelected ? "white" : "rgba(255,255,255,0.45)" }}>{d.date}</p>
                </div>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: hasEvent ? "white" : "transparent", opacity: 0.6 }} />
              </button>
            );
          })}
        </div>

        {/* Chips row — 4 chips, scrollable */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto", scrollbarWidth: "none" as const }}>
          {[
            { href: "/member/happenings",           label: "Tonight",     icon: "✦", bg: "white"                  },
            { href: "/member/happenings?lm=1",      label: "Last Minute", icon: "⚡", bg: "rgba(255,255,255,0.10)" },
            { href: "/member/city",                 label: "City Guide",  icon: "◎", bg: "rgba(255,255,255,0.10)" },
            { href: "/member/plans",                label: "My Plans",    icon: "◫", bg: "rgba(255,255,255,0.10)" },
          ].map(c => (
            <Link key={c.href} href={c.href} style={{ textDecoration: "none", flexShrink: 0, minWidth: 80 }}>
              <div style={{
                padding: "12px 10px",
                borderRadius: 14,
                background: c.bg,
                border: c.bg === "white" ? "none" : "1px solid rgba(255,255,255,0.13)",
                boxShadow: c.bg === "white" ? "0 2px 0 rgba(140,0,50,0.55), 0 4px 14px rgba(0,0,0,0.1)" : "none",
                display: "flex", flexDirection: "column", gap: 5,
              }}>
                <span style={{ fontSize: 14, lineHeight: 1, color: c.bg === "white" ? PINK : "rgba(255,255,255,0.5)" }}>{c.icon}</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: c.bg === "white" ? "#111" : "rgba(255,255,255,0.72)", letterSpacing: "0.04em", lineHeight: 1 }}>{c.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── SEARCH BAR ── */}
        <Link href="/member/discover" style={{ textDecoration: "none", display: "block", marginTop: 14 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.13)",
            borderRadius: 999,
            padding: "13px 18px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "rgba(255,255,255,0.32)", fontWeight: 500 }}>
              Search events, clubs, places…
            </span>
          </div>
        </Link>
      </div>

      <ClubActivityRow />

      {/* ══ MORNING-AFTER ═══════════════════════════════════════════════════════ */}
      {showRecap && (
        <BloomRecapCard onDismiss={() => setShowRecap(false)} />
      )}

      {showMorningAfter && (
        <MorningAfterCard
          happeningTitle="Girls Dinner"
          happeningVenue="Carbone · West Village"
          onDismiss={() => setShowMorningAfter(false)}
        />
      )}

      {/* ══ LIVE PULSE ══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "18px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.22)", borderRadius: 999, padding: "5px 12px 5px 8px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, animation: "pinkPulse 1.6s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.16em", color: PINK }}>LIVE</span>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)" }}>What&apos;s happening now</p>
      </div>
      <div style={{ display: "flex", overflowX: "auto", gap: 8, padding: "10px 16px 0", scrollbarWidth: "none" as const }}>
        {[
          { text: "New happenings added near you",     time: "" },
          { text: "Your clubs have been active",        time: "" },
          { text: "3 events this weekend in SoHo",     time: "" },
          { text: "Invitations waiting for you",        time: "" },
        ].map((p, i) => (
          <div key={i} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 999, padding: "8px 15px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, flexShrink: 0, boxShadow: `0 0 0 2px rgba(255,31,125,0.22)` }} />
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" as const }}>{p.text}</span>
            {p.time && <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.24)", marginLeft: 1 }}>{p.time}</span>}
          </div>
        ))}
      </div>

      {/* ══ FEATURED TONIGHT ════════════════════════════════════════════════════ */}
      <div style={{ padding: "22px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.95)" }}>FEATURED TONIGHT</p>
          <Link href="/member/happenings" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.38)" }}>SEE ALL →</span>
          </Link>
        </div>
        {/* Carousel track */}
        <div
          style={{ position: "relative", touchAction: "pan-y" }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            (e.currentTarget as HTMLElement).dataset.touchX = String(t.clientX);
          }}
          onTouchEnd={(e) => {
            const startX = Number((e.currentTarget as HTMLElement).dataset.touchX ?? 0);
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) {
              setTonightIdx(prev =>
                dx < 0
                  ? Math.min(prev + 1, TONIGHT_CARDS.length - 1)
                  : Math.max(prev - 1, 0)
              );
            }
          }}
        >
          <Link href={TONIGHT_CARDS[tonightIdx].href} style={{ textDecoration: "none" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 268, boxShadow: "0 14px 44px rgba(0,0,0,0.42)" }}>
              <Image
                src={TONIGHT_CARDS[tonightIdx].image}
                alt="Tonight"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                sizes="(max-width: 520px) 100vw, 520px"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.92) 100%)" }} />
              {/* Top tag */}
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <div style={{ background: PINK, borderRadius: 999, padding: "5px 14px", display: "inline-flex", boxShadow: `0 2px 8px ${PINK}66` }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 900, color: "white", letterSpacing: "0.12em" }}>{TONIGHT_CARDS[tonightIdx].time}</span>
                </div>
              </div>
              {/* Dots */}
              <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 5 }}>
                {TONIGHT_CARDS.map((_, i) => (
                  <div key={i} style={{ width: i === tonightIdx ? 16 : 5, height: 5, borderRadius: 999, background: i === tonightIdx ? "white" : "rgba(255,255,255,0.4)", transition: "width 0.2s" }} />
                ))}
              </div>
              {/* Bottom content */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px 18px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.62)", letterSpacing: "0.1em", marginBottom: 5 }}>{TONIGHT_CARDS[tonightIdx].venue}</p>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "white", lineHeight: 1 }}>{TONIGHT_CARDS[tonightIdx].title}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.58)", marginTop: 4 }}>{TONIGHT_CARDS[tonightIdx].sub}</p>
                  </div>
                  <div style={{ flexShrink: 0, background: PINK, borderRadius: 999, padding: "12px 24px", boxShadow: `0 2px 0 rgba(150,0,55,0.75), 0 6px 18px ${PINK}55` }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900, color: "white", letterSpacing: "0.06em" }}>JOIN →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ══ THREE STAT TILES ════════════════════════════════════════════════════ */}
      <div style={{ padding: "14px 16px 0", display: "flex", gap: 9 }}>

        {/* MY FIRST MONTH — stat: week number */}
        <Link href={task.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, padding: "16px 8px 14px", textAlign: "center" as const, position: "relative" }}>
            <PushPin style={{ top: -7, left: "50%", transform: "translateX(-50%)" }} color="#FF5BAD" />
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 44, color: "#000", lineHeight: 1, letterSpacing: "-0.02em" }}>W{weeksIn}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.1em", color: PINK, marginTop: 6 }}>FIRST<br />MONTH</p>
            <div style={{ height: 2, borderRadius: 999, background: "rgba(255,31,125,0.1)", marginTop: 8, overflow: "hidden" }}>
              <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
            </div>
          </div>
        </Link>

        {/* THIS WEEK — stat: event count */}
        <Link href="/member/happenings" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, padding: "16px 8px 14px", textAlign: "center" as const }}>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 44, color: "#000", lineHeight: 1, letterSpacing: "-0.02em" }}>2</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.1em", color: PINK, marginTop: 6 }}>THIS<br />WEEK</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.36)", marginTop: 8 }}>Next: Wed</p>
          </div>
        </Link>

        {/* CITY VIBES — stat: spots saved + micro photo */}
        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, overflow: "hidden" }}>
            <div style={{ height: 52, position: "relative", overflow: "hidden" }}>
              <Image
                src="/club gatherings,casual gatherings templates/Event_Sunday_Walk.png"
                alt="City"
                fill
                style={{ objectFit: "cover", objectPosition: "center 30%" }}
                sizes="110px"
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
            </div>
            <div style={{ padding: "10px 8px 14px", textAlign: "center" as const }}>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 36, color: "#000", lineHeight: 1, letterSpacing: "-0.02em" }}>9</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.1em", color: PINK, marginTop: 4 }}>SPOTS<br />SAVED</p>
            </div>
          </div>
        </Link>

      </div>

      {/* ══ VISUAL BREAK ════════════════════════════════════════════════════════ */}
      <div style={{ margin: "32px 0 0", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18))" }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.28em", color: "rgba(255,255,255,0.28)" }}>YOUR WORLD</p>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.18), transparent)" }} />
        </div>
      </div>

      {/* ══ YOUR CLUBS ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.95)" }}>YOUR CLUBS</p>
            {!loading && myClubs.length > 0 && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{myClubs.length} joined</p>}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Browse all →</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: 14, padding: "4px 20px 12px" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ width: 62, height: 62, borderRadius: 17, background: "rgba(255,255,255,0.18)", flexShrink: 0 }} />)}
          </div>
        ) : myClubs.length === 0 ? (
          <div style={{ margin: "0 16px", ...CARD, padding: "30px 22px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <StickyNote text={"find your people ✦"} rotate={-2} />
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontStyle: "italic", fontWeight: 400, color: "#000", marginBottom: 6 }}>No clubs yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.38)", lineHeight: 1.5, marginBottom: 22 }}>There&apos;s a club for every<br />side of you.</p>
            <Link href="/member/clubs" style={{ display: "inline-block", background: PINK, color: "white", padding: "12px 32px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-jost)", boxShadow: `0 3px 0 rgba(150,0,55,0.8), 0 6px 18px ${PINK}44` }}>Browse Clubs →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", padding: "4px 20px 16px", gap: 14, scrollbarWidth: "none" as const }}>
            {myClubs.map(club => <ClubCover key={club.id} club={club} />)}
          </div>
        )}
      </div>

      {/* ══ THE EDIT ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "28px 0 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 18 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.95)" }}>THE EDIT</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>This week&apos;s picks</p>
          </div>
          <Link href="/member/edit" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.38)" }}>SEE ALL →</span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingLeft: 16, paddingRight: 16, paddingBottom: 12, scrollbarWidth: "none" as const }}>
          {[
            { cat: "WATCHING",  title: "The White Lotus",  sub: "HBO · Season 3",   note: "Thailand. Drama. You're already late." },
            { cat: "READING",   title: "Intermezzo",        sub: "Sally Rooney",      note: "Grief, want, and brothers."            },
            { cat: "OBSESSING", title: "The Row aesthetic", sub: "Quiet luxury",      note: "Rich. Quiet. No logos needed."         },
          ].map((item, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 172, borderRadius: 16,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              padding: "18px 16px 20px",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>{item.cat}</p>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 26, color: "rgba(255,255,255,0.88)", lineHeight: 1, letterSpacing: "-0.01em", marginBottom: 8 }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.42)", marginBottom: 10 }}>{item.sub}</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.32)", lineHeight: 1.4 }}>&ldquo;{item.note}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ NEAR YOU ═════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.95)" }}>NEAR YOU</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>SoHo, NYC</p>
          </div>
          <Link href="/member/discover" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>EXPLORE MAP →</span>
          </Link>
        </div>
        {/* Polaroid photos — overlapping, pinned-up feel */}
        <div style={{ display: "flex", overflowX: "auto", paddingBottom: 20, paddingLeft: 18, paddingRight: 18, scrollbarWidth: "none" as const, alignItems: "flex-end" }}>
          {[
            { name: "SoHo",         happenings: 4, img: "/happenings/posters/08_Rooftop_Sessions.png",        rot: -3,   zIdx: 5, slug: "soho" },
            { name: "West Village", happenings: 7, img: "/happenings/posters/04_Italian_Dinner_Society.png",  rot:  1.5, zIdx: 4, slug: "west-village" },
            { name: "Williamsburg", happenings: 5, img: "/happenings/posters/06_Dance_All_Night.png",         rot: -1.5, zIdx: 3, slug: "williamsburg" },
            { name: "Brooklyn Hts", happenings: 3, img: "/happenings/posters/07_Sunday_Brunch_Club.png",      rot:  2.5, zIdx: 2, slug: "brooklyn-heights" },
            { name: "Harlem",       happenings: 2, img: "/happenings/posters/09_Bagels_And_Books.png",        rot: -1,   zIdx: 1, slug: "harlem" },
          ].map((n, i) => (
            <Link key={i} href={`/member/city/neighborhoods/${n.slug}`} style={{ textDecoration: "none", flexShrink: 0, marginLeft: i === 0 ? 0 : -32, zIndex: n.zIdx, position: "relative" }}>
              <div style={{
                width: 152, background: "white",
                padding: "8px 8px 0",
                boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.12)",
                transform: `rotate(${n.rot}deg)`,
                transformOrigin: "bottom center",
                position: "relative",
              }}>
                {i === 0 && <Tape style={{ top: -10, left: "50%", transform: "translateX(-50%) rotate(1deg)" }} width={56} pink />}
                <div style={{ height: 120, position: "relative", overflow: "hidden" }}>
                  <Image src={n.img} alt={n.name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="152px" />
                </div>
                <div style={{ padding: "9px 6px 10px", textAlign: "center" as const }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#1A0010", lineHeight: 1 }}>{n.name}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.35)", marginTop: 3 }}>{n.happenings} happenings</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ QUOTE — torn magazine clipping pinned to board ════════════════════════ */}
      <div style={{ padding: "28px 22px 44px", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "100%", transform: "rotate(-0.8deg)" }}>
          {/* Push pin at top center */}
          <PushPin style={{ top: -7, left: "50%", transform: "translateX(-50%)" }} />
          {/* Clipping body — aged paper */}
          <div style={{
            background: "linear-gradient(160deg, #F5EDD8 0%, #EDE3C8 100%)",
            padding: "28px 24px 24px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.22), 2px 3px 10px rgba(0,0,0,0.12)",
            position: "relative", overflow: "hidden",
            borderBottom: "2px solid rgba(0,0,0,0.06)",
          }}>
            {/* Subtle lined-paper texture */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(transparent, transparent 24px, rgba(0,0,0,0.04) 24px, rgba(0,0,0,0.04) 25px)", pointerEvents: "none" }} />
            {/* Pink margin line on left */}
            <div style={{ position: "absolute", left: 46, top: 0, bottom: 0, width: 1, background: "rgba(255,31,125,0.18)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.24em", color: "rgba(0,0,0,0.28)", marginBottom: 14, position: "relative" }}>FROM THE BLOOMBAY JOURNAL</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 32, color: "#1A0010", lineHeight: 1.1, letterSpacing: "-0.01em", position: "relative" }}>
              Collect moments,<br />not things.
            </p>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
              <div style={{ height: 1, flex: 1, background: "rgba(0,0,0,0.1)" }} />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.35)" }}>BloomBay ✦</p>
            </div>
            {/* Tape strip at bottom-right corner — holding it down */}
            <Tape style={{ bottom: -8, right: 24, transform: "rotate(2deg)" }} width={48} />
          </div>
        </div>
      </div>

    </div>
  );
}
