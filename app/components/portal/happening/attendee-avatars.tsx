"use client";

import { useEffect, useState } from "react";

type Attendee = {
  user_id: string;
  seat_number: number | null;
  table_number: number | null;
  profiles: { first_name: string | null; full_name: string | null; avatar_url: string | null } | null;
};

function initialOf(a: Attendee): string {
  const name = a.profiles?.first_name ?? a.profiles?.full_name ?? "";
  return name ? name[0]!.toUpperCase() : "?";
}

/** Real "who's coming" roster from seat_reservations — no invented avatars. */
export function AttendeeAvatars({
  gatheringId,
  accent = "#FF1F7D",
  max = 6,
}: {
  gatheringId: string;
  accent?: string;
  max?: number;
}) {
  const [attendees, setAttendees] = useState<Attendee[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/attendees`)
      .then(r => r.json())
      .then(d => { if (alive) setAttendees(d.attendees ?? []); })
      .catch(() => { if (alive) setAttendees([]); });
    return () => { alive = false; };
  }, [gatheringId]);

  if (!attendees || attendees.length === 0) return null;

  const shown = attendees.slice(0, max);
  const extra = attendees.length - shown.length;

  return (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#bbb" }}>
        WHO&apos;S COMING
      </p>
      <div className="flex items-center">
        {shown.map((a, i) => (
          <div
            key={a.user_id}
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white"
            style={{
              marginLeft: i === 0 ? 0 : -10,
              background: `${accent}22`,
              color: accent,
              fontFamily: "var(--font-jost)",
              fontSize: 12,
              fontWeight: 700,
              zIndex: shown.length - i,
              overflow: "hidden",
            }}
          >
            {a.profiles?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.profiles.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              initialOf(a)
            )}
          </div>
        ))}
        {extra > 0 && (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white"
            style={{ marginLeft: -10, background: "#eee", color: "#888", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700 }}
          >
            +{extra}
          </div>
        )}
        <span className="ml-3 text-xs" style={{ color: "#999" }}>
          {attendees.length} confirmed
        </span>
      </div>
    </div>
  );
}
