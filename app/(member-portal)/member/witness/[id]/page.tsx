"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const WITNESSES: Record<string, {
  initial: string; color: string; name: string; neighborhood: string;
  note: string; date: string; context?: string;
}> = {
  kezia: {
    initial: "K", color: "#FF1F7D", name: "Kezia A.", neighborhood: "Crown Heights",
    note: "She makes every table feel full.",
    date: "June 2026",
    context: "witnessed at Girls Dinner · Carbone",
  },
  sofia: {
    initial: "S", color: "#FF69B4", name: "Sofia K.", neighborhood: "Williamsburg",
    note: "You made the whole table feel like home.",
    date: "June 2026",
    context: "witnessed at Rooftop Night · DUMBO",
  },
  priya: {
    initial: "P", color: "#C084FC", name: "Priya R.", neighborhood: "SoHo",
    note: "You made everyone feel welcome. That's a rare thing.",
    date: "May 2026",
    context: "witnessed at Sunday Walk Circle",
  },
};

export default function WitnessedNotePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const witness = WITNESSES[id] ?? WITNESSES["kezia"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0508" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 30%, rgba(255,31,125,0.12) 0%, transparent 65%)",
      }} />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-5 pt-14 pb-6 md:pt-10">
        <Link href="/member/notifications"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity active:opacity-60"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(255,31,125,0.7)" }}>
          ✦ WITNESSED
        </p>
        <div className="w-10" />
      </div>

      {/* Note card — center of page */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-full max-w-sm relative">
          {/* Glow behind the card */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
            background: `radial-gradient(ellipse at 50% 0%, ${witness.color}22 0%, transparent 70%)`,
            filter: "blur(20px)",
            transform: "translateY(-10px) scale(1.05)",
          }} />

          {/* The note / letter */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1A0812 0%, #120508 60%, #0D040C 100%)",
              border: `1px solid ${witness.color}25`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${witness.color}10`,
            }}>

            {/* Subtle paper texture line */}
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${witness.color}30, transparent)` }} />

            {/* Note body */}
            <div className="px-8 pt-10 pb-8">
              {/* "Something beautiful" label */}
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-center mb-8"
                style={{ color: `${witness.color}66` }}>
                SOMETHING BEAUTIFUL SHE NOTICED
              </p>

              {/* The note — big and prominent */}
              <p className="text-center leading-snug mb-8"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(22px, 6vw, 30px)",
                  color: "rgba(255,235,215,0.95)",
                  textShadow: `0 0 40px ${witness.color}40`,
                }}>
                &ldquo;{witness.note}&rdquo;
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: `${witness.color}20` }} />
                <span style={{ color: `${witness.color}40`, fontSize: "10px" }}>✦</span>
                <div className="flex-1 h-px" style={{ background: `${witness.color}20` }} />
              </div>

              {/* Who wrote it */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${witness.color} 0%, ${witness.color}99 100%)`,
                    boxShadow: `0 4px 14px ${witness.color}44`,
                  }}>
                  {witness.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "rgba(255,235,215,0.9)" }}>{witness.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{witness.neighborhood}</p>
                </div>
                <p className="text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>{witness.date}</p>
              </div>

              {/* Context */}
              {witness.context && (
                <p className="text-[9px] text-center mt-5 tracking-wide"
                  style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                  {witness.context}
                </p>
              )}
            </div>

            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${witness.color}20, transparent)` }} />

            {/* Footer */}
            <div className="px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>
                  WITNESSED — BLOOMBAY
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.1)" }}>
                  A social artifact. Not a rating.
                </p>
              </div>
              <span style={{ color: `${witness.color}30`, fontSize: "18px" }}>✦</span>
            </div>
          </div>

          {/* "This lives on your profile" note below card */}
          <p className="text-[10px] text-center mt-5 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
            This observation lives on your profile.<br/>
            <Link href="/member/lounge" style={{ color: "rgba(255,31,125,0.55)", textDecoration: "underline" }}>
              See your full Witness Stack →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
