"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";

interface WitnessData {
  id: string;
  note: string;
  created_at: string;
  witness: {
    name: string;
    initial: string;
    avatar_url: string | null;
    neighborhood: string | null;
  };
  gathering_title: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function WitnessedNotePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<WitnessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/member/witness/${id}`)
      .then(async (res) => {
        if (!res.ok) { setNotFound(true); return; }
        const json: WitnessData = await res.json();
        setData(json);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

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

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(255,31,125,0.3)", borderTopColor: PINK, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : notFound || !data ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
              This witness note isn&apos;t available.
            </p>
            <Link href="/member/lounge" style={{ color: PINK, fontSize: 12, fontFamily: "Jost, sans-serif", display: "block", marginTop: 16 }}>
              Back to Lounge →
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-sm relative">
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              background: `radial-gradient(ellipse at 50% 0%, ${PINK}22 0%, transparent 70%)`,
              filter: "blur(20px)",
              transform: "translateY(-10px) scale(1.05)",
            }} />

            {/* The note card */}
            <div className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1A0812 0%, #120508 60%, #0D040C 100%)",
                border: `1px solid ${PINK}25`,
                boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${PINK}10`,
              }}>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${PINK}30, transparent)` }} />

              <div className="px-8 pt-10 pb-8">
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-center mb-8"
                  style={{ color: `${PINK}66` }}>
                  SOMETHING BEAUTIFUL SHE NOTICED
                </p>

                <p className="text-center leading-snug mb-8"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 5.5vw, 28px)",
                    color: "rgba(255,235,215,0.95)",
                    textShadow: `0 0 40px ${PINK}40`,
                  }}>
                  &ldquo;{data.note}&rdquo;
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background: `${PINK}20` }} />
                  <span style={{ color: `${PINK}40`, fontSize: "10px" }}>✦</span>
                  <div className="flex-1 h-px" style={{ background: `${PINK}20` }} />
                </div>

                <div className="flex items-center gap-3">
                  {data.witness.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.witness.avatar_url} alt={data.witness.name}
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${PINK}30` }} />
                  ) : (
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${PINK} 0%, ${PINK}99 100%)`, boxShadow: `0 4px 14px ${PINK}44` }}>
                      {data.witness.initial}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: "rgba(255,235,215,0.9)" }}>{data.witness.name}</p>
                    {data.witness.neighborhood && (
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{data.witness.neighborhood}</p>
                    )}
                  </div>
                  <p className="text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>{formatDate(data.created_at)}</p>
                </div>

                {data.gathering_title && (
                  <p className="text-[9px] text-center mt-5 tracking-wide"
                    style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                    witnessed at {data.gathering_title}
                  </p>
                )}
              </div>

              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${PINK}20, transparent)` }} />

              <div className="px-8 py-5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>
                    WITNESSED — BLOOMBAY
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.1)" }}>
                    A social artifact. Not a rating.
                  </p>
                </div>
                <span style={{ color: `${PINK}30`, fontSize: "18px" }}>✦</span>
              </div>
            </div>

            <p className="text-[10px] text-center mt-5 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
              This observation lives on your profile.<br/>
              <Link href="/member/lounge" style={{ color: "rgba(255,31,125,0.55)", textDecoration: "underline" }}>
                See your full Witness Stack →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
