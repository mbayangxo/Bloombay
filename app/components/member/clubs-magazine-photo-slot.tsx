"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClubsMagazinePhotoSlot } from "@/lib/clubs-magazine";
import {
  clearClubsBoardPhoto,
  getClubsBoardPhoto,
  readClubsBoardImageFile,
  setClubsBoardPhoto,
  validateClubsBoardImage,
} from "@/lib/clubs-board-photos";

export function ClubsMagazinePhotoSlot({ slot }: { slot: ClubsMagazinePhotoSlot }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setImageUrl(getClubsBoardPhoto(slot.id));
  }, [slot.id]);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-clubs-board-photos-updated", refresh);
    return () => window.removeEventListener("bb-clubs-board-photos-updated", refresh);
  }, [refresh]);

  async function onPick(file: File | undefined) {
    if (!file) return;
    const validation = validateClubsBoardImage(file);
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await readClubsBoardImageFile(file);
      setClubsBoardPhoto(slot.id, dataUrl);
      setImageUrl(dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save photo.");
    } finally {
      setBusy(false);
    }
  }

  function onLongPressClear() {
    if (!imageUrl) return;
    if (window.confirm("Remove your photo from this spot?")) {
      clearClubsBoardPhoto(slot.id);
      setImageUrl(null);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`bb-clubs-magazine__photo-slot${imageUrl ? " bb-clubs-magazine__photo-slot--filled" : ""}`}
        style={{
          top: `${slot.top}%`,
          left: `${slot.left}%`,
          width: `${slot.width}%`,
          height: `${slot.height}%`,
        }}
        aria-label={imageUrl ? `${slot.label} — tap to replace, hold to remove` : `${slot.label} — tap to add photo`}
        title={slot.label}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPressClear();
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="bb-clubs-magazine__photo-fill" draggable={false} />
        ) : (
          <span className="bb-clubs-magazine__photo-hint" aria-hidden>
            +
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="bb-clubs-magazine__photo-input"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          void onPick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error ? (
        <span className="bb-clubs-magazine__photo-error" role="alert">
          {error}
        </span>
      ) : null}
    </>
  );
}
