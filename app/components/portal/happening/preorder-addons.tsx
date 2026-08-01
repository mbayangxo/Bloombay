"use client";

import { useEffect, useState } from "react";
import { formatCents } from "@/lib/happenings/gathering-to-poster";

type MenuItem = { id: string; name: string; category: string; price_cents: number; sort_order: number };
type OrderRow = { id: string; item_id: string; quantity: number };

/** Real pre-order queue: host-defined menu, member "requested" orders the
 *  host fulfills/bills at the event — not a live charge, and honest about
 *  that in the copy. Renders nothing if the host hasn't set up a menu. */
export function PreorderAddons({ gatheringId, accent = "#FF1F7D" }: { gatheringId: string; accent?: string }) {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/menu`)
      .then(r => r.json())
      .then(d => { if (alive) setItems(d.items ?? []); })
      .catch(() => { if (alive) setItems([]); });
    fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/orders`)
      .then(r => r.json())
      .then(d => { if (alive) setOrders(d.orders ?? []); })
      .catch(() => {});
    return () => { alive = false; };
  }, [gatheringId]);

  if (!items || items.length === 0) return null;

  async function toggle(item: MenuItem) {
    const existing = orders.find(o => o.item_id === item.id);
    setBusyId(item.id);
    if (existing) {
      setOrders(prev => prev.filter(o => o.item_id !== item.id));
      await fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/orders?itemId=${item.id}`, { method: "DELETE" }).catch(() => {});
    } else {
      setOrders(prev => [...prev, { id: `local-${item.id}`, item_id: item.id, quantity: 1 }]);
      await fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: item.id, quantity: 1 }),
      }).catch(() => {});
    }
    setBusyId(null);
  }

  return (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#bbb" }}>
        MAKE IT YOUR NIGHT
      </p>
      <p className="text-xs mb-3" style={{ color: "#999" }}>
        Skip the line — request it now, the host has it ready or bills you at the event.
      </p>
      <div className="flex flex-col gap-2">
        {items.map(item => {
          const ordered = orders.some(o => o.item_id === item.id);
          return (
            <div key={item.id} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: "rgba(0,0,0,0.03)" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#111" }}>{item.name}</p>
                {item.price_cents > 0 && (
                  <p className="text-[11px]" style={{ color: "#999" }}>{formatCents(item.price_cents)}</p>
                )}
              </div>
              <button
                type="button"
                disabled={busyId === item.id}
                onClick={() => void toggle(item)}
                className="text-xs font-bold rounded-full px-3 py-1.5 disabled:opacity-50"
                style={{
                  background: ordered ? "rgba(0,0,0,0.06)" : accent,
                  color: ordered ? "#666" : "white",
                }}
              >
                {ordered ? "Added ✓" : "+ Add"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
