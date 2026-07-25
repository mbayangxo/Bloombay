"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getMyGems, type SavedGem } from "@/lib/actions/member-saves";
import { getMySavedNotes } from "@/lib/actions/bloom-notes";
import type { BloomNote } from "@/lib/bloom-notes/shared";

const PINK = "#FF1F7D";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

type Filter = "all" | "happenings" | "places" | "notes";

type ProfileGemsPanelProps = {
  /** Compact for profile tab; full for /member/gems */
  compact?: boolean;
  showHeader?: boolean;
};

export function ProfileGemsPanel({ compact = false, showHeader = true }: ProfileGemsPanelProps) {
  const [gems, setGems] = useState<SavedGem[]>([]);
  const [notes, setNotes] = useState<BloomNote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const [g, n] = await Promise.all([getMyGems(), getMySavedNotes()]);
      setGems(g);
      setNotes(n);
      setLoaded(true);
    });
  }, []);

  const total = gems.length + notes.length;
  const showHappenings = filter === "all" || filter === "happenings";
  const showPlaces = filter === "all" || filter === "places";
  const showNotes = filter === "all" || filter === "notes";

  const happeningGems = showHappenings ? gems.filter((g) => g.kind === "happening") : [];
  const placeGems = showPlaces ? gems.filter((g) => g.kind === "place") : [];
  const noteList = showNotes ? notes : [];
  const empty =
    happeningGems.length === 0 && placeGems.length === 0 && noteList.length === 0;

  return (
    <div style={{ fontFamily: "var(--font-jost)" }}>
      {showHeader ? (
        <div style={{ marginBottom: compact ? 14 : 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              {!compact ? (
                <>
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: PINK,
                      marginBottom: 6,
                    }}
                  >
                    BloomBay
                  </p>
                  <h1
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(28px,7vw,40px)",
                      fontWeight: 900,
                      color: "#111",
                      lineHeight: 1.05,
                      marginBottom: 6,
                    }}
                  >
                    My gems
                  </h1>
                </>
              ) : (
                <p
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    color: "rgba(255,31,125,0.6)",
                    marginBottom: 8,
                  }}
                >
                  MY GEMS
                </p>
              )}
              <p style={{ fontSize: compact ? 12 : 14, color: "#888" }}>
                Happenings, places, and Bloom Notes you saved.
                {loaded ? ` · ${total}` : ""}
              </p>
            </div>
            {compact ? (
              <Link
                href="/member/gems"
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: PINK,
                  textDecoration: "none",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                Open all →
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(
          [
            ["all", "All"],
            ["happenings", "Happenings"],
            ["places", "Places"],
            ["notes", "Notes"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.04em",
              cursor: "pointer",
              border: filter === id ? "none" : "1.5px solid #E8E8E8",
              background: filter === id ? "#111" : "white",
              color: filter === id ? "white" : "#888",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <p style={{ fontSize: 12, color: "#bbb", textAlign: "center", padding: "28px 0" }}>
          Loading your gems…
        </p>
      ) : empty ? (
        <div
          style={{
            textAlign: "center",
            padding: compact ? "28px 16px" : "48px 16px",
            background: "white",
            borderRadius: 18,
            border: "1px solid rgba(255,31,125,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 18,
              color: "#ccc",
              marginBottom: 8,
            }}
          >
            Nothing saved yet
          </p>
          <p style={{ fontSize: 13, color: "#aaa", marginBottom: 18 }}>
            Tap Save on a happening or place, or bookmark a Bloom Note.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link
              href="/member/happenings"
              style={{
                padding: "12px",
                borderRadius: 14,
                background: PINK,
                color: "white",
                fontWeight: 800,
                fontSize: 12,
                textDecoration: "none",
              }}
            >
              Browse Happenings
            </Link>
            <Link
              href="/member/city"
              style={{
                padding: "12px",
                borderRadius: 14,
                background: "rgba(0,0,0,0.04)",
                color: "#444",
                fontWeight: 800,
                fontSize: 12,
                textDecoration: "none",
              }}
            >
              Explore The City
            </Link>
          </div>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {happeningGems.map((gem) => (
            <li key={`h-${gem.id}`}>
              <Link
                href={`/member/happenings/${gem.slug}`}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 12,
                  background: "white",
                  borderRadius: 16,
                  textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <Thumb url={gem.image_url} fallback="✦" pink />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: PINK, textTransform: "uppercase" }}>
                    Happening
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#111",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {gem.title}
                  </p>
                  <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                    {formatWhen(gem.starts_at)}
                    {gem.venue || gem.neighborhood || gem.area
                      ? ` · ${[gem.venue, gem.neighborhood ?? gem.area].filter(Boolean).join(" · ")}`
                      : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}

          {placeGems.map((gem) => (
            <li key={`p-${gem.id}`}>
              <Link
                href="/member/city/trending"
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 12,
                  background: "white",
                  borderRadius: 16,
                  textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <Thumb url={gem.image_url} fallback="✿" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "#888", textTransform: "uppercase" }}>
                    Place · {gem.category}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#111",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {gem.name}
                  </p>
                  {gem.neighborhood ? (
                    <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{gem.neighborhood}</p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}

          {noteList.map((note) => (
            <li key={`n-${note.id}`}>
              <Link
                href={`/member/city/bloom-notes/${encodeURIComponent(note.place_slug)}`}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 12,
                  background: "white",
                  borderRadius: 16,
                  textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <Thumb url={note.photo_urls[0] ?? null} fallback="📝" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: PINK, textTransform: "uppercase" }}>
                    Bloom Note · {note.place_name ?? note.place_slug}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-caveat)",
                      fontSize: 16,
                      color: "#4A3A2A",
                      marginTop: 2,
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {note.content === "✦" ? "Photo note" : note.content}
                  </p>
                  <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                    ✿ {note.flower_count} · saved
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Thumb({
  url,
  fallback,
  pink,
}: {
  url: string | null | undefined;
  fallback: string;
  pink?: boolean;
}) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 12,
        flexShrink: 0,
        overflow: "hidden",
        background: pink ? `${PINK}12` : "rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        color: pink ? PINK : "#111",
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
