"use client";

import { useState, useEffect, useCallback } from "react";

const PINK    = "#FF1F7D";
const DARK    = "#0F0A1A";
const CREAM   = "#FAF6F0";
const GOLD    = "#D4A853";
const GREEN   = "#2E7D32";
const RED     = "#C62828";

const SECTION_COLORS: Record<string, string> = {
  style:    "#C4005A",
  culture:  "#7B1FA2",
  love:     PINK,
  career:   "#1565C0",
  wellness: "#2E7D32",
  opinion:  "#E65100",
};

interface Pitch {
  id: string;
  section: string;
  headline: string;
  pitch_body: string;
  image_url: string | null;
  status: string;
  reviewer_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  author: any;
}

type StatusFilter = "pending" | "approved" | "rejected" | "all";

function PitchCard({
  pitch,
  onUpdate,
}: {
  pitch: Pitch;
  onUpdate: (id: string, status: "approved" | "rejected", note?: string) => Promise<void>;
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  const sectionColor = SECTION_COLORS[pitch.section] ?? DARK;
  const date = new Date(pitch.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const authorName = pitch.author?.first_name ?? pitch.author?.full_name?.split(" ")[0] ?? "Member";
  const initial = authorName[0]?.toUpperCase() ?? "B";
  const isPending = pitch.status === "pending";

  async function act(status: "approved" | "rejected") {
    setLoading(true);
    await onUpdate(pitch.id, status, note.trim() || undefined);
    setLoading(false);
  }

  return (
    <div style={{
      background: "white",
      borderRadius: 18,
      overflow: "hidden",
      border: `1px solid ${isPending ? `${sectionColor}22` : "rgba(0,0,0,0.07)"}`,
      boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
    }}>
      {/* Image — full width if present */}
      {pitch.image_url && (
        <div
          onClick={() => setImageExpanded(e => !e)}
          style={{ cursor: "pointer", position: "relative", overflow: "hidden", height: imageExpanded ? "auto" : 120 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pitch.image_url}
            alt="Pitch reference"
            style={{ width: "100%", height: imageExpanded ? "auto" : 120, objectFit: "cover", display: "block" }}
          />
          {!imageExpanded && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "0 10px 8px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>tap to expand</span>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "14px 16px" }}>
        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ background: sectionColor, color: "white", borderRadius: 99, padding: "2px 9px", fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, letterSpacing: "0.1em" }}>{pitch.section.toUpperCase()}</span>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${sectionColor}, ${sectionColor}88)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: "white" }}>{initial}</span>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.5)" }}>{authorName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.3)" }}>{date}</span>
            {!isPending && (
              <span style={{
                background: pitch.status === "approved" ? `${GREEN}15` : `${RED}15`,
                color: pitch.status === "approved" ? GREEN : RED,
                borderRadius: 99, padding: "2px 8px",
                fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, letterSpacing: "0.08em",
              }}>{pitch.status.toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Headline */}
        <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: DARK, lineHeight: 1.25, marginBottom: 8 }}>{pitch.headline}</h3>

        {/* Pitch body */}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.6)", lineHeight: 1.55, marginBottom: isPending ? 14 : 0 }}>{pitch.pitch_body}</p>

        {/* Reviewer note if set */}
        {pitch.reviewer_note && (
          <div style={{ background: `${GOLD}12`, borderLeft: `3px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "7px 10px", marginTop: 10 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.55)", fontStyle: "italic" }}>Note: {pitch.reviewer_note}</p>
          </div>
        )}

        {/* Actions — only pending */}
        {isPending && (
          <>
            {noteOpen && (
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note to the pitcher (optional)…"
                rows={2}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.1)", fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.7)", outline: "none", resize: "none", marginBottom: 10, boxSizing: "border-box" }}
              />
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => act("approved")}
                disabled={loading}
                style={{ flex: 1, padding: "10px", borderRadius: 99, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(0,0,0,0.05)" : GREEN, color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, opacity: loading ? 0.6 : 1 }}
              >Yes, commission →</button>
              <button
                onClick={() => act("rejected")}
                disabled={loading}
                style={{ flex: 1, padding: "10px", borderRadius: 99, border: `1.5px solid ${RED}33`, cursor: loading ? "not-allowed" : "pointer", background: `${RED}08`, color: RED, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, opacity: loading ? 0.6 : 1 }}
              >Pass</button>
              <button
                onClick={() => setNoteOpen(o => !o)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.1)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                title="Add a note"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 10V12h2l5.5-5.5-2-2L2 10zm9.2-6.8a.8.8 0 0 0 0-1.1l-.9-.9a.8.8 0 0 0-1.1 0L8 2.5l2 2 1.2-1.3z" fill="rgba(0,0,0,0.4)"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function MagazinePitchesPanel() {
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (status: StatusFilter) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/founder/pitches?status=${status}&limit=50`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setPitches(data.pitches ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filter); }, [filter, load]);

  async function handleUpdate(id: string, status: "approved" | "rejected", note?: string) {
    const res = await fetch("/api/founder/pitches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, reviewer_note: note }),
    });
    if (res.ok) setPitches(prev => prev.filter(p => p.id !== id));
  }

  const filters: StatusFilter[] = ["pending", "approved", "rejected", "all"];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: 40 }}>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 20 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0, padding: "7px 16px", borderRadius: 99,
              background: filter === f ? DARK : "white",
              color: filter === f ? "white" : "#888",
              border: `1.5px solid ${filter === f ? DARK : "rgba(0,0,0,0.1)"}`,
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>
        {loading ? "Loading…" : `${pitches.length} pitch${pitches.length !== 1 ? "es" : ""}`}
      </p>

      {error && (
        <div style={{ background: `${RED}10`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, border: `1px solid ${RED}22` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: RED }}>{error}</p>
        </div>
      )}

      {!loading && !error && pitches.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", background: CREAM, borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>✦</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: DARK, marginBottom: 6 }}>Nothing here yet.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.4)" }}>
            {filter === "pending" ? "No pitches waiting for review." : `No ${filter} pitches.`}
          </p>
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 160, background: "rgba(0,0,0,0.04)", borderRadius: 18, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      )}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pitches.map(p => <PitchCard key={p.id} pitch={p} onUpdate={handleUpdate} />)}
        </div>
      )}

      {/* Context note */}
      <div style={{ marginTop: 32, padding: "14px 16px", background: CREAM, borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.4)", lineHeight: 1.6 }}>
          Commissioning a pitch doesn&apos;t auto-publish anything. It marks the pitch as approved so you can follow up with the member. Use Founder Portal → Magazine Generate to produce the AI-drafted issue each week.
        </p>
      </div>
    </div>
  );
}
