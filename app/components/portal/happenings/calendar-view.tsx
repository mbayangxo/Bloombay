import type { Event } from "@/lib/actions/events";

export function CalendarView({ events }: { events: Event[] }) {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleString("en-US", { month: "long" });
  const yearStr   = String(year);

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstWdRaw   = new Date(year, month, 1).getDay();
  const firstWd      = (firstWdRaw + 6) % 7;

  const eventsByDay = new Map<number, Event[]>();
  events.forEach(ev => {
    const d = new Date(ev.starts_at);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dom = d.getDate();
      const arr = eventsByDay.get(dom) ?? [];
      arr.push(ev);
      eventsByDay.set(dom, arr);
    }
  });

  const nowMs = Date.now();
  const futureEventsThisMonth = events
    .filter(ev => {
      const d = new Date(ev.starts_at);
      return d.getFullYear() === year && d.getMonth() === month && d.getTime() > nowMs;
    })
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  const featuredEv = futureEventsThisMonth[0] ?? null;
  const featuredDay = featuredEv ? new Date(featuredEv.starts_at).getDate() : null;

  const totalCells = firstWd + daysInMonth;
  const rows       = Math.ceil(totalCells / 7);
  const cells: (number | null)[] = [
    ...Array(firstWd).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length < rows * 7) cells.push(null);

  const todayDay = today.getMonth() === month && today.getFullYear() === year ? today.getDate() : -1;

  return (
    <div style={{ fontFamily: "var(--font-jost)" }}>
      <div style={{
        background: "#F5EDD8",
        padding: "28px 24px 20px",
        textAlign: "center",
        borderBottom: "1px solid rgba(139,115,85,0.18)",
        position: "relative",
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: "#8B7355", marginBottom: 4, textTransform: "uppercase" as const }}>
          ✦ &nbsp; {yearStr} &nbsp; ✦
        </div>
        <h2 style={{
          fontFamily: "var(--font-fraunces)",
          fontStyle: "italic",
          fontSize: "clamp(38px, 10vw, 52px)",
          fontWeight: 900,
          color: "#2C2417",
          lineHeight: 1,
          margin: "0 0 6px",
          letterSpacing: "-0.02em",
        }}>
          {monthName}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "12px 0 0" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #8B7355 50%, transparent)" }} />
          <span style={{ fontSize: 14, color: "#8B7355" }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #8B7355 50%, transparent)" }} />
        </div>
      </div>

      <div style={{ background: "#FDFAF4", padding: "16px 12px 20px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
          {["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d => (
            <div key={d} style={{
              textAlign: "center" as const,
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#8B7355",
              padding: "4px 0",
            }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {cells.map((day, idx) => {
            const isToday   = day === todayDay;
            const hasEvents = day !== null && (eventsByDay.get(day)?.length ?? 0) > 0;
            return (
              <div
                key={idx}
                style={{
                  height: 48,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  position: "relative",
                }}
              >
                {day !== null && (
                  <>
                    <div style={isToday ? {
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "2px solid #FF1F7D",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "rotate(-4deg)",
                    } : {}}>
                      <span style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: 16,
                        fontWeight: 700,
                        color: isToday ? "#FF1F7D" : "#2C2417",
                        lineHeight: 1,
                      }}>{day}</span>
                    </div>
                    {hasEvents && (
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#FF1F7D",
                        flexShrink: 0,
                      }} />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {featuredEv && featuredDay !== null && (() => {
          const cellIdx = firstWd + featuredDay - 1;
          const rowIdx  = Math.floor(cellIdx / 7);
          const colIdx  = cellIdx % 7;
          const cellW = 100 / 7;
          const leftPct = cellW * colIdx + cellW / 2;
          const topPx   = 54 + rowIdx * 50;
          return (
            <div style={{
              position: "absolute",
              left: `${leftPct}%`,
              top: topPx,
              transform: "translate(-50%, -100%) rotate(2deg)",
              zIndex: 10,
              width: 130,
              background: "#FFF176",
              borderRadius: 6,
              boxShadow: "2px 3px 8px rgba(0,0,0,0.15)",
              padding: "20px 10px 10px",
              pointerEvents: "none",
            }}>
              <svg
                width="18" height="28"
                viewBox="0 0 18 28"
                fill="none"
                style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}
              >
                <path
                  d="M9 2C6.79 2 5 3.79 5 6v14c0 3.31 2.69 6 6 6s6-2.69 6-6V8h-2v12c0 2.21-1.79 4-4 4s-4-1.79-4-4V6c0-1.1.9-2 2-2s2 .9 2 2v12h2V6c0-2.21-1.79-4-4-4z"
                  fill="#888"
                />
              </svg>
              <p style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 12,
                color: "#333",
                lineHeight: 1.4,
                textAlign: "center" as const,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                wordBreak: "break-word" as const,
              }}>
                {featuredEv.title}
              </p>
              {featuredEv.venue && (
                <p style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  color: "#666",
                  textAlign: "center" as const,
                  marginTop: 4,
                  whiteSpace: "nowrap" as const,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  📍 {featuredEv.venue}
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {futureEventsThisMonth.length > 0 && (
        <div style={{ background: "#F5EDD8", padding: "16px 16px 24px", borderTop: "1px solid rgba(139,115,85,0.15)" }}>
          <p style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "#8B7355",
            marginBottom: 14,
            textTransform: "uppercase" as const,
          }}>
            ✦ COMING UP THIS MONTH
          </p>
          {futureEventsThisMonth.slice(0, 8).map((ev, i) => {
            const d = new Date(ev.starts_at);
            const timeLabel = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
            return (
              <div key={ev.id} style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                paddingBottom: 12,
                marginBottom: 12,
                borderBottom: i < futureEventsThisMonth.slice(0, 8).length - 1 ? "1px solid rgba(139,115,85,0.12)" : "none",
              }}>
                <div style={{
                  flexShrink: 0,
                  width: 54,
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  fontWeight: 800,
                  color: "#FF1F7D",
                  letterSpacing: "0.06em",
                  lineHeight: 1.4,
                }}>
                  {d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
                  <br />
                  <span style={{ color: "#8B7355", fontWeight: 600, fontSize: 8 }}>{timeLabel}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#2C2417",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap" as const,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {ev.title}
                  </p>
                  {(ev.venue ?? ev.neighborhood) && (
                    <p style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 10,
                      color: "#8B7355",
                      marginTop: 2,
                      whiteSpace: "nowrap" as const,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {ev.venue ?? ev.neighborhood}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
