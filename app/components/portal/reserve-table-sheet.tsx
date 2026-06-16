"use client";

import { useState } from "react";

const PINK = "#FF1F7D";
const PLUM = "#1A0A2E";

const TIMES = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];
const SIZES = [1, 2, 3, 4, 5, 6, 8, 10];

interface Props {
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
}

export function ReserveTableSheet({ restaurantId, restaurantName, onClose }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("7:00 PM");
  const [size, setSize] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  async function handleSubmit() {
    if (!date) { setError("Please select a date"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: restaurantId, restaurant_name: restaurantName, date, time, party_size: size, notes: notes || undefined }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? "Something went wrong"); setSubmitting(false); return; }
      setDone(true);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, backdropFilter: "blur(4px)" }} />

      {/* Sheet */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301, background: "#FEFCF7", borderRadius: "24px 24px 0 0", padding: "12px 20px", paddingBottom: "calc(28px + env(safe-area-inset-bottom,0px))", boxShadow: "0 -8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.1)" }} />
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>✓</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: PLUM, marginBottom: 8 }}>Request sent!</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>
              We&apos;ve sent your table request to <strong>{restaurantName}</strong>.<br/>You&apos;ll get an SMS confirmation within 24 hours.
            </p>
            <button onClick={onClose} style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: PINK, background: "none", border: `1.5px solid ${PINK}`, borderRadius: 999, padding: "10px 28px", cursor: "pointer" }}>
              Done ✦
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: PINK, letterSpacing: "0.16em", marginBottom: 4 }}>RESERVE A TABLE</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 22, color: PLUM, marginBottom: 20 }}>{restaurantName}</p>

            {/* Date */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "#aaa", letterSpacing: "0.14em", marginBottom: 8 }}>DATE</label>
              <input type="date" value={date} min={minDateStr} onChange={e => setDate(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${date ? PINK : "#E8E0D8"}`, fontFamily: "var(--font-jost)", fontSize: 14, color: "#111", background: "white", outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Time */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "#aaa", letterSpacing: "0.14em", marginBottom: 8 }}>TIME</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TIMES.map(t => (
                  <button key={t} onClick={() => setTime(t)} style={{ padding: "8px 14px", borderRadius: 999, border: `1.5px solid ${time === t ? PINK : "#E8E0D8"}`, background: time === t ? "rgba(255,31,125,0.07)" : "white", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: time === t ? PINK : "#666", cursor: "pointer" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Party size */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "#aaa", letterSpacing: "0.14em", marginBottom: 8 }}>PARTY SIZE</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SIZES.map(n => (
                  <button key={n} onClick={() => setSize(n)} style={{ width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${size === n ? PINK : "#E8E0D8"}`, background: size === n ? PINK : "white", fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, color: size === n ? "white" : "#666", cursor: "pointer" }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "#aaa", letterSpacing: "0.14em", marginBottom: 8 }}>SPECIAL REQUESTS <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Birthday celebration, dietary needs, seating preference…" rows={2}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #E8E0D8", fontFamily: "var(--font-jost)", fontSize: 13, color: "#111", background: "white", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box" }} />
            </div>

            {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", marginBottom: 10 }}>{error}</p>}

            <button onClick={() => void handleSubmit()} disabled={submitting || !date}
              style={{ width: "100%", padding: "16px", borderRadius: 999, border: "none", background: submitting || !date ? "rgba(255,31,125,0.4)" : PINK, color: "white", fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, cursor: submitting || !date ? "not-allowed" : "pointer" }}>
              {submitting ? "Sending request…" : `Request Table for ${size} →`}
            </button>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 10 }}>Confirmed within 24 hours · No charge until seated</p>
          </>
        )}
      </div>
    </>
  );
}
