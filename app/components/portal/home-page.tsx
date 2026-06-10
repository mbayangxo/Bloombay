"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";
import { BBLogo } from "./bb-logo";

const PINK = "#FF0090";
const MONTHS_S = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const WEEK_DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

type Club = { id: string; name: string; color: string | null; cover_url: string | null; member_count: number };

const FIRST_MONTH_TASKS = [
  { week: 1, task: "Join 3 clubs",             href: "/member/clubs"    },
  { week: 2, task: "Attend 1 gathering",        href: "/member/discover" },
  { week: 3, task: "Introduce yourself",        href: "/member/match"    },
  { week: 4, task: "Save 5 places in The City", href: "/member/city"     },
];

const TODAY_EVENTS = [
  { time: "9:00 AM",  label: "NEXT",    name: "Pilates Class",    loc: "Brooklyn Studio · Carroll Gardens" },
  { time: "1:00 PM",  label: "",        name: "Lunch with Sofia", loc: "Café Auguste · East Village"      },
  { time: "7:30 PM",  label: "TONIGHT", name: "Girls Dinner",     loc: "Carbone · West Village"           },
];

// ── White card base ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 20,
  border: "1.5px solid rgba(255,0,144,0.09)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
};

// ── Pink sticky note ───────────────────────────────────────────────────────────
function StickyNote({ text, author, rotate = 2 }: { text: string; author?: string; rotate?: number }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #FFF0F8 0%, #FFE4F3 100%)",
      padding: "9px 11px 10px",
      borderRadius: 4,
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 2px 10px rgba(255,0,144,0.15), 0 1px 4px rgba(0,0,0,0.08)",
      maxWidth: 118,
      border: "1px solid rgba(255,0,144,0.13)",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 9, height: 9, borderRadius: "50%", background: PINK, boxShadow: "0 1px 5px rgba(255,0,144,0.55)" }} />
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#1A0010", lineHeight: 1.45 }}>{text}</p>
      {author && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(200,0,100,0.5)", marginTop: 4 }}>— {author}</p>}
    </div>
  );
}

// ── Club cover ─────────────────────────────────────────────────────────────────
function ClubCover({ club }: { club: Club }) {
  const abbr = club.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
        <div style={{ width: 62, height: 62, borderRadius: 17, overflow: "hidden", boxShadow: "0 4px 16px rgba(255,0,144,0.2)" }}>
          {club.cover_url
            ? <img src={club.cover_url} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${PINK}, #FF5BAD)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "white" }}>{abbr}</p>
              </div>
          }
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(255,255,255,0.65)", maxWidth: 66, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "center" }}>{club.name}</p>
      </div>
    </Link>
  );
}

// ── HomePage ───────────────────────────────────────────────────────────────────
export function HomePage() {
  const [tod,       setTod]       = useState<TimeOfDay>("afternoon");
  const [greeting,  setGreeting]  = useState("Good afternoon");
  const [firstName, setFirstName] = useState("");
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
      const { data: profile } = await supabase.from("profiles").select("first_name, avatar_url, created_at").eq("id", user.id).single();
      if (profile) { setFirstName(profile.first_name || ""); setJoinedAt(profile.created_at || null); }
      const { data: uc } = await supabase.from("user_clubs").select("club:clubs(id,name,color,cover_url,member_count)").eq("user_id", user.id).limit(10);
      if (uc) setMyClubs(uc.map((r: Record<string, unknown>) => r.club as Club).filter(Boolean));
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
  const displayName = firstName || "there";
  const monthShort  = MONTHS_S[today.getMonth()];
  const dayOfMonth  = today.getDate();
  const dayAbbr     = WEEK_DAYS[todayDow];
  void tod;

  const nameFontSize = loading ? 52 : Math.max(38, 68 - Math.max(0, (displayName.length - 5) * 3.5));

  return (
    <div style={{
      background: "linear-gradient(175deg, #FF0090 0%, #FF1F7D 28%, #FF5BAD 60%, #FFB3D9 85%, #FFF0F8 100%)",
      minHeight: "100vh",
      paddingBottom: 112,
      overflowX: "hidden",
    }}>

      {/* ══ MASTHEAD ═════════════════════════════════════════════════════════════ */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)",
        paddingLeft: 24, paddingRight: 24, paddingBottom: 38,
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -50, right: -40, width: 210, height: 210, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 80, left: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        {/* Logo + date row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <BBLogo size={24} light />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,255,255,0.52)" }}>
            {dayAbbr} · {dayOfMonth} {monthShort}
          </p>
        </div>

        {/* Greeting */}
        <p style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 300,
          fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.2, marginBottom: 5,
        }}>{greeting},</p>

        {/* Name — the hero */}
        <p style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
          fontSize: nameFontSize,
          color: "white", lineHeight: 0.88, letterSpacing: "-0.025em",
          textShadow: "0 2px 0 rgba(150,0,55,0.5), 0 8px 32px rgba(0,0,0,0.15)",
          marginBottom: 16,
        }}>{loading ? "…" : `${displayName}.`}</p>

        {/* Tagline */}
        <p style={{
          fontFamily: "var(--font-caveat)", fontSize: 15,
          color: "rgba(255,255,255,0.46)", marginBottom: 28, letterSpacing: "0.01em",
        }}>you belong here ✦ soft life, strong mind</p>

        {/* Action chips */}
        <div style={{ display: "flex", gap: 9 }}>
          <Link href="/member/happenings" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "10px 22px", borderRadius: 999,
              background: "white",
              boxShadow: "0 2px 0 rgba(140,0,50,0.65), 0 6px 20px rgba(0,0,0,0.13)",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: PINK, letterSpacing: "0.05em" }}>Tonight</p>
            </div>
          </Link>
          <Link href="/member/city" style={{ textDecoration: "none" }}>
            <div style={{ padding: "10px 22px", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.42)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>City</p>
            </div>
          </Link>
          <Link href="/member/plans" style={{ textDecoration: "none" }}>
            <div style={{ padding: "10px 22px", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.42)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>Plans</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ══ CALENDAR STRIP ═══════════════════════════════════════════════════════ */}
      <div style={{ background: "rgba(255,255,255,0.97)", borderTop: "1px solid rgba(255,0,144,0.08)", borderBottom: "1px solid rgba(255,0,144,0.08)", padding: "10px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.07em", color: d.isToday ? PINK : "rgba(0,0,0,0.2)" }}>{d.abbr}</span>
              <div style={{ width: 29, height: 29, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: d.isToday ? PINK : "transparent", boxShadow: d.isToday ? `0 2px 10px ${PINK}44` : "none" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: d.isToday ? "white" : "rgba(0,0,0,0.38)" }}>{d.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURED TONIGHT — hero card ═════════════════════════════════════════ */}
      <div style={{ padding: "20px 16px 0" }}>
        <Link href="/member/happenings" style={{ textDecoration: "none" }}>
          <div style={{
            borderRadius: 24, position: "relative", overflow: "visible",
            background: "linear-gradient(145deg, #B5004E 0%, #E8006A 35%, #FF0090 70%, #FF5BAD 100%)",
            padding: "26px 22px 28px",
            boxShadow: [
              "0 1px 0 rgba(100,0,40,0.8)",
              "0 4px 0 rgba(80,0,30,0.35)",
              "0 14px 40px rgba(180,0,70,0.32)",
              "inset 0 1px 0 rgba(255,255,255,0.22)",
            ].join(", "),
          }}>
            {/* Gloss */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "42%", borderRadius: "24px 24px 0 0", background: "linear-gradient(to bottom, rgba(255,255,255,0.16) 0%, transparent 100%)", pointerEvents: "none" }} />

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.18)", borderRadius: 999, padding: "4px 12px 4px 10px", marginBottom: 16, backdropFilter: "blur(6px)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.85 }} />
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.82)" }}>THIS EVENING</p>
            </div>

            {/* Event name */}
            <p style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
              fontSize: 34, color: "white", lineHeight: 0.95, letterSpacing: "-0.02em",
              position: "relative", marginBottom: 4,
            }}>Girls Dinner.</p>
            <p style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400,
              fontSize: 22, color: "rgba(255,255,255,0.68)", lineHeight: 1.1,
              position: "relative",
            }}>Carbone.</p>

            {/* Details */}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.55)", marginTop: 12, position: "relative" }}>
              7:30 PM · West Village · 4 seats
            </p>

            {/* CTA */}
            <div style={{ marginTop: 20, display: "inline-flex", background: "white", borderRadius: 999, padding: "11px 24px", position: "relative", boxShadow: "0 3px 0 rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.12)" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900, color: PINK, letterSpacing: "0.07em" }}>I&apos;M IN →</span>
            </div>

            {/* Sticky note */}
            <div style={{ position: "absolute", top: 20, right: 18 }}>
              <StickyNote text={"tonight's the night ✦"} author="bloombay" rotate={3} />
            </div>
          </div>
        </Link>
      </div>

      {/* ══ BENTO GRID ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 10, alignItems: "stretch" }}>

        {/* THIS WEEK — stat card */}
        <Link href="/member/happenings" style={{ textDecoration: "none", flex: 1.45 }}>
          <div style={{ ...CARD, padding: "20px 18px 22px", height: "100%" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.22em", color: PINK, marginBottom: 6 }}>THIS WEEK</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 56, color: "#000", lineHeight: 1, letterSpacing: "-0.04em" }}>2</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.3)", marginTop: 6, lineHeight: 1.45 }}>events<br />near you</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginTop: 14 }}>Book Girls NYC →</p>
          </div>
        </Link>

        {/* Right — stacked mini cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

          <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
            <div style={{ ...CARD, padding: "15px 13px", height: "100%", minHeight: 88, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: -12, right: -12, width: 66, height: 66, borderRadius: "50%", background: "rgba(255,0,144,0.05)", pointerEvents: "none" }} />
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 7 }}>CITY VIBES</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 800, fontSize: 13, color: "#000", lineHeight: 1.2 }}>Crown Heights</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.38)", marginTop: 5 }}>9 spots saved</p>
            </div>
          </Link>

          <Link href={task.href} style={{ textDecoration: "none", flex: 1 }}>
            <div style={{ ...CARD, padding: "15px 13px", height: "100%", minHeight: 88 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 7 }}>MONTH 1</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, fontWeight: 700, color: "#000", lineHeight: 1.45 }}>Wk {weeksIn}: {task.task}</p>
              <div style={{ height: 3, borderRadius: 999, background: "rgba(255,0,144,0.1)", marginTop: 10, overflow: "hidden" }}>
                <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.26)", marginTop: 5 }}>{weeksIn}/4</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ══ TODAY'S SCHEDULE ═════════════════════════════════════════════════════ */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(255,255,255,0.75)" }}>TODAY · {TODAY_EVENTS.length} EVENTS</p>
          <Link href="/member/happenings" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.42)" }}>VIEW ALL →</span>
          </Link>
        </div>
        <div style={{ ...CARD, overflow: "hidden" }}>
          {TODAY_EVENTS.map((ev, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < TODAY_EVENTS.length - 1 ? "1px solid rgba(255,0,144,0.07)" : "none" }}>
              <div style={{ width: 44, flexShrink: 0, textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.3)", lineHeight: 1 }}>{ev.time.split(" ")[0]}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(0,0,0,0.18)" }}>{ev.time.split(" ")[1]}</p>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: PINK, flexShrink: 0, boxShadow: `0 0 0 3px rgba(255,0,144,0.12)` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "#000", lineHeight: 1.2 }}>{ev.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.35)", marginTop: 1 }}>{ev.loc}</p>
              </div>
              {ev.label && (
                <div style={{ flexShrink: 0, background: ev.label === "NEXT" ? "rgba(0,0,0,0.05)" : PINK, borderRadius: 999, padding: "4px 10px", boxShadow: ev.label === "TONIGHT" ? `0 2px 8px ${PINK}44` : "none" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.1em", color: ev.label === "NEXT" ? "rgba(0,0,0,0.35)" : "white" }}>{ev.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══ YOUR CLUBS ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(255,255,255,0.8)" }}>YOUR CLUBS</p>
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
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 21, fontStyle: "italic", fontWeight: 700, color: "#000", marginBottom: 6 }}>No clubs yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.38)", lineHeight: 1.5, marginBottom: 22 }}>There&apos;s a club for every<br />side of you.</p>
            <Link href="/member/clubs" style={{ display: "inline-block", background: PINK, color: "white", padding: "12px 32px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-jost)", boxShadow: `0 3px 0 rgba(150,0,55,0.8), 0 6px 18px ${PINK}44` }}>Browse Clubs →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", padding: "4px 20px 16px", gap: 14, scrollbarWidth: "none" as const }}>
            {myClubs.map(club => <ClubCover key={club.id} club={club} />)}
          </div>
        )}
      </div>

      {/* ══ NEAR YOU ═════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(255,255,255,0.8)" }}>NEAR YOU</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>SoHo, NYC</p>
          </div>
          <Link href="/member/discover" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>EXPLORE MAP →</span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const }}>
          {[
            { name: "SoHo",         clubs: 12, note: "fave ♡" },
            { name: "West Village", clubs: 18, note: null     },
            { name: "Williamsburg", clubs: 16, note: null     },
            { name: "Brooklyn Hts", clubs: 11, note: null     },
            { name: "Harlem",       clubs: 9,  note: null     },
          ].map((n, i) => (
            <Link key={i} href="/member/discover" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 110, ...CARD, overflow: "hidden", position: "relative" }}>
                <div style={{ height: 64, background: `linear-gradient(135deg, ${PINK} 0%, #FF5BAD 100%)`, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)" }} />
                  {n.note && (
                    <div style={{ position: "absolute", bottom: -9, right: 9, background: "#FFF0F8", borderRadius: 3, padding: "4px 8px", transform: "rotate(-2deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", border: "1px solid rgba(255,0,144,0.12)" }}>
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: PINK }}>{n.note}</p>
                    </div>
                  )}
                </div>
                <div style={{ padding: "11px 10px 12px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "#000" }}>{n.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.32)", marginTop: 1 }}>{n.clubs} clubs</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ QUOTE CARD ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px 16px 40px" }}>
        <Link href="/member/discover" style={{ textDecoration: "none" }}>
          <div style={{ ...CARD, padding: "28px 24px", position: "relative", overflow: "hidden", borderLeft: `4px solid ${PINK}` }}>
            <div style={{ position: "absolute", top: -20, right: -10, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,0,144,0.04)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 21, color: "#000", lineHeight: 1.5, position: "relative" }}>
              &ldquo;Collect moments,<br />not things.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, marginTop: 10, letterSpacing: "0.12em", position: "relative" }}>— BLOOMBAY</p>
            <div style={{ marginTop: 18, display: "inline-flex", background: PINK, borderRadius: 999, padding: "10px 20px", position: "relative", boxShadow: `0 2px 0 rgba(150,0,55,0.8), 0 6px 16px ${PINK}44` }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: "white", letterSpacing: "0.07em" }}>DISCOVER PLACES →</span>
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
