"use client";

import "@/app/styles/bloom-entrance.css";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEvents, getJoinedEventIds, joinEvent, leaveEvent, type Event } from "@/lib/actions/events";
import {
  joinWaitlist, leaveWaitlist, getWaitlistCounts, getMyWaitlistIds,
  getMyReviewedEventIds, getMyHostedCount,
  toggleGatheringFlower, getGatheringFlowersForUser,
} from "@/lib/actions/happenings";
import { getTraditions, toggleFollowTradition, type Tradition } from "@/lib/actions/traditions";
import { getIntros, flowerIntro, type IntroPost } from "@/lib/actions/introductions";
import { PINK, POSTER_IMGS, CSS, FILTERS, CATEGORY_CHIPS } from "@/lib/happenings/constants";
import type { HapTab, Filter, CategoryFilter } from "@/lib/happenings/types";
import { getPageBg, getNavBg, fmtTime, matchesFilter, matchesCategoryFilter } from "@/lib/happenings/utils";
import { Skeleton } from "./happenings/skeleton";
import { TypeCarousel } from "./happenings/type-carousel";
import { TonightStrip } from "./happenings/tonight-strip";
import { InviteFriendSheet } from "./happenings/invite-friend-sheet";
import { WitnessSheet } from "./happenings/witness-sheet";
import { HostReviewSheet } from "./happenings/host-review-sheet";
import { EventTemplatesStrip } from "./happenings/event-templates-strip";
import { CelebrationInvitationsView } from "./happenings/celebration-invitations-view";
import { StaticCollage } from "./happenings/static-collage";
import { TraditionsStrip } from "./happenings/traditions-strip";
import { CalendarView } from "./happenings/calendar-view";
import { CreateFAB } from "./happenings/create-fab";
import { SceneBuilding, SCENE_CATS } from "./happenings/scene-building";

export function HappeningsPage({ standalone = true }: { standalone?: boolean }) {
  const [tab,            setTab]           = useState<HapTab>("happenings");
  const [filter,         setFilter]        = useState<Filter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [filterOpen,     setFilterOpen]    = useState(false);
  const [searchOpen,     setSearchOpen]    = useState(false);
  const [searchQuery,    setSearchQuery]   = useState("");
  const [gatheringFlowers, setGatheringFlowers] = useState<Record<string, { count: number; gave: boolean }>>({});
  const [traditions,   setTraditions]   = useState<Tradition[]>([]);
  const [events,     setEvents]    = useState<Event[]>([]);
  const [joined,     setJoined]    = useState<Set<string>>(new Set());
  const [loading,    setLoading]   = useState(true);
  const [, startTransition] = useTransition();

  const [waitlistCounts, setWaitlistCounts] = useState<Record<string, number>>({});
  const [myWaitlist,     setMyWaitlist]     = useState<Set<string>>(new Set());
  const [hostedCount, setHostedCount] = useState(0);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const [intros,        setIntros]        = useState<IntroPost[]>([]);
  const [introsLoading, setIntrosLoading] = useState(false);

  const [inviteEv,   setInviteEv]   = useState<Event | null>(null);
  const [witnessEv,  setWitnessEv]  = useState<Event | null>(null);
  const [reviewEv,   setReviewEv]   = useState<Event | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [evs, ids] = await Promise.all([getEvents(), getJoinedEventIds()]);
      setJoined(new Set(ids));

      if (evs.length > 0) {
        setEvents(evs);
        setLoading(false);
      } else {
        try {
          const res = await fetch("/api/member/eventbrite");
          if (res.ok) {
            const data = await res.json() as { events: Array<{
              id: string; title: string; starts_at: string; venue: string | null;
              city: string; neighborhood: string | null; host_name: string | null;
              cover_url: string | null; attending_count: number | null;
              spots_left: number | null; event_type: string; slug: string;
              accent_color: string | null; badge: string | null;
              source: "eventbrite"; href: string;
            }> };
            const mapped = (data.events ?? []).map(ev => ({
              id: ev.id,
              slug: ev.slug,
              title: ev.title,
              description: null,
              venue: ev.venue,
              neighborhood: ev.neighborhood,
              area: null,
              city: ev.city,
              starts_at: ev.starts_at,
              event_type: ev.event_type,
              image_url: ev.cover_url,
              accent_color: ev.accent_color,
              host_id: null,
              host_name: ev.host_name,
              host_note: null,
              capacity: ev.spots_left,
              spots_left: ev.spots_left,
              attending_count: ev.attending_count ?? 0,
              price_cents: 0,
              is_official: false,
              badge: ev.badge,
            })) as Event[];
            setEvents(mapped);
          }
        } catch { /* ignore */ }
        setLoading(false);
      }

      const eventIds = evs.map(e => e.id);
      Promise.all([
        getWaitlistCounts(eventIds),
        getMyWaitlistIds(),
        getMyHostedCount(),
        getMyReviewedEventIds(),
        getGatheringFlowersForUser(eventIds),
        getTraditions(8),
      ]).then(([wCounts, wIds, hCount, rIds, flowers, trads]) => {
        setWaitlistCounts(wCounts);
        setMyWaitlist(new Set(wIds));
        setHostedCount(hCount);
        setReviewedIds(new Set(rIds));
        setGatheringFlowers(flowers as Record<string, { count: number; gave: boolean }>);
        setTraditions(trads as Tradition[]);
      }).catch(() => {});
    }
    load();
  }, []);

  useEffect(() => {
    if (tab !== "intros") return;
    setIntrosLoading(true);
    getIntros().then(data => { setIntros(data); setIntrosLoading(false); }).catch(() => setIntrosLoading(false));
  }, [tab]);

  function toggleJoin(eventId: string) {
    const isJoined = joined.has(eventId);
    setJoined(prev => {
      const next = new Set(prev);
      isJoined ? next.delete(eventId) : next.add(eventId);
      return next;
    });
    startTransition(async () => {
      if (isJoined) await leaveEvent(eventId);
      else await joinEvent(eventId);
    });
  }

  function toggleWaitlist(eventId: string) {
    const onList = myWaitlist.has(eventId);
    setMyWaitlist(prev => { const s = new Set(prev); onList ? s.delete(eventId) : s.add(eventId); return s; });
    setWaitlistCounts(prev => ({ ...prev, [eventId]: Math.max(0, (prev[eventId] ?? 0) + (onList ? -1 : 1)) }));
    startTransition(async () => {
      if (onList) await leaveWaitlist(eventId);
      else await joinWaitlist(eventId);
    });
  }

  const now = Date.now();
  const recentPast = events.filter(ev => {
    const ended = new Date(ev.starts_at).getTime();
    const diffH = (now - ended) / 36e5;
    return diffH >= 0 && diffH <= 48 && joined.has(ev.id);
  });

  const filtered = events.filter(ev => {
    if (!matchesFilter(ev, filter) || !matchesCategoryFilter(ev, categoryFilter)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ev.title.toLowerCase().includes(q) ||
      (ev.venue ?? ev.neighborhood ?? ev.city).toLowerCase().includes(q) ||
      (ev.host_name ?? "").toLowerCase().includes(q);
  });

  function toggleEventFlower(eventId: string) {
    setGatheringFlowers(prev => {
      const cur = prev[eventId] ?? { count: 0, gave: false };
      return { ...prev, [eventId]: { count: cur.count + (cur.gave ? -1 : 1), gave: !cur.gave } };
    });
    void toggleGatheringFlower(eventId);
  }

  function handleFollowTradition(id: string) {
    setTraditions(prev => prev.map(t => t.id === id
      ? { ...t, is_following: !t.is_following, follower_count: t.follower_count + (t.is_following ? -1 : 1) }
      : t
    ));
    void toggleFollowTradition(id);
  }

  const tickerItems = events.length > 0
    ? events.map(ev => `${ev.title.toUpperCase()} · ${ev.neighborhood ?? ev.city} · ${fmtTime(ev.starts_at)}`)
    : ["GIRLS NIGHT OUT ✦ ITALIAN DINNER SOCIETY ✦ ROOFTOP SESSIONS ✦ VINYL NIGHT ✦ SUNDAY BRUNCH CLUB ✦ FILM NIGHT ✦ DANCE ALL NIGHT"];

  return (
    <div className="bloom-world-enter" style={{ background: getPageBg(), minHeight: standalone ? "100vh" : "auto", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 130px)" }}>
      <style>{CSS}</style>

      {/* Fixed top bar */}
      {standalone && <div className="md:top-[60px] lg:top-0 lg:left-60 lg:right-[280px]" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        background: getNavBg(),
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 18, fontWeight: 900, color: "white", letterSpacing: "-0.01em" }}>BB+</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: PINK, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em" }}>
              NYC · {new Date().getHours() < 12 ? "THIS MORNING" : new Date().getHours() < 17 ? "THIS AFTERNOON" : new Date().getHours() < 21 ? "TONIGHT" : "LATE NIGHT"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => setSearchOpen(o => !o)} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: searchOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={searchOpen ? PINK : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <button onClick={() => setTab("intros")} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: tab === "intros" ? PINK : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tab === "intros" ? "white" : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </button>
            <button onClick={() => setTab("calendar")} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: tab === "calendar" ? PINK : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tab === "calendar" ? "white" : "rgba(255,255,255,0.7)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </button>
          </div>
        </div>
        <div style={{ height: 40, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", overflowX: "auto", scrollbarWidth: "none" as const }}>
          {(["All", "Tonight", "This Weekend", "Dinners", "Parties", "Gatherings"] as const).map(f => {
            const filterMap: Record<string, Filter> = { "Tonight": "Parties", "This Weekend": "Parties", "Dinners": "Dinners", "Parties": "Parties", "Gatherings": "Gatherings" };
            const mapped = (filterMap[f] ?? "All") as Filter;
            const active = f === "All" ? filter === "All" : filter === mapped;
            return (
              <button key={f} onClick={() => setFilter(f === "All" ? "All" : mapped)} style={{
                flexShrink: 0, padding: "5px 14px", borderRadius: 999, border: "none",
                background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)",
                color: active ? "white" : "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.04em", cursor: "pointer",
                outline: active ? "1.5px solid rgba(255,255,255,0.25)" : "none",
              }}>
                {f === "This Weekend" ? "★ This Weekend" : f}
              </button>
            );
          })}
        </div>
      </div>}

      {/* Collapsible search bar */}
      {standalone && searchOpen && (
        <div className="md:top-[166px] lg:top-[86px] lg:left-60 lg:right-[280px]" style={{
          position: "fixed", top: 86, left: 0, right: 0, zIndex: 50,
          background: getNavBg(), backdropFilter: "blur(20px)",
          padding: "10px 14px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "8px 14px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events, venues, hosts…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: "white", caretColor: PINK }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>
        </div>
      )}

      {/* Page content */}
      <div style={{ paddingTop: standalone ? (searchOpen ? 140 : 86) : 0 }}>

        {/* HAPPENINGS TAB */}
        {(standalone ? tab === "happenings" : true) && (
          <>
            {/* Type carousel */}
            <TypeCarousel onSelect={label => { setFilter(label as Filter); setFilterOpen(false); }} />

            {/* Post-event witness section */}
            {!loading && recentPast.length > 0 && (
              <div style={{ margin: "10px 14px 4px", background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>HAPPENED RECENTLY</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {recentPast.slice(0, 3).map(ev => (
                    <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.1 }}>{ev.title}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{ev.neighborhood ?? ev.city}</p>
                      </div>
                      {!reviewedIds.has(ev.id) && ev.host_name && (
                        <button onClick={() => setReviewEv(ev)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "4px 10px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                          Rate host
                        </button>
                      )}
                      <button onClick={() => setWitnessEv(ev)} style={{ background: PINK, border: "none", borderRadius: 999, padding: "4px 10px", color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
                        Who was there?
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Minute Plans */}
            {(() => {
              const nowMs = Date.now();
              const lastMinute = events.filter(ev => {
                const ms = new Date(ev.starts_at).getTime();
                const hoursAway = (ms - nowMs) / 36e5;
                return hoursAway >= 0 && hoursAway <= 6;
              });
              if (loading || lastMinute.length === 0) return null;
              return (
                <div style={{ margin: "12px 14px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,220,0,0.12)", border: "1px solid rgba(255,220,0,0.22)", borderRadius: 999, padding: "4px 10px 4px 7px" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD700", animation: "livePulse 1.2s ease-in-out infinite" }} />
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.16em", color: "#FFD700" }}>LAST MINUTE</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.32)", fontWeight: 600 }}>Starting in the next 6 hours</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" as const }}>
                    {lastMinute.slice(0, 6).map(ev => {
                      const startTime = new Date(ev.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                      const hoursAway = Math.round((new Date(ev.starts_at).getTime() - nowMs) / 36e5 * 10) / 10;
                      const isJoined = joined.has(ev.id);
                      return (
                        <div key={ev.id} style={{
                          flexShrink: 0, width: 160,
                          background: "rgba(255,220,0,0.06)",
                          border: "1px solid rgba(255,220,0,0.15)",
                          borderRadius: 14, padding: "12px 13px 12px",
                          display: "flex", flexDirection: "column", gap: 6,
                        }}>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "#FFD700", letterSpacing: "0.1em" }}>
                            ⚡ {hoursAway < 1 ? "< 1h away" : `${hoursAway}h away`}
                          </p>
                          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{ev.title}</p>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>
                            {startTime}{ev.venue ? ` · ${ev.venue}` : ""}
                          </p>
                          <button
                            onClick={() => { const id = ev.id; void (isJoined ? leaveEvent(id) : joinEvent(id)); setJoined(prev => { const s = new Set(prev); isJoined ? s.delete(id) : s.add(id); return s; }); }}
                            style={{
                              marginTop: 2, padding: "7px 0", borderRadius: 999, border: "none",
                              background: isJoined ? "rgba(255,255,255,0.1)" : "#FFD700",
                              color: isJoined ? "rgba(255,255,255,0.5)" : "#111",
                              fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, cursor: "pointer", letterSpacing: "0.08em",
                            }}
                          >
                            {isJoined ? "Going ✓" : "Going →"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Tonight strip */}
            {!loading && <TonightStrip events={events} joined={joined} onToggle={toggleJoin} />}

            {/* Host streak badge */}
            {!loading && hostedCount >= 2 && (
              <div style={{ margin: "8px 14px 4px", display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,31,125,0.12)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(255,31,125,0.25)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 3px 10px ${PINK}55` }}>
                  <span style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: "white" }}>{hostedCount}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.9)" }}>HOST STREAK ✦</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>the city knows you ♡</p>
                </div>
              </div>
            )}

            {/* Filter chips */}
            {filterOpen && (
              <>
                <div className="filter-scroll" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "8px 14px 4px", scrollbarWidth: "none" as const }}>
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      flexShrink: 0, padding: "6px 16px", borderRadius: 999, border: "none",
                      background: filter === f ? PINK : "rgba(255,255,255,0.1)",
                      color: filter === f ? "white" : "rgba(255,255,255,0.6)",
                      fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700,
                      letterSpacing: "0.04em", cursor: "pointer",
                      boxShadow: filter === f ? `0 2px 12px ${PINK}55` : "none",
                      transition: "all 0.15s",
                    }}>
                      {f}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "4px 14px 10px", scrollbarWidth: "none" as const }}>
                  {CATEGORY_CHIPS.map(c => {
                    const active = categoryFilter === c.id;
                    return (
                      <button key={c.id} onClick={() => setCategoryFilter(active ? "all" : c.id)} style={{
                        flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 999, border: "none",
                        background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
                        color: active ? "white" : "rgba(255,255,255,0.45)",
                        fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                        letterSpacing: "0.04em", cursor: "pointer",
                        outline: active ? `1.5px solid rgba(255,255,255,0.4)` : "none",
                        transition: "all 0.15s",
                      }}>
                        <span style={{ fontSize: 11, lineHeight: 1 }}>{c.emoji}</span>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Ticker */}
            <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,31,125,0.07)", padding: "7px 0", marginBottom: 12 }}>
              <div style={{ display: "flex", animation: "ticker 28s linear infinite", width: "max-content" }}>
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", padding: "0 24px" }}>
                    {item} <span style={{ color: PINK }}>✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Count label */}
            <div style={{ padding: "0 14px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)" }}>
                {loading ? "LOADING…" : events.length === 0 ? "UPCOMING THIS WEEK" : filter === "All" ? `${events.length} HAPPENINGS` : `${filtered.length} ${filter.toUpperCase()}`}
              </span>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div style={{ padding: "0 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ gridColumn: "span 2" }}><Skeleton h={260} br={16} dark/></div>
                <Skeleton h={195} br={10} dark/>
                <Skeleton h={195} br={10} dark/>
                <Skeleton h={195} br={10} dark/>
                <Skeleton h={195} br={10} dark/>
              </div>
            )}

            {/* Invitations view */}
            {!loading && filter === "Invitations" && (
              <CelebrationInvitationsView events={filtered} joined={joined} onToggle={toggleJoin} />
            )}

            {/* Real events collage */}
            {!loading && filter !== "Invitations" && filtered.length > 0 && (
              <EventTemplatesStrip
                events={filtered}
                joined={joined}
                waitlistCounts={waitlistCounts}
                myWaitlist={myWaitlist}
                onToggle={toggleJoin}
                onWaitlist={toggleWaitlist}
                onInvite={setInviteEv}
                flowers={gatheringFlowers}
                onFlower={toggleEventFlower}
              />
            )}

            {/* Static poster collage when no events */}
            {!loading && filter !== "Invitations" && events.length === 0 && <StaticCollage />}

            {/* No match for filter */}
            {!loading && filter !== "Invitations" && events.length > 0 && filtered.length === 0 && (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,255,255,0.3)" }}>nothing here yet ✦</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: 6, letterSpacing: "0.06em" }}>try a different filter</p>
              </div>
            )}

            <div style={{ height: 20 }}/>

            {/* From your city */}
            {!loading && (
              <div style={{ padding: "0 0 8px" }}>
                <div style={{ padding: "8px 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: PINK }}/>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)" }}>FROM YOUR CITY</span>
                </div>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 14px 12px", scrollbarWidth: "none" as const }}>
                  {[
                    { name: "Sunset Walk",  sub: "Brooklyn Bridge · SUN 1PM", img: POSTER_IMGS[9], going: 7  },
                    { name: "Natural Wine", sub: "West Village · TONIGHT",    img: POSTER_IMGS[1], going: 6  },
                    { name: "Rooftop Girls",sub: "SAT 8PM",                   img: POSTER_IMGS[7], going: 12 },
                    { name: "Dance All Night",sub: "SAT · 11PM",              img: POSTER_IMGS[5], going: 10 },
                  ].map((item, i) => (
                    <div key={i} style={{ flexShrink: 0, width: 140, borderRadius: 12, overflow: "hidden", position: "relative", height: 108, boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
                      <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.88) 100%)" }}/>
                      <div style={{ position: "absolute", top: 8, right: 8, background: PINK, borderRadius: 999, padding: "2px 7px" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white" }}>{item.going} going</p>
                      </div>
                      <div style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
                        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>{item.name}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traditions */}
            {!loading && traditions.length > 0 && (
              <TraditionsStrip traditions={traditions} onFollow={handleFollowTradition} />
            )}
          </>
        )}

        {/* INTROS TAB */}
        {standalone && tab === "intros" && (
          <div style={{ paddingBottom: 96 }}>
            <div style={{ padding: "20px 18px 16px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: PINK, marginBottom: 6 }}>🌸 INTRODUCTIONS</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(22px, 7vw, 28px)", color: "rgba(255,238,220,0.95)", lineHeight: 0.95, margin: 0, marginBottom: 10 }}>
                Meet the Women.
              </h2>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>
                New arrivals, locals & women finding their people
              </p>
              <Link href="/member/introductions" style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "rgba(255,255,255,0.09)", border: "1.5px solid rgba(255,255,255,0.18)",
                  borderRadius: 14, padding: "12px 16px", cursor: "pointer",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 14 }}>👋</span>
                  </div>
                  <div style={{ flex: 1, textAlign: "left" as const }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>Introduce yourself</p>
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Tap to share your story</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </Link>
            </div>
            <div style={{ padding: "0 14px" }}>
              {introsLoading ? (
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.3)", textAlign: "center" as const, padding: "30px 0" }}>Loading…</p>
              ) : intros.length === 0 ? (
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.3)", textAlign: "center" as const, padding: "30px 0" }}>No introductions yet — be the first!</p>
              ) : intros.map(intro => (
                <div key={intro.id} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 18, padding: "14px 16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${intro.color},${intro.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, color: "white" }}>{intro.initial}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "white" }}>{intro.name}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{intro.neighborhood ? `📍 ${intro.neighborhood} · ` : ""}{intro.time}</p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 10 }}>{intro.bio}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button onClick={() => { const next = !intro.my_flower; void flowerIntro(intro.id); setIntros(prev => prev.map(i => i.id === intro.id ? { ...i, my_flower: next, flowers: i.flowers + (next ? 1 : -1) } : i)); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, border: "none", cursor: "pointer", background: intro.my_flower ? `${PINK}20` : "rgba(255,255,255,0.08)" }}>
                      <span style={{ fontSize: 12 }}>🌸</span>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: intro.my_flower ? PINK : "rgba(255,255,255,0.5)" }}>{intro.flowers}</p>
                    </button>
                    <button style={{ padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${PINK},#FF69B4)`, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white", boxShadow: `0 2px 10px ${PINK}33` }}>
                      Connect →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {standalone && tab === "map" && (
          <div style={{ minHeight: "calc(100vh - 54px)", display: "flex", flexDirection: "column", paddingBottom: 28 }}>
            <div style={{ padding: "18px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", color: PINK }}>🗺 LIVE MAP</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>bloomies are out tonight</p>
              </div>
              <div style={{ background: "rgba(255,31,125,0.15)", borderRadius: 999, padding: "5px 12px", border: "1px solid rgba(255,31,125,0.3)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>NYC ✦ LIVE</p>
              </div>
            </div>
            <div style={{ padding: "0 16px 10px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const }}>
              {[
                { label: "ALL",           color: PINK,      active: true  },
                { label: "EVENTS",        color: PINK,      active: false },
                { label: "BLOOMIE NOTES", color: "#F59E0B", active: false },
                { label: "GIRL GEMS",     color: "#8B5CF6", active: false },
                { label: "FAVORITES",     color: "#EF4444", active: false },
                { label: "FOOD",          color: "#F97316", active: false },
              ].map((f, i) => (
                <div key={i} style={{ flexShrink: 0, background: f.active ? f.color : "rgba(255,255,255,0.08)", borderRadius: 999, padding: "7px 14px", border: `1.5px solid ${f.active ? f.color : f.color + "44"}` }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: f.active ? "white" : f.color, letterSpacing: "0.06em", whiteSpace: "nowrap" as const }}>{f.label}</p>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, margin: "0 16px", borderRadius: 24, overflow: "hidden", position: "relative", minHeight: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
              <div style={{ position: "absolute", inset: 0, background: "#E8E2D8" }}/>
              {[8, 17, 26, 35, 44, 53, 62, 71, 80, 89].map(pct => (
                <div key={`h${pct}`} style={{ position: "absolute", top: `${pct}%`, left: 0, right: 0, height: pct % 17 === 8 ? 4 : 2, background: "#F2EDE4", zIndex: 1 }}/>
              ))}
              {[10, 22, 34, 46, 58, 70, 82].map(pct => (
                <div key={`v${pct}`} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 3, background: "#F2EDE4", zIndex: 1 }}/>
              ))}
              {[
                {t:"9%",l:"11%",w:"10%",h:"7%"},{t:"9%",l:"23%",w:"10%",h:"7%"},{t:"9%",l:"35%",w:"10%",h:"7%"},
                {t:"9%",l:"59%",w:"10%",h:"7%"},{t:"18%",l:"11%",w:"10%",h:"7%"},{t:"18%",l:"47%",w:"10%",h:"7%"},
                {t:"27%",l:"23%",w:"10%",h:"7%"},{t:"27%",l:"59%",w:"10%",h:"7%"},{t:"36%",l:"11%",w:"10%",h:"7%"},
                {t:"36%",l:"35%",w:"10%",h:"7%"},{t:"45%",l:"23%",w:"10%",h:"7%"},{t:"45%",l:"71%",w:"10%",h:"7%"},
                {t:"54%",l:"11%",w:"10%",h:"7%"},{t:"54%",l:"47%",w:"10%",h:"7%"},{t:"63%",l:"35%",w:"10%",h:"7%"},
                {t:"63%",l:"59%",w:"10%",h:"7%"},{t:"72%",l:"11%",w:"10%",h:"7%"},{t:"72%",l:"23%",w:"10%",h:"7%"},
              ].map((b, i) => (
                <div key={`b${i}`} style={{ position: "absolute", top: b.t, left: b.l, width: b.w, height: b.h, background: "#D9D3C8", zIndex: 1 }}/>
              ))}
              <div style={{ position: "absolute", top: "4%", right: "5%", width: "20%", height: "28%", borderRadius: 8, background: "rgba(110,175,80,0.35)", border: "1px solid rgba(90,160,60,0.25)", zIndex: 2 }}/>
              <p style={{ position: "absolute", top: "9%", right: "8%", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(60,130,40,0.7)", zIndex: 2, letterSpacing: "0.05em" }}>THE PARK</p>
              <div style={{ position: "absolute", top: 0, left: 0, width: "8%", height: "100%", background: "rgba(100,160,220,0.28)", borderRight: "2px solid rgba(80,140,200,0.2)", zIndex: 2 }}/>
              {[
                {x:"28%",y:"38%",label:"Girls Night",cnt:12,color:PINK},
                {x:"55%",y:"22%",label:"Rooftop",cnt:8,color:PINK},
                {x:"42%",y:"58%",label:"Brunch Club",cnt:15,color:PINK},
                {x:"74%",y:"45%",label:"Jazz Night",cnt:4,color:PINK},
                {x:"48%",y:"72%",label:"Dance All Night",cnt:20,color:PINK},
                {x:"63%",y:"55%",label:"Book Society",cnt:9,color:PINK},
              ].map((pin, i) => (
                <div key={`e${i}`} style={{ position: "absolute", left: pin.x, top: pin.y, transform: "translate(-50%, -100%)", zIndex: 5 }}>
                  <div style={{ background: PINK, borderRadius: 20, padding: "4px 10px 4px 7px", display: "flex", alignItems: "center", gap: 4, boxShadow: `0 3px 14px ${PINK}70`, whiteSpace: "nowrap" as const }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.9)", animation: "livePulse 1.4s ease-in-out infinite" }}/>
                    <span style={{ fontSize: "9px", fontWeight: 800, color: "white", fontFamily: "var(--font-jost)" }}>{pin.label}</span>
                    <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontWeight: 700 }}>{pin.cnt}</span>
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: `6px solid ${PINK}`, margin: "0 auto" }}/>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px 0" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>ON THE MAP</p>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const }}>
                {[
                  { label: "Girls Night Out",  time: "Tonight",    color: PINK      },
                  { label: "Rooftop Sessions", time: "Sat 8PM",    color: "#FF69B4" },
                  { label: "Brunch Club",      time: "Sun 11AM",   color: "#F97316" },
                  { label: "Jazz Night",       time: "Fri 9PM",    color: PINK      },
                  { label: "Bar Pisellino",    time: "♥ 32 saves", color: "#EF4444" },
                  { label: "Wine Cave",        time: "💎 gem",     color: "#8B5CF6" },
                ].map((chip, i) => (
                  <div key={i} style={{ flexShrink: 0, background: "rgba(255,255,255,0.07)", borderRadius: 999, padding: "8px 14px", border: `1.5px solid ${chip.color}44` }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "white" }}>{chip.label}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{chip.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CITY TAB */}
        {standalone && tab === "scene" && (
          <div style={{ padding: "0 0 24px", minHeight: "calc(100vh - 54px)" }}>
            <div style={{ padding: "20px 20px 8px" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginBottom: 2 }}>New York City</p>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px, 8.5vw, 34px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, letterSpacing: "-0.01em" }}>The City</h1>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>tap a neighborhood to explore</p>
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 30px", minHeight: 520 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#8A8A8A", border: "3px solid #666", marginBottom: 0, zIndex: 2 }} />
              <div style={{ width: 8, height: "100%", position: "absolute", top: 14, background: "linear-gradient(90deg, #AAA 0%, #CCC 40%, #BBB 60%, #999 100%)", borderRadius: 4, zIndex: 1 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12, width: "100%", alignItems: "center", zIndex: 2 }}>
                {[
                  { href: "/member/city?area=les",          name: "Lower East Side",  sub: "UNDERGROUND SPOTS · LATE NIGHTS", color: PINK,     dir: "left",  cls: "sign-s1", ml: "5%"  },
                  { href: "/member/city?area=williamsburg",  name: "Williamsburg",     sub: "ROOFTOPS · STUDIOS · EATS",       color: "#D86487", dir: "right", cls: "sign-s2", mr: "5%"  },
                  { href: "/member/city?area=crownheights",  name: "Crown Heights",    sub: "BRUNCHES · RHYTHM · CULTURE",     color: "#C0185F", dir: "left",  cls: "sign-s3", ml: "8%"  },
                  { href: "/member/city?area=harlem",        name: "Harlem",           sub: "CULTURE RUNS DEEP",               color: PINK,     dir: "right", cls: "sign-s4", mr: "8%"  },
                  { href: "/member/city?area=soho",          name: "SoHo",             sub: "GALLERIES · DINNERS · FASHION",   color: "#E87BA8", dir: "left",  cls: "sign-s5", ml: "5%"  },
                  { href: "/member/city?area=dumbo",         name: "DUMBO",            sub: "WATERFRONT · BRIDGE VIEWS",       color: "#D86487", dir: "right", cls: "sign-s6", mr: "5%"  },
                  { href: "/member/city?area=bushwick",      name: "Bushwick",         sub: "ART · LATE NIGHTS · ENERGY",      color: "#C0185F", dir: "left",  cls: "sign-s7", ml: "10%" },
                ].map(s => (
                  <Link key={s.href} href={s.href} style={{ textDecoration: "none", alignSelf: s.dir === "left" ? "flex-start" : "flex-end", marginLeft: s.dir === "left" ? s.ml : undefined, marginRight: s.dir === "right" ? s.mr : undefined }}>
                    <div className={s.cls} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                      {s.dir === "left" && <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: `16px solid ${s.color}` }} />}
                      <div style={{ background: s.color, padding: s.dir === "left" ? "10px 18px 10px 10px" : "10px 10px 10px 18px", borderRadius: s.dir === "left" ? "0 8px 8px 0" : "8px 0 0 8px" }}>
                        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>{s.name}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{s.sub}</p>
                      </div>
                      {s.dir === "right" && <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `16px solid ${s.color}` }} />}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              <div style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "16px 18px", border: "1px solid rgba(255,31,125,0.15)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 6 }}>FULL CITY GUIDE</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 12 }}>
                  Restaurants, bars, rooftops — curated by Bloomies for Bloomies.
                </p>
                <Link href="/member/city" style={{ textDecoration: "none" }}>
                  <div style={{ display: "inline-flex", background: PINK, color: "white", borderRadius: 999, padding: "9px 20px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", boxShadow: `0 4px 14px ${PINK}55` }}>
                    ALL OF NYC →
                  </div>
                </Link>
              </div>
            </div>
            <div style={{ marginTop: 24, padding: "0 0 8px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", marginBottom: 10, paddingLeft: 20 }}>BROWSE BY CATEGORY</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SCENE_CATS.map((cat, idx) => (
                  <SceneBuilding key={cat.label} cat={cat} idx={idx} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {standalone && tab === "calendar" && (
          <div style={{ padding: "0 0 120px" }}>
            <CalendarView events={events} />
          </div>
        )}
      </div>

      {tab === "happenings" && <CreateFAB />}

      {inviteEv  && <InviteFriendSheet ev={inviteEv}  onClose={() => setInviteEv(null)} />}
      {witnessEv && <WitnessSheet      ev={witnessEv} onClose={() => setWitnessEv(null)} />}
      {reviewEv  && (
        <HostReviewSheet
          ev={reviewEv}
          onClose={() => setReviewEv(null)}
          onDone={id => { setReviewedIds(prev => new Set([...prev, id])); setReviewEv(null); }}
        />
      )}
    </div>
  );
}
