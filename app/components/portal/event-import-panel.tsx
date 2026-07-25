"use client";

import { useState } from "react";
import Link from "next/link";

type Preview = {
  title: string;
  description: string | null;
  starts_at: string | null;
  venue: string | null;
  image_url: string | null;
  url: string;
  source?: string;
};

type ImportResult = {
  ok: boolean;
  source?: string;
  preview?: Preview;
  gatheringSlug?: string | null;
  status?: string;
  message?: string;
  error?: string;
};

const SOURCES = [
  { id: "luma", label: "Luma", hint: "lu.ma/…" },
  { id: "partiful", label: "Partiful", hint: "partiful.com/e/…" },
  { id: "eventbrite", label: "Eventbrite", hint: "eventbrite.com/e/…" },
];

/**
 * Paste a Luma / Partiful / Eventbrite link → preview → import into BloomBay.
 */
export function EventImportPanel({
  publishByDefault = true,
  clubId,
  compact = false,
}: {
  publishByDefault?: boolean;
  clubId?: string;
  compact?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publish, setPublish] = useState(publishByDefault);

  async function loadPreview() {
    setBusy(true);
    setError(null);
    setResult(null);
    setPreview(null);
    try {
      const res = await fetch(`/api/events/import?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn’t read that link");
      } else {
        setPreview(data.preview as Preview);
      }
    } catch {
      setError("Network error — try again");
    }
    setBusy(false);
  }

  async function importEvent() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/events/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), publish, clubId }),
      });
      const data = (await res.json()) as ImportResult;
      if (!res.ok) {
        setError(data.error ?? "Import failed");
      } else {
        setResult(data);
        if (data.preview) setPreview(data.preview);
      }
    } catch {
      setError("Network error — try again");
    }
    setBusy(false);
  }

  return (
    <div
      style={{
        background: compact ? "rgba(255,255,255,0.92)" : "#fff",
        border: "1px solid rgba(28,27,28,0.08)",
        borderRadius: 16,
        padding: compact ? 14 : 18,
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: "#FF1F7D",
          marginBottom: 6,
        }}
      >
        IMPORT EVENT
      </p>
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: compact ? 16 : 20,
          fontWeight: 700,
          color: "#1C1B1C",
          marginBottom: 8,
          lineHeight: 1.2,
        }}
      >
        Bring it over from Luma, Partiful, or Eventbrite.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {SOURCES.map((s) => (
          <span
            key={s.id}
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 9,
              fontWeight: 700,
              color: "#666",
              background: "rgba(0,0,0,0.04)",
              borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            {s.label}
          </span>
        ))}
      </div>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste event link…"
        style={{
          width: "100%",
          boxSizing: "border-box",
          border: "1.5px solid rgba(28,27,28,0.12)",
          borderRadius: 12,
          padding: "12px 14px",
          fontFamily: "var(--font-jost)",
          fontSize: 13,
          marginBottom: 10,
          outline: "none",
        }}
      />

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          fontFamily: "var(--font-jost)",
          fontSize: 11,
          color: "#555",
          cursor: "pointer",
        }}
      >
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
        Publish to Happenings now (otherwise queues for review)
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={!url.trim() || busy}
          onClick={loadPreview}
          style={{
            border: "1.5px solid rgba(28,27,28,0.15)",
            background: "transparent",
            borderRadius: 999,
            padding: "10px 16px",
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            fontWeight: 700,
            cursor: url.trim() && !busy ? "pointer" : "default",
            opacity: url.trim() && !busy ? 1 : 0.45,
          }}
        >
          Preview
        </button>
        <button
          type="button"
          disabled={!url.trim() || busy}
          onClick={importEvent}
          style={{
            border: "none",
            background: "#FF1F7D",
            color: "#fff",
            borderRadius: 999,
            padding: "10px 18px",
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            fontWeight: 800,
            cursor: url.trim() && !busy ? "pointer" : "default",
            opacity: url.trim() && !busy ? 1 : 0.45,
          }}
        >
          {busy ? "Working…" : "Import →"}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 12, fontFamily: "var(--font-jost)", fontSize: 12, color: "#B71C1C" }}>
          {error}
        </p>
      )}

      {preview && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,31,125,0.05)",
            border: "1px solid rgba(255,31,125,0.12)",
          }}
        >
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "#1C1B1C", marginBottom: 4 }}>
            {preview.title}
          </p>
          {preview.starts_at && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#666", marginBottom: 2 }}>
              {new Date(preview.starts_at).toLocaleString()}
            </p>
          )}
          {preview.venue && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#666" }}>{preview.venue}</p>
          )}
        </div>
      )}

      {result?.ok && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#059669", fontWeight: 700 }}>
            {result.message}
          </p>
          {result.gatheringSlug && (
            <Link
              href={`/member/happenings/${result.gatheringSlug}`}
              style={{
                display: "inline-block",
                marginTop: 8,
                fontFamily: "var(--font-jost)",
                fontSize: 11,
                fontWeight: 800,
                color: "#FF1F7D",
                textDecoration: "none",
              }}
            >
              View happening →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
