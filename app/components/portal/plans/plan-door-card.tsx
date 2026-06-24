import type { PlanRoom } from "@/lib/plans/types";
import { PINK } from "@/lib/plans/constants";

export function PlanDoorCard({ room, isRead, onPress }: { room: PlanRoom; isRead: boolean; onPress: () => void }) {
  const hasUnread = room.unread > 0 && !isRead;
  const W = 100;
  const H = 155;

  return (
    <button
      onClick={onPress}
      className="active:scale-[0.95] transition-transform"
      style={{ width: W, height: H, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0, position: "relative", WebkitTapHighlightColor: "transparent", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.28)" }}
    >
      {room.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={room.poster} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: room.bg }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "8px 8px 10px" }}>
        <div style={{ position: "absolute", top: 7, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.18)", borderRadius: 999, padding: "2px 8px", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(6px)", whiteSpace: "nowrap" as const }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{room.date}</p>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.04em", lineHeight: 1.3, marginBottom: 3, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {room.name.toUpperCase()}
        </p>
        {room.venue && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 400, color: "rgba(255,255,255,0.72)", letterSpacing: "0.02em", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
            {room.venue.split(",")[0]}
          </p>
        )}
      </div>
      {hasUnread && (
        <div style={{ position: "absolute", top: 7, right: 7, width: 17, height: 17, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(255,31,125,0.6)", zIndex: 3, animation: "badgeShake 3s ease-in-out 1s infinite" }}>
          <span style={{ fontSize: 7, fontWeight: 900, color: "white" }}>{room.unread}</span>
        </div>
      )}
    </button>
  );
}
