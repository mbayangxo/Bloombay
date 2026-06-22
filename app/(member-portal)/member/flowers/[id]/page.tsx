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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bb-bg)" }}>

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
            background: "var(--bb-nav-bg)",
            border: "1px solid var(--bb-nav-border)",
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: `${PINK}99`, margin: 0 }}>
          ✦ FLOWERS
        </p>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 80px" }}>

        {loading ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(255,31,125,0.3)", borderTopColor: PINK, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : notFound || !data ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "var(--bb-text-3)", marginBottom: 16 }}>
              These flowers aren&apos;t available.
            </p>
            <Link href="/member/lounge" style={{ color: PINK, fontSize: 12, fontFamily: "var(--font-jost)" }}>
              Back to Lounge →
            </Link>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: 360, position: "relative" }}>

            {/* Flower card */}
            <div style={{
              borderRadius: 24,
              overflow: "hidden",
              background: "var(--bb-card)",
              border: `1px solid var(--bb-border-strong)`,
              boxShadow: `0 12px 40px rgba(255,31,125,0.12)`,
            }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${PINK}, transparent)` }} />

              <div style={{ padding: "36px 28px 28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>🌸</div>

                <p style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "var(--bb-text)",
                  margin: "0 0 16px",
                  lineHeight: 1.35,
                }}>
                  She sent you flowers.
                </p>

                {data.note && (
                  <p style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: 17,
                    color: "var(--bb-text-2)",
                    margin: "0 0 20px",
                    lineHeight: 1.55,
                  }}>
                    &ldquo;{data.note}&rdquo;
                  </p>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "var(--bb-border)" }} />
                  <span style={{ color: `${PINK}50`, fontSize: 10 }}>✦</span>
                  <div style={{ flex: 1, height: 1, background: "var(--bb-border)" }} />
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
                    }}>
                      {data.sender.initial}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 14, color: "var(--bb-text)", margin: 0 }}>{data.sender.name}</p>
                    {data.sender.neighborhood && (
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "var(--bb-text-3)", margin: "2px 0 0" }}>{data.sender.neighborhood}</p>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "var(--bb-text-muted)", flexShrink: 0 }}>
                    {formatDate(data.sent_at)}
                  </p>
                </div>

                {data.gathering_title && (
                  <p style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: 9,
                    color: "var(--bb-text-muted)",
                    marginTop: 16,
                    letterSpacing: "0.05em",
                  }}>
                    at {data.gathering_title}
                  </p>
                )}
              </div>

              <div style={{ height: 1, background: "var(--bb-border)" }} />

              <div style={{ padding: "16px 28px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "var(--bb-text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
                  A small gesture. A real thing.
                </p>
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "var(--bb-text-muted)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
              This is on your profile.{" "}
              <Link href="/member/you" style={{ color: PINK, textDecoration: "underline" }}>
                See it →
              </Link>
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
