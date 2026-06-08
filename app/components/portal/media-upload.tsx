"use client";

import { useRef, useState } from "react";
import { uploadImageFile } from "@/lib/media/upload-client";
import type { MediaBucket } from "@/lib/media/buckets";

export function MediaUpload({
  bucket,
  storagePath,
  currentUrl,
  onUploaded,
  label = "Upload photo",
  aspect = "cover",
  className = "",
}: {
  bucket: MediaBucket;
  storagePath: string;
  currentUrl?: string | null;
  onUploaded: (url: string) => void | Promise<void>;
  label?: string;
  aspect?: "cover" | "avatar" | "polaroid";
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    setBusy(true);
    const local = URL.createObjectURL(file);
    setPreview(local);
    const result = await uploadImageFile(bucket, storagePath, file);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      setPreview(currentUrl ?? null);
      return;
    }
    setPreview(result.publicUrl);
    await onUploaded(result.publicUrl);
  }

  const height =
    aspect === "avatar" ? "h-28 w-28 rounded-full" : aspect === "polaroid" ? "h-36 w-28 rounded-lg" : "h-40 w-full rounded-2xl";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={`relative overflow-hidden flex items-center justify-center border-2 border-dashed transition-all active:scale-[0.98] ${height}`}
        style={{
          borderColor: "rgba(255,31,125,0.35)",
          background: preview
            ? `center/cover no-repeat url(${preview})`
            : "linear-gradient(135deg, #FFE0EE, #FFF5F8)",
        }}
        aria-label={label}
      >
        {!preview ? (
          <span className="text-xs font-semibold px-3 text-center" style={{ color: "var(--bb-pink)" }}>
            {busy ? "Uploading…" : `+ ${label}`}
          </span>
        ) : busy ? (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white" style={{ background: "rgba(0,0,0,0.45)" }}>
            Saving…
          </span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onFile(file);
          e.target.value = "";
        }}
      />
      {error ? (
        <p className="text-xs mt-2" style={{ color: "#FF1F7D" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
