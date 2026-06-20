"use client";

import "@/app/styles/bloom-entrance.css";
import { useState, useEffect } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";

type FriendKind = "active" | "fading" | "forming";

type FriendSignal = {
  user_id: string;
  name: string;
  first_name: string;
  avatar_url: string | null;
  neighborhood: string | null;
  score: number;
  co_attendance_count: number;
  last_seen_together: string | null;
  days_since: number | null;
  kind: FriendKind;
};

type HealthData = {
  active: FriendSignal[];
  fading: FriendSignal[];
  forming: FriendSignal[];
};

type SentMap = Record<string, boolean>;

function Avatar({ person }: { person: FriendSignal }) {
  const initial = (person.first_name ?? person.name ?? "?")[0]?.toUpperCase() ?? "?";

  if (person.avatar_url) {
    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          border: "2px solid rgba(255,31,125,0.15)",
        }}
      >
        <img
          src={person.avatar_url}
          alt={person.first_name}
          width={44}
          height={44}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${PINK}, #c4005a)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 10px rgba(255,31,125,0.25)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 16,
          fontWeight: 800,
          color: "white",
        }}
      >
        {initial}
      </span>
    </div>
  );
}

function ObservationLine({ person }: { person: FriendSignal }) {
  let text = "";
  if (person.kind === "active") {
    text = `You've crossed paths ${person.co_attendance_count} time${person.co_attendance_count === 1 ? "" : "s"} recently.`;
  } else if (person.kind === "forming") {
    text = "You keep showing up in the same places. She doesn't know you yet.";
  } else if (person.kind === "fading") {
    const weeks = person.days_since !== null ? Math.ceil(person.days_since / 7) : null;
    text = weeks !== null
      ? `You haven't crossed paths in ${weeks} week${weeks === 1 ? "" : "s"}.`
      : "You haven't crossed paths in a while.";
  }

  return (
    <p
      style={{
        fontFamily: "var(--font-playfair)",
        fontStyle: "italic",
        fontSize: 12,
        color: PINK,
        lineHeight: 1.45,
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}

function FriendCard({
  person,
  onBloomSent,
  alreadySent,
}: {
  person: FriendSignal;
  onBloomSent: (userId: string) => void;
  alreadySent: boolean;
}) {
  const [sending, setSending] = useState(false);

  // Border style per kind
  const borderStyle =
    person.kind === "active"
      ? `3px solid ${PINK}`
      : person.kind === "fading"
      ? "3px solid rgba(255,31,125,0.25)"
      : "2.5px dashed rgba(255,31,125,0.5)";

  async function sendBloom() {
    if (sending || alreadySent) return;
    setSending(true);
    try {
      const res = await fetch("/api/member/bloom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: person.user_id }),
      });
      if (res.ok) {
        onBloomSent(person.user_id);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="bloom-card-enter bloom-lift"
      style={{
        background: "white",
        borderRadius: 16,
        padding: "14px 16px",
        borderLeft: borderStyle,
        boxShadow: "0 2px 12px rgba(255,31,125,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Top row: avatar + name/neighborhood */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar person={person} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 14,
              fontWeight: 700,
              color: "#111",
              margin: 0,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {person.name}
          </p>
          {person.neighborhood && (
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 10,
                color: "#aaa",
                margin: "2px 0 0",
              }}
            >
              {person.neighborhood}
            </p>
          )}
        </div>
      </div>

      {/* Yande observation line */}
      <ObservationLine person={person} />

      {/* Action buttons */}
      {person.kind === "fading" && (
        <Link
          href={`/member/profile/${person.user_id}`}
          style={{ textDecoration: "none", alignSelf: "flex-start" }}
        >
          <div
            style={{
              border: `1.5px solid ${PINK}`,
              borderRadius: 999,
              padding: "6px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 11,
                fontWeight: 700,
                color: PINK,
              }}
            >
              Reach out →
            </span>
          </div>
        </Link>
      )}

      {person.kind === "forming" && (
        <button
          onClick={sendBloom}
          disabled={sending || alreadySent}
          style={{
            alignSelf: "flex-start",
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            fontWeight: 700,
            color: alreadySent ? "#111" : "white",
            background: alreadySent ? "#f0f0f0" : PINK,
            border: "none",
            borderRadius: 999,
            padding: "7px 16px",
            cursor: alreadySent || sending ? "default" : "pointer",
            opacity: sending ? 0.7 : 1,
            transition: "all 0.18s",
          }}
        >
          {alreadySent ? "Sent ✓" : sending ? "Sending…" : "Send bloom request 🌸"}
        </button>
      )}
    </div>
  );
}

type TabKey = "active" | "forming" | "fading";

const TABS: { key: TabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "forming", label: "Forming" },
  { key: "fading", label: "Fading" },
];

export function FriendshipHealthSection() {
  const [data, setData] = useState<HealthData | null>(null);
  const [tab, setTab] = useState<TabKey>("active");
  const [sentIds, setSentIds] = useState<SentMap>({});

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/member/friendship-health");
        if (!res.ok) return;
        const json: HealthData = await res.json();
        setData(json);

        // Auto-select first non-empty tab
        if ((json.active?.length ?? 0) > 0) {
          setTab("active");
        } else if ((json.forming?.length ?? 0) > 0) {
          setTab("forming");
        } else if ((json.fading?.length ?? 0) > 0) {
          setTab("fading");
        }
      } catch {
        // fail silently — section just won't render
      }
    })();
  }, []);

  // Don't render if no data in any category
  if (!data) return null;
  const hasAny =
    (data.active?.length ?? 0) > 0 ||
    (data.fading?.length ?? 0) > 0 ||
    (data.forming?.length ?? 0) > 0;
  if (!hasAny) return null;

  const currentCards = data[tab] ?? [];

  function handleBloomSent(userId: string) {
    setSentIds((prev) => ({ ...prev, [userId]: true }));
  }

  return (
    <div style={{ padding: "28px 20px 0" }}>
      {/* ── Section header ── */}
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: PINK,
            marginBottom: 5,
          }}
        >
          ✦ FRIENDSHIP PULSE
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 20,
            color: "#111",
            lineHeight: 1.15,
            margin: "0 0 6px",
          }}
        >
          Who&rsquo;s in your orbit right now.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            color: "#aaa",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Observed, not curated. Based on where you&rsquo;ve been showing up.
        </p>
      </div>

      {/* ── Category tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 14,
        }}
      >
        {TABS.map(({ key, label }) => {
          const count = data[key]?.length ?? 0;
          const isActive = tab === key;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: isActive ? "white" : PINK,
                background: isActive ? PINK : "rgba(255,31,125,0.07)",
                border: isActive ? "none" : `1.5px solid rgba(255,31,125,0.2)`,
                borderRadius: 999,
                padding: "7px 16px",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {label}
              {count > 0 && (
                <span
                  style={{
                    marginLeft: 5,
                    opacity: isActive ? 0.75 : 0.55,
                    fontSize: 9,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Cards ── */}
      <div
        className="bloom-stagger"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {currentCards.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "20px 18px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 12,
                color: "#bbb",
              }}
            >
              Nothing here yet.
            </p>
          </div>
        ) : (
          currentCards.map((person) => (
            <FriendCard
              key={person.user_id}
              person={person}
              onBloomSent={handleBloomSent}
              alreadySent={!!sentIds[person.user_id]}
            />
          ))
        )}
      </div>
    </div>
  );
}
