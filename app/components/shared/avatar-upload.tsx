"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar } from "@/lib/storage/upload";

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string | null;
  /** Fallback initials shown when no photo */
  initials: string;
  size?: number;
  onUpdate?: (url: string) => void;
}

export function AvatarUpload({
  userId,
  currentUrl,
  initials,
  size = 88,
  onUpdate,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const badgeSize = Math.round(size * 0.32);
  const iconSize = Math.round(size * 0.15);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");
      return;
    }
    setError(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const url = await uploadAvatar(file, userId);
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", userId);
      if (dbErr) throw dbErr;
      setPreview(url);
      onUpdate?.(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setPreview(currentUrl ?? null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative flex-shrink-0 transition-all active:scale-[0.96]"
        style={{ width: size, height: size, borderRadius: "50%", background: "none", border: "none", padding: 0, cursor: "pointer" }}
        aria-label="Change photo"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={initials}
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center font-black text-white"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FF1F7D, #7F0028)",
              fontSize: Math.round(size * 0.3),
            }}
          >
            {initials}
          </div>
        )}

        {/* Camera badge */}
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: badgeSize, height: badgeSize,
            bottom: 0, right: 0,
            background: uploading ? "rgba(0,0,0,0.5)" : "#FF1F7D",
            border: "2.5px solid white",
            pointerEvents: "none",
          }}
        >
          {uploading ? (
            <span
              className="animate-spin"
              style={{ width: iconSize, height: iconSize, borderRadius: "50%", border: "2px solid white", borderTopColor: "transparent", display: "inline-block" }}
            />
          ) : (
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </button>

      {error && (
        <p style={{ fontSize: 11, color: "#ef4444" }}>{error}</p>
      )}
    </div>
  );
}
