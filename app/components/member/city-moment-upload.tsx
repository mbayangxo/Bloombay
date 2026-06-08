"use client";

import { useRef, useState } from "react";
import { addCityMomentUpload } from "@/lib/city-moments-store";
import {
  CITY_MOMENT_FEELINGS,
  type CityMomentTie,
  type CityMomentTieKind,
} from "@/lib/city-moment-ties";

export function CityMomentUpload({ onPosted }: { onPosted?: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tieKind, setTieKind] = useState<CityMomentTieKind>("cafe");
  const [label, setLabel] = useState("");
  const [at, setAt] = useState("");
  const [caption, setCaption] = useState("");
  const [hood, setHood] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a photo (JPG or PNG).");
      return;
    }
    if (file.size > 4_000_000) {
      setError("Photo must be under 4MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function buildTie(): CityMomentTie | null {
    const trimmed = label.trim();
    if (!trimmed) return null;
    if (tieKind === "feeling") {
      return {
        kind: "feeling",
        label: trimmed,
        at: at.trim() || undefined,
        neighborhood: hood.trim() || undefined,
      };
    }
    return {
      kind: tieKind,
      label: trimmed,
      neighborhood: hood.trim() || undefined,
    };
  }

  function placeLine(tie: CityMomentTie): string {
    if (tie.kind === "feeling" && tie.at) {
      return `${tie.at}${tie.neighborhood ? ` · ${tie.neighborhood}` : ""}`;
    }
    return `${tie.label}${tie.neighborhood ? ` · ${tie.neighborhood}` : ""}`;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) {
      setError("Add a photo first.");
      return;
    }
    const tie = buildTie();
    if (!tie) {
      setError(
        tieKind === "cafe"
          ? "Name the café this moment is tied to."
          : tieKind === "place"
            ? "Name the place in the city."
            : "Pick or name the feeling."
      );
      return;
    }
    if (!caption.trim()) {
      setError("Add a short caption.");
      return;
    }
    setBusy(true);
    try {
      addCityMomentUpload({
        place: placeLine(tie),
        caption: caption.trim(),
        imageDataUrl: preview,
        neighborhood: hood.trim() || undefined,
        tie,
      });
      setLabel("");
      setAt("");
      setCaption("");
      setHood("");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      onPosted?.();
    } catch {
      setError("Could not save — try a smaller photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="bb-city-upload" onSubmit={submit} aria-label="Pin your moment">
      <p className="bb-city-upload__title">Pin a moment</p>
      <p className="bb-city-upload__sub">Every snap ties to a café, a place, or a feeling — never floating alone.</p>

      <div className="bb-city-upload__tie-tabs" role="tablist" aria-label="Tie moment to">
        {(
          [
            { id: "cafe" as const, label: "Café" },
            { id: "place" as const, label: "Place" },
            { id: "feeling" as const, label: "Feeling" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tieKind === t.id}
            className={`bb-city-upload__tie-tab${tieKind === t.id ? " bb-city-upload__tie-tab--on" : ""}`}
            onClick={() => setTieKind(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`bb-city-upload__photo${preview ? " bb-city-upload__photo--has" : ""}`}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your moment preview" />
        ) : (
          <span>+ Add photo</span>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="bb-city-upload__file"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {tieKind === "cafe" ? (
        <label className="bb-city-upload__field">
          <span>Café name</span>
          <input
            type="text"
            placeholder="Café Gitane"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>
      ) : null}

      {tieKind === "place" ? (
        <label className="bb-city-upload__field">
          <span>Place in the city</span>
          <input
            type="text"
            placeholder="Fort Greene Park"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>
      ) : null}

      {tieKind === "feeling" ? (
        <>
          <div className="bb-city-upload__feelings">
            {CITY_MOMENT_FEELINGS.map((f) => (
              <button
                key={f}
                type="button"
                className={`bb-city-upload__feel-pill${label === f ? " bb-city-upload__feel-pill--on" : ""}`}
                onClick={() => setLabel(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <label className="bb-city-upload__field">
            <span>Feeling</span>
            <input
              type="text"
              placeholder="Or type your own"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <label className="bb-city-upload__field">
            <span>While at (optional)</span>
            <input
              type="text"
              placeholder="Café, park, rooftop…"
              value={at}
              onChange={(e) => setAt(e.target.value)}
            />
          </label>
        </>
      ) : null}

      <label className="bb-city-upload__field">
        <span>Neighborhood</span>
        <input
          type="text"
          placeholder="SoHo, Williamsburg…"
          value={hood}
          onChange={(e) => setHood(e.target.value)}
        />
      </label>
      <label className="bb-city-upload__field">
        <span>Caption</span>
        <textarea
          rows={2}
          placeholder="What made this moment?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </label>

      {error ? <p className="bb-city-upload__error">{error}</p> : null}

      <button type="submit" className="bb-btn bb-btn--hot bb-btn--block" disabled={busy}>
        {busy ? "Pinning…" : "Pin to Moments"}
      </button>
    </form>
  );
}
