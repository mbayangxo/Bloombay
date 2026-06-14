"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const INK   = "#111111";
const IVORY = "#fdf4ec";

interface FeedbackItem {
  id: string;
  user_id: string | null;
  category: string;
  priority: string;
  message: string;
  page_url: string | null;
  device_info: string | null;
  status: string;
  assigned_to: string | null;
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
  profiles?: { first_name: string | null; full_name: string | null; email: string | null } | null;
}

const AGENTS = [
  { name: "Aria",  area: "GirlMate",        emoji: "🏡", color: "#FF1F7D" },
  { name: "Nova",  area: "Member Portal",   emoji: "✦",  color: "#8B5CF6" },
  { name: "Quinn", area: "Performance",     emoji: "⚡",  color: "#3B82F6" },
  { name: "Sage",  area: "Safety & Content",emoji: "🛡️", color: "#10B981" },
  { name: "Zoe",   area: "UX & Feedback",   emoji: "💡",  color: "#F59E0B" },
];

const CATEGORY_LABEL: Record<string, string> = {
  bug:        "Bug",
  feature:    "Feature",
  compliment: "Compliment",
  other:      "Other",
};

const STATUS_COLOR: Record<string, string> = {
  open:      "#FF1F7D",
  in_review: "#F59E0B",
  resolved:  "#10B981",
  wont_fix:  "#9CA3AF",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function QADashboard() {
  const [items, setItems]       = useState<FeedbackItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("open");
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving]     = useState(false);
  const adminPw = process.env.NEXT_PUBLIC_ADMIN_PW ?? "";

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/feedback?status=${filter}`, {
      headers: { "x-admin-password": process.env.NEXT_PUBLIC_ADMIN_PW ?? "" },
    });
    if (res.ok) setItems(await res.json() as FeedbackItem[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => { void load(); }, [load]);

  async function updateItem(id: string, updates: Record<string, string>) {
    setSaving(true);
    await fetch("/api/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": adminPw },
      body: JSON.stringify({ id, ...updates }),
    });
    setSaving(false);
    await load();
    setSelected(null);
  }

  const openCount = items.filter(i => i.status === "open").length;

  return (
    <div style={{ minHeight: "100vh", background: IVORY, fontFamily: "var(--font-jost)", color: INK }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 3 }}>BLOOMBAY HQ</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 22, color: INK }}>QA &amp; Feedback</p>
        </div>
        <Link href="/admin/dashboard" style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", textDecoration: "none" }}>← Dashboard</Link>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>

        {/* Agent cards */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: "rgba(0,0,0,0.35)", marginBottom: 12 }}>YOUR QA TEAM</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {AGENTS.map(a => (
              <div key={a.name} style={{ background: "white", borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{a.emoji}</div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 13, color: INK }}>{a.name}</p>
                    <p style={{ fontSize: 9, color: a.color, fontWeight: 700, letterSpacing: "0.06em" }}>{a.area.toUpperCase()}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                  <span style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", fontWeight: 600 }}>Active</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", marginTop: 10, fontStyle: "italic" }}>
            Each agent monitors their area and flags issues to this dashboard. You can assign reports to specific agents.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "OPEN REPORTS", value: String(items.filter(i => i.status === "open").length) },
            { label: "IN REVIEW",    value: String(items.filter(i => i.status === "in_review").length) },
            { label: "RESOLVED",     value: String(items.filter(i => i.status === "resolved").length) },
          ].map(s => (
            <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.07)" }}>
              <p style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.18em", color: "rgba(0,0,0,0.3)", marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 32, color: PINK, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[{ v: "open", l: "Open" }, { v: "in_review", l: "In Review" }, { v: "resolved", l: "Resolved" }, { v: "all", l: "All" }].map(t => (
            <button
              key={t.v}
              onClick={() => setFilter(t.v)}
              style={{ padding: "7px 14px", borderRadius: 999, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jost)", background: filter === t.v ? PINK : "rgba(0,0,0,0.06)", color: filter === t.v ? "white" : "rgba(0,0,0,0.5)" }}
            >
              {t.l}
            </button>
          ))}
          <button onClick={() => void load()} style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jost)", background: "white", color: "rgba(0,0,0,0.5)" }}>Refresh ↻</button>
        </div>

        {/* Feedback list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.3)" }}>Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: "40px 24px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>✦</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, color: INK }}>All clear.</p>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>No {filter !== "all" ? filter : ""} reports right now.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => { setSelected(item); setNoteText(item.admin_notes ?? ""); }}
                style={{ background: "white", borderRadius: 16, padding: "16px 18px", border: `1px solid ${item.priority === "urgent" ? "rgba(255,31,125,0.3)" : "rgba(0,0,0,0.07)"}`, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.15s" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* Category badge */}
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: `${STATUS_COLOR[item.status] ?? PINK}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                    {item.category === "bug" ? "🐛" : item.category === "feature" ? "💡" : item.category === "compliment" ? "♡" : "◦"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", color: PINK }}>{CATEGORY_LABEL[item.category]?.toUpperCase()}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: STATUS_COLOR[item.status] ?? "#888", background: `${STATUS_COLOR[item.status] ?? "#888"}15`, borderRadius: 999, padding: "1px 7px" }}>{item.status.replace("_", " ")}</span>
                      {item.assigned_to && <span style={{ fontSize: 9, fontWeight: 700, color: "#888", background: "rgba(0,0,0,0.06)", borderRadius: 999, padding: "1px 7px" }}>→ {item.assigned_to}</span>}
                    </div>
                    <p style={{ fontSize: 13, color: INK, lineHeight: 1.5, marginBottom: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{item.message}</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {item.page_url && <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)" }}>{item.page_url}</span>}
                      {item.profiles?.first_name && <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)" }}>— {item.profiles.first_name}</span>}
                      <span style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", marginLeft: "auto" }}>{timeAgo(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101, background: "white", borderRadius: "24px 24px 0 0", padding: "12px 22px 40px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.1)" }} />
            </div>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>{CATEGORY_LABEL[selected.category]?.toUpperCase()} · {selected.status.replace("_"," ").toUpperCase()}</p>
            <p style={{ fontSize: 15, color: INK, lineHeight: 1.6, marginBottom: 16 }}>{selected.message}</p>
            {selected.page_url && <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 4 }}>Page: {selected.page_url}</p>}
            {selected.profiles?.email && <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 12 }}>From: {selected.profiles.email}</p>}
            {selected.device_info && <p style={{ fontSize: 9, color: "rgba(0,0,0,0.3)", marginBottom: 16, lineHeight: 1.5 }}>{selected.device_info}</p>}

            {/* Admin notes */}
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>ADMIN NOTES</p>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add notes for your team…"
              rows={3}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 14, border: "1.5px solid #F0E0E8", fontFamily: "var(--font-jost)", fontSize: 13, color: INK, resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 14 }}
            />

            {/* Assign to agent */}
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>ASSIGN TO</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {AGENTS.map(a => (
                <button
                  key={a.name}
                  onClick={() => void updateItem(selected.id, { assigned_to: a.name, admin_notes: noteText })}
                  style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${a.color}`, background: selected.assigned_to === a.name ? a.color : "white", color: selected.assigned_to === a.name ? "white" : a.color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-jost)" }}
                >
                  {a.emoji} {a.name}
                </button>
              ))}
            </div>

            {/* Status actions */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { status: "in_review", label: "Mark In Review", color: "#F59E0B" },
                { status: "resolved",  label: "Mark Resolved ✓", color: "#10B981" },
                { status: "wont_fix",  label: "Won't Fix",       color: "#9CA3AF" },
              ].map(action => (
                <button
                  key={action.status}
                  onClick={() => void updateItem(selected.id, { status: action.status, admin_notes: noteText })}
                  disabled={saving}
                  style={{ flex: 1, padding: "13px", borderRadius: 999, border: "none", background: action.color, color: "white", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
