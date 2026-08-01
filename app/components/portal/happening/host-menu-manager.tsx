"use client";

import { useEffect, useState } from "react";
import { formatCents } from "@/lib/happenings/gathering-to-poster";

type MenuItem = { id: string; name: string; category: string; price_cents: number; sort_order: number };
type Category = "drink" | "food" | "extra";

const CATEGORY_LABEL: Record<Category, string> = { drink: "Drink", food: "Food", extra: "Extra" };

/** Host-only tool to set up the pre-order menu members see in "Make it your
 *  night" / the Plan Room's Orders tab. Nothing shows there until a host
 *  actually adds items here — no default/sample menu is seeded. */
export function HostMenuManager({ gatheringId, accent = "#FF1F7D" }: { gatheringId: string; accent?: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("drink");
  const [priceInput, setPriceInput] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/menu`)
      .then(r => r.json())
      .then(d => setItems(d.items ?? []))
      .catch(() => {});
  }

  useEffect(() => { load(); }, [gatheringId]);

  async function add() {
    if (!name.trim()) return;
    setBusy(true);
    const priceCents = priceInput ? Math.round(parseFloat(priceInput) * 100) || 0 : 0;
    await fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), category, price_cents: priceCents, sort_order: items.length }),
    }).catch(() => {});
    setName("");
    setPriceInput("");
    setBusy(false);
    load();
  }

  async function remove(itemId: string) {
    setItems(prev => prev.filter(i => i.id !== itemId));
    await fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/menu?itemId=${itemId}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#bbb" }}>
        MENU (HOST ONLY)
      </p>
      <p className="text-xs mb-3" style={{ color: "#999" }}>
        Add drinks, food, or extras members can request ahead of the night.
      </p>

      {items.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "rgba(0,0,0,0.03)" }}>
              <span className="text-xs" style={{ color: "#333" }}>
                {item.name} <span style={{ color: "#aaa" }}>· {CATEGORY_LABEL[item.category as Category] ?? item.category}</span>
                {item.price_cents > 0 && <span style={{ color: "#aaa" }}> · {formatCents(item.price_cents)}</span>}
              </span>
              <button type="button" onClick={() => void remove(item.id)} className="text-xs" style={{ color: "#C0392B" }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Item name"
          className="flex-1 rounded-lg px-3 py-2 text-xs bg-white outline-none"
          style={{ border: "1.5px solid #eee" }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          className="rounded-lg px-2 py-2 text-xs bg-white"
          style={{ border: "1.5px solid #eee" }}
        >
          <option value="drink">Drink</option>
          <option value="food">Food</option>
          <option value="extra">Extra</option>
        </select>
        <input
          value={priceInput}
          onChange={e => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setPriceInput(v); }}
          placeholder="$"
          inputMode="decimal"
          className="w-14 rounded-lg px-2 py-2 text-xs bg-white outline-none"
          style={{ border: "1.5px solid #eee" }}
        />
        <button
          type="button"
          disabled={!name.trim() || busy}
          onClick={() => void add()}
          className="text-xs font-bold rounded-lg px-3 disabled:opacity-50"
          style={{ background: accent, color: "white" }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
