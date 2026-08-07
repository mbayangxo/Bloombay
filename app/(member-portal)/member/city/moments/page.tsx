"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCityMoments, flowerMoment, unflowerMoment, postCityMoment, type CityMoment } from "@/lib/actions/moments";
import { uploadImageFile } from "@/lib/media/upload-client";
import { MEDIA_BUCKETS } from "@/lib/media/buckets";
import { createClient } from "@/lib/supabase/client";

const PINK = "#FF1F7D";
const POLAROID_ROTATIONS = ["-2.5deg", "2deg", "-1deg", "3deg", "-1.8deg", "1.5deg", "-2deg", "1deg"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))}m`;
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function ShareMomentSheet({ onClose, onShared }: { onClose: () => void; onShared: () => void }) {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleShare() {
    if (!file || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in to continue.");
      const path = `${user.id}/moments/${Date.now()}`;
      const uploaded = await uploadImageFile(MEDIA_BUCKETS.memberMemories, path, file);
      if (!uploaded.ok) throw new Error(uploaded.error);
      const res = await postCityMoment({ caption, locationName: location, photoUrl: uploaded.publicUrl });
      if (!res.ok) throw new Error(res.error ?? "Couldn't share");
      setSubmitted(true);
      setTimeout(() => { onShared(); onClose(); }, 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't share");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl overflow-hidden" style={{ background: "#FDFAF5", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "85vh", overflowY: "auto" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>
        <div className="px-6 pb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FF1F7D" }}>✦ SHARE A MOMENT</p>
            <p className="text-lg font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>What are you doing?</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        <div className="px-6 pb-8 flex flex-col gap-4 mt-4">
          <label className="rounded-2xl overflow-hidden cursor-pointer block" style={{ background: "white", border: "1.5px solid #F0E0E8", height: preview ? 180 : 100 }}>
            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <span style={{ fontSize: 22 }}>📷</span>
                <span className="text-xs" style={{ color: "#aaa" }}>Add a photo</span>
              </div>
            )}
          </label>
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #F0E0E8" }}>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write something real…"
              rows={3}
              className="w-full resize-none text-sm outline-none px-4 py-3.5"
              style={{ background: "transparent", color: "#111", lineHeight: 1.6 }}
            />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>WHERE ARE YOU?</p>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Place or neighborhood"
              className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }} />
          </div>
          {error && <p className="text-xs" style={{ color: PINK }}>{error}</p>}
          <button onClick={handleShare} disabled={!file || submitting || submitted}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: submitted ? "#FFB6D0" : file ? "#FF1F7D" : "#F0E0E8", color: submitted || file ? "white" : "#C8A0B0" }}>
            {submitted ? "Shared ✓" : submitting ? "Sharing…" : "Share Moment"}
          </button>
        </div>
      </div>
    </>
  );
}

function PolaroidCard({ m, idx, onFlower, size = "normal" }: {
  m: CityMoment; idx: number; onFlower: () => void;
  size?: "normal" | "large";
}) {
  const rot = POLAROID_ROTATIONS[idx % POLAROID_ROTATIONS.length];
  const photoH = size === "large" ? 170 : 120;
  const width = size === "large" ? 190 : 150;
  const captionSize = size === "large" ? "15px" : "13px";
  const bottomPad = size === "large" ? 44 : 32;
  const initial = (m.author_name ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="transition-transform active:scale-[0.97]" style={{ transform: `rotate(${rot})`, transformOrigin: "center" }}>
      <div style={{ background: "white", borderRadius: "3px", padding: `9px 9px ${bottomPad}px`, width: `${width}px`, boxShadow: "0 6px 24px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.07)" }}>
        <div className="relative overflow-hidden" style={{ height: `${photoH}px`, background: `${PINK}18`, borderRadius: "2px" }}>
          {m.photo_urls[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photo_urls[0]} alt={m.caption ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"><span style={{ fontSize: size === "large" ? 44 : 32, opacity: 0.5 }}>✿</span></div>
          )}
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: PINK }}>{initial}</div>
            <span className="text-[8px] font-medium px-1 py-px rounded" style={{ color: "rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.7)" }}>{timeAgo(m.created_at)}</span>
          </div>
        </div>
        <div className="pt-2.5 px-0.5 text-center">
          {m.caption && <p style={{ fontFamily: "var(--font-caveat)", fontSize: captionSize, color: "#333", lineHeight: 1.3 }}>{m.caption}</p>}
          {m.location_name && <p className="text-[9px] mt-0.5" style={{ color: "#bbb" }}>{m.location_name}</p>}
          <button onClick={e => { e.stopPropagation(); onFlower(); }} className="flex items-center justify-center gap-1 mt-2 w-full transition-transform active:scale-110">
            <span style={{ fontSize: 12, color: m.myFlower ? PINK : "#ccc" }}>✿</span>
            <span className="text-[9px] font-bold" style={{ color: m.myFlower ? PINK : "#ccc" }}>{m.flowers}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MomentsPage() {
  const [moments, setMoments] = useState<CityMoment[] | null>(null);
  const [showShare, setShowShare] = useState(false);

  function load() {
    getCityMoments().then(setMoments).catch(() => setMoments([]));
  }
  useEffect(load, []);

  async function handleFlower(m: CityMoment) {
    setMoments(prev => prev?.map(x => x.id === m.id ? { ...x, myFlower: !x.myFlower, flowers: x.flowers + (x.myFlower ? -1 : 1) } : x) ?? null);
    await (m.myFlower ? unflowerMoment(m.id) : flowerMoment(m.id)).catch(() => load());
  }

  const weekAgo = Date.now() - 7 * 86400000;
  const sharedThisWeek = moments?.filter(m => new Date(m.created_at).getTime() > weekAgo).length ?? 0;

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-20 pb-4 md:pt-8 flex items-center gap-3">
        <Link href="/member/city" className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,0,0,0.06)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>✦ MOMENTS</p>
          <h1 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,6vw,36px)", color: "#111" }}>Not influencers.</h1>
          <p className="font-black leading-none italic" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,6vw,36px)", color: "#FF1F7D" }}>Just women.</p>
        </div>
        <button onClick={() => setShowShare(true)} className="ml-auto px-4 py-2 rounded-full text-xs font-bold text-white flex-shrink-0 transition-all active:scale-95" style={{ background: "#FF1F7D", boxShadow: "0 3px 10px rgba(255,31,125,0.3)" }}>
          + Share yours
        </button>
      </div>

      <div className="px-5 pb-2">
        <p className="text-xs italic" style={{ color: "#aaa", fontFamily: "var(--font-playfair)" }}>
          {moments === null ? "Loading…" : `${sharedThisWeek} moment${sharedThisWeek === 1 ? "" : "s"} shared this week`}
        </p>
      </div>

      {showShare && <ShareMomentSheet onClose={() => setShowShare(false)} onShared={load} />}

      {moments !== null && moments.length === 0 && (
        <div className="px-5 py-16 text-center">
          <p className="italic" style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: "rgba(0,0,0,0.4)" }}>No moments yet.</p>
          <p className="text-xs mt-2" style={{ color: "#bbb" }}>Be the first to share what you&apos;re doing in the city.</p>
        </div>
      )}

      {moments !== null && moments.length > 0 && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between px-5 mb-2">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#aaa" }}>RECENT</p>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-8 px-5" style={{ scrollbarWidth: "none", alignItems: "flex-start" }}>
              {moments.slice(0, 6).map((m, idx) => (
                <PolaroidCard key={m.id} m={m} idx={idx} size="large" onFlower={() => handleFlower(m)} />
              ))}
            </div>
          </div>

          <div className="px-5 pb-1">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#aaa" }}>ALL MOMENTS</p>
          </div>
          <div className="px-4 pb-6">
            <div className="columns-2 gap-4">
              {moments.map((m, idx) => (
                <div key={m.id} className="mb-5 break-inside-avoid flex justify-center">
                  <PolaroidCard m={m} idx={idx + 2} onFlower={() => handleFlower(m)} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
