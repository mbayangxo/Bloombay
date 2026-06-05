"use client";

import { useState } from "react";
import Link from "next/link";

function ShareMomentSheet({ onClose, onShared }: { onClose: () => void; onShared: () => void }) {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleShare() {
    if (!caption.trim()) return;
    setSubmitted(true);
    setTimeout(() => { onShared(); onClose(); }, 1200);
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: "#FDFAF5", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "80vh", overflowY: "auto" }}>
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
          <button onClick={handleShare} disabled={!caption.trim() || submitted}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: submitted ? "#FFB6D0" : caption.trim() ? "#FF1F7D" : "#F0E0E8", color: submitted || caption.trim() ? "white" : "#C8A0B0" }}>
            {submitted ? "Shared ✓" : "Share Moment"}
          </button>
        </div>
      </div>
    </>
  );
}

const POLAROID_ROTATIONS = ["-2.5deg", "2deg", "-1deg", "3deg", "-1.8deg", "1.5deg", "-2deg", "1deg"];

const MOMENTS = [
  { id: 1, initial: "A", avatarColor: "#FF1F7D", location: "Sadelle's", neighborhood: "SoHo", caption: "Sunday brunch season never ends.", flowers: 47, timeAgo: "2h", bgColor: "#FFE8F0", emoji: "🥯" },
  { id: 2, initial: "S", avatarColor: "#FF69B4", location: "Brooklyn Bridge Park", neighborhood: "DUMBO", caption: "Golden hour ✦", flowers: 83, timeAgo: "4h", bgColor: "#E8F4FF", emoji: "🌉" },
  { id: 3, initial: "P", avatarColor: "#FF1F7D", location: "The Met", neighborhood: "Upper East Side", caption: "Matisse forever.", flowers: 61, timeAgo: "6h", bgColor: "#FFF8E8", emoji: "🎨" },
  { id: 4, initial: "Z", avatarColor: "#FF69B4", location: "High Line", neighborhood: "Chelsea", caption: "8AM and the city is still asleep.", flowers: 34, timeAgo: "8h", bgColor: "#E8FFE8", emoji: "🌿" },
  { id: 5, initial: "N", avatarColor: "#FF1F7D", location: "La Mercerie", neighborhood: "SoHo", caption: "This croissant is my whole personality.", flowers: 112, timeAgo: "10h", bgColor: "#FFF0F5", emoji: "🥐" },
  { id: 6, initial: "J", avatarColor: "#FF69B4", location: "Archway Café", neighborhood: "DUMBO", caption: "Found my new place.", flowers: 28, timeAgo: "12h", bgColor: "#F5E8FF", emoji: "🌉" },
  { id: 7, initial: "K", avatarColor: "#FF1F7D", location: "Prospect Park", neighborhood: "Park Slope", caption: "Sunday light hits different here.", flowers: 55, timeAgo: "1d", bgColor: "#E8F5E8", emoji: "🌳" },
  { id: 8, initial: "T", avatarColor: "#FF69B4", location: "MoMA", neighborhood: "Midtown", caption: "Stayed until closing. Worth it.", flowers: 91, timeAgo: "1d", bgColor: "#F8E8FF", emoji: "🎨" },
  { id: 9, initial: "L", avatarColor: "#FF1F7D", location: "Russ & Daughters", neighborhood: "Lower East Side", caption: "NYC on a plate.", flowers: 67, timeAgo: "2d", bgColor: "#FFF5E8", emoji: "🥯" },
  { id: 10, initial: "M", avatarColor: "#FF69B4", location: "McNally Jackson", neighborhood: "Nolita", caption: "Four hours. Zero regrets.", flowers: 44, timeAgo: "2d", bgColor: "#E8F0FF", emoji: "📚" },
  { id: 11, initial: "R", avatarColor: "#FF1F7D", location: "Bangkok Supper Club", neighborhood: "Lower East Side", caption: "The tom yum. Every. Single. Time.", flowers: 79, timeAgo: "3d", bgColor: "#FFF0E8", emoji: "🍜" },
  { id: 12, initial: "B", avatarColor: "#FF69B4", location: "Smorgasburg", neighborhood: "Williamsburg", caption: "Saturday ritual.", flowers: 38, timeAgo: "3d", bgColor: "#E8FFE8", emoji: "🌮" },
];

function PolaroidCard({ m, idx, flowered, onFlower, size = "normal" }: {
  m: typeof MOMENTS[0]; idx: number; flowered: boolean; onFlower: () => void;
  size?: "normal" | "large";
}) {
  const rot = POLAROID_ROTATIONS[idx % POLAROID_ROTATIONS.length];
  const photoH = size === "large" ? 170 : 120;
  const width = size === "large" ? 190 : 150;
  const captionSize = size === "large" ? "15px" : "13px";
  const bottomPad = size === "large" ? 44 : 32;

  return (
    <div
      className="cursor-pointer transition-transform active:scale-[0.97]"
      style={{ transform: `rotate(${rot})`, transformOrigin: "center" }}
    >
      <div style={{
        background: "white",
        borderRadius: "3px",
        padding: `9px 9px ${bottomPad}px`,
        width: `${width}px`,
        boxShadow: "0 6px 24px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.07)",
      }}>
        {/* Photo area */}
        <div className="relative overflow-hidden"
          style={{ height: `${photoH}px`, background: m.bgColor, borderRadius: "2px" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: size === "large" ? "64px" : "46px", opacity: 0.55 }}>{m.emoji}</span>
          </div>
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
              style={{ background: m.avatarColor }}>
              {m.initial}
            </div>
            <span className="text-[8px] font-medium px-1 py-px rounded"
              style={{ color: "rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.7)" }}>
              {m.timeAgo}
            </span>
          </div>
        </div>
        {/* Caption */}
        <div className="pt-2.5 px-0.5 text-center">
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: captionSize, color: "#333", lineHeight: 1.3 }}>
            {m.caption}
          </p>
          <p className="text-[9px] mt-0.5" style={{ color: "#bbb" }}>{m.location}</p>
          <button
            onClick={e => { e.stopPropagation(); onFlower(); }}
            className="flex items-center justify-center gap-1 mt-2 w-full transition-transform active:scale-110"
          >
            <span style={{ fontSize: 12, color: flowered ? "#FF1F7D" : "#ccc" }}>✿</span>
            <span className="text-[9px] font-bold" style={{ color: flowered ? "#FF1F7D" : "#ccc" }}>
              {m.flowers + (flowered ? 1 : 0)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MomentsPage() {
  const [flowered, setFlowered] = useState<Set<number>>(new Set());
  const [showShare, setShowShare] = useState(false);
  const [sharedCount, setSharedCount] = useState(MOMENTS.length);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>
      {/* Header */}
      <div className="px-5 pt-20 pb-4 md:pt-8 flex items-center gap-3">
        <Link href="/member/city"
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(0,0,0,0.06)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF1F7D" }}>✦ MOMENTS</p>
          <h1 className="font-black leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,6vw,36px)", color: "#111" }}>
            Not influencers.
          </h1>
          <p className="font-black leading-none italic" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,6vw,36px)", color: "#FF1F7D" }}>
            Just women.
          </p>
        </div>
        <button onClick={() => setShowShare(true)}
          className="ml-auto px-4 py-2 rounded-full text-xs font-bold text-white flex-shrink-0 transition-all active:scale-95"
          style={{ background: "#FF1F7D", boxShadow: "0 3px 10px rgba(255,31,125,0.3)" }}>
          + Share yours
        </button>
      </div>

      <div className="px-5 pb-2">
        <p className="text-xs italic" style={{ color: "#aaa", fontFamily: "var(--font-instrument)" }}>
          {sharedCount} moments shared this week
        </p>
      </div>

      {showShare && (
        <ShareMomentSheet
          onClose={() => setShowShare(false)}
          onShared={() => setSharedCount(c => c + 1)}
        />
      )}

      {/* Horizontal swipe row — featured */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-5 mb-2">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#aaa" }}>RECENT</p>
        </div>
        <div
          className="flex gap-6 overflow-x-auto pb-8 px-5"
          style={{ scrollbarWidth: "none", alignItems: "flex-start" }}
        >
          {MOMENTS.slice(0, 6).map((m, idx) => (
            <PolaroidCard
              key={m.id}
              m={m}
              idx={idx}
              size="large"
              flowered={flowered.has(m.id)}
              onFlower={() => setFlowered(p => new Set([...p, m.id]))}
            />
          ))}
        </div>
      </div>

      {/* Masonry grid — all moments */}
      <div className="px-5 pb-1">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#aaa" }}>ALL MOMENTS</p>
      </div>
      <div className="px-4 pb-6">
        <div className="columns-2 gap-4">
          {MOMENTS.map((m, idx) => (
            <div key={m.id} className="mb-5 break-inside-avoid flex justify-center">
              <PolaroidCard
                m={m}
                idx={idx + 2}
                flowered={flowered.has(m.id)}
                onFlower={() => setFlowered(p => new Set([...p, m.id]))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
