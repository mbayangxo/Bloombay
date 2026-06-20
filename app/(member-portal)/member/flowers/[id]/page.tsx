"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";

interface FlowerData {
  id: string;
  note: string | null;
  sent_at: string;
  sender: {
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

export default function FlowerPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<FlowerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/member/flowers/${id}`)
      .then(async (res) => {
        if (!res.ok) { setNotFound(true); return; }
        const json: FlowerData = await res.json();
        setData(json);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0A0508" }}>
      {/* Ambient pink glow — softer/more joyful */}
      <div style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 20%, rgba(255,31,125,0.14) 0%, rgba(255,100,160,0.06) 40%, transparent 70%)",
      }} />

      {/* Top bar */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "56px 20px 24px" }}>
        <Link
          href="/member/notifications"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <p style={{
          fontFamily: "Jost, sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,31,125,0.7)",
          margin: 0,
        }}>
          ✦ FLOWERS
        </p>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 80px" }}>

        {loading ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid rgba(255,31,125,0.3)",
              borderTopColor: PINK,
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : notFound || !data ? (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 16,
            }}>
              These flowers aren&apos;t available.
            </p>
            <Link href="/member/lounge" style={{ color: PINK, fontSize: 12, fontFamily: "Jost, sans-serif" }}>
              Back to Lounge →
            </Link>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: 360, position: "relative" }}>
            {/* Glow behind card */}
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              pointerEvents: "none",
              background: `radial-gradient(ellipse at 50% 0%, ${PINK}20 0%, transparent 70%)`,
              filter: "blur(20px)",
              transform: "translateY(-10px) scale(1.05)",
            }} />

            {/* Flower card */}
            <div style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background: "linear-gradient(160deg, #1A0812 0%, #120508 60%, #0D040C 100%)",
              border: `1px solid rgba(255,31,125,0.25)`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${PINK}10`,
            }}>
              {/* Top accent line */}
              <div style={{ height: 1, width: "100%", background: `linear-gradient(90deg, transparent, ${PINK}35, transparent)` }} />

              <div style={{ padding: "36px 28px 28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                {/* Flower emoji */}
                <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>🌸</div>

                {/* Headline */}
                <p style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "rgba(255,235,215,0.95)",
                  margin: "0 0 16px",
                  lineHeight: 1.35,
                }}>
                  She sent you flowers.
                </p>

                {/* Note */}
                {data.note && (
                  <p style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: 18,
                    color: "rgba(255,235,215,0.85)",
                    margin: "0 0 20px",
                    lineHeight: 1.55,
                  }}>
                    &ldquo;{data.note}&rdquo;
                  </p>
                )}

                {/* Divider */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  marginBottom: 20,
                }}>
                  <div style={{ flex: 1, height: 1, background: `${PINK}20` }} />
                  <span style={{ color: `${PINK}40`, fontSize: 10 }}>✦</span>
                  <div style={{ flex: 1, height: 1, background: `${PINK}20` }} />
                </div>

                {/* Sender row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left" }}>
                  {data.sender.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.sender.avatar_url}
                      alt={data.sender.name}
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${PINK}30` }}
                    />
                  ) : (
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${PINK} 0%, ${PINK}99 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: 16,
                      flexShrink: 0,
                      boxShadow: `0 4px 14px ${PINK}44`,
                    }}>
                      {data.sender.initial}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,235,215,0.9)", margin: 0 }}>{data.sender.name}</p>
                    {data.sender.neighborhood && (
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "2px 0 0", fontFamily: "Jost, sans-serif" }}>{data.sender.neighborhood}</p>
                    )}
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", flexShrink: 0, fontFamily: "Jost, sans-serif" }}>
                    {formatDate(data.sent_at)}
                  </p>
                </div>

                {/* Gathering */}
                {data.gathering_title && (
                  <p style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.18)",
                    marginTop: 16,
                    letterSpacing: "0.05em",
                  }}>
                    at {data.gathering_title}
                  </p>
                )}
              </div>

              {/* Bottom accent line */}
              <div style={{ height: 1, width: "100%", background: `linear-gradient(90deg, transparent, ${PINK}20, transparent)` }} />

              {/* Footer */}
              <div style={{ padding: "16px 28px", textAlign: "center" }}>
                <p style={{
                  fontFamily: "Jost, sans-serif",
                  fontSize: 8,
                  color: "rgba(255,255,255,0.20)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  margin: 0,
                }}>
                  A small gesture. A real thing.
                </p>
              </div>
            </div>

            {/* Below card */}
            <p style={{
              fontFamily: "Jost, sans-serif",
              fontSize: 10,
              color: "rgba(255,255,255,0.22)",
              textAlign: "center",
              marginTop: 20,
              lineHeight: 1.6,
            }}>
              This is on your profile.{" "}
              <Link href="/member/you" style={{ color: "rgba(255,31,125,0.55)", textDecoration: "underline" }}>
                See it →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
