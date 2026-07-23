"use client";

import { useEffect, useState } from "react";
import { PartnerShell } from "../components/partner-shell";

const DAYS: { key: string; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export default function PartnerAvailabilityPage() {
  const [hours, setHours] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setHours(data.venue?.hours ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasHours = hours && Object.keys(hours).length > 0;

  return (
    <PartnerShell title="Availability" sub="Hours BloomBay members see for your venue.">
      {loading ? (
        <p className="pp-dash__empty">Loading…</p>
      ) : !hasHours ? (
        <p className="pp-dash__empty">
          Hours haven&apos;t been set yet — email partners@bloombay.app to add them, or check back
          once venue hours editing is live in Brand identity.
        </p>
      ) : (
        <div className="pp-avail-grid">
          {DAYS.map((d) => (
            <div key={d.key} className="pp-avail-day">
              <strong>{d.label}</strong>
              {hours?.[d.key] ?? "Closed"}
            </div>
          ))}
        </div>
      )}
    </PartnerShell>
  );
}
