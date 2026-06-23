"use client";

import "@/app/styles/bloom-entrance.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme/theme-context";

const PINK  = "#FF1F7D";
const BLACK = "#111111";
const WHITE = "#FFFFFF";
const CREAM = "#FFF8F0";

interface Chapter {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  happened_at: string;
  meta: Record<string, unknown> | null;
}

interface StoryStats {
  events_attended: number;
  bloomies_count: number;
  clubs_joined: number;
  flowers_received: number;
  times_witnessed: number;
}

interface MyStoryData {
  chapters: Chapter[];
  member_since: string | null;
  name: string | null;
  stats: StoryStats;
}

function formatChapterDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function SkeletonCard() {
  return (
    <div
      style={{
        marginLeft: 36,
        marginBottom: 16,
        background: WHITE,
        borderRadius: 14,
        padding: "14px 16px",
        border: "1px solid rgba(255,31,125,0.08)",
        boxShadow: "0 2px 8px rgba(255,31,125,0.05)",
      }}
    >
      <div
        className="bloom-shimmer"
        style={{ width: 60, height: 10, borderRadius: 4, marginBottom: 8 }}
      />
      <div
        className="bloom-shimmer"
        style={{ width: "70%", height: 14, borderRadius: 4, marginBottom: 6 }}
      />
      <div
        className="bloom-shimmer"
        style={{ width: "90%", height: 10, borderRadius: 4 }}
      />
    </div>
  );
}

export function MyStoryPage() {
  const { palette } = useTheme();
  const [data, setData] = useState<MyStoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/my-story")
      .then((r) => r.json())
      .then((d: MyStoryData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats: { value: number; label: string }[] = data
    ? [
        { value: data.stats.events_attended, label: "GATHERINGS" },
        { value: data.stats.bloomies_count,  label: "BLOOMIES"   },
        { value: data.stats.clubs_joined,    label: "CLUBS"      },
        { value: data.stats.flowers_received, label: "FLOWERS"   },
        { value: data.stats.times_witnessed, label: "WITNESSED"  },
      ]
    : [];

  return (
    <div
      style={{
        background: palette.pageBg,
        minHeight: "100vh",
        paddingBottom: 100,
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: "28px 20px 0" }}>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: PINK,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          ✦ MY STORY
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 26,
            fontStyle: "italic",
            fontWeight: 700,
            color: palette.textPrimary,
            lineHeight: 1.25,
            margin: "0 0 8px",
          }}
        >
          Your BloomBay life, as Yande remembers it.
        </h1>
        {data?.name && (
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 11,
              color: "#aaa",
              margin: 0,
            }}
          >
            Every chapter is yours, {data.name}.
          </p>
        )}
      </div>

      {/* ── Stats strip ── */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 10,
          marginTop: 20,
          padding: "4px 20px 8px",
          scrollbarWidth: "none",
        }}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bloom-shimmer"
                style={{
                  minWidth: 80,
                  height: 68,
                  borderRadius: 14,
                  flexShrink: 0,
                }}
              />
            ))
          : stats.map((s) => (
              <div
                key={s.label}
                style={{
                  minWidth: 80,
                  flexShrink: 0,
                  background: palette.card,
                  borderRadius: 14,
                  padding: "14px 12px",
                  border: "1px solid rgba(255,31,125,0.1)",
                  boxShadow: "0 2px 10px rgba(255,31,125,0.06)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: 22,
                    fontWeight: 700,
                    fontStyle: "italic",
                    color: PINK,
                    margin: "0 0 4px",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: palette.textPrimary,
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
      </div>

      {/* ── Timeline ── */}
      <div style={{ padding: "20px 20px 0", position: "relative" }}>
        {loading ? (
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 9,
                width: 1,
                background: "rgba(255,31,125,0.15)",
              }}
            />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : !data || data.chapters.length === 0 ? (
          /* ── Empty state ── */
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 17,
                fontStyle: "italic",
                color: "#999",
                lineHeight: 1.55,
                marginBottom: 16,
              }}
            >
              Your story hasn&apos;t started yet. Show up to your first gathering.
            </p>
            <Link
              href="/member/happenings"
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 12,
                fontWeight: 700,
                color: PINK,
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              See what&apos;s happening →
            </Link>
          </div>
        ) : (
          /* ── Chapter list ── */
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 9,
                width: 1,
                background: "rgba(255,31,125,0.15)",
              }}
            />

            {data.chapters.map((chapter) => (
              <div
                key={chapter.id}
                style={{ display: "flex", alignItems: "flex-start", marginBottom: 16, position: "relative" }}
              >
                {/* Circle node */}
                <div
                  style={{
                    position: "absolute",
                    left: 1,
                    top: 14,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: PINK,
                    border: `3px solid ${palette.pageBg}`,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                />

                {/* Chapter card */}
                <div
                  className="bloom-card-enter"
                  style={{
                    marginLeft: 36,
                    flex: 1,
                    background: palette.card,
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: "1px solid rgba(255,31,125,0.08)",
                    boxShadow: "0 2px 8px rgba(255,31,125,0.05)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: 9,
                      color: "#bbb",
                      margin: "0 0 4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {formatChapterDate(chapter.happened_at)}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: 15,
                      fontStyle: "italic",
                      fontWeight: 700,
                      color: palette.textPrimary,
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {chapter.title}
                  </p>
                  {chapter.body !== null && (
                    <p
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: 12,
                        color: "#888",
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {chapter.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
