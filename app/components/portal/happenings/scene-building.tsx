import Link from "next/link";
import { SCENE_CATS } from "@/lib/happenings/constants";

export function SceneBuilding({ cat, idx: _idx }: { cat: typeof SCENE_CATS[number]; idx: number }) {
  return (
    <Link href={cat.href} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        width: `${cat.pct}%`,
        height: 78,
        background: cat.color,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px)",
        backgroundSize: "10px 10px",
        borderRadius: "0 18px 18px 0",
        display: "flex", alignItems: "center",
        padding: "0 18px 0 20px",
        gap: 14,
        boxShadow: `0 5px 22px ${cat.color}44, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.1)`,
        position: "relative", overflow: "hidden",
        transition: "transform 0.18s",
        cursor: "pointer",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "42%", background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)", pointerEvents: "none" }}/>
        <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 21 }}>{cat.icon}</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 900, color: "white", letterSpacing: "0.07em", lineHeight: 1 }}>{cat.label}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 3 }}>{cat.sub}</p>
        </div>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </Link>
  );
}

export { SCENE_CATS };
