"use client";

import { useEffect, useState } from "react";
import {
  defaultCaption,
  deleteDrop,
  dropSummary,
  listDropsForPartner,
  saveDrop,
} from "@/lib/partner-drops/store";
import type { BoomDrop, BoomDropKind } from "@/lib/partner-drops/types";
import { SESSION_PARTNER_SLUG } from "@/lib/partner-brand/store";

const KIND_LABELS: Record<BoomDropKind, string> = {
  percent_off: "% off",
  bogo: "Buy one · get one",
  bundle: "Bundle deal",
};

export function PartnerDropsEditor() {
  const slug = SESSION_PARTNER_SLUG;
  const [drops, setDrops] = useState<BoomDrop[]>([]);
  const [kind, setKind] = useState<BoomDropKind>("percent_off");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [buyItem, setBuyItem] = useState("");
  const [getItem, setGetItem] = useState("");
  const [percentOff, setPercentOff] = useState(15);
  const [validUntil, setValidUntil] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function refresh() {
    setDrops(listDropsForPartner(slug));
  }

  useEffect(() => {
    refresh();
  }, [slug]);

  function syncCaption(k: BoomDropKind, buy: string, get?: string, pct?: number) {
    setCaption(defaultCaption(k, buy, get, pct));
  }

  function createDrop(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !buyItem.trim()) return;
    saveDrop({
      partnerSlug: slug,
      title,
      caption: caption || defaultCaption(kind, buyItem, getItem, percentOff),
      kind,
      buyItem,
      getItem: kind !== "percent_off" ? getItem : undefined,
      percentOff: kind === "percent_off" ? percentOff : undefined,
      validUntil: validUntil || undefined,
      active: true,
    });
    setTitle("");
    setBuyItem("");
    setGetItem("");
    setCaption("");
    setMsg("Boom drop published");
    refresh();
  }

  return (
    <div className="pp-drops">
      {msg ? <p className="pb-builder__msg">{msg}</p> : null}

      <form onSubmit={createDrop} className="pp-card pp-drops__form">
        <h2>New Boom drop</h2>
        <select
          className="pp-input"
          value={kind}
          onChange={(e) => {
            const k = e.target.value as BoomDropKind;
            setKind(k);
            syncCaption(k, buyItem, getItem, percentOff);
          }}
        >
          {(Object.keys(KIND_LABELS) as BoomDropKind[]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABELS[k]}
            </option>
          ))}
        </select>
        <input
          className="pp-input"
          placeholder="Drop title (internal)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="pp-input"
          placeholder={kind === "percent_off" ? "Item (e.g. Saffron pasta)" : "Buy item"}
          value={buyItem}
          onChange={(e) => {
            setBuyItem(e.target.value);
            syncCaption(kind, e.target.value, getItem, percentOff);
          }}
        />
        {kind === "percent_off" ? (
          <label className="pb-builder__field">
            Percent off
            <input
              className="pp-input"
              type="number"
              min={5}
              max={75}
              value={percentOff}
              onChange={(e) => {
                const n = Number(e.target.value);
                setPercentOff(n);
                syncCaption(kind, buyItem, getItem, n);
              }}
            />
          </label>
        ) : (
          <input
            className="pp-input"
            placeholder={kind === "bogo" ? "Get item (free or discounted)" : "Bundle item"}
            value={getItem}
            onChange={(e) => {
              setGetItem(e.target.value);
              syncCaption(kind, buyItem, e.target.value, percentOff);
            }}
          />
        )}
        <label className="pb-builder__field">
          Caption (editable — members see this)
          <textarea
            className="pp-input"
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="BloomBay exclusive · show app at the door"
          />
        </label>
        <input
          className="pp-input"
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
        <button type="submit" className="pp-btn pp-btn--primary">
          Publish Boom drop
        </button>
      </form>

      <ul className="pp-drops__list">
        {drops.map((d) => (
          <li key={d.id} className="pp-card">
            <div className="pp-dash__card-head">
              <strong>{d.title}</strong>
              <span className={d.active ? "pp-drop-badge pp-drop-badge--on" : "pp-drop-badge"}>
                {d.active ? "Active" : "Off"}
              </span>
            </div>
            <p className="pp-drop-summary">{dropSummary(d)}</p>
            <textarea
              className="pp-input"
              rows={2}
              defaultValue={d.caption}
              onBlur={(e) => {
                saveDrop({ ...d, caption: e.target.value });
                refresh();
              }}
            />
            <div className="pp-drops__actions">
              <button
                type="button"
                className="pp-btn pp-btn--sm"
                onClick={() => {
                  saveDrop({ ...d, active: !d.active });
                  refresh();
                }}
              >
                {d.active ? "Pause" : "Activate"}
              </button>
              <button
                type="button"
                className="pp-btn pp-btn--ghost"
                onClick={() => {
                  deleteDrop(d.id);
                  refresh();
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
