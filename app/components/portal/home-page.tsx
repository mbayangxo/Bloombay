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

      {/* ══ HEADER SHELL ═════════════════════════════════════════════════════════ */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)",
        paddingLeft: 16, paddingRight: 16, paddingBottom: 20,
      }}>
        {/* Logo + date */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingLeft: 6, paddingRight: 6 }}>
          <BBLogo size={22} light />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.16em", color: "rgba(255,255,255,0.52)" }}>{dayAbbr} · {dayOfMonth} {monthShort}</p>
        </div>

        {/* ── UNIFIED CARD: greeting top + tonight bottom ── */}
        <div style={{
          background: "#000",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 2px 0 rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.4)",
          position: "relative",
        }}>
          {/* Pink glow bottom-right */}
          <div style={{ position: "absolute", bottom: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,0,144,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* — TOP: Greeting — */}
          <div style={{ padding: "20px 20px 16px", position: "relative" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "8px", letterSpacing: "0.3em", color: PINK, marginBottom: 8 }}>{greeting.toUpperCase()}</p>
            <p style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
              fontSize: nameFontSize,
              color: "white", lineHeight: 0.88, letterSpacing: "-0.025em",
            }}>{loading ? "…" : `${displayName}.`}</p>
          </div>

          {/* Pink separator */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${PINK}99, rgba(255,0,144,0.15), transparent)`, margin: "0 20px" }} />

          {/* — BOTTOM: Tonight — */}
          <Link href="/member/happenings" style={{ textDecoration: "none" }}>
            <div style={{ padding: "14px 20px 18px", position: "relative" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>TONIGHT · 7:30 PM · WEST VILLAGE</p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white", lineHeight: 1.0 }}>Girls Dinner.</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>Carbone · 4 seats</p>
                </div>
                <div style={{ flexShrink: 0, background: PINK, borderRadius: 999, padding: "9px 18px", boxShadow: `0 2px 0 rgba(150,0,55,0.8), 0 5px 16px ${PINK}55` }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: "white", letterSpacing: "0.07em" }}>I&apos;M IN →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Chips row */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, paddingLeft: 2 }}>
          {[
            { href: "/member/happenings", label: "Tonight", bg: "white",    text: PINK       },
            { href: "/member/city",       label: "City",    bg: "#000000",  text: "white"    },
            { href: "/member/plans",      label: "Plans",   bg: "#000000",  text: "white"    },
          ].map(c => (
            <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
              <div style={{ padding: "9px 20px", borderRadius: 999, background: c.bg, boxShadow: c.bg === "white" ? "0 2px 0 rgba(140,0,50,0.6), 0 5px 16px rgba(0,0,0,0.1)" : "0 2px 0 rgba(0,0,0,0.85), 0 4px 10px rgba(0,0,0,0.18)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: c.text, letterSpacing: "0.04em" }}>{c.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ CALENDAR STRIP ═══════════════════════════════════════════════════════ */}
      <div style={{ background: "rgba(255,255,255,0.97)", borderTop: "1px solid rgba(255,0,144,0.07)", borderBottom: "1px solid rgba(255,0,144,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "10px 16px" }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.07em", color: d.isToday ? PINK : "rgba(0,0,0,0.2)" }}>{d.abbr}</span>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: d.isToday ? PINK : "transparent", boxShadow: d.isToday ? `0 2px 10px ${PINK}44` : "none" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: d.isToday ? "white" : "rgba(0,0,0,0.38)" }}>{d.date}</span>
              </div>
              {/* Event dot */}
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: [2, 4, 6].includes(i) ? PINK : "transparent" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ══ THREE BENTO CARDS ════════════════════════════════════════════════════ */}
      <div style={{ padding: "14px 16px 0", display: "flex", gap: 9 }}>

        {/* MY FIRST MONTH */}
        <Link href={task.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, padding: "14px 12px 16px", height: "100%" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 900, letterSpacing: "0.18em", color: PINK, marginBottom: 8 }}>MY FIRST<br />MONTH</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 11, color: "#000", lineHeight: 1.4 }}>Week {weeksIn}:<br />{task.task}</p>
            <div style={{ height: 3, borderRadius: 999, background: "rgba(255,0,144,0.1)", marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.28)", marginTop: 5 }}>{weeksIn}/4</p>
          </div>
        </Link>

        {/* THIS WEEK */}
        <Link href="/member/happenings" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, padding: "14px 12px 16px", height: "100%" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 900, letterSpacing: "0.18em", color: PINK, marginBottom: 8 }}>THIS WEEK<br />· 2 EVENTS</p>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 12, color: "#000", lineHeight: 1.3 }}>Next: Book Girls NYC</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)", marginTop: 4 }}>Wednesday</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: PINK, marginTop: 10 }}>› View all</p>
          </div>
        </Link>

        {/* CITY VIBES — photo card */}
        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ ...CARD, overflow: "hidden", height: "100%" }}>
            {/* Photo area */}
            <div style={{ height: 64, background: `linear-gradient(145deg, ${PINK} 0%, #FF5BAD 100%)`, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.15))" }} />
              <p style={{ position: "absolute", bottom: 6, left: 8, fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "7px", letterSpacing: "0.1em", color: "white" }}>CITY VIBES</p>
            </div>
            <div style={{ padding: "8px 10px 12px" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 12, color: "#000" }}>Crown Heights</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.38)", marginTop: 3 }}>9 spots saved ♡</p>
            </div>
          </div>
        </Link>

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
