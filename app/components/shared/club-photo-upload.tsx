"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadClubCover } from "@/lib/storage/upload";

interface ClubPhotoUploadProps {
  clubId: string;
  currentUrl?: string | null;
  onUpdate?: (url: string) => void;
}

export function ClubPhotoUpload({ clubId, currentUrl, onUpdate }: ClubPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    setSaved(false);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const url = await uploadClubCover(file, clubId);
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("clubs")
        .update({ cover_url: url })
        .eq("id", clubId);
      if (dbErr) throw dbErr;
      setPreview(url);
      onUpdate?.(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setPreview(currentUrl ?? null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/* Photo frame */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ width: "100%", maxWidth: 480, aspectRatio: "4/3", background: "#F0E8E4" }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Club cover"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.4" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p style={{ fontSize: 11, color: "#bbb" }}>No cover photo yet</p>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full font-bold text-white transition-all active:scale-[0.97]"
          style={{
            background: saved ? "#22c55e" : uploading ? "rgba(0,0,0,0.45)" : "#FF1F7D",
            fontSize: 11, padding: "7px 14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.22)",
          }}
        >
          {uploading ? (
            <>
              <span
                className="animate-spin"
                style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid white", borderTopColor: "transparent", display: "inline-block" }}
              />
              Uploading…
            </>
          ) : saved ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Saved
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              {preview ? "Change photo" : "Add photo"}
            </>
          )}
        </button>

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
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>{error}</p>
      )}
      <p style={{ fontSize: 10, color: "#bbb", marginTop: 6, letterSpacing: "0.02em" }}>
        Recommended: 1200 × 900 px or wider · JPG, PNG, WebP · Max 8 MB
      </p>
    </div>
  );
}
