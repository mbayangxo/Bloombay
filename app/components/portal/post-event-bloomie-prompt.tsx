"use client";

import { useEffect, useState } from "react";
import "@/app/styles/bloom-entrance.css";

interface Suggestion {
  id: string;
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
  shared_context: "gathering" | "event";
  gathering_title: string | null;
  gathering_id: string | null;
}

function initials(s: Suggestion) {
  const n = s.full_name || s.first_name || "?";
  return n.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
}

function displayName(s: Suggestion) {
  return s.first_name || s.full_name?.split(" ")[0] || "Her";
}

// ── Bloom request templates ───────────────────────────────────────────────────

const BLOOM_TEMPLATES = [
  { id: "classic", label: "Classic", swatch: "#FF1F7D", border: "none" },
  { id: "dark",    label: "Editorial", swatch: "#111111", border: "none" },
  { id: "cream",   label: "Script",   swatch: "#FFF8F0", border: "1.5px solid #FFB6D9" },
  { id: "minimal", label: "Minimal",  swatch: "#FFFFFF", border: "1.5px solid #FF1F7D" },
] as const;

type TemplateId = typeof BLOOM_TEMPLATES[number]["id"];

// ── Send Bloom Request Sheet ─────────────────────────────────────────────────

function SendBloomSheet({
  person,
  onClose,
  onSent,
}: {
  person: Suggestion;
  onClose: () => void;
  onSent: (id: string) => void;
}) {
  const [note, setNote] = useState("");
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const contextLine = person.gathering_title
    ? `You both went to "${person.gathering_title}"`
    : person.shared_context === "gathering"
    ? "You both attended the same gathering"
    : "You both sat at the same table";

  async function send() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/member/bloom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toUserId: person.id,
          context: contextLine,
          note: note.trim() || undefined,
          template,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      onSent(person.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSending(false);
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, backdropFilter: "blur(4px)" }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 201,
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          padding: "20px 20px 48px",
          boxShadow: "0 -16px 48px rgba(0,0,0,0.15)",
          animation: "bloomFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#eee", borderRadius: 2, margin: "0 auto 20px" }} />

        {/* Person */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          {person.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.avatar_url}
              alt={displayName(person)}
              style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,31,125,0.2)" }}
            />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, #FF1F7D, #FF9ECA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Jost, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff",
            }}>
              {initials(person)}
            </div>
          )}
          <div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>
              {displayName(person)}
            </p>
            {person.neighborhood && (
              <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#aaa", margin: "2px 0 0" }}>{person.neighborhood}</p>
            )}
          </div>
        </div>

        {/* Context pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,31,125,0.06)",
          border: "1px solid rgba(255,31,125,0.15)",
          borderRadius: 20,
          padding: "6px 12px",
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 12 }}>🌸</span>
          <span style={{ fontFamily: "Jost, sans-serif", fontSize: 11, color: "#FF1F7D", fontWeight: 600 }}>
            {contextLine}
          </span>
        </div>

        {/* Template picker */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FF1F7D", marginBottom: 10 }}>
            Choose your invitation style
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {BLOOM_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                style={{
                  flex: 1,
                  padding: "10px 4px 8px",
                  borderRadius: 12,
                  border: template === t.id ? "2px solid #FF1F7D" : "2px solid transparent",
                  background: template === t.id ? "#FFF0F5" : "#f8f8f8",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <div style={{
                  width: 32,
                  height: 22,
                  borderRadius: 5,
                  background: t.swatch,
                  border: t.border,
                  boxShadow: t.id === "classic" ? "0 2px 8px rgba(255,31,125,0.35)" : "0 1px 4px rgba(0,0,0,0.1)",
                }} />
                <span style={{
                  fontFamily: "Jost, sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: template === t.id ? "#FF1F7D" : "#aaa",
                }}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#111", margin: "0 0 6px" }}>
          Write her a little letter.
        </h2>
        <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#aaa", margin: "0 0 16px", lineHeight: 1.5 }}>
          Optional — but a note makes it real. She'll see it when she opens your bloom request.
        </p>

        {/* Note field */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Hey ${displayName(person)}, it was really nice meeting you at ${person.gathering_title ?? "the event"}…`}
            rows={4}
            maxLength={280}
            style={{
              width: "100%",
              background: "#FFF8F0",
              border: "1.5px solid rgba(255,31,125,0.2)",
              borderRadius: 14,
              padding: "14px 16px",
              fontFamily: "Jost, sans-serif",
              fontSize: 14,
              color: "#333",
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
              lineHeight: 1.6,
            }}
          />
          <span style={{
            position: "absolute",
            bottom: 10,
            right: 14,
            fontFamily: "Jost, sans-serif",
            fontSize: 10,
            color: note.length > 240 ? "#FF1F7D" : "#ccc",
          }}>
            {note.length}/280
          </span>
        </div>

        {error && <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#FF1F7D", marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "14px", borderRadius: 14, border: "1.5px solid #eee",
              background: "#fff", fontFamily: "Jost, sans-serif", fontSize: 12,
              fontWeight: 700, color: "#999", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={send}
            disabled={sending}
            style={{
              flex: 2, padding: "14px", borderRadius: 14, border: "none",
              background: sending ? "#eee" : "#FF1F7D",
              fontFamily: "Jost, sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: sending ? "#bbb" : "#fff",
              cursor: sending ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {sending ? "Sending…" : "Send bloom request 🌸"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Witness Sheet ─────────────────────────────────────────────────────────────

function WitnessSheet({
  person,
  onClose,
  onSent,
}: {
  person: Suggestion;
  onClose: () => void;
  onSent: () => void;
}) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    if (!note.trim()) { setError("Write something you noticed."); return; }
    if (!person.gathering_id) { setError("No gathering context."); return; }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/member/witness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_user_id: person.id,
          gathering_id: person.gathering_id,
          note: note.trim(),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      onSent();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSending(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
        background: "#fff", borderRadius: "20px 20px 0 0", padding: "20px 20px 48px",
        boxShadow: "0 -16px 48px rgba(0,0,0,0.15)", animation: "bloomFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
        maxHeight: "80vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, background: "#eee", borderRadius: 2, margin: "0 auto 20px" }} />

        {/* Person header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          {person.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={person.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,31,125,0.2)" }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#FF1F7D,#FF9ECA)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Jost,sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
              {(person.first_name ?? person.full_name ?? "?")[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "#111", margin: 0 }}>
              {person.first_name || person.full_name?.split(" ")[0] || "Her"}
            </p>
            <p style={{ fontFamily: "Jost,sans-serif", fontSize: 10, color: "#aaa", margin: "2px 0 0" }}>Something you noticed about her at this event.</p>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 20, color: "#111", margin: "0 0 6px" }}>
          What did you witness?
        </h2>
        <p style={{ fontFamily: "Jost,sans-serif", fontSize: 12, color: "#aaa", margin: "0 0 16px", lineHeight: 1.5 }}>
          A moment, a quality, something true. She&apos;ll see it on her profile. Under 280 characters.
        </p>

        <div style={{ position: "relative", marginBottom: 20 }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`She moved the whole room without trying…`}
            rows={4}
            maxLength={280}
            style={{
              width: "100%", background: "#FFF8F0", border: "1.5px solid rgba(255,31,125,0.2)",
              borderRadius: 14, padding: "14px 16px", fontFamily: "Jost,sans-serif", fontSize: 14,
              color: "#333", outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.6,
            }}
          />
          <span style={{ position: "absolute", bottom: 10, right: 14, fontFamily: "Jost,sans-serif", fontSize: 10, color: note.length > 240 ? "#FF1F7D" : "#ccc" }}>
            {note.length}/280
          </span>
        </div>

        {error && <p style={{ fontFamily: "Jost,sans-serif", fontSize: 12, color: "#FF1F7D", marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "1.5px solid #eee", background: "#fff", fontFamily: "Jost,sans-serif", fontSize: 12, fontWeight: 700, color: "#999", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={send} disabled={sending} style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: sending ? "#eee" : "#111", fontFamily: "Jost,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sending ? "#bbb" : "#fff", cursor: sending ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
            {sending ? "Sending…" : "Share what you witnessed ✦"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Flower Sheet ──────────────────────────────────────────────────────────────

function FlowerSheet({
  person,
  onClose,
  onSent,
}: {
  person: Suggestion;
  onClose: () => void;
  onSent: () => void;
}) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/member/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_user_id: person.id,
          gathering_id: person.gathering_id ?? undefined,
          note: note.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        if (d.error === "already_sent") { onSent(); return; }
        throw new Error(d.error ?? "Something went wrong");
      }
      onSent();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSending(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
        background: "#fff", borderRadius: "20px 20px 0 0", padding: "20px 20px 48px",
        boxShadow: "0 -16px 48px rgba(0,0,0,0.15)", animation: "bloomFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        <div style={{ width: 36, height: 4, background: "#eee", borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 36, margin: "0 0 8px" }}>🌸</p>
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: 22, color: "#111", margin: "0 0 6px" }}>
            Send {person.first_name || person.full_name?.split(" ")[0] || "her"} flowers.
          </h2>
          <p style={{ fontFamily: "Jost,sans-serif", fontSize: 12, color: "#aaa", lineHeight: 1.5 }}>
            Optional note — 120 characters max.
          </p>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="You made tonight feel like something…"
          rows={3}
          maxLength={120}
          style={{
            width: "100%", background: "#FFF8F0", border: "1.5px solid rgba(255,31,125,0.2)",
            borderRadius: 14, padding: "14px 16px", fontFamily: "Jost,sans-serif", fontSize: 14,
            color: "#333", outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.6, marginBottom: 16,
          }}
        />

        {error && <p style={{ fontFamily: "Jost,sans-serif", fontSize: 12, color: "#FF1F7D", marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "1.5px solid #eee", background: "#fff", fontFamily: "Jost,sans-serif", fontSize: 12, fontWeight: 700, color: "#999", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={send} disabled={sending} style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: sending ? "#eee" : "#FF1F7D", fontFamily: "Jost,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sending ? "#bbb" : "#fff", cursor: sending ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
            {sending ? "Sending…" : "Send flowers 🌸"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Post-event suggestion card ───────────────────────────────────────────────

function SuggestionCard({
  person,
  onBloom,
  onDismiss,
  onWitness,
  onFlower,
}: {
  person: Suggestion;
  onBloom: () => void;
  onDismiss: () => void;
  onWitness: () => void;
  onFlower: () => void;
}) {
  return (
    <div
      className="bloom-card-enter bloom-lift"
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "14px 16px",
        boxShadow: "0 2px 12px rgba(255,31,125,0.08)",
        border: "1px solid rgba(255,31,125,0.1)",
      }}
    >
      {/* Top row: avatar + info + dismiss + bloom */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Avatar */}
        {person.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.avatar_url}
            alt={displayName(person)}
            style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #FF1F7D, #FF9ECA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Jost, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff",
            flexShrink: 0,
          }}>
            {initials(person)}
          </div>
        )}

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "#111", margin: 0 }}>
            {displayName(person)}
          </p>
          <p style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#aaa", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {person.neighborhood ? `${person.neighborhood} · ` : ""}
            {person.gathering_title ? `met at ${person.gathering_title}` : "you both went"}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={onDismiss}
            style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #eee", background: "#fff", cursor: "pointer", fontSize: 14, color: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>
          <button
            onClick={onBloom}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background: "#FF1F7D",
              fontFamily: "Jost, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#fff",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Bloom her 🌸
          </button>
        </div>
      </div>

      {/* Secondary actions row — only show if gathering context exists */}
      {person.gathering_id && (
        <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: "1px solid rgba(255,31,125,0.08)", marginTop: 8 }}>
          <button
            onClick={onWitness}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", background: "#fafafa", fontFamily: "Jost,sans-serif", fontSize: 10, fontWeight: 700, color: "#555", cursor: "pointer", textAlign: "center" as const }}
          >
            Say something you noticed ✦
          </button>
          <button
            onClick={onFlower}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,31,125,0.15)", background: "rgba(255,31,125,0.04)", fontFamily: "Jost,sans-serif", fontSize: 10, fontWeight: 700, color: "#FF1F7D", cursor: "pointer", textAlign: "center" as const }}
          >
            Send her flowers 🌸
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export function PostEventBloomiePrompt() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissed, setDismissed]     = useState<Set<string>>(new Set());
  const [bloomed, setBloomed]         = useState<Set<string>>(new Set());
  const [composing, setComposing]     = useState<Suggestion | null>(null);
  const [sent, setSent]               = useState<Set<string>>(new Set());
  const [witnessing, setWitnessing]   = useState<Suggestion | null>(null);
  const [flowering, setFlowering]     = useState<Suggestion | null>(null);
  const [witnessed, setWitnessed]     = useState<Set<string>>(new Set());
  const [flowered, setFlowered]       = useState<Set<string>>(new Set());
  const [witnessToast, setWitnessToast] = useState(false);
  const [flowerToast, setFlowerToast]   = useState(false);

  useEffect(() => {
    fetch("/api/member/people-you-met")
      .then((r) => (r.ok ? r.json() : { suggestions: [] }))
      .then((d) => setSuggestions(d.suggestions ?? []))
      .catch(() => undefined);
  }, []);

  const visible = suggestions.filter(
    (s) => !dismissed.has(s.id) && !bloomed.has(s.id) && !sent.has(s.id)
  );

  if (visible.length === 0) return null;

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "#FF1F7D", textTransform: "uppercase", marginBottom: 4 }}>
              You met them
            </p>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#111", margin: 0 }}>
              Want to become Bloomies?
            </h3>
          </div>
          <button
            onClick={() => setDismissed(new Set(visible.map((s) => s.id)))}
            style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#ccc", background: "none", border: "none", cursor: "pointer" }}
          >
            Clear all
          </button>
        </div>

        <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#aaa", margin: "0 0 14px", lineHeight: 1.5 }}>
          You can only bloom someone you've actually spent time with. That's the rule.
        </p>

        <div className="bloom-stagger" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visible.map((s) => (
            <SuggestionCard
              key={s.id}
              person={s}
              onBloom={() => setComposing(s)}
              onDismiss={() => setDismissed((prev) => new Set([...prev, s.id]))}
              onWitness={() => setWitnessing(s)}
              onFlower={() => setFlowering(s)}
            />
          ))}
        </div>
      </div>

      {/* Success toast */}
      {sent.size > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "#fff",
            borderRadius: 20,
            padding: "10px 20px",
            fontFamily: "Jost, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            zIndex: 300,
            whiteSpace: "nowrap",
            animation: "bloomFadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          Bloom request sent 🌸
        </div>
      )}

      {/* Compose sheet */}
      {composing && (
        <SendBloomSheet
          person={composing}
          onClose={() => setComposing(null)}
          onSent={(id) => {
            setComposing(null);
            setSent((prev) => new Set([...prev, id]));
            setBloomed((prev) => new Set([...prev, id]));
            setTimeout(() => setSent(new Set()), 3000);
          }}
        />
      )}
    </>
  );
}
