"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitANight } from "@/lib/actions/nights";

const PINK = "#FF1F7D";
const CREAM = "#FAF6F0";

const CATEGORIES = [
  "event",
  "brunch",
  "dining",
  "drinks",
  "nightlife",
  "art",
  "wellness",
  "shopping",
  "coffee",
  "pop-up",
] as const;

export default function SubmitANightPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [venue, setVenue] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("event");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitANight({
        title,
        description,
        starts_at: startsAt ? new Date(startsAt).toISOString() : undefined,
        venue,
        neighborhood,
        external_url: externalUrl,
        category,
      });
      if (!res.ok) {
        setError(res.error ?? "Couldn’t submit");
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 28,
          textAlign: "center",
          fontFamily: "var(--font-jost)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: 28,
            color: "#111",
            marginBottom: 10,
          }}
        >
          Night submitted ✦
        </p>
        <p style={{ fontSize: 14, color: "#888", maxWidth: 320, lineHeight: 1.5, marginBottom: 24 }}>
          Our team will review it. If it fits BloomBay, it shows up in Happenings for the girls.
        </p>
        <button
          type="button"
          onClick={() => router.push("/member/happenings")}
          style={{
            padding: "12px 22px",
            borderRadius: 999,
            border: "none",
            background: PINK,
            color: "white",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Back to Happenings
        </button>
      </div>
    );
  }

  const field: React.CSSProperties = {
    width: "100%",
    border: "none",
    borderBottom: "1.5px solid #E5DCD4",
    background: "transparent",
    padding: "12px 0",
    fontFamily: "var(--font-jost)",
    fontSize: 15,
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
  };

  const label: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#999",
    marginTop: 18,
    marginBottom: 4,
  };

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "var(--font-jost)", paddingBottom: 80 }}>
      <div style={{ padding: "52px 20px 20px" }}>
        <Link
          href="/member/happenings"
          style={{ fontSize: 13, color: PINK, textDecoration: "none", fontWeight: 700 }}
        >
          ← Happenings
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: 32,
            color: "#111",
            margin: "16px 0 8px",
          }}
        >
          Submit a night
        </h1>
        <p style={{ fontSize: 14, color: "#888", lineHeight: 1.5, maxWidth: 360 }}>
          Found a girl-oriented dinner, gallery, brunch, or soft night out? Share the link or details — we&apos;ll
          review and feature fits on Happenings.
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ padding: "0 20px", maxWidth: 480 }}>
        <label style={label}>What&apos;s the night?</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Museum Girls · Slow Art Sunday"
          style={field}
        />

        <label style={label}>When (optional)</label>
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          style={field}
        />

        <label style={label}>Venue</label>
        <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="The Met / Via Carota" style={field} />

        <label style={label}>Neighborhood</label>
        <input
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          placeholder="West Village"
          style={field}
        />

        <label style={label}>Link (Eventbrite, Luma, Instagram…)</label>
        <input
          type="url"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://"
          style={field}
        />

        <label style={label}>Vibe</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
          style={{ ...field, borderBottom: "1.5px solid #E5DCD4" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label style={label}>Why should Bloomies go?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Soft lighting, great table energy, no bro crawl energy…"
          style={{ ...field, resize: "vertical", border: "1.5px solid #E5DCD4", borderRadius: 12, padding: 12, marginTop: 6 }}
        />

        {error && (
          <p style={{ color: "#c0392b", fontSize: 13, marginTop: 12 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={pending || !title.trim()}
          style={{
            width: "100%",
            marginTop: 28,
            padding: "16px 0",
            borderRadius: 999,
            border: "none",
            background: title.trim() ? `linear-gradient(135deg, ${PINK}, #FF69B4)` : "#E8E0DA",
            color: title.trim() ? "white" : "#aaa",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: "0.06em",
            cursor: title.trim() ? "pointer" : "not-allowed",
          }}
        >
          {pending ? "Submitting…" : "Submit for review →"}
        </button>
      </form>
    </div>
  );
}
