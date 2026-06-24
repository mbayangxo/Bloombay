"use client";

import { useState } from "react";
import Link from "next/link";
import type { Event } from "@/lib/actions/events";
import { leaveHostReview } from "@/lib/actions/happenings";
import { PINK } from "@/lib/happenings/constants";

export function HostReviewSheet({ ev, onClose, onDone }: { ev: Event; onClose: () => void; onDone: (id: string) => void }) {
  const [rating, setRating]   = useState(0);
  const [content, setContent] = useState("");
  const [saving, setSaving]   = useState(false);

  async function submit() {
    if (!rating || saving || !ev.host_name) return;
    setSaving(true);
    const res = await leaveHostReview(ev.id, ev.id, rating, content);
    if (res.ok) onDone(ev.id);
    setSaving(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.5)", position: "absolute", inset: 0 }}/>
      <div style={{ position: "relative", background: "#FFF8F2", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", zIndex: 1 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)", margin: "0 auto 16px" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>RATE THE HOST</p>
        {ev.host_id ? (
          <Link href={`/member/host/${ev.host_id}`} style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: PINK, marginBottom: 4 }}>{ev.host_name ?? "The host"} →</p>
          </Link>
        ) : (
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", marginBottom: 4 }}>{ev.host_name ?? "The host"}</p>
        )}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#9A8070", marginBottom: 18 }}>{ev.title}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{
              width: 44, height: 44, borderRadius: 10, border: "none",
              background: n <= rating ? PINK : "rgba(0,0,0,0.06)",
              fontSize: 20, cursor: "pointer",
              boxShadow: n <= rating ? `0 3px 12px ${PINK}44` : "none",
            }}>⭐</button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Say something about her hosting… (optional)"
          rows={3}
          maxLength={300}
          style={{
            width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.1)",
            padding: "12px 14px", fontFamily: "var(--font-caveat)", fontSize: 16,
            color: "#3A2A1A", resize: "none", outline: "none", background: "white",
            marginBottom: 14,
          }}
        />
        <button onClick={submit} disabled={!rating || saving} style={{
          width: "100%", padding: "14px", borderRadius: 999,
          background: rating ? PINK : "rgba(0,0,0,0.08)",
          color: rating ? "white" : "#AAA", border: "none",
          fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em",
          cursor: rating ? "pointer" : "default",
          boxShadow: rating ? `0 4px 18px ${PINK}55` : "none",
        }}>
          {saving ? "SAVING…" : "LEAVE REVIEW ✦"}
        </button>
      </div>
    </div>
  );
}
