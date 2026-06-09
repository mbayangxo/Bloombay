"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";

// Slightly warm paper-white for card surfaces
const PAPER = "#FEFCF7";

// SVG fractal-noise tile — grayscale grain at 5% opacity, tileable, no PNG needed
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

// Tape configs — RGB string + base opacity
const TAPES = [
  { rgb: "255,148,172", a: 0.72 },  // rose
  { rgb: "255,210,60",  a: 0.62 },  // warm yellow
  { rgb: "120,185,255", a: 0.68 },  // sky blue
  { rgb: "120,205,140", a: 0.62 },  // sage
  { rgb: "195,140,240", a: 0.68 },  // lavender
];

type Club = {
  id: string;
  name: string;
  color: string | null;
  cover_url: string | null;
  member_count: number;
};

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const FIRST_MONTH_TASKS = [
  { week: 1, task: "Join 3 clubs",             href: "/member/clubs"    },
  { week: 2, task: "Attend 1 gathering",        href: "/member/discover" },
  { week: 3, task: "Introduce yourself",        href: "/member/match"    },
  { week: 4, task: "Save 5 places in The City", href: "/member/city"     },
];

// ─── Tape ─────────────────────────────────────────────────────────────────────
// Gradient highlight through the centre simulates tape catching light

function Tape({
  index = 0,
  width = 36,
  height = 13,
  rotate = 0,
  style,
}: {
  index?: number;
  width?: number;
  height?: number;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  const t = TAPES[index % TAPES.length];
  const { rgb: r, a } = t;
  const fade = (a * 0.38).toFixed(2);
  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(to bottom,
          rgba(${r},${fade}),
          rgba(${r},${a}) 25%,
          rgba(255,255,255,0.55) 45%,
          rgba(255,255,255,0.55) 55%,
          rgba(${r},${a}) 75%,
          rgba(${r},${fade})
        )`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.11)",
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    />
  );
}

// ─── Club Card ────────────────────────────────────────────────────────────────

function ClubCard({ club, index }: { club: Club; index: number }) {
  const abbr  = club.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const bg    = club.color || PINK;
  const angle = index % 2 === 0 ? -1.5 : 1.2;
  const tapeRotate = index % 2 === 0 ? -3 : 2;

  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{ position: "relative", width: 104, transform: `rotate(${angle}deg)` }}>

        {/* Tape */}
        <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
          <Tape index={index} width={32} height={12} rotate={tapeRotate} />
        </div>

        {/* Polaroid shell — warm paper + noise texture */}
        <div style={{
          backgroundImage: PAPER_TEX,
          backgroundColor: PAPER,
          backgroundSize: "200px 200px",
          padding: "6px 6px 28px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.17), 0 1px 4px rgba(0,0,0,0.07)",
        }}>
          {/* Photo / crest */}
          <div style={{ width: "100%", height: 108, overflow: "hidden" }}>
            {club.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={club.cover_url} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: `linear-gradient(145deg, ${bg} 0%, ${bg}bb 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 34, fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                  {abbr}
                </p>
              </div>
            )}
          </div>
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 600, color: "#888",
            marginTop: 6, textAlign: "center", letterSpacing: "0.04em",
            overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          }}>
            {club.name}
          </p>
        </div>

      </div>
    </Link>
  );
}

// ─── Yande Sheet ──────────────────────────────────────────────────────────────

function YandeSheet({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10"
        style={{ background: "#FDF4EC", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex justify-center pt-3 pb-3">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="px-5 flex items-center gap-3 mb-3">
          <span style={{ fontSize: 22 }}>🌸</span>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, letterSpacing: "0.22em", fontSize: 9, color: PINK, textTransform: "uppercase" }}>
              YANDE
            </p>
            <p className="font-black italic leading-tight"
              style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "#111" }}>
              Find your tribe.
            </p>
          </div>
        </div>
        <p className="px-5 italic mb-6 leading-relaxed"
          style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: "#888" }}>
          Join clubs to start connecting with women in your city.
        </p>
        <div className="px-5">
          <Link href="/member/clubs" onClick={onClose}
            className="w-full py-4 rounded-full font-bold text-sm flex items-center justify-center"
            style={{ background: PINK, color: "white", textDecoration: "none", boxShadow: `0 4px 18px ${PINK}44` }}>
            Browse all clubs →
          </Link>
        </div>
      </div>
    </>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const [tod,       setTod]       = useState<TimeOfDay>("afternoon");
  const [greeting,  setGreeting]  = useState("Good afternoon");
  const [showYande, setShowYande] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [myClubs,   setMyClubs]   = useState<Club[]>([]);
  const [joinedAt,  setJoinedAt]  = useState<string | null>(null);
  const [loading,   setLoading]   = useState(true);

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

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, avatar_url, created_at")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFirstName(profile.first_name || "");
        setAvatarUrl(profile.avatar_url || null);
        setJoinedAt(profile.created_at  || null);
      }

      const { data: uc } = await supabase
        .from("user_clubs")
        .select("club:clubs(id,name,color,cover_url,member_count)")
        .eq("user_id", user.id)
        .limit(8);

      if (uc) setMyClubs(uc.map((r: Record<string, unknown>) => r.club as Club).filter(Boolean));
      setLoading(false);
    }
    load();
  }, []);

  /* ── derived ─────────────────────────────────────────────── */

  const today    = new Date();
  const todayDow = today.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    return { abbr: WEEK_DAYS[i], date: d.getDate(), isToday: i === todayDow };
  });

  const timeLabel = tod === "morning" ? "MORNING"
    : (tod === "evening" || tod === "night") ? "EVENING"
    : "AFTERNOON";

  const weeksIn   = joinedAt
    ? Math.min(4, Math.floor((Date.now() - new Date(joinedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1)
    : 1;
  const task        = FIRST_MONTH_TASKS[Math.min(weeksIn - 1, 3)];
  const displayName = firstName || "there";
  const initial     = firstName ? firstName[0].toUpperCase() : "?";

  /* ── render ──────────────────────────────────────────────── */

  return (
    <div style={{
      backgroundImage: PAPER_TEX,
      backgroundColor: CREAM,
      backgroundSize: "200px 200px",
      minHeight: "100vh",
      paddingBottom: 104,
      overflowX: "hidden",
    }}>

      {/* ══════════════════════════ HEADER ══════════════════════════ */}
      <div style={{ paddingTop: 52, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: 22, color: PINK }}>
            BB*
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <button onClick={() => setShowYande(true)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>
              🌷
            </button>
            <Link href="/member/you" style={{ textDecoration: "none" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", overflow: "hidden",
                border: `2.5px solid ${PINK}`, background: PINK, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: "white" }}>{initial}</p>
                }
              </div>
            </Link>
          </div>
        </div>

        {/* Greeting row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>
              GOOD {timeLabel}
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 27, fontWeight: 800, fontStyle: "italic", color: DARK, lineHeight: 1.08 }}>
              {greeting},
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 31, fontWeight: 900, fontStyle: "italic", color: PINK, lineHeight: 0.96 }}>
              {loading ? "…" : `${displayName}. ♡`}
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#c8bdb5", marginTop: 10 }}>you belong here</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#d4c9c3", marginTop: 2 }}>soft life, strong mind ♡</p>
          </div>

          {/* Polaroid membership card */}
          <div style={{ flexShrink: 0 }}>
            <Link href="/member/you" style={{ textDecoration: "none" }}>
              <div style={{ position: "relative" }}>
                {/* Tape */}
                <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
                  <Tape index={0} width={34} height={13} rotate={-2.5} />
                </div>
                {/* Card — warm paper texture */}
                <div style={{
                  backgroundImage: PAPER_TEX,
                  backgroundColor: PAPER,
                  backgroundSize: "200px 200px",
                  padding: "5px 5px 26px",
                  boxShadow: "0 7px 28px rgba(0,0,0,0.17), 0 1px 4px rgba(0,0,0,0.07)",
                  transform: "rotate(2deg)",
                  width: 106,
                }}>
                  {/* Photo */}
                  <div style={{ width: "100%", height: 126, overflow: "hidden" }}>
                    {avatarUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: `linear-gradient(145deg, ${PINK} 0%, #7F0030 100%)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 52, color: "rgba(255,255,255,0.45)" }}>
                            {initial}
                          </p>
                        </div>
                      )
                    }
                  </div>
                  {/* Caption */}
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#999", textAlign: "center", marginTop: 6 }}>
                    {loading ? "" : (firstName || "Member")}
                  </p>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* ══════════════════════════ CALENDAR ══════════════════════════ */}
      <div style={{ margin: "22px 0 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          backgroundImage: PAPER_TEX,
          backgroundColor: "rgba(255,31,125,0.045)",
          backgroundSize: "200px 200px",
          borderTop: "1px solid rgba(255,31,125,0.09)",
          borderBottom: "1px solid rgba(255,31,125,0.09)",
          padding: "8px 22px",
        }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.06em", color: d.isToday ? PINK : "#ccc" }}>
                {d.abbr}
              </span>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: d.isToday ? PINK : "transparent",
                boxShadow: d.isToday ? "0 2px 10px rgba(255,31,125,0.38)" : "none",
              }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: d.isToday ? "white" : "#999" }}>
                  {d.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ THREE CARDS ══════════════════════════ */}
      <div style={{ display: "flex", gap: 8, padding: "16px 16px 4px" }}>

        {/* My First Month — tape on top */}
        <Link href={task.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 8 }}>
            {/* Tape */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
              <Tape index={1} width={40} height={13} rotate={-2} />
            </div>
            <div style={{
              backgroundImage: PAPER_TEX,
              backgroundColor: PAPER,
              backgroundSize: "200px 200px",
              borderRadius: 18,
              padding: "18px 12px 12px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.09), inset 0 0 0 0.5px rgba(0,0,0,0.03)",
              transform: "rotate(-0.6deg)",
              minHeight: 152,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 6 }}>
                  MY FIRST MONTH
                </p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.38 }}>
                  ⭐ Week {weeksIn}:<br />{task.task}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 999, background: "rgba(255,31,125,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
                </div>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "#bbb" }}>{weeksIn}/4</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Happenings */}
        <Link href="/member/discover" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 8 }}>
            <div style={{ position: "absolute", top: 0, right: 12, zIndex: 4 }}>
              <Tape index={2} width={36} height={13} rotate={3} />
            </div>
            <div style={{
              backgroundImage: PAPER_TEX,
              backgroundColor: "#FEF0F5",
              backgroundSize: "200px 200px",
              borderRadius: 18,
              padding: "18px 12px 12px",
              boxShadow: "0 4px 18px rgba(255,31,125,0.09), inset 0 0 0 0.5px rgba(255,31,125,0.06)",
              transform: "rotate(0.4deg)",
              minHeight: 152,
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 6 }}>
                HAPPENINGS
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.38 }}>
                Discover<br />what&apos;s on
              </p>
              <p style={{ fontFamily: "var(--font-instrument)", fontSize: 9, fontStyle: "italic", color: "#ddb", marginTop: 6 }}>Find what&apos;s next →</p>
            </div>
          </div>
        </Link>

        {/* The City */}
        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 8 }}>
            <div style={{ position: "absolute", top: 0, left: 8, zIndex: 4 }}>
              <Tape index={3} width={36} height={13} rotate={-1} />
            </div>
            <div style={{
              backgroundImage: PAPER_TEX,
              backgroundColor: PAPER,
              backgroundSize: "200px 200px",
              borderRadius: 18,
              padding: "18px 12px 12px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.03)",
              transform: "rotate(-0.3deg)",
              minHeight: 152,
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 6 }}>
                THE CITY
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.38 }}>
                NYC<br />Spots
              </p>
              <p style={{ fontFamily: "var(--font-instrument)", fontSize: 9, fontStyle: "italic", color: "#ccc", marginTop: 6 }}>Explore →</p>
            </div>
          </div>
        </Link>

      </div>

      {/* ══════════════════════════ YOUR CLUBS ══════════════════════════ */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingLeft: 20, paddingRight: 20, marginBottom: 16 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>YOUR CLUBS</p>
            {!loading && myClubs.length > 0 && (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#c8bdb5", marginTop: 1 }}>
                {myClubs.length} joined
              </p>
            )}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "#c8bdb5" }}>Browse all →</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: 16, padding: "4px 20px 12px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                width: 104, height: 138,
                backgroundImage: PAPER_TEX, backgroundColor: "rgba(0,0,0,0.04)",
                backgroundSize: "200px 200px", flexShrink: 0,
              }} />
            ))}
          </div>
        ) : myClubs.length === 0 ? (
          <div style={{
            margin: "0 20px",
            backgroundImage: PAPER_TEX,
            backgroundColor: PAPER,
            backgroundSize: "200px 200px",
            borderRadius: 22, padding: "30px 22px", textAlign: "center",
            boxShadow: "0 4px 18px rgba(0,0,0,0.07), inset 0 0 0 0.5px rgba(0,0,0,0.03)",
          }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontStyle: "italic", color: "#bbb", marginBottom: 8 }}>
              No clubs yet.
            </p>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 12, fontStyle: "italic", color: "#ccc", lineHeight: 1.5, marginBottom: 20 }}>
              Find your people —<br />there&apos;s a club for every side of you.
            </p>
            <Link href="/member/clubs" style={{
              display: "inline-block", background: PINK, color: "white",
              padding: "12px 30px", borderRadius: 999, fontSize: 11, fontWeight: 700,
              textDecoration: "none", fontFamily: "var(--font-jost)",
              boxShadow: `0 4px 18px ${PINK}44`,
            }}>
              Browse Clubs →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", padding: "8px 20px 24px", gap: 18, scrollbarWidth: "none" as const }}>
            {myClubs.map((club, i) => (
              <ClubCard key={club.id} club={club} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════ DISCOVER CTA ══════════════════════════ */}
      <div style={{ padding: "8px 20px" }}>
        <Link href="/member/discover" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(145deg, #1C1B1C 0%, #2D0015 100%)",
            borderRadius: 22, padding: "24px 22px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 10px 34px rgba(0,0,0,0.22)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 82% 15%, rgba(255,31,125,0.3) 0%, transparent 58%)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,31,125,0.85)", marginBottom: 8, position: "relative" }}>
              HAPPENING NOW
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "#F1DFDD", lineHeight: 1.1, marginBottom: 8, position: "relative" }}>
              Something&apos;s<br />always on.
            </p>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.35)", marginBottom: 20, position: "relative" }}>
              Find happenings and city spots near you.
            </p>
            <div style={{
              display: "inline-flex", background: PINK, borderRadius: 999,
              padding: "11px 22px", position: "relative",
              boxShadow: `0 4px 18px ${PINK}55`,
            }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: "white", letterSpacing: "0.07em" }}>DISCOVER →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ══════════════════════════ NEAR YOU ══════════════════════════ */}
      <div style={{ padding: "22px 20px 8px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 3 }}>NEAR YOU</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#c8bdb5", marginBottom: 12 }}>New York City</p>
        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { name: "SoHo",         color: "#D4B5A0" },
              { name: "West Village", color: "#C4A0A8" },
              { name: "Williamsburg", color: "#B8A8C0" },
            ].map((n, i) => (
              <div key={i} style={{
                flex: 1,
                backgroundImage: PAPER_TEX,
                backgroundColor: PAPER,
                backgroundSize: "200px 200px",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
              }}>
                <div style={{ height: 46, background: n.color, opacity: 0.55 }} />
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, fontWeight: 700, color: "#666", textAlign: "center", padding: "7px 4px" }}>{n.name}</p>
              </div>
            ))}
          </div>
        </Link>
        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <div style={{ marginTop: 10, background: PINK, borderRadius: 12, padding: "10px", textAlign: "center", boxShadow: `0 4px 16px ${PINK}44` }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.1em", color: "white" }}>EXPLORE THE CITY →</p>
          </div>
        </Link>
      </div>

      {/* ══════════════════════════ INSPIRATION ══════════════════════════ */}
      <div style={{ padding: "20px 20px 36px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>INSPIRATION</p>
        <Link href="/member/discover" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(145deg, #1C1B1C 0%, #3D001A 100%)",
            borderRadius: 20, padding: "26px 22px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            transform: "rotate(0.5deg)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 88% 12%, rgba(255,31,125,0.22) 0%, transparent 65%)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, fontStyle: "italic", color: "#F1DFDD", lineHeight: 1.5, position: "relative" }}>
              &ldquo;Collect moments,<br />not things.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 600, color: "rgba(255,255,255,0.22)", marginTop: 12, letterSpacing: "0.1em", position: "relative" }}>
              — bloombay
            </p>
          </div>
        </Link>
      </div>

      {showYande && <YandeSheet onClose={() => setShowYande(false)} />}

    </div>
  );
}
