"use client";

import { useEffect, useRef, useState } from "react";
import { uploadGatheringOutfitPhoto } from "@/lib/storage/upload";

const PINK = "#FF1F7D";

type OutfitPhoto = {
  id: string;
  user_id: string;
  photo_url: string;
  vote_count: number;
  my_vote: boolean;
  profiles: { first_name: string | null; full_name: string | null } | null;
};

/** Real outfit-check board: attendees each share one photo, others react.
 *  No fabricated fashion content — empty until someone actually posts. */
export function OutfitCheck({ gatheringId, myUserId }: { gatheringId: string; myUserId: string }) {
  const [photos, setPhotos] = useState<OutfitPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/outfit-checks`)
      .then(r => r.json())
      .then(d => setPhotos(d.photos ?? []))
      .catch(() => {});
  }

  useEffect(() => { load(); }, [gatheringId]);

  async function upload(file: File) {
    setUploading(true);
    try {
      const url = await uploadGatheringOutfitPhoto(file, gatheringId, myUserId);
      await fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/outfit-checks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: url }),
      });
      load();
    } catch {
      // silently keep prior state — the button remains so she can retry
    }
    setUploading(false);
  }

  async function toggleVote(photo: OutfitPhoto) {
    setPhotos(prev => prev.map(p => p.id === photo.id
      ? { ...p, my_vote: !p.my_vote, vote_count: p.vote_count + (p.my_vote ? -1 : 1) }
      : p));
    const method = photo.my_vote ? "DELETE" : "POST";
    await fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/outfit-checks/${photo.id}/vote`, { method }).catch(() => {});
  }

  const mine = photos.find(p => p.user_id === myUserId);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>OUTFIT CHECK</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) void upload(e.target.files[0]); e.target.value = ""; }} />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="text-xs font-bold disabled:opacity-50"
          style={{ color: PINK }}
        >
          {uploading ? "Uploading…" : mine ? "Replace mine" : "+ Share mine"}
        </button>
      </div>
      <p className="text-xs mb-3" style={{ color: "#999" }}>Help each other decide what to wear.</p>

      {photos.length === 0 ? (
        <p className="text-xs" style={{ color: "#bbb" }}>No outfits shared yet.</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map(p => (
            <div key={p.id} className="flex-shrink-0 w-24">
              <div className="w-24 h-28 rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.05)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => void toggleVote(p)}
                className="w-full mt-1 flex items-center justify-center gap-1 text-[11px] font-bold rounded-full py-1"
                style={{ background: p.my_vote ? `${PINK}18` : "rgba(0,0,0,0.04)", color: p.my_vote ? PINK : "#888" }}
              >
                ♡ {p.vote_count}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
