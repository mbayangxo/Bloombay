"use client";

import { useState } from "react";

const PINK = "#FF1F7D";

const CATEGORIES = [
  { value: "bug",       label: "Something's broken", icon: "🐛" },
  { value: "feature",   label: "Idea / suggestion",  icon: "💡" },
  { value: "compliment",label: "Love something!",     icon: "♡" },
  { value: "other",     label: "Other",               icon: "◦" },
];

export function FeedbackButton() {
  const [open, setOpen]       = useState(false);
  const [category, setCategory] = useState("bug");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function submit() {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        message,
        page_url: window.location.pathname,
        device_info: `${navigator.userAgent.slice(0, 120)} · ${window.innerWidth}x${window.innerHeight}`,
      }),
    });
    setSending(false);
    if (!res.ok) {
      const d = await res.json() as { error?: string };
      setError(d.error ?? "Something went wrong");
      return;
    }
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setMessage(""); setCategory("bug"); }, 2000);
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: "calc(env(safe-area-inset-bottom,0px) + 84px)", right: 16, zIndex: 45,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(8px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        }}
        aria-label="Give feedback"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </button>

      {/* Sheet */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201, background: "#FEFCF7", borderRadius: "24px 24px 0 0", padding: "12px 20px 32px", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto", paddingBottom: "calc(32px + env(safe-area-inset-bottom,0px))" }}>
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.1)" }} />
            </div>

            {sent ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontSize: 36, marginBottom: 10 }}>♡</p>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 22, color: "#111" }}>Got it. Thank you!</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#aaa", marginTop: 6 }}>We review every report.</p>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK, letterSpacing: "0.16em", marginBottom: 6 }}>FEEDBACK</p>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 22, color: "#111", marginBottom: 18 }}>What&apos;s on your mind?</p>

                {/* Category chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                  {CATEGORIES.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      style={{
                        padding: "8px 14px", borderRadius: 999, border: "1.5px solid",
                        borderColor: category === c.value ? PINK : "#e0d8d0",
                        background: category === c.value ? "rgba(255,31,125,0.07)" : "white",
                        fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700,
                        color: category === c.value ? PINK : "#666", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5,
                      }}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={category === "bug" ? "Describe what happened — what were you doing when it broke?" : category === "compliment" ? "What do you love? Tell us everything ♡" : "What's your idea?"}
                  rows={4}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 16, border: "1.5px solid #F0E0E8", fontFamily: "var(--font-jost)", fontSize: 14, color: "#111", background: "white", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 14 }}
                />

                {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", marginBottom: 10 }}>{error}</p>}

                <button
                  onClick={() => void submit()}
                  disabled={sending || !message.trim()}
                  style={{ width: "100%", padding: "15px", borderRadius: 999, border: "none", background: sending || !message.trim() ? "rgba(255,31,125,0.4)" : PINK, color: "white", fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, cursor: "pointer" }}
                >
                  {sending ? "Sending…" : "Send →"}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
