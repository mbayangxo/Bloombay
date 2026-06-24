import type { DayContent } from "@/lib/plans/types";
import { MONTH_THEMES, MONTH_NAMES, DAY_FULL } from "@/lib/plans/constants";
import { EVENT_DATES } from "@/lib/plans/mock-data";

export function DayScheduleView({ dayKey, dayContent, onEdit }: {
  dayKey: string;
  dayContent: DayContent | undefined;
  onEdit: () => void;
}) {
  const date       = new Date(dayKey + "T12:00:00");
  const T          = MONTH_THEMES[date.getMonth()];
  const dayNum     = date.getDate();
  const dayLabel   = DAY_FULL[date.getDay()];
  const monthLabel = MONTH_NAMES[date.getMonth()];
  const events     = EVENT_DATES[dayKey] ?? [];

  function parseHour(t: string): number {
    const m = t.match(/(\d+)(?::\d+)?\s*(AM|PM)/i);
    if (!m) return 12;
    let h = parseInt(m[1]);
    if (m[2].toUpperCase() === "PM" && h !== 12) h += 12;
    if (m[2].toUpperCase() === "AM" && h === 12) h = 0;
    return h;
  }

  const HOURS = Array.from({ length: 15 }, (_, i) => i + 7);
  const hasContent = dayContent && (dayContent.text || dayContent.photos.length > 0 || dayContent.voiceCount > 0 || dayContent.stickers.length > 0);

  return (
    <div style={{ margin: "0 8px 12px", borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,0.1)", border: `1px solid ${T.accent}18` }}>

      <div style={{ background: T.headerGrad, padding: "14px 16px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.25em", color: T.accent, marginBottom: 4 }}>{dayLabel.toUpperCase()} {T.deco}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: T.textColor, lineHeight: 1 }}>{dayNum} {monthLabel}</p>
          {events.length > 0 && <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: T.accent, opacity: 0.7, marginTop: 3 }}>{events.length} plan{events.length !== 1 ? "s" : ""} today</p>}
        </div>
        <button onClick={onEdit} style={{ padding: "8px 16px", borderRadius: 999, background: T.accent, border: "none", cursor: "pointer", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white", letterSpacing: "0.05em" }}>+ NOTES</p>
        </button>
      </div>

      {dayContent?.stickers && dayContent.stickers.length > 0 && (
        <div style={{ background: `${T.accent}0A`, padding: "6px 14px", display: "flex", gap: 6, flexWrap: "wrap" as const, borderBottom: `1px solid ${T.accent}15` }}>
          {dayContent.stickers.map((s, i) => (
            s.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={s} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
            ) : <span key={i} style={{ fontSize: 22 }}>{s}</span>
          ))}
        </div>
      )}

      <div style={{ background: "white" }}>
        {HOURS.map((h) => {
          const timeLabel = h < 12 ? `${h}AM` : h === 12 ? "12PM" : `${h-12}PM`;
          const eventsAtHour = events.filter(ev => parseHour(ev.time) === h);
          return (
            <div key={h} style={{ display: "flex", alignItems: "stretch", borderBottom: `1px solid rgba(0,0,0,0.04)`, minHeight: eventsAtHour.length > 0 ? "auto" : 40 }}>
              <div style={{ width: 46, flexShrink: 0, borderRight: `1px solid rgba(0,0,0,0.05)`, padding: "10px 6px 10px 10px", display: "flex", alignItems: "flex-start" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 600, color: "#C0B8B8", lineHeight: 1, whiteSpace: "nowrap" as const }}>{timeLabel}</p>
              </div>
              <div style={{ flex: 1, padding: eventsAtHour.length > 0 ? "7px 10px" : "0", display: "flex", flexDirection: "column", gap: 6 }}>
                {eventsAtHour.map((ev, ei) => (
                  <div key={ei} style={{ background: `${ev.color}14`, borderLeft: `3.5px solid ${ev.color}`, borderRadius: "0 12px 12px 0", padding: "9px 10px 9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40%", background: `linear-gradient(90deg, transparent, ${ev.color}10)`, pointerEvents: "none" }} />
                    <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{ev.emoji}</span>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{ev.name}</p>
                      </div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#aaa" }}>🕐 {ev.time}</p>
                    </div>
                    <div style={{ flexShrink: 0, width: 38, background: "white", padding: "3px 3px 9px", borderRadius: 3, boxShadow: "0 3px 10px rgba(0,0,0,0.14)", transform: "rotate(2.5deg)", zIndex: 1 }}>
                      <div style={{ width: 32, height: 28, borderRadius: 2, background: `linear-gradient(135deg, ${ev.color}55, ${ev.color}22)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{ev.emoji}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {dayContent?.text && (
        <div style={{ background: `${T.accent}07`, padding: "12px 16px 14px", borderTop: `1px solid ${T.accent}12` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.2em", color: T.accent, opacity: 0.6, marginBottom: 6 }}>✍️ MY NOTES</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#555", lineHeight: 1.55 }}>{dayContent.text}</p>
        </div>
      )}

      {events.length === 0 && !hasContent && (
        <div style={{ padding: "22px 16px 24px", textAlign: "center" as const, background: "white" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, color: "#D4CCC8" }}>Nothing planned yet {T.deco}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "#DDD", marginTop: 4 }}>Tap + NOTES to journal, add stickers, photos or voice notes</p>
        </div>
      )}
    </div>
  );
}
