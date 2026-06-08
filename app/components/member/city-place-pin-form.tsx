"use client";

import { useState } from "react";
import { addCityPlacePin } from "@/lib/city-place-pins-store";

const EMOJI_PICKS = ["📍", "☕", "🍸", "🌸", "🥐", "🌅", "📚", "💃"];

export function CityPlacePinForm({ onPinned }: { onPinned?: () => void }) {
  const [placeName, setPlaceName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [note, setNote] = useState("");
  const [emoji, setEmoji] = useState("📍");
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!placeName.trim() || !note.trim()) return;
    setBusy(true);
    addCityPlacePin({ placeName, neighborhood, note, emoji });
    setPlaceName("");
    setNeighborhood("");
    setNote("");
    setEmoji("📍");
    setBusy(false);
    onPinned?.();
  }

  return (
    <form className="bb-city-pin-form" onSubmit={submit} aria-label="Drop a place pin">
      <p className="bb-city-pin-form__title">Drop a place pin</p>
      <p className="bb-city-pin-form__sub">Mark where you&apos;d send a friend — eats, walks, safe corners.</p>
      <div className="bb-city-pin-form__emoji" role="group" aria-label="Pin mood">
        {EMOJI_PICKS.map((e) => (
          <button
            key={e}
            type="button"
            className={`bb-city-pin-form__emoji-btn${emoji === e ? " bb-city-pin-form__emoji-btn--on" : ""}`}
            onClick={() => setEmoji(e)}
          >
            {e}
          </button>
        ))}
      </div>
      <label className="bb-city-upload__field">
        <span>Place name</span>
        <input
          type="text"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="The Rose Room"
        />
      </label>
      <label className="bb-city-upload__field">
        <span>Neighborhood</span>
        <input
          type="text"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          placeholder="West Village"
        />
      </label>
      <label className="bb-city-upload__field">
        <span>Why women love it</span>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Soft lighting, staff remembers your name…"
        />
      </label>
      <button type="submit" className="bb-btn bb-btn--outline-pink bb-btn--block" disabled={busy}>
        {busy ? "Pinning…" : "Add pin to map"}
      </button>
    </form>
  );
}
