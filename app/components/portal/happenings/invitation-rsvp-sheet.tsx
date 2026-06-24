"use client";

import { useState } from "react";
import type { Event } from "@/lib/actions/events";
import { PINK } from "@/lib/happenings/constants";

export function InvitationRsvpSheet({ ev, onClose }: { ev: Event; onClose: () => void }) {
  const [choice, setChoice] = useState<"going" | "maybe" | "cant" | null>(null);
  const [msg, setMsg] = useState("");
  const [confettiSent, setConfettiSent] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.55)", position: "absolute", inset: 0, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#FFF8F0", borderRadius: "22px 22px 0 0", padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 32px)", zIndex: 1, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.14)", margin: "0 auto 18px" }} />

        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{confettiSent ? "🎊" : choice === "going" ? "🌸" : choice === "maybe" ? "🤞" : "💌"}</div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "#111", marginBottom: 6 }}>
              {confettiSent ? "Confetti sent!" : choice === "going" ? "You're going!" : choice === "maybe" ? "Noted!" : "They know you care."}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#999" }}>
              {choice === "going" ? "She'll see you there." : "You can always send her confetti later."}
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: `${PINK}99`, marginBottom: 4 }}>💌 YOU WERE INVITED</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "#111", lineHeight: 1.15, marginBottom: 4 }}>{ev.title}</p>
            {ev.host_name && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", marginBottom: 16 }}>Hosted by {ev.host_name}</p>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {([
                { key: "going",  label: "I'm going",           emoji: "🌸" },
                { key: "maybe",  label: "I'll try to make it", emoji: "🤞" },
                { key: "cant",   label: "Can't make it",        emoji: "💌" },
              ] as { key: "going" | "maybe" | "cant"; label: string; emoji: string }[]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setChoice(opt.key)}
                  style={{
                    flex: 1, padding: "12px 6px", borderRadius: 14, border: "none", cursor: "pointer",
                    background: choice === opt.key ? `${PINK}18` : "white",
                    outline: choice === opt.key ? `2px solid ${PINK}` : "1px solid rgba(0,0,0,0.1)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, color: choice === opt.key ? PINK : "#555", textAlign: "center", lineHeight: 1.3 }}>{opt.label}</p>
                </button>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.1)", padding: "12px 14px", marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.12em", color: "#999", marginBottom: 6 }}>SEND A MESSAGE</p>
              <textarea
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder={choice === "cant" ? "Let her know you're thinking of her…" : choice === "maybe" ? "Let her know you'll try…" : "Can't wait to celebrate you!"}
                rows={2}
                style={{ width: "100%", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: "#111", resize: "none", background: "transparent" }}
              />
            </div>

            <button
              onClick={() => setConfettiSent(true)}
              style={{ width: "100%", padding: "12px", borderRadius: 14, border: `1.5px solid ${confettiSent ? PINK : "rgba(255,31,125,0.25)"}`, background: confettiSent ? `${PINK}12` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, transition: "all 0.15s" }}
            >
              <span style={{ fontSize: 20 }}>🎊</span>
              <div style={{ flex: 1, textAlign: "left" as const }}>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 12, color: PINK }}>
                  {confettiSent ? "Confetti sent! 🎊" : "Send her confetti"}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#999", marginTop: 1 }}>A little celebration, whether you&apos;re going or not</p>
              </div>
              {confettiSent && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>

            <button
              onClick={() => setDone(true)}
              disabled={!choice}
              style={{ width: "100%", padding: "15px", borderRadius: 18, background: choice ? PINK : "rgba(0,0,0,0.08)", border: "none", cursor: choice ? "pointer" : "default", fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", color: choice ? "white" : "rgba(0,0,0,0.3)", boxShadow: choice ? `0 6px 22px ${PINK}44` : "none", transition: "all 0.15s" }}
            >
              {choice === "going" ? "I'm going 🌸" : choice === "maybe" ? "I'll try to make it 🤞" : choice === "cant" ? "Send my love 💌" : "Choose one above"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
