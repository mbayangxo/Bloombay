"use client";

import { useEffect, useState } from "react";

type AnalyticsPayload = {
  analytics: { view: number; click: number; interest: number; share: number };
  going: number;
  attended: number;
  ticketsSold: number;
  revenue: {
    grossCents: number;
    platformFeeCents: number;
    hostNetCents: number;
    currency: string;
  };
  title?: string;
};

function money(cents: number, currency = "gbp") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function HostEventAnalytics({ gatheringId }: { gatheringId: string }) {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/happenings/analytics?gatheringId=${encodeURIComponent(gatheringId)}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Forbidden");
        setData(j as AnalyticsPayload);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [gatheringId]);

  if (error) {
    return (
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#999" }}>
        Analytics available to the host only.
      </p>
    );
  }
  if (!data) {
    return (
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#999" }}>Loading analytics…</p>
    );
  }

  const rows = [
    { label: "Views", value: String(data.analytics.view) },
    { label: "Clicks", value: String(data.analytics.click) },
    { label: "Interest", value: String(data.analytics.interest) },
    { label: "Going", value: String(data.going) },
    { label: "Attended", value: String(data.attended) },
    { label: "Tickets sold", value: String(data.ticketsSold) },
    { label: "Gross", value: money(data.revenue.grossCents, data.revenue.currency) },
    { label: "BloomBay fee", value: money(data.revenue.platformFeeCents, data.revenue.currency) },
    { label: "Your payout", value: money(data.revenue.hostNetCents, data.revenue.currency) },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: "#FF1F7D",
          marginBottom: 10,
        }}
      >
        EVENT ANALYTICS
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {rows.map((r) => (
          <div key={r.label}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#999", fontWeight: 700 }}>
              {r.label}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 16, fontWeight: 800, color: "#1C1B1C" }}>
              {r.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Fire-and-forget view/click/interest tracking on happening pages. */
export function useGatheringAnalytics(gatheringId: string | null | undefined) {
  useEffect(() => {
    if (!gatheringId) return;
    void fetch("/api/happenings/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gatheringId, eventType: "view" }),
    }).catch(() => {});
  }, [gatheringId]);
}
