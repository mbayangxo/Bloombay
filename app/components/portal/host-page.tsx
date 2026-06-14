"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getHostReputation, getMyHostedGatherings, getGatheringAttendeesForHost,
  type HostReputation, type HostedGathering, type AttendeePreview,
} from "@/lib/actions/happenings";
import {
  createTradition, getMyTraditions, linkGatheringToTradition,
  type Tradition,
} from "@/lib/actions/traditions";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
const BG   = "#FBF6F0";

type Tab = "host" | "dashboard" | "traditions";

const HOST_KINDS = [
  { kind: "dinner",    label: "Dinner",     emoji: "🍷", whisper: "Six girls, one table" },
  { kind: "brunch",    label: "Brunch",     emoji: "🥂", whisper: "Sunday, obviously" },
  { kind: "coffee",    label: "Coffee",     emoji: "☕", whisper: "An hour, no pressure" },
  { kind: "walk",      label: "Walk",       emoji: "🌿", whisper: "Park loop & talk" },
  { kind: "museum",    label: "Museum",     emoji: "🏛️", whisper: "Then froyo after" },
  { kind: "picnic",    label: "Picnic",     emoji: "🧺", whisper: "Blanket, snacks, sun" },
  { kind: "open-seat", label: "Open Seat",  emoji: "🪑", whisper: "Already going? Save a seat" },
  { kind: "party",     label: "Party",      emoji: "🎉", whisper: "Go big" },
];

const FREQ_OPTIONS = [
  { value: "weekly",    label: "Every week" },
  { value: "biweekly",  label: "Every two weeks" },
  { value: "monthly",   label: "Monthly" },
  { value: "seasonal",  label: "Seasonal" },
  { value: "irregular", label: "Recurring (flexible)" },
];

const TRADITION_COLORS = ["#FF1F7D", "#7B2FF7", "#2563EB", "#059669", "#D97706", "#DC2626"];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Initials({ name, size = 36, color = PINK }: { name: string | null; size?: number; color?: string }) {
  const letters = (name ?? "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: size * 0.36, color: "white" }}>{letters}</span>
    </div>
  );
}

export function HostPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [tab, setTab] = useState<Tab>("host");
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  // Dashboard
  const [stats, setStats]       = useState<HostReputation | null>(null);
  const [hosted, setHosted]     = useState<{ upcoming: HostedGathering[]; past: HostedGathering[] }>({ upcoming: [], past: [] });
  const [dashLoading, setDashLoading] = useState(false);

  // Attendee peek
  const [peekId, setPeekId]         = useState<string | null>(null);
  const [peekName, setPeekName]     = useState("");
  const [peekList, setPeekList]     = useState<AttendeePreview[]>([]);
  const [peekLoading, setPeekLoading] = useState(false);

  // Traditions
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [tradLoading, setTradLoading] = useState(false);

  // Tradition creation sheet
  const [showCreate, setShowCreate] = useState(false);
  const [tradName, setTradName]     = useState("");
  const [tradFreq, setTradFreq]     = useState("monthly");
  const [tradDesc, setTradDesc]     = useState("");
  const [tradColor, setTradColor]   = useState(PINK);
  const [tradHood, setTradHood]     = useState("");
  const [tradSaving, setTradSaving] = useState(false);
  const [tradError, setTradError]   = useState("");

  useEffect(() => {
    if (tab === "dashboard" && !stats) {
      setDashLoading(true);
      Promise.all([
        getHostReputation("me" as string),   // will be replaced below with actual user
        getMyHostedGatherings(),
      ]).then(([rep, h]) => {
        setStats(rep);
        setHosted(h);
        setDashLoading(false);
      });
    }
    if (tab === "traditions" && traditions.length === 0) {
      setTradLoading(true);
      getMyTraditions().then(t => { setTraditions(t); setTradLoading(false); });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Re-fetch reputation using the gatherings-based approach (host_id = current user)
  useEffect(() => {
    if (tab === "dashboard") {
      setDashLoading(true);
      Promise.all([getMyHostedGatherings(), getHostReputation("" as string)])
        .then(([h, _rep]) => {
          setHosted(h);
          // Derive live stats from hosted list
          const totalAttendees = [...h.upcoming, ...h.past].reduce((s, g) => s + g.attending_count, 0);
          setStats(prev => prev ? { ...prev, totalAttendees, eventsHosted: h.upcoming.length + h.past.length } : prev);
          setDashLoading(false);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function openPeek(g: HostedGathering) {
    setPeekId(g.id);
    setPeekName(g.title);
    setPeekList([]);
    setPeekLoading(true);
    const list = await getGatheringAttendeesForHost(g.id);
    setPeekList(list);
    setPeekLoading(false);
  }

  async function submitTradition() {
    if (!tradName.trim()) { setTradError("Give your tradition a name."); return; }
    setTradSaving(true);
    setTradError("");
    startTransition(async () => {
      const res = await createTradition({
        name: tradName.trim(),
        description: tradDesc.trim() || undefined,
        frequency: tradFreq,
        neighborhood: tradHood.trim() || undefined,
        primary_color: tradColor,
      });
      if (res.ok && res.tradition) {
        setTraditions(prev => [res.tradition!, ...prev]);
        setShowCreate(false);
        setTradName(""); setTradDesc(""); setTradHood(""); setTradColor(PINK); setTradFreq("monthly");
      } else {
        setTradError(res.error ?? "Something went wrong.");
      }
      setTradSaving(false);
    });
  }

  async function convertToTradition(g: HostedGathering) {
    if (traditions.length > 0) {
      // If they already have traditions, let them pick — for now just open create
      setShowCreate(true);
      setTradName(g.title);
    } else {
      setShowCreate(true);
      setTradName(g.title);
    }
  }

  function goCustom() {
    const t = otherText.trim();
    router.push(t ? `/member/happenings/create?title=${encodeURIComponent(t)}` : "/member/happenings/create");
  }

  const upcomingPastTitles = [...hosted.past.map(g => g.title)];
  const repeatCandidates = hosted.past.filter(g =>
    !g.tradition_id && upcomingPastTitles.filter(t => t === g.title).length > 1
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, paddingBottom: 120 }}>

      {/* ── Header ── */}
      <div style={{ padding: "62px 22px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.26em", color: "#D4849A", marginBottom: 6 }}>BRING WOMEN TOGETHER</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 38, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1, margin: 0 }}>Host something.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#C07080", marginTop: 6 }}>No club required. Just an idea and a date.</p>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: "flex", gap: 0, margin: "20px 22px 0", background: "rgba(0,0,0,0.05)", borderRadius: 12, padding: 4 }}>
        {(["host", "dashboard", "traditions"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 0", border: "none", borderRadius: 9, cursor: "pointer",
            fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em",
            background: tab === t ? "white" : "transparent",
            color: tab === t ? PINK : "#999",
            boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}>
            {t === "host" ? "HOST" : t === "dashboard" ? "DASHBOARD" : "TRADITIONS"}
          </button>
        ))}
      </div>

      {/* ══════════════ HOST TAB ══════════════ */}
      {tab === "host" && (
        <div style={{ padding: "20px 18px 0" }}>

          {/* Start a Tradition — highlight card */}
          <button onClick={() => { setTab("traditions"); setShowCreate(true); }} style={{
            width: "100%", marginBottom: 16, background: `linear-gradient(145deg, #1A0830, #3D1060)`,
            border: `1.5px solid ${PINK}44`, borderRadius: 20, padding: "18px",
            cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}30 0%, transparent 70%)`, pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.3em", color: `${PINK}CC`, marginBottom: 8 }}>✦ BUILD SOMETHING THAT LASTS</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, margin: 0 }}>Start a Tradition.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>First Friday Dinner. Monthly Museum Girls. Sunday Walk Club.</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: PINK, borderRadius: 999, padding: "6px 14px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: "white" }}>CREATE TRADITION →</span>
            </div>
          </button>

          {/* Event kind grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {HOST_KINDS.map(k => (
              <Link key={k.kind} href={`/member/happenings/create?kind=${k.kind}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "white", borderRadius: 18, padding: "18px 16px", border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 3px 14px rgba(200,80,120,0.07)" }}>
                  <span style={{ fontSize: 26, display: "block", marginBottom: 8 }}>{k.emoji}</span>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 900, fontStyle: "italic", color: DARK }}>{k.label}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#B08A9A", marginTop: 2 }}>{k.whisper}</p>
                </div>
              </Link>
            ))}

            <div style={{ gridColumn: "1 / -1" }}>
              {!showOther ? (
                <button onClick={() => setShowOther(true)} style={{ width: "100%", background: "white", borderRadius: 18, padding: "16px", border: "1.5px dashed rgba(255,31,125,0.35)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>✨</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: DARK }}>Something else</p>
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#B08A9A", marginTop: 1 }}>Pottery class. Gallery crawl. Anything.</p>
                  </div>
                </button>
              ) : (
                <div style={{ background: "white", borderRadius: 18, padding: "16px", border: `1.5px solid ${PINK}55` }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "#D4849A", marginBottom: 8 }}>WHAT ARE YOU HOSTING?</p>
                  <input autoFocus value={otherText} onChange={e => setOtherText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") goCustom(); }}
                    placeholder="Pottery night, gallery crawl, beach day…"
                    style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: DARK, marginBottom: 12 }} />
                  <button onClick={goCustom} style={{ width: "100%", background: PINK, color: "white", border: "none", borderRadius: 999, padding: "12px 0", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em" }}>
                    KEEP GOING →
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 0 14px" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#C0A0B0" }}>or</p>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
          </div>

          <Link href="/member/clubs/create" style={{ textDecoration: "none" }}>
            <div style={{ borderRadius: 20, background: `linear-gradient(145deg, ${DARK} 0%, #2E2230 100%)`, boxShadow: "0 8px 28px rgba(28,27,28,0.3)", padding: "22px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}33 0%, transparent 70%)`, pointerEvents: "none" }} />
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.3em", color: `${PINK}BB`, marginBottom: 8 }}>FOR SOMETHING THAT LASTS</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.15 }}>Start a club.</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>A crew, traditions, a name. The whole thing.</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginTop: 14 }}>BUILD IT →</p>
            </div>
          </Link>
        </div>
      )}

      {/* ══════════════ DASHBOARD TAB ══════════════ */}
      {tab === "dashboard" && (
        <div style={{ padding: "20px 18px 0" }}>
          {dashLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Events hosted",  value: (hosted.upcoming.length + hosted.past.length).toString(), icon: "🎉" },
                  { label: "Women hosted",   value: hosted.past.reduce((s, g) => s + g.attending_count, 0).toString(), icon: "🌸" },
                  { label: "Coming up",      value: hosted.upcoming.reduce((s, g) => s + g.attending_count, 0).toString(), icon: "📅" },
                  { label: "Repeat guests",  value: stats?.repeatAttendees?.toString() ?? "—", icon: "💕" },
                ].map(s => (
                  <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <p style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</p>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 28, color: PINK, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb", letterSpacing: "0.1em", marginTop: 4 }}>{s.label.toUpperCase()}</p>
                  </div>
                ))}
              </div>

              {/* Upcoming events */}
              {hosted.upcoming.length > 0 && (
                <>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 10 }}>COMING UP</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {hosted.upcoming.map(g => (
                      <div key={g.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderLeft: `3px solid ${PINK}` }}>
                        <div style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK }}>{g.title}</p>
                              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb", marginTop: 3 }}>
                                {fmtDate(g.starts_at)}{g.venue ? ` · ${g.venue}` : ""}
                              </p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <p style={{ fontFamily: "var(--font-jost)", fontSize: 18, fontWeight: 900, color: PINK, lineHeight: 1 }}>{g.attending_count}</p>
                              <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "#ccc", letterSpacing: "0.08em" }}>GOING</p>
                            </div>
                          </div>
                          <button onClick={() => openPeek(g)} style={{
                            marginTop: 10, width: "100%", background: `${PINK}12`, border: "none", borderRadius: 8, padding: "8px 0",
                            fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: PINK, cursor: "pointer", letterSpacing: "0.1em",
                          }}>
                            SEE WHO&apos;S COMING →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Convert to tradition prompt */}
              {repeatCandidates.length > 0 && (
                <div style={{ background: `linear-gradient(145deg, #1A0830, #3D1060)`, borderRadius: 18, padding: "16px", marginBottom: 20, border: `1px solid ${PINK}33` }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.3em", color: `${PINK}CC`, marginBottom: 8 }}>✦ YOU&apos;VE RUN THIS MORE THAN ONCE</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: "white", lineHeight: 1.2, margin: 0 }}>
                    &ldquo;{repeatCandidates[0].title}&rdquo; is becoming a tradition.
                  </p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>Make it official. Women will follow it and get notified every time you host.</p>
                  <button onClick={() => convertToTradition(repeatCandidates[0])} style={{
                    marginTop: 12, background: PINK, border: "none", borderRadius: 999, padding: "8px 18px",
                    fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: "white", cursor: "pointer",
                  }}>
                    MAKE IT A TRADITION →
                  </button>
                </div>
              )}

              {/* Past events */}
              {hosted.past.length > 0 && (
                <>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 10 }}>PAST EVENTS</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {hosted.past.map(g => (
                      <div key={g.id} style={{ background: "white", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", opacity: 0.85 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: DARK, fontWeight: 700 }}>{g.title}</p>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#ccc", marginTop: 2 }}>{fmtShort(g.starts_at)}{g.venue ? ` · ${g.venue}` : ""}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 900, color: "#888" }}>{g.attending_count}</p>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#ccc", letterSpacing: "0.08em" }}>ATTENDED</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {hosted.upcoming.length === 0 && hosted.past.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ fontSize: 36, marginBottom: 12 }}>🌸</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: PINK }}>No events yet.</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#ccc", marginTop: 6 }}>Host your first gathering to see your dashboard.</p>
                  <button onClick={() => setTab("host")} style={{ marginTop: 16, background: PINK, border: "none", borderRadius: 999, padding: "10px 22px", color: "white", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, cursor: "pointer", letterSpacing: "0.1em" }}>
                    HOST SOMETHING →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════ TRADITIONS TAB ══════════════ */}
      {tab === "traditions" && (
        <div style={{ padding: "20px 18px 0" }}>
          {/* Create button */}
          <button onClick={() => setShowCreate(true)} style={{
            width: "100%", marginBottom: 18, background: PINK, border: "none", borderRadius: 18, padding: "16px",
            display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left",
            boxShadow: `0 6px 20px ${PINK}40`,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 13, color: "white", letterSpacing: "0.04em" }}>Create a Tradition</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Something women organize their lives around.</p>
            </div>
          </button>

          {tradLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : traditions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: 36, marginBottom: 10 }}>🌸</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "#ccc" }}>No traditions yet.</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#ccc", marginTop: 6 }}>Start your first — First Friday Dinner, Monthly Museum Girls…</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {traditions.map(t => (
                <Link key={t.id} href={`/member/happenings/traditions/${t.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "white", borderRadius: 18, padding: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, borderLeft: `4px solid ${t.primary_color}` }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${t.primary_color}22, ${t.primary_color}44)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 20 }}>🌸</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb", marginTop: 2 }}>
                        {FREQ_OPTIONS.find(f => f.value === t.frequency)?.label ?? t.frequency}
                        {t.neighborhood ? ` · ${t.neighborhood}` : ""}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 16, color: t.primary_color, lineHeight: 1 }}>{t.follower_count}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#ccc", letterSpacing: "0.08em" }}>FOLLOWING</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ ATTENDEE PEEK SHEET ══════════════ */}
      {peekId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setPeekId(null)} />
          <div style={{ position: "relative", background: "white", borderRadius: "24px 24px 0 0", padding: "24px 22px 40px", maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto 20px" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "#bbb", marginBottom: 4 }}>WHO&apos;S COMING</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: DARK, marginBottom: 20 }}>{peekName}</p>

            {peekLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "30px 0" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            ) : peekList.length === 0 ? (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#ccc", textAlign: "center", padding: "20px 0" }}>No RSVPs yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {peekList.map(a => (
                  <div key={a.user_id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {a.avatar_url
                      ? <img src={a.avatar_url} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                      : <Initials name={a.full_name} size={38} />
                    }
                    <p style={{ fontFamily: "var(--font-jost)", fontWeight: 600, fontSize: 14, color: DARK }}>{a.full_name ?? "Anonymous"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ CREATE TRADITION SHEET ══════════════ */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={() => setShowCreate(false)} />
          <div style={{ position: "relative", background: "#FBF6F0", borderRadius: "24px 24px 0 0", padding: "24px 22px", maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto 20px" }} />

            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.24em", color: PINK, marginBottom: 6 }}>✦ NEW TRADITION</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 26, color: DARK, lineHeight: 1.1, marginBottom: 24 }}>What will it be?</p>

            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "#999", marginBottom: 8 }}>TRADITION NAME</p>
              <input
                value={tradName} onChange={e => setTradName(e.target.value)}
                placeholder="First Friday Dinner Club, Sunday Walk…"
                style={{ width: "100%", background: "white", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "13px 14px", fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, color: DARK, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Frequency */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "#999", marginBottom: 8 }}>HOW OFTEN</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {FREQ_OPTIONS.map(f => (
                  <button key={f.value} onClick={() => setTradFreq(f.value)} style={{
                    border: `1.5px solid ${tradFreq === f.value ? PINK : "rgba(0,0,0,0.1)"}`,
                    borderRadius: 999, padding: "7px 14px", cursor: "pointer",
                    background: tradFreq === f.value ? `${PINK}15` : "white",
                    fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
                    color: tradFreq === f.value ? PINK : "#888",
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "#999", marginBottom: 8 }}>DESCRIPTION <span style={{ fontWeight: 400, letterSpacing: 0 }}>(optional)</span></p>
              <textarea
                value={tradDesc} onChange={e => setTradDesc(e.target.value)} rows={3}
                placeholder="What happens, who it's for, what makes it special…"
                style={{ width: "100%", background: "white", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "13px 14px", fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, outline: "none", resize: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Neighborhood */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "#999", marginBottom: 8 }}>NEIGHBORHOOD <span style={{ fontWeight: 400, letterSpacing: 0 }}>(optional)</span></p>
              <input
                value={tradHood} onChange={e => setTradHood(e.target.value)}
                placeholder="West Village, Brooklyn, Upper East…"
                style={{ width: "100%", background: "white", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "13px 14px", fontFamily: "var(--font-jost)", fontSize: 14, color: DARK, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Color */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "#999", marginBottom: 10 }}>COLOUR</p>
              <div style={{ display: "flex", gap: 10 }}>
                {TRADITION_COLORS.map(c => (
                  <button key={c} onClick={() => setTradColor(c)} style={{
                    width: 36, height: 36, borderRadius: "50%", background: c, border: "none", cursor: "pointer",
                    boxShadow: tradColor === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : "none",
                    transition: "box-shadow 0.15s",
                  }} />
                ))}
              </div>
            </div>

            {tradError && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", marginBottom: 12 }}>{tradError}</p>
            )}

            <button onClick={submitTradition} disabled={tradSaving} style={{
              width: "100%", background: tradSaving ? "#ccc" : PINK, border: "none", borderRadius: 999, padding: "16px 0",
              fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.14em", color: "white",
              cursor: tradSaving ? "not-allowed" : "pointer", boxShadow: tradSaving ? "none" : `0 6px 20px ${PINK}40`,
            }}>
              {tradSaving ? "CREATING…" : "START THE TRADITION →"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
