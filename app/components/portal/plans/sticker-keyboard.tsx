"use client";

import { useState, useRef } from "react";
import { STICKER_PACKS, type StickerPackId, PINK } from "@/lib/plans/constants";

const USER_STICKERS_STORE: string[] = [];

export function StickerKeyboard({ onAdd }: { onAdd: (s: string) => void }) {
  const [activePack, setActivePack] = useState<StickerPackId | "yours">("bloom");
  const [userStickers, setUserStickers] = useState<string[]>([...USER_STICKERS_STORE]);
  const fileRef = useRef<HTMLInputElement>(null);

  const PACK_TABS: { id: StickerPackId | "yours"; emoji: string; name: string }[] = [
    { id: "bloom",  emoji: "🌸", name: "BLOOM"  },
    { id: "hearts", emoji: "💕", name: "LOVE"   },
    { id: "glam",   emoji: "💎", name: "GLAM"   },
    { id: "stars",  emoji: "⭐", name: "MAGIC"  },
    { id: "nyc",    emoji: "🗽", name: "NYC"    },
    { id: "yours",  emoji: "📸", name: "YOURS"  },
  ];

  const stickers: string[] = activePack === "yours" ? userStickers : STICKER_PACKS[activePack as StickerPackId];

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        const url = ev.target.result as string;
        USER_STICKERS_STORE.push(url);
        setUserStickers([...USER_STICKERS_STORE]);
        setActivePack("yours");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ background: "white" }}>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />

      <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 6px" }}>
        {PACK_TABS.map(p => (
          <button key={p.id} onClick={() => setActivePack(p.id)}
            style={{ flex: 1, paddingTop: 8, paddingBottom: 8, background: "none", border: "none", borderBottom: activePack === p.id ? `2.5px solid ${PINK}` : "2.5px solid transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "border-color 0.15s" }}>
            <span style={{ fontSize: 20 }}>{p.emoji}</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.1em", color: activePack === p.id ? PINK : "#ccc" }}>{p.name}</p>
          </button>
        ))}
      </div>

      {activePack === "yours" && userStickers.length === 0 && (
        <div style={{ padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,31,125,0.08)", border: "2px dashed rgba(255,31,125,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 4 }}>Your Sticker Pack</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "#aaa", lineHeight: 1.4 }}>Upload PNG images to use as custom stickers on your planner</p>
          </div>
          <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "white", letterSpacing: "0.06em" }}>UPLOAD STICKER →</p>
          </button>
        </div>
      )}

      {(activePack !== "yours" || userStickers.length > 0) && (
        <div style={{ padding: "10px 10px 6px" }}>
          {activePack === "yours" && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "5px 14px", borderRadius: 999, background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)", cursor: "pointer" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: PINK }}>+ Upload more</p>
              </button>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 7 }}>
            {stickers.map((s, i) => (
              <button key={i} onClick={() => onAdd(s)}
                className="active:scale-90 transition-transform"
                style={{ aspectRatio: "1", borderRadius: 14, background: "rgba(255,31,125,0.04)", border: "1px solid rgba(255,31,125,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
                {s.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s} alt="" style={{ width: "75%", height: "75%", objectFit: "contain" }} />
                ) : (
                  <span style={{ fontSize: 26 }}>{s}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
