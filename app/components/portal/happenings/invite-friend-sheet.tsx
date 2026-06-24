"use client";

import { useState } from "react";
import type { Event } from "@/lib/actions/events";
import { PINK } from "@/lib/happenings/constants";

export function InviteFriendSheet({ ev, onClose }: { ev: Event; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? `${window.location.origin}/member/happenings/${ev.slug ?? ev.id}` : "";

  function copy() {
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.5)", position: "absolute", inset: 0 }}/>
      <div style={{ position: "relative", background: "#FFF8F2", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", zIndex: 1 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)", margin: "0 auto 16px" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>BRING A FRIEND</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", marginBottom: 6 }}>{ev.title}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#9A8070", marginBottom: 18, lineHeight: 1.4 }}>Women only. Your friend will need to verify she&apos;s a woman to join Bloombay.</p>
        <div style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(0,0,0,0.08)", marginBottom: 12, wordBreak: "break-all" as const }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#999", marginBottom: 4, letterSpacing: "0.08em" }}>INVITE LINK</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#444" }}>{link}</p>
        </div>
        <button onClick={copy} style={{
          width: "100%", padding: "14px", borderRadius: 999,
          background: copied ? "#22C55E" : PINK, color: "white", border: "none",
          fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em",
          cursor: "pointer", boxShadow: copied ? "0 4px 18px rgba(34,197,94,0.35)" : `0 4px 18px ${PINK}55`,
        }}>
          {copied ? "COPIED ✓" : "COPY LINK"}
        </button>
      </div>
    </div>
  );
}
