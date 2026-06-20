"use client";

import { useEffect, useRef, useState } from "react";
import { POLAROID_PHOTO } from "@/lib/homepage-assets";
import { getHomePolaroidPhoto, setHomePolaroidPhoto } from "@/lib/home-scrapbook-store";
import { uploadImageFile } from "@/lib/media/upload-client";
import { MEDIA_BUCKETS } from "@/lib/media/buckets";

const FALLBACK_GRADIENT =
  "linear-gradient(145deg, #ffd6e4 0%, #ff8fb8 42%, #c4b5fd 100%)";

export function HomePolaroidPhoto({
  defaultUrl,
  userId,
}: {
  defaultUrl?: string | null;
  userId?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return defaultUrl ?? null;
    return getHomePolaroidPhoto() ?? defaultUrl ?? null;
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getHomePolaroidPhoto() || !defaultUrl) return;
    setPhotoUrl(defaultUrl);
  }, [defaultUrl]);

  async function onPick(file: File) {
    setBusy(true);
    const local = URL.createObjectURL(file);
    setPhotoUrl(local);
    setHomePolaroidPhoto(local);

    const path = userId
      ? `${userId}/home-polaroid`
      : `guest/${Date.now()}-home-polaroid`;
    const result = await uploadImageFile(MEDIA_BUCKETS.profilePhotos, path, file);
    setBusy(false);

    if (result.ok) {
      setPhotoUrl(result.publicUrl);
      setHomePolaroidPhoto(result.publicUrl);
    }
  }

  return (
    <>
      <button
        type="button"
        className="bb-home-polaroid__photo"
        style={{
          left: `${POLAROID_PHOTO.left}%`,
          top: `${POLAROID_PHOTO.top}%`,
          width: `${POLAROID_PHOTO.width}%`,
          height: `${POLAROID_PHOTO.height}%`,
          zIndex: 0,
          backgroundImage: photoUrl ? `url(${photoUrl})` : FALLBACK_GRADIENT,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={() => inputRef.current?.click()}
        aria-label={photoUrl ? "Change polaroid photo" : "Add polaroid photo"}
      >
        {!photoUrl && !busy ? (
          <span className="bb-home-polaroid__photo-hint">+ add photo</span>
        ) : null}
        {busy ? <span className="bb-home-polaroid__photo-hint">Saving…</span> : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onPick(file);
          e.target.value = "";
        }}
      />
    </>
  );
}
