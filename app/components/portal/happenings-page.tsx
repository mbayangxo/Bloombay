"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { getEvents, getJoinedEventIds, joinEvent, leaveEvent, type Event } from "@/lib/actions/events";

const PINK    = "#FF1F7D";
const DARK    = "#1C1B1C";
const NAV_BG  = "#FAF7F2";
const CREAM   = "#F6F1EB";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const CSS = `
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

type HapTab  = "happenings" | "city";
type Filter  = "All" | "Tonight" | "This Weekend" | "Dinners" | "Parties";

const FILTERS: Filter[] = ["All", "Tonight", "This Weekend", "Dinners", "Parties"];

const AV_COLORS = ["#FF1F7D","#FF69B4","#C084FC","#F97316","#06B6D4","#84CC16","#FBBF24"];

/* ── helpers ──────────────────────────────────────────────────── */

function getBadge(ev: Event): string {
  if (ev.badge) return ev.badge;
  const dt = new Date(ev.starts_at);
  const now = new Date();
  const diffH = (dt.getTime() - now.getTime()) / 36e5;
  if (diffH <= 0 && diffH > -6) return "TONIGHT";
  if (diffH > 0 && diffH <= 10) return "TONIGHT";
  if (diffH > 0 && diffH <= 60) return "THIS WEEKEND";
  return "";
}

function matchesFilter(ev: Event, filter: Filter): boolean {
  if (filter === "All") return true;
  const badge = getBadge(ev);
  if (filter === "Tonight") return badge === "TONIGHT";
  if (filter === "This Weekend") return badge === "THIS WEEKEND" || badge === "TONIGHT";
  if (filter === "Dinners") return ev.event_type === "dinner" || ev.event_type === "brunch";
  if (filter === "Parties") return ev.event_type === "party" || ev.event_type === "rooftop" || ev.event_type === "social";
  return true;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/* ── Skeleton ─────────────────────────────────────────────────── */
function Skeleton({ h, br = 16 }: { h: number; br?: number }) {
  return (
    <div style={{
      height: h, borderRadius: br,
      background: "linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)",
      backgroundSize: "400px 100%",
      animation: "shimmer 1.4s ease-in-out infinite",
    }}/>
  );
}

/* ── Hero card ────────────────────────────────────────────────── */
function HeroCard({ ev, joined, onToggle }: { ev: Event; joined: boolean; onToggle: () => void }) {
  const badge = getBadge(ev);
  const accent = ev.accent_color ?? PINK;

  return (
    <div style={{
      margin: "0 14px 6px",
      borderRadius: 24,
      overflow: "hidden",
      position: "relative",
      minHeight: 260,
      boxShadow: "0 6px 28px rgba(0,0,0,0.18)",
    }}>
      {/* Photo or gradient fallback */}
      {ev.image_url ? (
        <img
          src={ev.image_url}
          alt={ev.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${accent}44 0%, ${accent}aa 100%)`, backgroundColor: CREAM }}/>
      )}

      {/* Gradient overlay for readability */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.82) 100%)" }}/>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "16px", height: "100%", display: "flex", flexDirection: "column", minHeight: 260 }}>
        {/* Top badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {badge && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.45)", borderRadius: 999, padding: "4px 10px", backdropFilter: "blur(4px)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>{badge}</span>
            </div>
          )}
          {ev.is_official && (
            <div style={{ background: PINK, borderRadius: 999, padding: "4px 10px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>✦ OFFICIAL</span>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }}/>

        {/* Bottom content */}
        <div>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, marginBottom: 4, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            {ev.title}
          </p>
          {ev.venue && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: "rgba(255,255,255,0.75)", letterSpacing: "0.05em", marginBottom: 10 }}>
              {ev.venue}{ev.neighborhood ? ` · ${ev.neighborhood}` : ""}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Avatar stack */}
            <div style={{ display: "flex" }}>
              {AV_COLORS.slice(0, 4).map((c, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: "2px solid rgba(255,255,255,0.7)", marginLeft: i > 0 ? -7 : 0 }}/>
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
              {ev.attending_count ?? 0} going
            </span>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "rgba(255,255,255,0.55)", marginLeft: "auto" }}>
              {fmtTime(ev.starts_at)}
            </span>
            <button
              onClick={onToggle}
              style={{
                background: joined ? "rgba(255,255,255,0.2)" : PINK,
                color: "white",
                border: joined ? "1.5px solid rgba(255,255,255,0.5)" : "none",
                borderRadius: 999,
                padding: "9px 18px",
                fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.06em",
                cursor: "pointer",
                backdropFilter: joined ? "blur(4px)" : "none",
                boxShadow: joined ? "none" : `0 4px 14px ${PINK}55`,
              }}
            >
              {joined ? "JOINED ✓" : "JOIN →"}
            </button>
          </div>

          {/* Host note */}
          {ev.host_note && (
            <div style={{ marginTop: 10, display: "inline-block", transform: "rotate(-0.8deg)", background: "rgba(255,255,230,0.92)", padding: "4px 10px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#555" }}>{ev.host_note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Grid card ────────────────────────────────────────────────── */
function GridCard({ ev, idx, joined, onToggle }: { ev: Event; idx: number; joined: boolean; onToggle: () => void }) {
  const isFull = idx % 5 === 0;
  const badge  = getBadge(ev);
  const accent = ev.accent_color ?? PINK;
  const rot    = ["-0.5deg","0.4deg","-0.3deg","0.6deg"][idx % 4];

  return (
    <div style={{
      gridColumn: isFull ? "span 2" : undefined,
      borderRadius: 18, overflow: "hidden",
      position: "relative",
      minHeight: isFull ? 190 : 185,
      boxShadow: "0 3px 16px rgba(0,0,0,0.12)",
      transform: `rotate(${rot})`,
    }}>
      {/* Photo */}
      {ev.image_url ? (
        <img src={ev.image_url} alt={ev.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${accent}33 0%, ${accent}88 100%)`, backgroundColor: "#f8f4f0" }}/>
      )}

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.8) 100%)" }}/>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "10px 12px", height: "100%", display: "flex", flexDirection: "column", minHeight: isFull ? 190 : 185 }}>
        {/* Top */}
        <div style={{ display: "flex", gap: 5 }}>
          {badge && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.4)", borderRadius: 999, padding: "3px 8px", backdropFilter: "blur(4px)" }}>
              {badge === "TONIGHT" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>}
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>{badge}</span>
            </div>
          )}
          {ev.is_official && (
            <div style={{ background: PINK, borderRadius: 999, padding: "3px 7px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, color: "white" }}>✦ BB</span>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}/>

        {/* Bottom */}
        <div>
          <p style={{
            fontFamily: "var(--font-playfair)", fontSize: isFull ? 17 : 14, fontWeight: 900, fontStyle: "italic",
            color: "white", lineHeight: 1.15, marginBottom: 3, textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}>
            {ev.title}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>
            {ev.neighborhood ?? ev.city}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {AV_COLORS.slice(0, 3).map((c, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.6)", marginLeft: i > 0 ? -5 : 0 }}/>
              ))}
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginLeft: 5 }}>
                {ev.attending_count ?? 0}
              </span>
            </div>
            <button
              onClick={onToggle}
              style={{
                background: joined ? "rgba(255,255,255,0.2)" : PINK,
                color: "white", border: "none", borderRadius: 999,
                padding: "5px 12px",
                fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800,
                cursor: "pointer",
                boxShadow: joined ? "none" : `0 2px 8px ${PINK}44`,
              }}
            >
              {joined ? "✓" : "JOIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export function HappeningsPage() {
  const [tab,      setTab]    = useState<HapTab>("happenings");
  const [filter,   setFilter] = useState<Filter>("All");
  const [events,   setEvents] = useState<Event[]>([]);
  const [joined,   setJoined] = useState<Set<string>>(new Set());
  const [loading,  setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [evs, ids] = await Promise.all([getEvents(), getJoinedEventIds()]);
      setEvents(evs);
      setJoined(new Set(ids));
      setLoading(false);
    }
    load();
  }, []);

  function toggleJoin(eventId: string) {
    const isJoined = joined.has(eventId);
    setJoined(prev => {
      const next = new Set(prev);
      isJoined ? next.delete(eventId) : next.add(eventId);
      return next;
    });
    // optimistic update — fire-and-forget
    startTransition(async () => {
      if (isJoined) await leaveEvent(eventId);
      else await joinEvent(eventId);
    });
  }

  const filtered = events.filter(ev => matchesFilter(ev, filter));
  const heroEv   = filtered[0];
  const gridEvs  = filtered.slice(1);

  const tickerItems = events.length > 0
    ? events.map(ev => `${ev.title.toUpperCase()} · ${ev.neighborhood ?? ev.city} · ${fmtTime(ev.starts_at)}`)
    : ["LOADING TONIGHT'S EVENTS ✦ STAY CLOSE ✦ BLOOMBAY NYC"];

  return (
    <div style={{
      backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px",
      minHeight: "100vh", paddingBottom: 100,
    }}>
      <style>{CSS}</style>

      {/* ── Custom top bar ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        background: NAV_BG,
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        height: 54,
        paddingTop: "env(safe-area-inset-top, 0px)",
        display: "flex", alignItems: "center",
      }}>
        {/* Left: BB logo */}
        <div style={{ width: 64, display: "flex", alignItems: "center", paddingLeft: 18 }}>
          <Link href="/member/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "20px", color: PINK, letterSpacing: "-0.02em" }}>BB</span>
            <span style={{ color: PINK, fontSize: "12px", opacity: 0.6 }}>✿</span>
          </Link>
        </div>

        {/* Center: BIG toggle */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", background: "rgba(0,0,0,0.07)", borderRadius: 999, padding: "3px" }}>
            {(["happenings","city"] as HapTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 14px", borderRadius: 999, border: "none",
                background: tab === t ? PINK : "transparent",
                color: tab === t ? "white" : "rgba(0,0,0,0.4)",
                fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800,
                letterSpacing: "0.10em", cursor: "pointer", transition: "all 0.18s",
                boxShadow: tab === t ? `0 2px 10px ${PINK}44` : "none",
              }}>
                {t === "happenings" ? "HAPPENINGS" : "THE CITY"}
              </button>
            ))}
          </div>
        </div>

        {/* Right: mailbox · pin drop · chat · apt */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 16 }}>
          <Link href="/member/messages" aria-label="Mailbox" style={{ position: "relative", display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div style={{ position: "absolute", top: "-4px", right: "-5px", width: 14, height: 14, borderRadius: "50%", background: PINK, border: `1.5px solid ${NAV_BG}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 900, color: "white", lineHeight: 1 }}>3</div>
          </Link>
          <Link href="/member/notifications" aria-label="Notifications" style={{ position: "relative", display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ position: "absolute", top: "-1px", right: "-1px", width: 7, height: 7, borderRadius: "50%", background: PINK, border: `1.5px solid ${NAV_BG}` }}/>
          </Link>
          <Link href="/member/messages" aria-label="Chats" style={{ display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </Link>
          <Link href="/member/lounge" aria-label="My Apt" style={{ display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22V8l9-6 9 6v14"/>
              <path d="M9 22V12h6v10"/>
              <rect x="10" y="14" width="4" height="4" rx="0.5"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ paddingTop: 54 }}>

        {/* ── Filter pills ── */}
        {tab === "happenings" && (
          <div style={{
            display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" as const,
            padding: "10px 16px 8px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(246,241,235,0.96)",
            backdropFilter: "blur(6px)",
          }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flexShrink: 0, padding: "6px 15px", borderRadius: 999,
                border: `1.5px solid ${filter === f ? PINK : "rgba(0,0,0,0.11)"}`,
                background: filter === f ? PINK : "white",
                color: filter === f ? "white" : "rgba(0,0,0,0.5)",
                fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.04em", cursor: "pointer",
                boxShadow: filter === f ? `0 2px 8px ${PINK}33` : "none",
              }}>
                {f}
              </button>
            ))}
          </div>
        )}

        {/* ── HAPPENINGS TAB ── */}
        {tab === "happenings" && (
          <>
            {/* Scrolling ticker */}
            <div style={{ overflow: "hidden", borderBottom: "1px solid rgba(0,0,0,0.06)", background: `${PINK}0a`, padding: "7px 0" }}>
              <div style={{ display: "flex", animation: "ticker 22s linear infinite", width: "max-content" }}>
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", color: PINK, whiteSpace: "nowrap", padding: "0 20px" }}>
                    {item} ✦
                  </span>
                ))}
              </div>
            </div>

            {/* Section label */}
            <div style={{ padding: "12px 18px 8px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.35)" }}>
                {loading ? "LOADING…" : filter === "All" ? `${events.length} EVENTS THIS WEEK` : `${filtered.length} ${filter.toUpperCase()}`}
              </span>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div style={{ padding: "0 14px" }}>
                <Skeleton h={260} br={24}/>
                <div style={{ height: 10 }}/>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Skeleton h={185}/>
                  <Skeleton h={185}/>
                  <Skeleton h={185} />
                  <Skeleton h={185} />
                </div>
              </div>
            )}

            {/* No events */}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#ccc" }}>no events yet ✦</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#bbb", marginTop: 6, letterSpacing: "0.06em" }}>check back soon</p>
              </div>
            )}

            {/* Hero card */}
            {!loading && heroEv && (
              <HeroCard ev={heroEv} joined={joined.has(heroEv.id)} onToggle={() => toggleJoin(heroEv.id)}/>
            )}

            {/* Grid */}
            {!loading && gridEvs.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "6px 14px 0" }}>
                {gridEvs.map((ev, i) => (
                  <GridCard key={ev.id} ev={ev} idx={i} joined={joined.has(ev.id)} onToggle={() => toggleJoin(ev.id)}/>
                ))}
              </div>
            )}

            {!loading && events.length > 0 && (
              <div style={{ textAlign: "center", padding: "22px 0 0" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb" }}>more coming soon ✿</p>
              </div>
            )}
          </>
        )}

        {/* ── CITY TAB ── */}
        {tab === "city" && (
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ backgroundImage: PAPER_TEX, backgroundColor: "#FEFCF7", backgroundSize: "200px 200px", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.09)" }}>
              <div style={{ height: 130, background: "linear-gradient(to bottom, #1a2a3a 0%, #0d1520 100%)", position: "relative", overflow: "hidden" }}>
                <svg viewBox="0 0 400 80" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
                  <rect x="60"  y="20" width="30" height="60" fill="rgba(255,255,255,0.2)"/>
                  <rect x="100" y="8"  width="22" height="72" fill="rgba(255,255,255,0.28)"/>
                  <rect x="160" y="2"  width="16" height="78" fill="rgba(255,255,255,0.35)"/>
                  <rect x="182" y="14" width="28" height="66" fill="rgba(255,255,255,0.22)"/>
                  <rect x="240" y="10" width="20" height="70" fill="rgba(255,255,255,0.28)"/>
                  <rect x="280" y="24" width="36" height="56" fill="rgba(255,255,255,0.18)"/>
                  {[[80,22],[110,10],[170,4],[250,12],[290,26]].map(([x,y],i)=>(
                    <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,220,120,0.6)"/>
                  ))}
                </svg>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)" }}/>
                <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Your City</p>
                </div>
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 6 }}>EATS · GO · SOLO · TRENDING</p>
                <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 14 }}>
                  Restaurants, bars, rooftops — everything worth doing in NYC, curated for you.
                </p>
                <Link href="/member/city" style={{ textDecoration: "none" }}>
                  <div style={{ display: "inline-flex", background: PINK, color: "white", borderRadius: 999, padding: "9px 20px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", boxShadow: `0 4px 14px ${PINK}55` }}>
                    EXPLORE CITY →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
