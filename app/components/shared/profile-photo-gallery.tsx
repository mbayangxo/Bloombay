"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadProfilePhoto } from "@/lib/storage/upload";

const PINK = "#FF1F7D";

interface Photo {
  id: string;
  url: string;
}

export function ProfilePhotoGallery({ userId }: { userId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load existing photos on mount
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profile_photos")
      .select("id, url")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setPhotos(data as Photo[]);
      });
  }, [userId]);

  async function handleFiles(files: FileList) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!validFiles.length) return;

    setError(null);
    setUploadingCount(validFiles.length);
    const supabase = createClient();

    await Promise.all(
      validFiles.map(async (file) => {
        try {
          const url = await uploadProfilePhoto(file, userId);
          const { data } = await supabase
            .from("profile_photos")
            .insert({ user_id: userId, url })
            .select("id, url")
            .single();
          if (data) {
            setPhotos(prev => [...prev, { id: (data as { id: string; url: string }).id, url: (data as { id: string; url: string }).url }]);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "One or more uploads failed.");
        } finally {
          setUploadingCount(n => n - 1);
        }
      })
    );
  }

  async function removePhoto(photo: Photo) {
    setRemoving(photo.id);
    const supabase = createClient();

    // Parse the storage path from the public URL
    try {
      const urlObj = new URL(photo.url);
      const parts = urlObj.pathname.split("/profile-photos/");
      if (parts[1]) {
        await supabase.storage.from("profile-photos").remove([parts[1]]);
      }
      await supabase.from("profile_photos").delete().eq("id", photo.id);
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
    } catch {
      // Continue removing from local state even if storage delete fails
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
    } finally {
      setRemoving(null);
    }
  }

  const uploading = uploadingCount > 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
          YOUR PHOTOS
        </p>
        <p style={{ fontSize: "9px", color: "#bbb" }}>
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {/* Existing photos */}
        {photos.map((photo) => (
          <div key={photo.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "#e8ddd8" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Remove button */}
            <button
              onClick={() => removePhoto(photo)}
              disabled={removing === photo.id}
              aria-label="Remove photo"
              style={{
                position: "absolute", top: 6, right: 6,
                width: 24, height: 24, borderRadius: "50%",
                background: "rgba(0,0,0,0.6)", border: "none", padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {removing === photo.id ? (
                <span
                  className="animate-spin"
                  style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid white", borderTopColor: "transparent", display: "inline-block" }}
                />
              ) : (
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="1" x2="11" y2="11"/>
                  <line x1="11" y1="1" x2="1" y2="11"/>
                </svg>
              )}
            </button>
          </div>
        ))}

        {/* Uploading placeholders */}
        {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
          <div
            key={`uploading-${i}`}
            style={{ aspectRatio: "1", borderRadius: 14, background: "rgba(255,31,125,0.06)", border: "1.5px solid rgba(255,31,125,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span
              className="animate-spin"
              style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid #FF1F7D", borderTopColor: "transparent", display: "inline-block" }}
            />
          </div>
        ))}

        {/* Add button */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Add photo"
          style={{
            aspectRatio: "1", borderRadius: 14,
            border: "2px dashed rgba(255,31,125,0.25)",
            background: "rgba(255,31,125,0.04)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 5, cursor: uploading ? "default" : "pointer",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span style={{ fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.08em" }}>ADD</span>
        </button>
      </div>

      {error && (
        <p style={{ fontSize: 11, color: "#ef4444", marginTop: 8 }}>{error}</p>
      )}

      <p style={{ fontSize: "10px", color: "#bbb", marginTop: 8, lineHeight: 1.4 }}>
        Select one or multiple photos. JPG, PNG, WebP · Max 5 MB each.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
