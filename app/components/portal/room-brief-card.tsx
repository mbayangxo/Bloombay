"use client";

import { useEffect, useState } from "react";

type Person = {
  user_id: string;
  name: string;
  avatar_url: string | null;
  neighborhood: string | null;
  connection_hint: string | null;
  is_bloomie: boolean;
  co_attendance_count: number;
};

type RoomBriefData = {
  gathering: { title: string; starts_at: string; venue: string | null };
  attendee_count: number;
  people: Person[];
};

function PersonAvatar({ person }: { person: Person }) {
  if (person.avatar_url) {
    return (
      <img
        src={person.avatar_url}
        alt={person.name}
        width={32}
        height={32}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#1e1e1e",
        border: "1px solid #333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#FF1F7D",
        fontSize: 13,
        fontFamily: "Jost, sans-serif",
        fontWeight: 600,
      }}
    >
      {person.name.charAt(0).toUpperCase()}
    </div>
  );
}

export function RoomBriefCard({ gatheringId }: { gatheringId: string }) {
  const [data, setData] = useState<RoomBriefData | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/member/happenings/${gatheringId}/room-brief`);
        if (!res.ok) return;
        const json: RoomBriefData = await res.json();
        setData(json);
      } catch {
        // Fail silently — this is a quiet feature
      }
    })();
  }, [gatheringId]);

  if (!data || data.people.length < 2) return null;

  const displayPeople = data.people.slice(0, 5);

  return (
    <div
      style={{
        background: "#111",
        borderRadius: 16,
        padding: "20px 20px 16px",
        marginBottom: 20,
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
          marginBottom: 8,
        }}
      >
        ✦ BEFORE YOU ARRIVE
      </p>

      {/* Title + pill row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontStyle: "italic",
            color: "#fff",
            fontSize: 17,
            fontWeight: 500,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          A few faces you may recognize.
        </h3>

        <div
          style={{
            background: "rgba(255,31,125,0.12)",
            border: "1px solid rgba(255,31,125,0.25)",
            borderRadius: 20,
            padding: "4px 10px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "#FF1F7D",
              fontSize: 10,
              fontFamily: "Jost, sans-serif",
              fontWeight: 600,
            }}
          >
            {data.attendee_count} women going
          </span>
        </div>
      </div>

      {/* People list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {displayPeople.map((person) => (
          <div
            key={person.user_id}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
          >
            <PersonAvatar person={person} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontFamily: "Jost, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {person.name}
                </span>

                {person.is_bloomie && (
                  <span
                    style={{
                      color: "#FF1F7D",
                      fontSize: 9,
                      fontFamily: "Jost, sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    Bloomie ✿
                  </span>
                )}
              </div>

              {person.connection_hint && (
                <p
                  style={{
                    color: "#FF1F7D",
                    fontSize: 10,
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontStyle: "italic",
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {person.connection_hint}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {data.people.length > 5 || data.attendee_count > 5 ? (
        <p
          style={{
            color: "#555",
            fontSize: 11,
            fontFamily: "Jost, sans-serif",
            marginTop: 14,
            lineHeight: 1.4,
          }}
        >
          More women are going. You&apos;ll meet them there.
        </p>
      ) : null}
    </div>
  );
}
