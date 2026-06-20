"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "@/app/styles/bloom-entrance.css";

const PINK = "#FF1F7D";
const CREAM = "#FFF8F0";
const BLACK = "#111111";

interface Preview {
  user_id: string;
  name: string;
  avatar_url: string | null;
  neighborhood: string | null;
}

interface ScanResult {
  streak: number;
  milestone_stamp: string | null;
  scanned_name: string;
}

export default function ScanPage() {
  const [myCode, setMyCode] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [resolving, setResolving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>("");

  // Fetch the current user's ID to compute myCode
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const code = `BB-${user.id.slice(0, 4).toUpperCase()}`;
        setMyCode(code);
      }
    });
  }, []);

  // Auto-resolve when input matches BB-XXXX (length 7)
  useEffect(() => {
    const trimmed = input.trim().toUpperCase();
    if (trimmed.length === 7 && /^BB-[A-Z0-9]{4}$/.test(trimmed)) {
      setPreview(null);
      setError("");
      setResult(null);
      setResolving(true);
      fetch(`/api/member/resolve-code?code=${encodeURIComponent(trimmed)}`)
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) {
            setError(json.error || "Member not found.");
            setPreview(null);
          } else {
            setPreview(json as Preview);
            setError("");
          }
        })
        .catch(() => setError("Could not resolve code."))
        .finally(() => setResolving(false));
    } else {
      setPreview(null);
      if (trimmed.length > 0 && trimmed.length < 7) {
        setError("");
      }
    }
  }, [input]);

  async function handleConnect() {
    if (!preview) return;
    setScanning(true);
    setError("");
    try {
      const res = await fetch("/api/member/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanned_user_id: preview.user_id }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not connect.");
      } else {
        setResult({
          streak: json.streak,
          milestone_stamp: json.milestone_stamp ?? null,
          scanned_name: json.scanned_name,
        });
        setPreview(null);
        setInput("");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setScanning(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: CREAM, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 0", textAlign: "center" }}>
        <p style={{
          fontFamily: "Jost, sans-serif",
          fontWeight: 700,
          fontSize: 8,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: PINK,
          marginBottom: 10,
        }}>
          ✦ SCAN
        </p>
        <p style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: 24,
          color: BLACK,
          margin: 0,
        }}>
          Connect with her bloom code.
        </p>
      </div>

      <div style={{ flex: 1, padding: "36px 24px 48px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 400, margin: "0 auto", width: "100%" }}>

        {/* YOUR CODE section */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "24px 24px 20px",
          border: "1px solid rgba(255,31,125,0.12)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          <p style={{
            fontFamily: "Jost, sans-serif",
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.3)",
            marginBottom: 14,
          }}>
            YOUR CODE
          </p>
          <div className="bloom-card-enter" style={{
            background: `linear-gradient(135deg, ${PINK} 0%, #FF5FA5 100%)`,
            borderRadius: 14,
            padding: "18px 20px",
            textAlign: "center",
            boxShadow: `0 8px 28px ${PINK}33`,
          }}>
            {myCode ? (
              <p style={{
                fontFamily: "Jost, sans-serif",
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: "0.14em",
                color: "#FFFFFF",
                margin: 0,
              }}>
                {myCode}
              </p>
            ) : (
              <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#FFFFFF",
                  animation: "spin 1s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>
          <p style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: 11,
            color: "rgba(0,0,0,0.35)",
            textAlign: "center",
            marginTop: 12,
          }}>
            Share this with her to connect.
          </p>
        </div>

        {/* SCAN HERS section */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "24px 24px 20px",
          border: "1px solid rgba(255,31,125,0.12)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          <p style={{
            fontFamily: "Jost, sans-serif",
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.3)",
            marginBottom: 14,
          }}>
            SCAN HERS
          </p>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="BB-XXXX"
              maxLength={7}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1.5px solid ${preview ? PINK : "rgba(0,0,0,0.1)"}`,
                fontFamily: "Jost, sans-serif",
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: BLACK,
                background: "#FAFAFA",
                outline: "none",
                transition: "border-color 0.2s",
                textAlign: "center",
              }}
            />
            {resolving && (
              <div style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `2px solid ${PINK}40`,
                borderTopColor: PINK,
                animation: "spin 1s linear infinite",
              }} />
            )}
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontFamily: "Jost, sans-serif",
              fontSize: 11,
              color: "#E03060",
              marginTop: 8,
              textAlign: "center",
            }}>
              {error}
            </p>
          )}

          {/* Preview */}
          {preview && !result && (
            <div className="bloom-card-enter" style={{
              marginTop: 16,
              background: "#FFF8F0",
              borderRadius: 14,
              padding: "14px 16px",
              border: `1px solid ${PINK}20`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              {preview.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.avatar_url}
                  alt={preview.name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${PINK}25` }}
                />
              ) : (
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${PINK} 0%, #FF5FA5 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {preview.name[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: BLACK, margin: 0 }}>{preview.name}</p>
                {preview.neighborhood && (
                  <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", margin: "2px 0 0", fontFamily: "Jost, sans-serif" }}>{preview.neighborhood}</p>
                )}
              </div>
              <span style={{ color: `${PINK}60`, fontSize: 16 }}>✦</span>
            </div>
          )}

          {/* Connect button */}
          {preview && !result && (
            <button
              onClick={handleConnect}
              disabled={scanning}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "15px",
                borderRadius: 14,
                border: "none",
                background: scanning ? `${PINK}88` : `linear-gradient(135deg, ${PINK} 0%, #FF5FA5 100%)`,
                color: "#FFFFFF",
                fontFamily: "Jost, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: scanning ? "not-allowed" : "pointer",
                boxShadow: `0 6px 20px ${PINK}33`,
                transition: "opacity 0.2s, transform 0.12s",
              }}
            >
              {scanning ? "Connecting…" : `Connect ✓`}
            </button>
          )}
        </div>

        {/* Result card */}
        {result && (
          <div className="bloom-card-enter" style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "28px 24px",
            border: `1px solid ${PINK}25`,
            boxShadow: `0 8px 32px ${PINK}15`,
            textAlign: "center",
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${PINK} 0%, #FF5FA5 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: `0 8px 24px ${PINK}33`,
              fontSize: 24,
            }}>
              ✦
            </div>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 20,
              color: BLACK,
              margin: "0 0 6px",
            }}>
              Connected with {result.scanned_name}!
            </p>
            <p style={{
              fontFamily: "Jost, sans-serif",
              fontSize: 12,
              color: "rgba(0,0,0,0.45)",
              margin: "0 0 16px",
            }}>
              {result.streak === 1
                ? "First connection — she&apos;s in your Bloom."
                : `You&apos;ve connected ${result.streak} times. Keep the streak alive.`}
            </p>
            {result.milestone_stamp && (
              <div style={{
                background: `${PINK}12`,
                borderRadius: 10,
                padding: "10px 16px",
                border: `1px solid ${PINK}25`,
              }}>
                <p style={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  color: PINK,
                  letterSpacing: "0.08em",
                  margin: 0,
                }}>
                  Milestone earned: {result.milestone_stamp}
                </p>
              </div>
            )}
            <button
              onClick={() => { setResult(null); setInput(""); setError(""); }}
              style={{
                marginTop: 20,
                background: "none",
                border: `1px solid rgba(0,0,0,0.1)`,
                borderRadius: 10,
                padding: "10px 20px",
                fontFamily: "Jost, sans-serif",
                fontSize: 12,
                color: "rgba(0,0,0,0.5)",
                cursor: "pointer",
                letterSpacing: "0.06em",
              }}
            >
              Scan another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
