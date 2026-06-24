"use client";

import { useState, useEffect, useCallback } from "react";

const PINK   = "#FF1F7D";
const DARK   = "#0F0A1A";
const CREAM  = "#FAF6F0";
const GOLD   = "#D4A853";
const RED    = "#C62828";
const GREEN  = "#2E7D32";
const AMBER  = "#E65100";

interface Flag {
  claim: string;
  risk: "high" | "medium" | "low";
  issue: string;
  suggestion: string;
}

interface ModerationItem {
  id: string;
  source_table: string;
  source_id: string;
  content_type: string;
  content_text: string | null;
  verdict: string;
  risk_score: number;
  flags: Flag[] | null;
  summary: string | null;
  auto_flagged: boolean;
  reviewed_at: string | null;
  created_at: string;
}

type VerdictFilter = "needs_review" | "approved" | "rejected" | "pass" | "all";

const VERDICT_LABELS: Record<VerdictFilter, string> = {
  needs_review: "Needs Review",
  approved: "Approved",
  rejected: "Rejected",
  pass: "Passed",
  all: "All",
};

const RISK_COLORS: Record<Flag["risk"], string> = {
  high: RED,
  medium: AMBER,
  low: GOLD,
};

const TYPE_LABELS: Record<string, string> = {
  wall_post: "Wall Post",
  magazine_article: "Magazine",
  avenue_content: "Avenue",
  drop: "Drop",
  city_spot: "City Spot",
};

function riskBar(score: number) {
  const color = score >= 70 ? RED : score >= 30 ? AMBER : GREEN;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s" }} />
      </div>
      <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color, minWidth: 24 }}>{score}</span>
    </div>
  );
}

function FlagRow({ flag }: { flag: Flag }) {
  const [open, setOpen] = useState(false);
  const col = RISK_COLORS[flag.risk];
  return (
    <div style={{ borderRadius: 8, border: `1px solid ${col}22`, background: `${col}08`, marginBottom: 6 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", textAlign: "left", padding: "8px 10px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ background: col, color: "white", borderRadius: 99, padding: "1px 7px", fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, letterSpacing: "0.1em", flexShrink: 0 }}>{flag.risk.toUpperCase()}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{flag.claim}</span>
        </div>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? "rotate(180deg)" : undefined, flexShrink: 0 }}>
          <path d="M2 3.5l3 3 3-3" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.55)" }}><strong>Issue:</strong> {flag.issue}</p>
          <div style={{ background: `${GREEN}10`, borderLeft: `3px solid ${GREEN}`, borderRadius: "0 6px 6px 0", padding: "6px 8px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.6)" }}><strong>Suggestion:</strong> {flag.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemCard({
  item,
  onVerdict,
}: {
  item: ModerationItem;
  onVerdict: (id: string, verdict: "approved" | "rejected") => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function act(verdict: "approved" | "rejected") {
    setLoading(true);
    await onVerdict(item.id, verdict);
    setLoading(false);
  }

  const isPending = item.verdict === "needs_review";
  const flags = item.flags ?? [];
  const date = new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const typeLabel = TYPE_LABELS[item.content_type] ?? item.content_type;

  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      border: `1px solid ${item.verdict === "needs_review" ? `${AMBER}33` : "rgba(0,0,0,0.07)"}`,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      {/* Header row */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{
            background: item.verdict === "needs_review" ? `${AMBER}15` : item.verdict === "approved" ? `${GREEN}15` : item.verdict === "rejected" ? `${RED}15` : "rgba(0,0,0,0.05)",
            color: item.verdict === "needs_review" ? AMBER : item.verdict === "approved" ? GREEN : item.verdict === "rejected" ? RED : "#888",
            borderRadius: 99, padding: "2px 8px",
            fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, letterSpacing: "0.1em", flexShrink: 0,
          }}>{item.verdict.replace("_", " ").toUpperCase()}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>{typeLabel}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.3)", flexShrink: 0 }}>{date}</span>
        </div>
        <div style={{ flexShrink: 0, width: 80 }}>
          {riskBar(item.risk_score)}
        </div>
      </div>

      {/* Summary */}
      {item.summary && (
        <div style={{ padding: "0 16px 10px" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>{item.summary}</p>
        </div>
      )}

      {/* Flags summary + expand */}
      {flags.length > 0 && (
        <div style={{ padding: "0 16px 10px" }}>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}
          >
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: AMBER }}>
              {flags.length} flag{flags.length !== 1 ? "s" : ""}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: expanded ? "rotate(180deg)" : undefined }}>
              <path d="M2 3.5l3 3 3-3" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {expanded && (
            <div style={{ marginTop: 8 }}>
              {flags.map((f, i) => <FlagRow key={i} flag={f} />)}
              {item.content_text && (
                <details style={{ marginTop: 10 }}>
                  <summary style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.4)", cursor: "pointer" }}>View content snapshot</summary>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.55)", lineHeight: 1.6, marginTop: 8, padding: "8px 10px", background: "rgba(0,0,0,0.03)", borderRadius: 8 }}>
                    {item.content_text.slice(0, 600)}{item.content_text.length > 600 ? "…" : ""}
                  </p>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action buttons — only for pending items */}
      {isPending && (
        <div style={{ padding: "10px 16px 14px", display: "flex", gap: 8, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <button
            onClick={() => act("approved")}
            disabled={loading}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 99, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "rgba(0,0,0,0.06)" : GREEN, color: "white",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, opacity: loading ? 0.6 : 1,
            }}
          >
            Approve
          </button>
          <button
            onClick={() => act("rejected")}
            disabled={loading}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 99, border: `1.5px solid ${RED}33`, cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "rgba(0,0,0,0.06)" : `${RED}10`, color: RED,
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, opacity: loading ? 0.6 : 1,
            }}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

export function ContentModeration() {
  const [filter, setFilter] = useState<VerdictFilter>("needs_review");
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (verdict: VerdictFilter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/founder/moderation?verdict=${verdict}&limit=50`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filter); }, [filter, load]);

  async function handleVerdict(id: string, verdict: "approved" | "rejected") {
    const res = await fetch("/api/founder/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, verdict }),
    });
    if (res.ok) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }

  const filters: VerdictFilter[] = ["needs_review", "approved", "rejected", "pass", "all"];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 0 40px" }}>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 20 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0, padding: "7px 14px", borderRadius: 99,
              background: filter === f ? DARK : "white",
              color: filter === f ? "white" : "#888",
              border: `1.5px solid ${filter === f ? DARK : "rgba(0,0,0,0.1)"}`,
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            {VERDICT_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 14 }}>
        {loading ? "Loading…" : `${items.length} item${items.length !== 1 ? "s" : ""}`}
      </p>

      {/* Error */}
      {error && (
        <div style={{ background: `${RED}10`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, border: `1px solid ${RED}22` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: RED }}>{error}</p>
        </div>
      )}

      {/* Items */}
      {!loading && !error && items.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", background: CREAM, borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>✓</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: DARK, marginBottom: 6 }}>All clear.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.45)" }}>
            {filter === "needs_review" ? "Nothing waiting for review right now." : `No items with verdict: ${filter}.`}
          </p>
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 80, background: "rgba(0,0,0,0.04)", borderRadius: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      )}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(item => (
            <ItemCard key={item.id} item={item} onVerdict={handleVerdict} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: 32, padding: "16px 18px", background: CREAM, borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: "rgba(0,0,0,0.35)", marginBottom: 10 }}>RISK SCORE GUIDE</p>
        <div style={{ display: "flex", gap: 16 }}>
          {[{ color: GREEN, label: "0–29 Low risk" }, { color: AMBER, label: "30–69 Review" }, { color: RED, label: "70+ High risk" }].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.45)" }}>{label}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.35)", marginTop: 10, lineHeight: 1.5 }}>
          Wall posts are checked automatically on submit. Magazine articles are checked at generation time. Approving here logs your review — it does not change the content&apos;s live status.
        </p>
      </div>
    </div>
  );
}
