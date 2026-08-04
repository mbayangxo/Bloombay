"use client";

import { useEffect, useState } from "react";
import {
  getPendingTrendingSpots, approveTrendingSpot, rejectTrendingSpot,
  type PendingTrendingSpot,
} from "@/lib/actions/city-trending";

export function CityPicksReview() {
  const [items, setItems] = useState<PendingTrendingSpot[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    getPendingTrendingSpots().then(setItems).catch(() => setItems([]));
  }
  useEffect(load, []);

  async function approve(id: string) {
    setBusyId(id);
    await approveTrendingSpot(id, 99);
    setItems(prev => (prev ?? []).filter(i => i.id !== id));
    setBusyId(null);
  }

  async function reject(id: string) {
    setBusyId(id);
    await rejectTrendingSpot(id);
    setItems(prev => (prev ?? []).filter(i => i.id !== id));
    setBusyId(null);
  }

  if (items === null) return <p style={{ padding: 20, color: "#888" }}>Loading…</p>;
  if (items.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>
        <p style={{ fontSize: 16, fontWeight: 600 }}>Nothing pending</p>
        <p style={{ fontSize: 13, marginTop: 6 }}>Member-submitted City picks and cron-scraped spots will show up here for review.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 0" }}>
      {items.map(item => (
        <div key={item.id} style={{ display: "flex", gap: 14, border: "1px solid #e5e5e5", borderRadius: 12, padding: 14, background: "#fff" }}>
          {item.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt="" style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</p>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#FF1F7D", background: "#FFF0F6", borderRadius: 999, padding: "2px 8px" }}>{item.category}</span>
            </div>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
              {item.neighborhood ?? "NYC"} · submitted by {item.submitter_name}{item.source ? ` · via ${item.source}` : ""}
            </p>
            {item.description && <p style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{item.description}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                onClick={() => approve(item.id)}
                disabled={busyId === item.id}
                style={{ padding: "6px 14px", borderRadius: 999, border: "none", background: "#16A34A", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: busyId === item.id ? 0.6 : 1 }}
              >Approve</button>
              <button
                onClick={() => reject(item.id)}
                disabled={busyId === item.id}
                style={{ padding: "6px 14px", borderRadius: 999, border: "1px solid #ddd", background: "white", color: "#888", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: busyId === item.id ? 0.6 : 1 }}
              >Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
