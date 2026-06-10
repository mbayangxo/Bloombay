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

// ── Pink Tape ──────────────────────────────────────────────────────────────────
function PinkTape({ width = 38, rotate = 0 }: { width?: number; rotate?: number }) {
  return (
    <div style={{
      width, height: 14, borderRadius: 2,
      background: "linear-gradient(to bottom, rgba(255,0,144,0.28), rgba(255,0,144,0.55) 30%, rgba(255,255,255,0.6) 48%, rgba(255,255,255,0.6) 52%, rgba(255,0,144,0.55) 70%, rgba(255,0,144,0.28))",
      boxShadow: "0 1px 4px rgba(255,0,144,0.25)",
      transform: `rotate(${rotate}deg)`,
    }} />
  );
}

// ── White card base ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 20,
  border: "1.5px solid rgba(255,0,144,0.12)",
  boxShadow: "0 4px 24px rgba(255,0,144,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
};

// ── Club cover ─────────────────────────────────────────────────────────────────
function ClubCover({ club }: { club: Club }) {
  const abbr = club.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", boxShadow: "0 3px 12px rgba(255,0,144,0.2)" }}>
          {club.cover_url
            ? <img src={club.cover_url} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${PINK}, #FF5BAD)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "white" }}>{abbr}</p>
              </div>
          }
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(0,0,0,0.45)", maxWidth: 60, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{abbr}</p>
      </div>
    </Link>
  );
}

// ── Yande bottom sheet ─────────────────────────────────────────────────────────
function YandeSheet({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10" style={{ background: "white", boxShadow: "0 -8px 40px rgba(255,0,144,0.15)" }}>
        <div className="flex justify-center pt-3 pb-3">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="px-5 flex items-center gap-3 mb-3">
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, letterSpacing: "0.22em", fontSize: 9, color: PINK }}>FIND YOUR PEOPLE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#000" }}>Find your tribe.</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.4)", padding: "0 20px 20px", lineHeight: 1.5 }}>Join clubs to start connecting with women in your city.</p>
        <div className="px-5">
          <Link href="/member/clubs" onClick={onClose} className="w-full py-4 rounded-full font-bold text-sm flex items-center justify-center"
            style={{ background: PINK, color: "white", textDecoration: "none", boxShadow: `0 4px 18px ${PINK}55` }}>
            Browse all clubs →
          </Link>
        </div>
      </div>
    </>
  );
}

// ── HomePage ───────────────────────────────────────────────────────────────────
export function HomePage() {
  const [tod,       setTod]       = useState<TimeOfDay>("afternoon");
  const [greeting,  setGreeting]  = useState("Good afternoon");
  const [showYande, setShowYande] = useState(false);
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
  const timeLabel  = tod === "morning" ? "MORNING" : (tod === "evening" || tod === "night") ? "EVENING" : "AFTERNOON";
  const weeksIn    = joinedAt ? Math.min(4, Math.floor((Date.now() - new Date(joinedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1) : 1;
  const task       = FIRST_MONTH_TASKS[Math.min(weeksIn - 1, 3)];
  const displayName = firstName || "there";
  const monthShort  = MONTHS_S[today.getMonth()];
  const dayOfMonth  = today.getDate();
  const dayAbbr     = WEEK_DAYS[todayDow];

  return (
    <div style={{ background: "linear-gradient(160deg, #FF0090 0%, #FF1F7D 45%, #FF5BAD 80%, #FFB3D9 100%)", minHeight: "100vh", paddingBottom: 104, overflowX: "hidden" }}>

      {/* ══ HEADER CARD ══════════════════════════════════════════════════════════ */}
      {/* Hot pink outer shell */}
      <div style={{
        position: "relative", overflow: "visible",
        background: "linear-gradient(160deg, #FF0090 0%, #FF1F7D 45%, #FF5BAD 80%, #FFB3D9 100%)",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
        paddingBottom: 40, paddingLeft: 16, paddingRight: 16,
      }}>
        {/* Gloss highlight on shell */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 100%)", pointerEvents: "none" }} />
        {/* Shadow depth at base */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50, background: "linear-gradient(to top, rgba(180,0,70,0.4) 0%, transparent 100%)", pointerEvents: "none" }} />

        {/* 3D white floating card */}
        <div style={{
          position: "relative", background: "#FFFFFF", borderRadius: 24, marginTop: 10,
          padding: "18px 18px 20px",
          boxShadow: [
            "0 1px 0 rgba(180,0,70,0.9)",
            "0 3px 0 rgba(160,0,60,0.55)",
            "0 8px 0 rgba(140,0,50,0.22)",
            "0 20px 40px rgba(120,0,40,0.2)",
            "0 40px 70px rgba(255,0,128,0.12)",
            "inset 0 1.5px 0 rgba(255,255,255,1)",
          ].join(", "),
        }}>
          {/* Card top gloss */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 50, borderRadius: "24px 24px 0 0", background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)", pointerEvents: "none" }} />

          {/* Eyebrow row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.35em", color: PINK }}>GOOD {timeLabel}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(0,0,0,0.22)" }}>{dayAbbr} · {dayOfMonth} {monthShort}</p>
          </div>

          {/* Pink divider line */}
          <div style={{ height: 1.5, background: `linear-gradient(90deg, ${PINK}, #FF5BAD, ${PINK})`, borderRadius: 999, marginBottom: 14 }} />

          {/* Name row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 300, fontSize: 21, color: "rgba(0,0,0,0.38)", lineHeight: 1.1, marginBottom: 1 }}>{greeting},</p>
              <p style={{
                fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
                fontSize: loading ? 34 : Math.max(30, 46 - Math.max(0, (displayName.length - 6) * 2.8)),
                color: "#000000", lineHeight: 0.92, letterSpacing: "-0.02em",
                textShadow: ["0 1px 0 rgba(255,0,144,0.35)", "0 2px 0 rgba(255,0,144,0.18)", "0 4px 14px rgba(255,0,144,0.12)"].join(", "),
              }}>{loading ? "…" : `${displayName}.`}</p>
            </div>
            {/* BloomBay logo badge */}
            <div style={{
              width: 58, height: 58, borderRadius: "50%", flexShrink: 0, marginTop: 2,
              background: "linear-gradient(145deg, #FF0090 0%, #FF5BAD 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: ["0 1px 0 rgba(160,0,60,0.9)", "0 3px 0 rgba(140,0,50,0.45)", "0 8px 20px rgba(255,0,128,0.35)", "inset 0 1px 0 rgba(255,255,255,0.38)"].join(", "),
            }}>
              <BBLogo size={28} light />
            </div>
          </div>

          {/* Tagline */}
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.32)", marginTop: 12 }}>you belong here ✦ soft life, strong mind</p>

          {/* Bottom rule */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(255,0,144,0.25), transparent)`, borderRadius: 999, margin: "12px 0 14px" }} />

          {/* Action chips */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { href: "/member/happenings", label: "Tonight",    fill: true  },
              { href: "/member/city",       label: "City",       fill: false },
              { href: "/member/plans",      label: "Plans",      fill: false },
            ].map(c => (
              <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "8px 18px", borderRadius: 999,
                  background: c.fill ? PINK : "#FFFFFF",
                  border: c.fill ? "none" : "2px solid #000000",
                  boxShadow: c.fill
                    ? ["0 2px 0 rgba(160,0,60,0.85)", "0 5px 14px rgba(255,0,128,0.38)"].join(", ")
                    : ["0 2px 0 rgba(0,0,0,0.75)", "0 4px 12px rgba(0,0,0,0.08)"].join(", "),
                }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: c.fill ? "white" : "#000000", letterSpacing: "0.08em" }}>{c.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CALENDAR STRIP ═══════════════════════════════════════════════════════ */}
      <div style={{ background: "white", borderBottom: "1.5px solid rgba(255,0,144,0.1)", padding: "10px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.06em", color: d.isToday ? PINK : "rgba(0,0,0,0.22)" }}>{d.abbr}</span>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: d.isToday ? PINK : "transparent", boxShadow: d.isToday ? `0 2px 10px ${PINK}44` : "none" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: d.isToday ? "white" : "rgba(0,0,0,0.4)" }}>{d.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ THREE MINI CARDS ═════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", gap: 10, padding: "18px 16px 4px" }}>

        {/* My First Month */}
        <Link href={task.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 10 }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}><PinkTape width={38} rotate={-2} /></div>
            <div style={{ ...CARD, padding: "16px 12px 14px", minHeight: 130, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.16em", color: PINK, marginBottom: 6 }}>MY FIRST MONTH</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 900, fontStyle: "italic", color: "#000", lineHeight: 1.4 }}>⭐ Week {weeksIn}:<br />{task.task}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 999, background: "rgba(255,0,144,0.12)", overflow: "hidden" }}>
                  <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
                </div>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(0,0,0,0.28)" }}>{weeksIn}/4</span>
              </div>
            </div>
          </div>
        </Link>

        {/* This week */}
        <Link href="/member/happenings" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 10 }}>
            <div style={{ position: "absolute", top: 0, right: 10, zIndex: 4 }}><PinkTape width={34} rotate={3} /></div>
            <div style={{ ...CARD, padding: "16px 12px 14px", minHeight: 130 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.16em", color: PINK, marginBottom: 6 }}>THIS WEEK</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#000", lineHeight: 1 }}>2</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(0,0,0,0.32)", marginTop: 2 }}>events near you</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: PINK, marginTop: 8, lineHeight: 1.3 }}>Book Girls NYC<br />Wednesday</p>
            </div>
          </div>
        </Link>

        {/* City vibes */}
        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ position: "relative", paddingTop: 10 }}>
            <div style={{ position: "absolute", top: 0, left: 8, zIndex: 4 }}><PinkTape width={32} rotate={-1} /></div>
            <div style={{ ...CARD, padding: "16px 12px 14px", minHeight: 130 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.16em", color: PINK, marginBottom: 6 }}>CITY VIBES</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: "#000", lineHeight: 1.3 }}>Crown Heights</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.32)", marginTop: 4 }}>9 spots saved</p>
            </div>
          </div>
        </Link>

      </div>

      {/* ══ TODAY'S EVENTS ═══════════════════════════════════════════════════════ */}
      <div style={{ padding: "22px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: PINK }}>TODAY · {TODAY_EVENTS.length} EVENTS</p>
          <Link href="/member/happenings" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.28)" }}>VIEW ALL →</span>
          </Link>
        </div>

        <div style={{ ...CARD, overflow: "hidden" }}>
          {TODAY_EVENTS.map((ev, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < TODAY_EVENTS.length - 1 ? "1px solid rgba(255,0,144,0.08)" : "none" }}>
              <div style={{ width: 44, flexShrink: 0, textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.32)", lineHeight: 1 }}>{ev.time.split(" ")[0]}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(0,0,0,0.2)" }}>{ev.time.split(" ")[1]}</p>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: PINK, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "#000", lineHeight: 1.2 }}>{ev.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.35)", marginTop: 1 }}>{ev.loc}</p>
              </div>
              {ev.label && (
                <div style={{ flexShrink: 0, background: ev.label === "NEXT" ? "rgba(0,0,0,0.06)" : PINK, borderRadius: 999, padding: "3px 9px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.1em", color: ev.label === "NEXT" ? "rgba(0,0,0,0.38)" : "white" }}>{ev.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Tonight — hot pink card */}
        <Link href="/member/happenings" style={{ textDecoration: "none" }}>
          <div style={{
            marginTop: 10, borderRadius: 20, overflow: "hidden",
            background: `linear-gradient(145deg, ${PINK} 0%, #FF5BAD 100%)`,
            padding: "20px 20px", position: "relative",
            boxShadow: ["0 2px 0 rgba(160,0,60,0.85)", "0 8px 28px rgba(255,0,128,0.35)"].join(", "),
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, transparent 100%)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(255,255,255,0.75)", position: "relative" }}>7:30 PM · WEST VILLAGE</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, marginTop: 4, position: "relative" }}>Girls Dinner<br /><span style={{ color: "rgba(255,255,255,0.8)" }}>Carbone</span></p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.55)", marginTop: 6, position: "relative" }}>4 seats · Individual Pay</p>
            <div style={{ marginTop: 14, display: "inline-flex", background: "white", borderRadius: 999, padding: "9px 20px", position: "relative", boxShadow: "0 2px 0 rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 900, color: PINK, letterSpacing: "0.07em" }}>I&apos;M IN →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ══ YOUR CLUBS ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: PINK }}>YOUR CLUBS</p>
            {!loading && myClubs.length > 0 && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.28)", marginTop: 1 }}>{myClubs.length} joined</p>}
          </div>
          <Link href="/member/clubs" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.28)" }}>Browse all →</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: 14, padding: "4px 20px 12px" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,0,144,0.08)", flexShrink: 0 }} />)}
          </div>
        ) : myClubs.length === 0 ? (
          <div style={{ margin: "0 16px", ...CARD, padding: "28px 22px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontStyle: "italic", color: "rgba(0,0,0,0.22)", marginBottom: 8 }}>No clubs yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.35)", lineHeight: 1.5, marginBottom: 20 }}>Find your people —<br />there&apos;s a club for every side of you.</p>
            <Link href="/member/clubs" style={{ display: "inline-block", background: PINK, color: "white", padding: "12px 30px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-jost)", boxShadow: `0 4px 18px ${PINK}44` }}>Browse Clubs →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", padding: "4px 20px 16px", gap: 14, scrollbarWidth: "none" as const }}>
            {myClubs.map(club => <ClubCover key={club.id} club={club} />)}
          </div>
        )}
      </div>

      {/* ══ NEAR YOU ═════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: PINK }}>NEAR YOU</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.28)", marginTop: 1 }}>SoHo, NYC</p>
          </div>
          <Link href="/member/discover" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.28)" }}>EXPLORE MAP →</span>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const }}>
          {[
            { name: "SoHo",         clubs: 12 },
            { name: "West Village", clubs: 18 },
            { name: "Williamsburg", clubs: 16 },
            { name: "Brooklyn Hts", clubs: 11 },
            { name: "Harlem",       clubs: 9  },
          ].map((n, i) => (
            <Link key={i} href="/member/discover" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 96, ...CARD, overflow: "hidden" }}>
                <div style={{ height: 52, background: `linear-gradient(135deg, ${PINK} 0%, #FF5BAD 100%)`, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
                </div>
                <div style={{ padding: "7px 9px 9px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "#000" }}>{n.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.32)", marginTop: 1 }}>{n.clubs} clubs</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ QUOTE CARD ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: "14px 16px 36px" }}>
        <Link href="/member/discover" style={{ textDecoration: "none" }}>
          <div style={{
            ...CARD, padding: "26px 22px", position: "relative", overflow: "hidden",
            borderLeft: `4px solid ${PINK}`,
          }}>
            <div style={{ position: "absolute", top: -20, right: -10, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,0,144,0.06)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 20, color: "#000", lineHeight: 1.5, position: "relative" }}>
              &ldquo;Collect moments,<br />not things.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, marginTop: 10, letterSpacing: "0.12em", position: "relative" }}>— BLOOMBAY</p>
            <div style={{ marginTop: 16, display: "inline-flex", background: PINK, borderRadius: 999, padding: "9px 18px", position: "relative", boxShadow: `0 2px 0 rgba(160,0,60,0.8), 0 5px 14px ${PINK}44` }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: "white", letterSpacing: "0.07em" }}>DISCOVER PLACES →</span>
            </div>
          </div>
        </Link>
      </div>

      {showYande && <YandeSheet onClose={() => setShowYande(false)} />}
    </div>
  );
}
