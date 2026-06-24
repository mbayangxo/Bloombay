import { PushPin } from "../scrapbook";
import { PINK, PAPER_TEX } from "./shared";

export function NearYouClubs({ nearYou }: {
  nearYou: Array<{ name: string; clubs: number; grad: string }>;
}) {
  const rots = [-2.5, 1.8, -1.2, 2.2, -1.5];

  return (
    <section style={{ padding: "0 0 60px" }}>
      <div style={{ padding: "0 18px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, boxShadow: `0 0 8px ${PINK}` }} />
        <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)" }}>NEAR YOU</span>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,105,180,0.8)" }}>📍 SoHo, NYC</span>
      </div>

      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingLeft: 18, paddingRight: 18, paddingBottom: 16, scrollbarWidth: "none" as const }}>
        {nearYou.map((n, i) => (
          <div key={i} style={{ flexShrink: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
              <PushPin color="pink" size={11} />
            </div>
            <div style={{
              width: 106, background: "white", backgroundImage: PAPER_TEX, backgroundSize: "200px 200px",
              padding: "7px 7px 18px", boxShadow: "3px 6px 20px rgba(0,0,0,0.55)",
              transform: `rotate(${rots[i % rots.length]}deg)`, marginTop: 8,
            }}>
              <div style={{ width: "100%", height: 72, background: n.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.3 }}>{n.name}</span>
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 5 }}>{n.name}</p>
              <p style={{ fontSize: 8, color: "rgba(0,0,0,0.3)", textAlign: "center", marginTop: 2 }}>{n.clubs} clubs</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
