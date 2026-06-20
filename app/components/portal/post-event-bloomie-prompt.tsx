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
}

function initials(s: Suggestion) {
  const n = s.full_name || s.first_name || "?";
  return n.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
}

function displayName(s: Suggestion) {
  return s.first_name || s.full_name?.split(" ")[0] || "Her";
}

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

// ── Post-event suggestion card ───────────────────────────────────────────────

function SuggestionCard({
  person,
  onBloom,
  onDismiss,
}: {
  person: Suggestion;
  onBloom: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className="bloom-card-enter bloom-lift"
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 2px 12px rgba(255,31,125,0.08)",
        border: "1px solid rgba(255,31,125,0.1)",
      }}
    >
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
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export function PostEventBloomiePrompt() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissed, setDismissed]     = useState<Set<string>>(new Set());
  const [bloomed, setBloomed]         = useState<Set<string>>(new Set());
  const [composing, setComposing]     = useState<Suggestion | null>(null);
  const [sent, setSent]               = useState<Set<string>>(new Set());

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
