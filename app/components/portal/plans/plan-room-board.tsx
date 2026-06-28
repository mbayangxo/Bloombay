"use client";

import { useState } from "react";
import type { PlanRoom } from "@/lib/plans/types";
import { THEME, PINK } from "@/lib/plans/constants";
import { PLAN_TODOS, PLAN_NOTES, BLOOMIES_LIST } from "@/lib/plans/mock-data";
import { PlanTicketSheet } from "./plan-ticket-sheet";

export function PlanRoomBoard({ room, onBack }: { room: PlanRoom; onBack: () => void }) {
  const theme = THEME;
  const initialTodos = PLAN_TODOS[room.id] ?? [];
  const [todos, setTodos] = useState(initialTodos);
  const [showTicket, setShowTicket] = useState(false);
  const notes = PLAN_NOTES[room.id] ?? [];

  function toggleTodo(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const done = todos.filter(t => t.done).length;
  const pct  = todos.length > 0 ? Math.round((done / todos.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: theme.pageBg, paddingBottom: 96 }}>

      <div style={{ background: theme.topBar, borderBottom: `1px solid ${theme.topBarBorder}`, paddingTop: 54, position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 12px" }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.subText} strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ width: 38, height: 38, borderRadius: 14, background: `${room.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{room.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: theme.heading, lineHeight: 1.2 }}>{room.name}</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: theme.subText, marginTop: 1 }}>{room.members} women · {room.time}</p>
          </div>
          <button onClick={() => setShowTicket(true)} style={{ padding: "5px 12px", borderRadius: 999, background: `${room.accent}18`, border: `1px solid ${room.accent}44`, cursor: "pointer", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: room.accent }}>🎟 Ticket</span>
          </button>
        </div>
      </div>

      <div style={{ height: 140, background: `linear-gradient(135deg, ${room.bg} 0%, ${room.accent}33 100%)`, display: "flex", alignItems: "flex-end", padding: "0 20px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 72, opacity: 0.22 }}>{room.emoji}</div>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: `${room.accent}CC`, marginBottom: 4 }}>PLAN ROOM</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,7vw,30px)", fontWeight: 900, fontStyle: "italic", color: "#FEFCF7", lineHeight: 1.1 }}>{room.name}</h1>
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>

        <div style={{ background: theme.sectionBg, backdropFilter: "blur(8px)", borderRadius: 20, padding: "16px 18px", marginBottom: 16, border: `1px solid ${theme.cardBorder}` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 10 }}>THE PLAN</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {room.time && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>📅</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: theme.heading, fontWeight: 500 }}>{room.time}</p>
              </div>
            )}
            {room.venue && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: theme.heading, fontWeight: 500 }}>{room.venue}</p>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>👯‍♀️</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: theme.heading, fontWeight: 500 }}>{room.members} women joining</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: theme.label, marginBottom: 10, paddingLeft: 2 }}>WHO&apos;S IN</p>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as const }}>
            {BLOOMIES_LIST.map(b => (
              <div key={b.id} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${b.color},${b.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", border: "2.5px solid rgba(255,255,255,0.7)", boxShadow: `0 2px 10px ${b.color}44` }}>
                  {b.initial}
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: theme.subText, maxWidth: 44, textAlign: "center", lineHeight: 1.2 }}>{b.name.split(" ")[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: theme.sectionBg, backdropFilter: "blur(8px)", borderRadius: 20, padding: "16px 18px", marginBottom: 16, border: `1px solid ${theme.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK }}>CHECKLIST</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 60, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${PINK},#FF69B4)`, borderRadius: 99, transition: "width 0.3s" }} />
              </div>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: theme.subText }}>{done}/{todos.length}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {todos.map(t => (
              <button key={t.id} onClick={() => toggleTodo(t.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ width: 22, height: 22, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: t.done ? PINK : "transparent", border: t.done ? "none" : "2px solid rgba(0,0,0,0.15)", transition: "all 0.15s" }}>
                  {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: t.done ? theme.subText : theme.heading, fontWeight: t.done ? 400 : 500, textDecoration: t.done ? "line-through" : "none", flex: 1 }}>{t.text}</p>
              </button>
            ))}
          </div>
        </div>

        {notes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: theme.label, marginBottom: 10, paddingLeft: 2 }}>NOTES</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notes.map(n => (
                <div key={n.id} style={{ background: theme.sectionBg, backdropFilter: "blur(8px)", borderRadius: 16, padding: "12px 16px", border: `1px solid ${theme.cardBorder}`, borderLeft: `3px solid ${room.accent}` }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: theme.heading, lineHeight: 1.45 }}>{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTicket && <PlanTicketSheet room={room} onClose={() => setShowTicket(false)} onOpenRoom={() => setShowTicket(false)} />}
    </div>
  );
}
