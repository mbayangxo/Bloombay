"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BloomiesPlanner } from "@/app/components/portal/bloomies-planner";
import { PlanDoorCard } from "@/app/components/portal/plans/plan-door-card";
import { PlanRoomBoard } from "@/app/components/portal/plans/plan-room-board";
import { PlanTicketSheet } from "@/app/components/portal/plans/plan-ticket-sheet";
import { NewPlanSheet } from "@/app/components/portal/plans/new-plan-sheet";
import { RecentConfirmationsStrip } from "@/app/components/portal/plans/recent-confirmations-strip";
import { PaperCalendarView } from "@/app/components/portal/plans/paper-calendar-view";
import { DayScheduleView } from "@/app/components/portal/plans/day-schedule-view";
import { DayEditorSheet } from "@/app/components/portal/plans/day-editor-sheet";
import { WalletTickets } from "@/app/components/portal/plans/wallet-tickets";
import type { PlanRoom, View, DayContent } from "@/lib/plans/types";
import { PINK } from "@/lib/plans/constants";

const POLAROID_ROTS = [-1.5, 1.2, -0.8, 1.8, -1.1, 0.9, -1.7, 1.4, -0.6, 1.6, -1.3, 0.7];

function PlansPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userId, setUserId]           = useState<string | null>(null);
  const [view, setView]               = useState<View>("list");
  const [activeRoom, setActiveRoom]   = useState<PlanRoom | null>(null);
  const [ticketRoom, setTicketRoom]   = useState<PlanRoom | null>(null);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [planRooms, setPlanRooms]     = useState<PlanRoom[]>([]);
  const [memories, setMemories]       = useState<{ id: string; name: string; date: string; poster: string | null; note: string }[]>([]);
  const [plansError, setPlansError]   = useState<string | null>(null);
  const [read, setRead]               = useState<Set<number>>(new Set());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editorDay, setEditorDay]     = useState<string | null>(null);
  const [dayContents, setDayContents] = useState<Record<string, DayContent>>({});

  useEffect(() => {
    void import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    });
    fetch("/api/member/plans")
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load plans")))
      .then((json: { plans?: PlanRoom[]; memories?: typeof memories }) => {
        if (json?.plans && json.plans.length > 0) setPlanRooms(json.plans);
        if (json?.memories) setMemories(json.memories);
      })
      .catch((err: Error) => setPlansError(err.message));
  }, []);

  useEffect(() => {
    const eventId = searchParams.get("event");
    if (eventId) {
      const room = planRooms.find(r => r.eventId === parseInt(eventId, 10));
      if (room) openRoom(room);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planRooms]);

  function openRoom(room: PlanRoom) {
    setRead(prev => new Set([...prev, room.id]));
    setActiveRoom(room);
    setView("room");
  }
  function updateDayContent(key: string, c: DayContent) {
    setDayContents(prev => ({ ...prev, [key]: c }));
  }

  if (view === "room" && activeRoom) {
    return <PlanRoomBoard room={activeRoom} onBack={() => { setView("list"); setActiveRoom(null); }} />;
  }

  const totalUnread = planRooms.filter(r => r.unread > 0 && !read.has(r.id)).length;
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", paddingBottom: 96 }}>

      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 54, zIndex: 51, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid rgba(255,31,125,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, color: PINK }}>BB✿</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setShowCalendar(true)} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.18)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </button>
          <button onClick={() => setShowNewPlan(true)} style={{ width: 32, height: 32, borderRadius: "50%", background: PINK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(255,31,125,0.38)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>

      <div style={{ paddingTop: 54 }}>

        {plansError && (
          <div style={{ padding: "10px 16px", background: "rgba(255,31,125,0.07)", borderBottom: "1px solid rgba(255,31,125,0.12)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#FF1F7D", textAlign: "center" }}>{plansError}</p>
          </div>
        )}

        {/* Editorial header */}
        <div style={{ position: "relative", overflow: "hidden", paddingBottom: 8 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(185deg, #FF1F7D 0%, #E8006A 28%, #FF4FA0 55%, rgba(255,240,248,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1, padding: "8px 16px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.24em", color: "rgba(255,255,255,0.58)", marginBottom: 2 }}>✦ {todayStr.toUpperCase()}</p>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,5.5vw,24px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, letterSpacing: "-0.02em" }}>Your Plans.</h1>
              </div>
              <button onClick={() => setShowNewPlan(true)} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>{planRooms.length} ROOMS</p>
              {totalUnread > 0 && (
                <>
                  <div style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "rgba(255,255,255,0.32)" }} />
                  <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 999, padding: "1.5px 7px", border: "1px solid rgba(255,255,255,0.28)" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{totalUnread} NEW</p>
                  </div>
                </>
              )}
              <button onClick={() => setShowCalendar(true)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, background: "#FFF5F8", border: "1px solid rgba(255,31,125,0.25)", borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.82)", letterSpacing: "0.08em" }}>PLANNER</p>
              </button>
            </div>
          </div>
        </div>

        {/* Door cards row */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 16px 24px", scrollbarWidth: "none" as const, WebkitOverflowScrolling: "touch" as unknown as undefined }}>
          <button onClick={() => setShowNewPlan(true)} style={{ width: 100, height: 155, flexShrink: 0, borderRadius: 16, border: `2px dashed rgba(255,31,125,0.25)`, background: "rgba(255,31,125,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,31,125,0.6)", letterSpacing: "0.06em" }}>NEW</p>
          </button>
          {planRooms.map(room => (
            <PlanDoorCard key={room.id} room={room} isRead={read.has(room.id)} onPress={() => openRoom(room)} />
          ))}
        </div>

        <RecentConfirmationsStrip />

        {/* Confirmation receipt + compact wallet row */}
        <div style={{ display: "flex", gap: 10, padding: "8px 16px 20px" }}>
          {planRooms[1] && (
            <button onClick={() => router.push("/member/plans/confirmations")} style={{ flex: 1, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" as const }}>
              <div style={{ background: "linear-gradient(145deg, #FF1F7D 0%, #C8005A 100%)", borderRadius: 16, padding: "14px 13px 12px", boxShadow: "0 8px 28px rgba(255,31,125,0.42), 0 2px 0 rgba(120,0,45,0.4)", display: "flex", flexDirection: "column" as const, justifyContent: "space-between", height: 155, position: "relative" as const, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)", borderRadius: "16px 16px 0 0", pointerEvents: "none" as const }}/>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.52)", marginBottom: 5 }}>BLOOMBAY ❋</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.62)", marginBottom: 4 }}>ADMITS ONE</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: 14, color: "white", lineHeight: 1.05, marginBottom: 4 }}>{planRooms[1].name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 600, color: "rgba(255,255,255,0.78)" }}>{planRooms[1].time}</p>
                </div>
                <div>
                  <div style={{ borderTop: "1.5px dashed rgba(255,255,255,0.25)", paddingTop: 7, marginTop: 6 }}>
                    <div style={{ display: "flex", gap: 1, alignItems: "flex-end", marginBottom: 5 }}>
                      {[2,1,3,1,2,1,3,2,1,2,1,3,1,2].map((w, j) => (
                        <div key={j} style={{ width: w, height: j%3===0 ? 17 : 11, background: "rgba(255,255,255,0.6)", borderRadius: 0.5 }} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, color: "rgba(0,0,0,0.45)", letterSpacing: "0.1em" }}>VIEW ALL →</p>
                </div>
              </div>
            </button>
          )}
          {planRooms.filter(r => r.eventId).length > 0 && (
            <button onClick={() => { const r = planRooms.find(r => r.eventId); if (r) setTicketRoom(r); }} style={{ flex: 1, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" as const }}>
              <div style={{ background: "linear-gradient(145deg, #FFD6EB 0%, #FFBCD8 100%)", borderRadius: 16, padding: "14px 13px 12px", height: 155, display: "flex", flexDirection: "column" as const, justifyContent: "space-between", boxShadow: "0 4px 18px rgba(255,31,125,0.16)", position: "relative" as const, overflow: "hidden" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(180,40,100,0.55)", marginBottom: 6 }}>BB WALLET ❋</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "#AA2255", marginBottom: 10 }}>{planRooms.filter(r => r.eventId).length} tickets</p>
                  <div style={{ position: "relative", height: 72 }}>
                    {planRooms.filter(r => r.eventId).slice(0, 3).map((r, i) => (
                      <div key={r.id} style={{ position: "absolute" as const, top: i * 7, left: i * 2, right: -(i * 2), height: 50, background: r.bg, borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.22)", display: "flex", alignItems: "center", padding: "0 10px", overflow: "hidden" }}>
                        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "white", overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis" }}>{r.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, color: "rgba(170,34,85,0.5)", letterSpacing: "0.1em", textAlign: "right" as const }}>OPEN →</p>
              </div>
            </button>
          )}
        </div>

        {/* Bloomies Planner™ */}
        {userId && <BloomiesPlanner userId={userId} />}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 22px 0", marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,31,125,0.18))" }} />
          <span style={{ fontSize: 9, color: "rgba(255,31,125,0.38)" }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,31,125,0.18), transparent)" }} />
        </div>

        {/* Memories polaroid grid */}
        {memories.length > 0 && (
          <div style={{ padding: "0 16px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,31,125,0.5)", marginBottom: 3 }}>✦ MEMORIES</p>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1 }}>Your Story.</h3>
              </div>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "#bbb" }}>{memories.length} moments ✦</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {memories.map((ev, i) => (
                <div key={ev.id} style={{ transform: `rotate(${POLAROID_ROTS[i % POLAROID_ROTS.length]}deg)`, transformOrigin: "center bottom", transition: "transform 0.2s" }}>
                  <div style={{ background: "white", borderRadius: 4, padding: "5px 5px 14px", boxShadow: "0 6px 20px rgba(0,0,0,0.12), 0 1px 0 rgba(0,0,0,0.06)" }}>
                    <div style={{ width: "100%", aspectRatio: "1", borderRadius: 2, overflow: "hidden", background: "#F0E8E0", position: "relative" }}>
                      {ev.poster
                        ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={ev.poster} alt={ev.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 24 }}>✦</span>
                          </div>
                        )
                      }
                    </div>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: "#888", textAlign: "center", marginTop: 5, lineHeight: 1.2 }}>{ev.note}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, color: "#ccc", textAlign: "center", marginTop: 2, letterSpacing: "0.06em" }}>{ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Calendar overlay */}
      {showCalendar && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#FFFFFF", overflowY: "auto" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backdropFilter: "blur(12px)" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,31,125,0.6)", marginBottom: 4 }}>YOUR PLANNER</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1 }}>Plan Calendar.</h2>
            </div>
            <button onClick={() => setShowCalendar(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
            </button>
          </div>
          <div style={{ padding: "12px 0 32px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#aaa", letterSpacing: "0.06em", marginBottom: 12, paddingLeft: 16 }}>TAP A DATE TO ADD NOTES OR VIEW PLANS</p>
            <div style={{ margin: "0 16px 12px", borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,0.14), 0 1px 0 rgba(255,255,255,0.9) inset" }}>
              <PaperCalendarView
                dayContents={dayContents}
                onSelectDay={key => setSelectedDay(prev => prev === key ? null : key)}
                selectedDay={selectedDay}
              />
            </div>
            {selectedDay && (
              <DayScheduleView
                dayKey={selectedDay}
                dayContent={dayContents[selectedDay]}
                onEdit={() => setEditorDay(selectedDay)}
              />
            )}
          </div>
        </div>
      )}

      {editorDay && (
        <DayEditorSheet
          dayKey={editorDay}
          content={dayContents[editorDay] ?? { text: "", stickers: [], photos: [], voiceCount: 0 }}
          onUpdate={c => updateDayContent(editorDay, c)}
          onClose={() => setEditorDay(null)}
        />
      )}

      {ticketRoom && (
        <PlanTicketSheet
          room={ticketRoom}
          onClose={() => setTicketRoom(null)}
          onOpenRoom={() => { setTicketRoom(null); openRoom(ticketRoom); }}
        />
      )}

      {showNewPlan && <NewPlanSheet onClose={() => setShowNewPlan(false)} onCreated={() => {
        fetch("/api/member/plans")
          .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to reload plans")))
          .then((json: { plans?: PlanRoom[]; memories?: typeof memories }) => {
            if (json?.plans && json.plans.length > 0) setPlanRooms(json.plans);
            if (json?.memories) setMemories(json.memories);
          })
          .catch((err: Error) => setPlansError(err.message));
      }} />}

      <style>{`
        @keyframes badgeShake {
          0%, 60%, 100% { transform: scale(1) rotate(0deg); }
          65%  { transform: scale(1.22) rotate(-12deg); }
          70%  { transform: scale(1.22) rotate(12deg); }
          75%  { transform: scale(1.18) rotate(-9deg); }
          80%  { transform: scale(1.18) rotate(9deg); }
          85%  { transform: scale(1.12) rotate(-4deg); }
          90%  { transform: scale(1.06) rotate(2deg); }
          95%  { transform: scale(1.02) rotate(0deg); }
        }
        @keyframes waveBar {
          0% { transform: scaleY(0.35); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#FFFFFF" }} />}>
      <PlansPageInner />
    </Suspense>
  );
}
