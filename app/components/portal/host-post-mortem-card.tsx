"use client";

import { useEffect, useState } from "react";

type PostMortemData = {
  gathering: {
    title: string;
    starts_at: string;
    ends_at: string | null;
    venue: string | null;
  };
  attendance: { total: number; checked_in: number };
  new_connections: number;
  new_flowers: number;
  yande_observation: string;
};

type Stat = { value: number; label: string };

function StatBlock({ stat }: { stat: Stat }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <p
        style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          color: "#FF1F7D",
          fontSize: 28,
          fontWeight: 700,
          lineHeight: 1,
          margin: 0,
        }}
      >
        {stat.value}
      </p>
      <p
        style={{
          fontFamily: "Jost, sans-serif",
          color: "#888",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        {stat.label}
      </p>
    </div>
  );
}

export function HostPostMortemCard({
  gatheringId,
  title,
}: {
  gatheringId: string;
  title: string;
}) {
  const [data, setData] = useState<PostMortemData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(
          `/api/club-portal/gatherings/${gatheringId}/post-mortem`
        );
        if (!res.ok) return;
        const json: PostMortemData = await res.json();

        // Only show if event has ended
        const endsAt = json.gathering.ends_at
          ? new Date(json.gathering.ends_at)
          : new Date(json.gathering.starts_at);
        if (endsAt > new Date()) return;

        setData(json);
        // Slight delay so the animation fires after mount
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      } catch {
        // Fail silently
      }
    })();
  }, [gatheringId]);

  if (!data) return null;

  const stats: Stat[] = [
    { value: data.attendance.checked_in, label: "attended" },
    { value: data.new_connections, label: "connections" },
    { value: data.new_flowers, label: "flowers" },
  ];

  return (
    <div
      className={visible ? "bloom-card-enter" : ""}
      style={{
        background: "#fff",
        border: "1.5px solid #FF1F7D",
        borderRadius: 14,
        padding: "18px 18px 16px",
        marginTop: 12,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          color: "#FF1F7D",
          fontSize: 9,
          fontFamily: "Jost, sans-serif",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        ✦ AFTER THE GATHERING
      </p>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontStyle: "italic",
          color: "#111",
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 1.3,
          margin: "0 0 14px 0",
        }}
      >
        {title} · How it went
      </h3>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          padding: "12px 0",
          marginBottom: 14,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              borderRight: i < stats.length - 1 ? "1px solid #f0f0f0" : "none",
            }}
          >
            <StatBlock stat={s} />
          </div>
        ))}
      </div>

      {/* Yande observation */}
      <div
        style={{
          background: "#FFF8F0",
          borderLeft: "3px solid #FF1F7D",
          borderRadius: "0 8px 8px 0",
          padding: "10px 14px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontStyle: "italic",
            color: "#111",
            fontSize: 13,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {data.yande_observation}
        </p>
      </div>
    </div>
  );
}
