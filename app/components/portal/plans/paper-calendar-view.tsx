"use client";

import { useState } from "react";
import type { DayContent } from "@/lib/plans/types";
import { PINK, MONTH_THEMES, MONTH_NAMES, DAY_NAMES } from "@/lib/plans/constants";
import { EVENT_DATES } from "@/lib/plans/mock-data";

export function PaperCalendarView({ dayContents, onSelectDay, selectedDay }: {
  dayContents: Record<string, DayContent>;
  onSelectDay: (d: string) => void;
  selectedDay: string | null;
}) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const T = MONTH_THEMES[month];
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  function dateKey(d: number) { return `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  return (
    <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 10px 48px rgba(0,0,0,0.16)" }}>

      <div style={{ background: T.binding, padding: "8px 0 7px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", background: "#FFE0EE", border: "2.5px solid rgba(255,31,125,0.2)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08)" }} />
        ))}
      </div>

      <div style={{ position: "relative", background: T.headerGrad, padding: "20px 20px 16px", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-playfair)", fontSize: 78, fontWeight: 900, fontStyle: "italic", color: "rgba(0,0,0,0.045)", whiteSpace: "nowrap" as const, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>{T.watermark}</div>
        <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 68, lineHeight: 1, filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.16))", pointerEvents: "none" }}>{T.deco}</div>
        <div style={{ position: "absolute", right: 90, top: 10 }}><span style={{ fontSize: 11, color: T.accent, opacity: 0.55 }}>{T.decoExtra[0]}</span></div>
        <div style={{ position: "absolute", right: 76, bottom: 10 }}><span style={{ fontSize: 9, color: T.accent, opacity: 0.4 }}>{T.decoExtra[2]}</span></div>
        <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.22em", color: T.accent, opacity: 0.4, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>BLOOMBAY · {year}</p>
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4, zIndex: 2 }}>
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
            style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.09)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.textColor} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
            style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.09)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.textColor} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          {T.decoExtra.map((d, i) => <span key={i} style={{ fontSize: 9, color: T.accent, opacity: 0.55 }}>{d}</span>)}
        </div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(30px,9vw,40px)", fontWeight: 900, fontStyle: "italic", color: T.textColor, lineHeight: 0.95, marginBottom: 4 }}>{MONTH_NAMES[month]}</h2>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: T.textColor, opacity: 0.5, lineHeight: 1 }}>Planner {year}</p>
      </div>

      <div style={{ background: T.accent, display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
        {DAY_NAMES.map(d => (
          <p key={d} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.92)", textAlign: "center", padding: "7px 0 6px" }}>{d}</p>
        ))}
      </div>

      <div style={{ background: T.gridBg, padding: "3px 3px 2px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", border: `1px solid ${T.accent}22`, borderRadius: 10, overflow: "hidden" }}>
          {cells.map((day, i) => {
            if (!day) return (
              <div key={i} style={{ minHeight: 58, background: `${T.accent}07`, borderRight: i%7!==6 ? `1px solid ${T.accent}15` : "none", borderBottom: i<cells.length-7 ? `1px solid ${T.accent}15` : "none" }} />
            );
            const key = dateKey(day);
            const isToday = key === todayKey;
            const isSel   = key === selectedDay;
            const dots    = EVENT_DATES[key];
            const dc      = dayContents[key];
            const hasSticker = dc?.stickers?.length > 0;
            const hasNote    = dc && (dc.text || dc.photos.length > 0 || dc.voiceCount > 0);
            const isFullDay  = dots && dots.length >= 2;
            return (
              <button key={i} onClick={() => onSelectDay(key)}
                style={{ minHeight: 58, padding: "5px 3px 4px", borderRight: i%7!==6 ? `1px solid ${T.accent}15` : "none", borderBottom: i<cells.length-7 ? `1px solid ${T.accent}15` : "none", background: isSel ? `${T.accent}20` : isToday ? `${T.accent}0E` : "white", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "background 0.15s", position: "relative", gap: 2 }}>
                {isToday ? (
                  <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
                    <svg style={{ position: "absolute", top: 0, left: 0 }} width="28" height="28" viewBox="0 0 28 28">
                      <ellipse cx="14" cy="14" rx="12" ry="11.5" fill="none" stroke={T.todayRing} strokeWidth="1.8" strokeDasharray="4 1.5" transform="rotate(-12 14 14)" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: T.todayRing, lineHeight: 1 }}>{day}</p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: isSel ? T.accent : "#444", fontWeight: isSel ? 700 : 400, lineHeight: 1 }}>{day}</p>
                )}
                {hasSticker ? (
                  <span style={{ fontSize: 13 }}>{dc.stickers[dc.stickers.length-1]}</span>
                ) : isFullDay ? (
                  <div style={{ background: T.accent, borderRadius: 999, padding: "1.5px 5px" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>FULL</p>
                  </div>
                ) : dots ? (
                  <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    {dots.slice(0,3).map((ev, j) => <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: ev.color }} />)}
                  </div>
                ) : hasNote ? (
                  <div style={{ width: 14, height: 10, borderRadius: 2, background: `${T.accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 7, height: 1.5, borderRadius: 1, background: T.accent, opacity: 0.5 }} />
                  </div>
                ) : null}
                {isSel && <div style={{ position: "absolute", inset: 0, border: `2px solid ${T.accent}50`, pointerEvents: "none" }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: T.headerGrad, padding: "10px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        {[{ color: T.todayRing, label: "Today" }, { color: T.accent, label: "Plans" }, { color: "#999", label: "Notes" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, opacity: 0.8 }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: T.textColor, opacity: 0.6 }}>{l.label}</p>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 12 }}>{T.deco}</span>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.14em", color: T.accent, opacity: 0.55 }}>BLOOMBAY</p>
        </div>
      </div>
    </div>
  );
}
