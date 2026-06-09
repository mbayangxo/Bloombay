"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getTimeOfDay, getGreeting, type TimeOfDay } from "./time-wrapper";

const PINK = "#FF1F7D";

type Club = {
  id: string;
  name: string;
  color: string | null;
  cover_url: string | null;
  member_count: number;
};

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const FIRST_MONTH_TASKS = [
  { week: 1, task: "Join 3 clubs",             href: "/member/clubs"      },
  { week: 2, task: "Attend 1 gathering",        href: "/member/discover"   },
  { week: 3, task: "Introduce yourself",        href: "/member/match"      },
  { week: 4, task: "Save 5 places in The City", href: "/member/city"       },
];

// PNG polaroid frames — cycled across the user's clubs
const CLUB_FRAMES = [
  "E67AE5DD-286B-4E45-BA2E-080681D63958.PNG",
  "6D79FE52-AEB9-4F4C-AD10-B954C218834D.PNG",
  "D25A1545-F360-4978-93BB-9C19D97BACDA.PNG",
  "E894643F-2A53-4ABE-A8EF-19792A45CC5E.PNG",
  "868945DF-0D9E-40F6-A76F-96A187EBC961.PNG",
];

// ─── Club Polaroid ────────────────────────────────────────────────────────────
// The PNG is a frame with a transparent window. The club's real cover photo
// (or a color-gradient crest) sits behind that window via z-index layering.

function ClubPolaroid({ club, frameIndex = 0, rotate = 0 }: { club: Club; frameIndex?: number; rotate?: number }) {
  const abbr = club.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const bg = club.color || PINK;
  const frame = CLUB_FRAMES[frameIndex % CLUB_FRAMES.length];

  return (
    <Link href="/member/clubs" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{ position: "relative", width: 88, transform: `rotate(${rotate}deg)` }}>
        {/* Real photo slot — sits behind the transparent window of the PNG frame */}
        <div style={{ position: "absolute", top: "9%", left: "9%", width: "82%", height: "61%", zIndex: 1, overflow: "hidden" }}>
          {club.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={club.cover_url} alt={club.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(145deg, ${bg} 0%, ${bg}bb 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                {abbr}
              </p>
            </div>
          )}
        </div>
        {/* PNG frame overlays on top — transparent window reveals the photo behind */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/homepage-objects/${frame}`} alt="" style={{ width: "100%", display: "block", position: "relative", zIndex: 2 }} />
        <p style={{
          fontSize: "7px", fontWeight: 700, color: "#555",
          marginTop: 3, textAlign: "center", letterSpacing: "0.03em",
          overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
        }}>{club.name}</p>
      </div>
    </Link>
  );
}

// ─── Yande Sheet ──────────────────────────────────────────────────────────────

function YandeSheet({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10"
        style={{ background: "#FDF4EC", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div className="flex justify-center pt-3 pb-3">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div className="px-5 flex items-center gap-2 mb-3">
          <span style={{ fontSize: "22px" }}>🌸</span>
          <div>
            <p className="font-bold tracking-[0.22em] uppercase" style={{ fontSize: "9px", color: PINK }}>YANDE</p>
            <p className="font-black italic leading-tight"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "#111" }}>
              Find your tribe.
            </p>
          </div>
        </div>
        <p className="px-5 italic mb-6 leading-relaxed"
          style={{ fontFamily: "var(--font-instrument)", fontSize: "14px", color: "#888" }}>
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const [tod, setTod] = useState<TimeOfDay>("afternoon");
  const [greeting, setGreeting] = useState("Good afternoon");
  const [showYande, setShowYande] = useState(false);

  const [firstName, setFirstName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const t = getTimeOfDay(new Date().getHours());
    setTod(t);
    setGreeting(getGreeting(t));
  }, []);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingProfile(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, avatar_url, created_at")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFirstName(profile.first_name || "");
        setAvatarUrl(profile.avatar_url || null);
        setJoinedAt(profile.created_at || null);
      }

      const { data: userClubs } = await supabase
        .from("user_clubs")
        .select("club:clubs(id, name, color, cover_url, member_count)")
        .eq("user_id", user.id)
        .limit(8);

      if (userClubs) {
        setMyClubs(userClubs.map((uc: Record<string, unknown>) => uc.club as Club).filter(Boolean));
      }

      setLoadingProfile(false);
    }
    loadData();
  }, []);

  const today = new Date();
  const todayDow = today.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    return { abbr: WEEK_DAYS[i], date: d.getDate(), isToday: i === todayDow };
  });

  const greetingTime =
    tod === "morning" ? "MORNING" : tod === "evening" || tod === "night" ? "EVENING" : "AFTERNOON";

  const weeksIn = joinedAt
    ? Math.min(4, Math.floor((Date.now() - new Date(joinedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1)
    : 1;
  const currentTask = FIRST_MONTH_TASKS[Math.min(weeksIn - 1, 3)];

  const displayName = firstName || "there";
  const initial = firstName ? firstName[0].toUpperCase() : "?";

  return (
    <div style={{ background: "#F6F1EB", minHeight: "100vh", paddingBottom: "104px", overflowX: "hidden" }}>

      {/* ═══ HEADER ═══ */}
      <div style={{ position: "relative", background: "#F6F1EB", paddingTop: 44, paddingBottom: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/homepage-objects/EBACE242-70AB-4C83-B40D-485A01CBB332.PNG" alt=""
          style={{ position: "absolute", top: 0, left: -6, width: "108%", pointerEvents: "none", zIndex: 0 }} />

        {/* Nav bar */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 20, paddingRight: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: 22, color: PINK }}>BB*</span>
            <div style={{ position: "relative" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/member/discover" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: 14 }}>🌸</span>
                <span style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>DISCOVER</span>
              </div>
            </Link>
            <Link href="/member/apt" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: 14 }}>🏛</span>
                <span style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>LOBBY</span>
              </div>
            </Link>
            <button onClick={() => setShowYande(true)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: 14 }}>🌷</span>
                <span style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>YANDE</span>
              </div>
            </button>
          </div>
        </div>

        {/* Greeting + membership card */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-start", paddingLeft: 20, paddingRight: 16 }}>
          <div style={{ flex: 1, paddingRight: 12, paddingBottom: 10 }}>
            <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 3 }}>
              GOOD {greetingTime}
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 27, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.05 }}>
              {greeting},
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 29, fontWeight: 900, fontStyle: "italic", color: PINK, lineHeight: 0.95 }}>
              {loadingProfile ? "..." : `${displayName}. ♡`}
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#aaa", marginTop: 5 }}>you belong here</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#bbb", marginTop: 2 }}>soft life, strong mind ♡</p>
          </div>

          {/* Portrait card — PNG polaroid frame with user's real avatar behind the window */}
          <div style={{ width: 118, flexShrink: 0, marginTop: -8 }}>
            <Link href="/member/you" style={{ textDecoration: "none" }}>
              <div style={{ position: "relative", width: 118 }}>
                {/* User's avatar sits behind the transparent window of the polaroid frame */}
                <div style={{ position: "absolute", top: "11%", left: "10%", width: "80%", height: "56%", zIndex: 1, overflow: "hidden" }}>
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, #FF1F7D 0%, #7F0030 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 40, color: "rgba(255,255,255,0.6)" }}>
                        {initial}
                      </p>
                    </div>
                  )}
                </div>
                {/* PNG polaroid frame overlaid on top */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/homepage-objects/22BF0D14-A676-4B45-A133-EE13D17845F8.PNG" alt=""
                  style={{ width: "100%", display: "block", position: "relative", zIndex: 2 }} />
                {/* Name in the bottom caption area of the polaroid */}
                <div style={{ position: "absolute", bottom: "10%", left: 0, right: 0, zIndex: 3, textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 800, fontSize: 13, color: "#1C1B1C" }}>
                    {loadingProfile ? "" : (firstName || "")}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ CALENDAR STRIP ═══ */}
      <div style={{ position: "relative", marginBottom: 2 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(255,31,125,0.07)",
          borderTop: "1px solid rgba(255,31,125,0.12)", borderBottom: "1px solid rgba(255,31,125,0.12)",
          padding: "6px 16px", paddingRight: 74,
        }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <span style={{ fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.06em", color: d.isToday ? PINK : "#ccc" }}>{d.abbr}</span>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: d.isToday ? PINK : "transparent",
                boxShadow: d.isToday ? "0 2px 8px rgba(255,31,125,0.35)" : "none",
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: d.isToday ? "white" : "#666" }}>{d.date}</span>
              </div>
            </div>
          ))}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/homepage-objects/FE40EAB6-EBC5-474A-9170-B1893920E0B1.PNG" alt=""
          style={{ position: "absolute", right: 6, top: -8, width: 68, transform: "rotate(3deg)", zIndex: 3, pointerEvents: "none" }} />
      </div>

      {/* ═══ THREE CARDS ═══ */}
      <div style={{ display: "flex", alignItems: "stretch", padding: "4px 14px 12px", gap: 8 }}>

        <Link href={currentTask.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{
            position: "relative", overflow: "hidden", borderRadius: 18,
            background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            transform: "rotate(-0.5deg)", padding: "14px 11px", minHeight: 152,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%) rotate(-2deg)", width: 38, height: 13, background: "rgba(255,218,100,0.55)", borderRadius: 2 }} />
            <div>
              <p style={{ fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.12em", color: PINK, marginBottom: 6 }}>MY FIRST MONTH</p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 2, marginBottom: 8 }}>
                <span style={{ fontSize: 10, lineHeight: 1.3 }}>⭐</span>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.3 }}>
                  Week {weeksIn}:<br/>{currentTask.task}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 999, background: "rgba(255,31,125,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${(weeksIn / 4) * 100}%`, height: "100%", background: PINK, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 7, fontWeight: 700, color: "#bbb" }}>{weeksIn}/4</span>
            </div>
          </div>
        </Link>

        <Link href="/member/discover" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{
            position: "relative", overflow: "hidden", borderRadius: 18,
            background: "#FEF0F5", boxShadow: "0 4px 16px rgba(255,31,125,0.08)",
            transform: "rotate(0.4deg)", padding: "14px 11px", minHeight: 152,
          }}>
            <div style={{ position: "absolute", top: -5, right: 12, transform: "rotate(3deg)", width: 38, height: 13, background: "rgba(255,218,100,0.55)", borderRadius: 2 }} />
            <p style={{ fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.12em", color: PINK, marginBottom: 6 }}>DISCOVER</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.3 }}>
              Happenings<br/>&amp; The City
            </p>
            <p style={{ fontSize: 9, color: "#bbb", marginTop: 5 }}>Find your next →</p>
          </div>
        </Link>

        <Link href="/member/city" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{
            position: "relative", overflow: "hidden", borderRadius: 18,
            background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            transform: "rotate(-0.3deg)", padding: "14px 11px", minHeight: 152,
          }}>
            <p style={{ fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.12em", color: PINK, marginBottom: 6 }}>THE CITY</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 800, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.3 }}>
              NYC<br/>Spots
            </p>
            <p style={{ fontSize: 9, color: "#aaa", marginTop: 5 }}>Explore →</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.1)", position: "absolute", bottom: 10, right: 10 }}>explore →</p>
          </div>
        </Link>

      </div>

      {/* ═══ YOUR CLUBS ═══ */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 10px" }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>YOUR CLUBS</p>
          <Link href="/member/clubs" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#bbb" }}>Browse all →</span>
          </Link>
        </div>

        {loadingProfile ? (
          <div style={{ display: "flex", gap: 12, padding: "4px 16px 8px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: 88, height: 120, background: "rgba(0,0,0,0.06)", borderRadius: 4, flexShrink: 0 }} />
            ))}
          </div>
        ) : myClubs.length === 0 ? (
          <div style={{ margin: "0 16px", background: "white", borderRadius: 20, padding: "28px 20px", textAlign: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontStyle: "italic", color: "#888", marginBottom: 14 }}>
              You haven&apos;t joined any clubs yet.
            </p>
            <p style={{ fontSize: 12, color: "#bbb", marginBottom: 16 }}>
              Find your people — there&apos;s a club for every side of you.
            </p>
            <Link href="/member/clubs"
              style={{ display: "inline-block", background: PINK, color: "white", padding: "11px 24px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", boxShadow: `0 4px 16px ${PINK}44` }}>
              Browse Clubs →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", padding: "4px 16px 12px", gap: 12, scrollbarWidth: "none" as const }}>
            {myClubs.map((club, i) => (
              <ClubPolaroid key={club.id} club={club} frameIndex={i} rotate={i % 2 === 0 ? -1.5 : 1} />
            ))}
          </div>
        )}
      </div>

      {/* ═══ DISCOVER CTA ═══ */}
      <div style={{ margin: "0 14px 20px" }}>
        <Link href="/member/discover" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(145deg, #1C1B1C 0%, #2D0015 100%)",
            borderRadius: 20, padding: "20px 20px", overflow: "hidden", position: "relative",
            boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,31,125,0.25) 0%, transparent 60%)", pointerEvents: "none" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/homepage-objects/029131C9-6891-4053-A980-F8F436DBA8AB.PNG" alt=""
              style={{ position: "absolute", top: -10, right: 18, width: 40, transform: "rotate(20deg)", pointerEvents: "none", opacity: 0.7 }} />
            <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.8)", marginBottom: 6, position: "relative" }}>HAPPENING NOW</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#F1DFDD", lineHeight: 1.1, position: "relative" }}>
              Something&apos;s<br/>always on.
            </p>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, fontStyle: "italic", position: "relative" }}>
              Find happenings and city spots for you.
            </p>
            <div style={{
              marginTop: 16, display: "inline-flex", alignItems: "center",
              background: PINK, borderRadius: 999, padding: "9px 18px",
              boxShadow: `0 4px 16px ${PINK}55`, position: "relative",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>DISCOVER →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ═══ NEAR YOU ═══ */}
      <div style={{ margin: "0 14px 20px" }}>
        <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 3 }}>NEAR YOU</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888", marginBottom: 8 }}>New York City</p>
        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <div style={{ borderRadius: 14, background: "linear-gradient(145deg, #FEE8F0 0%, #FDF0F5 100%)", padding: "12px 10px 10px", boxShadow: "0 4px 14px rgba(255,31,125,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
              {[
                { name: "SoHo",         color: "#D4B5A0" },
                { name: "West Village", color: "#C4A8A0" },
                { name: "Williamsburg", color: "#C0B0A8" },
              ].map((n, i) => (
                <div key={i} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ width: "100%", height: 36, borderRadius: 8, background: n.color, marginBottom: 5, opacity: 0.55 }} />
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9, fontWeight: 700, color: "#555", lineHeight: 1.2 }}>{n.name}</p>
                </div>
              ))}
            </div>
          </div>
        </Link>
        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <div style={{ marginTop: 8, background: PINK, borderRadius: 10, padding: "7px 10px", textAlign: "center" }}>
            <p style={{ fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.1em", color: "white" }}>EXPLORE THE CITY →</p>
          </div>
        </Link>
      </div>

      {/* ═══ INSPIRATION ═══ */}
      <div style={{ margin: "0 14px 32px" }}>
        <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 8 }}>INSPIRATION FOR YOU</p>
        <Link href="/member/happenings" style={{ textDecoration: "none" }}>
          <div style={{
            borderRadius: 18, background: "linear-gradient(145deg, #1C1B1C 0%, #2D0015 100%)",
            padding: "22px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            position: "relative", overflow: "hidden", transform: "rotate(0.5deg)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 15%, rgba(255,31,125,0.22) 0%, transparent 65%)", pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, fontStyle: "italic", color: "#F1DFDD", lineHeight: 1.45, position: "relative" }}>
              &ldquo;Collect moments,<br/>not things.&rdquo;
            </p>
            <p style={{ fontSize: "7px", fontWeight: 600, color: "rgba(255,255,255,0.28)", marginTop: 10, letterSpacing: "0.1em", position: "relative" }}>
              — bloombay
            </p>
          </div>
        </Link>
        <Link href="/member/happenings" style={{ textDecoration: "none" }}>
          <div style={{ marginTop: 8, background: "white", border: "1px solid rgba(255,31,125,0.18)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <p style={{ fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.1em", color: PINK }}>DISCOVER PLACES →</p>
          </div>
        </Link>
      </div>

      {showYande && <YandeSheet onClose={() => setShowYande(false)} />}

    </div>
  );
}
