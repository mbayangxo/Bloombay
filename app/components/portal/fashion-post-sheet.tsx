"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/browser";

const PINK   = "#FF1F7D";
const INK    = "#111111";
const IVORY  = "#fdf4ec";
const CREAM  = "#F5EFE6";

// ── Template definitions ──────────────────────────────────────────────────────

export type TemplateId =
  | "standard"         // swipeable carousel 1-10 photos
  | "polaroid_single"  // one Polaroid, slight tilt, big border
  | "polaroid_grid"    // 2×2 contact sheet
  | "collage"          // 3 overlapping scattered Polaroids
  | "editorial"        // 58/42 split panel
  | "lookbook"         // "Look 01 / Look 02" (IMG_3464)
  | "camera"           // Y2K camera/device screen (IMG_3559)
  | "scrapbook"        // spiral notebook, clip + washi tape (IMG_3562)
  | "portrait_stack"   // big portrait left + Polaroid column (IMG_3470)
  | "moodboard";       // journal page, overlapping Polaroids (IMG_3457)

interface TemplateConfig {
  id: TemplateId;
  label: string;
  emoji: string;
  description: string;
  maxPhotos: number;
  minPhotos: number;
}

const TEMPLATES: TemplateConfig[] = [
  { id: "standard",        label: "Standard",    emoji: "◻",  description: "Swipeable feed",         maxPhotos: 10, minPhotos: 1 },
  { id: "polaroid_single", label: "Polaroid",    emoji: "📷", description: "Instant camera frame",   maxPhotos: 1,  minPhotos: 1 },
  { id: "polaroid_grid",   label: "Grid",        emoji: "⊞",  description: "2×2 contact sheet",      maxPhotos: 4,  minPhotos: 2 },
  { id: "collage",         label: "Collage",     emoji: "✦",  description: "Scattered moodboard",    maxPhotos: 3,  minPhotos: 2 },
  { id: "editorial",       label: "Editorial",   emoji: "▨",  description: "Split editorial panel",  maxPhotos: 2,  minPhotos: 1 },
  { id: "lookbook",        label: "Lookbook",    emoji: "👗", description: "Look 01 / Look 02",      maxPhotos: 2,  minPhotos: 2 },
  { id: "camera",          label: "Camera",      emoji: "📸", description: "Y2K camera screen",      maxPhotos: 6,  minPhotos: 1 },
  { id: "scrapbook",       label: "Scrapbook",   emoji: "📔", description: "Notebook journal page",  maxPhotos: 3,  minPhotos: 1 },
  { id: "portrait_stack",  label: "Portrait",    emoji: "🎞", description: "Portrait + photo stack", maxPhotos: 4,  minPhotos: 1 },
  { id: "moodboard",       label: "Moodboard",   emoji: "🌿", description: "Journal mood board",     maxPhotos: 3,  minPhotos: 1 },
];

const BORDER_COLORS = [
  { label: "Classic",  value: "#FFFFFF" },
  { label: "Ivory",    value: "#FAF5EC" },
  { label: "Black",    value: "#1A1A1A" },
  { label: "Blush",    value: "#FFD6E8" },
  { label: "Hot Pink", value: "#FF1F7D" },
  { label: "Sage",     value: "#C8D5C0" },
  { label: "Lavender", value: "#D4C5F0" },
  { label: "Nude",     value: "#E8D5C4" },
];

// ── Slot: tappable upload area or image preview ───────────────────────────────

function Slot({
  file, onTap, style, imgStyle,
}: {
  file: File | null;
  onTap: () => void;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
}) {
  const url = file ? URL.createObjectURL(file) : null;
  return (
    <div
      onClick={!file ? onTap : undefined}
      style={{ overflow: "hidden", position: "relative", ...style }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...imgStyle }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 4 }}>
          <span style={{ fontSize: 20, opacity: 0.4 }}>+</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb", letterSpacing: "0.04em" }}>tap to add</span>
        </div>
      )}
    </div>
  );
}

// ── Caption input inside frames ───────────────────────────────────────────────

function CaptionInput({
  value, onChange, placeholder = "write here…", style,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={60}
      onClick={e => e.stopPropagation()}
      style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.45)", textAlign: "center", boxSizing: "border-box", padding: "6px 4px 0", ...style }}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE PREVIEWS
// ══════════════════════════════════════════════════════════════════════════════

// 1. Standard — swipeable carousel ────────────────────────────────────────────
function StandardPreview({ photos, borderColor, captions, onTap }: {
  photos: (File | null)[]; borderColor: string; captions: string[]; onTap: (i: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const filled = photos.filter(Boolean);
  const total = Math.max(filled.length, 1);

  return (
    <div>
      <div style={{ borderRadius: 14, overflow: "hidden", background: "#F8F4EE", position: "relative", aspectRatio: "4/5" }}>
        <Slot file={photos[idx] ?? null} onTap={() => onTap(idx)} style={{ width: "100%", height: "100%" }} />
        {/* Arrow controls */}
        {filled.length > 1 && (
          <>
            {idx > 0 && (
              <button onClick={() => setIdx(i => i - 1)} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.35)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            )}
            {idx < filled.length - 1 && (
              <button onClick={() => setIdx(i => i + 1)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.35)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            )}
            {/* Dot indicators */}
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
              {filled.map((_, i) => (
                <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 16 : 6, height: 6, borderRadius: 3, background: i === idx ? "#fff" : "rgba(255,255,255,0.5)", transition: "width 0.2s", cursor: "pointer" }} />
              ))}
            </div>
          </>
        )}
        {/* Add more button */}
        {filled.length > 0 && filled.length < 10 && (
          <button onClick={() => onTap(filled.length)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.4)", color: "#fff", border: "none", borderRadius: 8, padding: "4px 8px", fontFamily: "var(--font-jost)", fontSize: 10, cursor: "pointer" }}>+ Add</button>
        )}
      </div>
      {captions[idx] !== undefined && (
        <CaptionInput value={captions[idx]} onChange={() => {}} placeholder="Add a caption…" style={{ textAlign: "left", fontSize: 12, paddingLeft: 2 }} />
      )}
    </div>
  );
}

// 2. Polaroid Single ───────────────────────────────────────────────────────────
function PolaroidSinglePreview({ photos, borderColor, captions, onTap, onCaptionChange }: {
  photos: (File | null)[]; borderColor: string; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px", background: CREAM, borderRadius: 14 }}>
      <div style={{ transform: "rotate(-2deg)", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.22))" }}>
        <div style={{ backgroundColor: borderColor, padding: "10px 10px 40px", width: 220 }}>
          <Slot file={photos[0]} onTap={() => onTap(0)} style={{ height: 220 }} />
          <CaptionInput
            value={captions[0]}
            onChange={v => onCaptionChange(0, v)}
            style={{ color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)", marginTop: 4 }}
          />
        </div>
      </div>
    </div>
  );
}

// 3. Polaroid Grid 2×2 ────────────────────────────────────────────────────────
function PolaroidGridPreview({ photos, borderColor, captions, onTap, onCaptionChange }: {
  photos: (File | null)[]; borderColor: string; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void;
}) {
  const tilts = [-2.5, 1.8, 2.2, -1.5];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, background: CREAM, borderRadius: 14 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ transform: `rotate(${tilts[i]}deg)`, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.18))" }}>
          <div style={{ backgroundColor: borderColor, padding: "7px 7px 28px" }}>
            <Slot file={photos[i] ?? null} onTap={() => onTap(i)} style={{ height: 110 }} />
            <CaptionInput
              value={captions[i] ?? ""}
              onChange={v => onCaptionChange(i, v)}
              style={{ fontSize: 11, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. Collage — 3 scattered Polaroids ──────────────────────────────────────────
function CollagePreview({ photos, borderColor, captions, onTap, onCaptionChange }: {
  photos: (File | null)[]; borderColor: string; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void;
}) {
  const configs = [
    { top: 0,    left: "5%",  width: 170, height: 170, rotate: -7,  zIndex: 3 },
    { top: 60,   left: "38%", width: 155, height: 155, rotate: 5,   zIndex: 2 },
    { top: 120,  left: "15%", width: 160, height: 160, rotate: -3,  zIndex: 1 },
  ];
  return (
    <div style={{ position: "relative", height: 340, background: CREAM, borderRadius: 14, overflow: "hidden" }}>
      {[0, 1, 2].map(i => {
        const c = configs[i];
        return (
          <div key={i} style={{ position: "absolute", top: c.top, left: c.left, transform: `rotate(${c.rotate}deg)`, zIndex: c.zIndex, filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.22))" }}>
            <div style={{ backgroundColor: borderColor, padding: "8px 8px 32px", width: c.width }}>
              <Slot file={photos[i] ?? null} onTap={() => onTap(i)} style={{ height: c.height }} />
              <CaptionInput
                value={captions[i] ?? ""}
                onChange={v => onCaptionChange(i, v)}
                style={{ fontSize: 11, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 5. Editorial split ───────────────────────────────────────────────────────────
function EditorialPreview({ photos, captions, onTap, onCaptionChange, title }: {
  photos: (File | null)[]; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void; title: string;
}) {
  return (
    <div style={{ background: "#F0EBE2", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", height: 280 }}>
        <Slot file={photos[0]} onTap={() => onTap(0)} style={{ flex: "0 0 58%", height: "100%" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Slot file={photos[1] ?? null} onTap={() => onTap(1)} style={{ flex: 1 }} />
          <div style={{ padding: "8px 10px 10px", background: "#fff" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(0,0,0,0.35)", textTransform: "uppercase" }}>BLOOMBAY ✦</p>
            <CaptionInput value={captions[1] ?? ""} onChange={v => onCaptionChange(1, v)} style={{ textAlign: "left", padding: 0, fontSize: 11, paddingTop: 3 }} />
          </div>
        </div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: INK }}>{title || "Title"}</p>
        <CaptionInput value={captions[0] ?? ""} onChange={v => onCaptionChange(0, v)} style={{ textAlign: "left", padding: "4px 0 0", fontSize: 12 }} />
      </div>
    </div>
  );
}

// 6. Lookbook — "Look 01 / Look 02" (IMG_3464) ────────────────────────────────
function LookbookPreview({ photos, captions, onTap, onCaptionChange, title }: {
  photos: (File | null)[]; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void; title: string;
}) {
  const year = new Date().getFullYear();
  return (
    <div style={{ background: "#F7F3EE", borderRadius: 14, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "10px 14px 6px", display: "flex", justifyContent: "flex-end" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(0,0,0,0.35)", textTransform: "uppercase", textAlign: "right", lineHeight: 1.5 }}>
          SPRING / SUMMER {year}<br />PHOTO DIRECTION
        </p>
      </div>
      {/* Two photos side by side */}
      <div style={{ display: "flex", gap: 6, padding: "0 8px" }}>
        {[0, 1].map(i => (
          <div key={i} style={{ flex: 1, position: "relative" }}>
            <Slot file={photos[i] ?? null} onTap={() => onTap(i)} style={{ height: 220, borderRadius: 2 }} />
            {/* "Look 0N" overlay */}
            <p style={{ position: "absolute", bottom: 8, left: 8, margin: 0, fontFamily: "var(--font-caveat)", fontSize: 16, color: "#fff", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
              Look 0{i + 1}
            </p>
          </div>
        ))}
      </div>
      {/* Title + caption */}
      <div style={{ padding: "10px 14px 14px" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: INK, textTransform: "uppercase" }}>
          {title || "TITLE 01"}
        </p>
        <CaptionInput value={captions[0] ?? ""} onChange={v => onCaptionChange(0, v)} placeholder="Describe the look…" style={{ textAlign: "left", padding: "4px 0 0", fontSize: 11, color: "rgba(0,0,0,0.45)" }} />
      </div>
    </div>
  );
}

// 7. Camera / Y2K device screen (IMG_3559) ────────────────────────────────────
function CameraPreview({ photos, captions, onTap }: {
  photos: (File | null)[]; captions: string[]; onTap: (i: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const filled = photos.filter(Boolean);
  const total = Math.max(filled.length, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "12px 0", background: "#1A1A2E", borderRadius: 14 }}>
      {/* Camera body */}
      <div style={{ background: "linear-gradient(160deg, #E8A0C8 0%, #D070B0 40%, #B85090 100%)", borderRadius: 18, padding: "10px 10px 14px", width: 230, boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "#FFD700" : "rgba(255,255,255,0.3)" }} />)}
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>BLOOMBAY CAM</p>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "1.5px solid rgba(255,255,255,0.2)" }} />
        </div>

        {/* Screen bezel */}
        <div style={{ background: "#0A0A1A", borderRadius: 6, padding: 4, boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,255,255,0.1)" }}>
          {/* Screen status bar */}
          <div style={{ background: "#000", padding: "3px 6px", display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 7, color: "#00FF88", letterSpacing: "0.1em" }}>REC</p>
            <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 7, color: "#FFD700" }}>{idx + 1}/{total}</p>
            <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.5)" }}>▣ MEM</p>
          </div>
          {/* Photo in screen */}
          <Slot file={photos[idx] ?? null} onTap={() => onTap(idx)} style={{ height: 168, borderRadius: 2 }} />
          {/* Screen grid overlay */}
          <div style={{ position: "relative", marginTop: 2 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(0,255,136,0.6)", textAlign: "center", letterSpacing: "0.08em" }}>▪ ▪ ▪ AF LOCK ▪ ▪ ▪</p>
          </div>
        </div>

        {/* Swipe controls */}
        {filled.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 4, width: 24, height: 16, cursor: "pointer", fontSize: 10, opacity: idx === 0 ? 0.3 : 1 }}>‹</button>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {filled.map((_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === idx ? "#FFD700" : "rgba(255,255,255,0.3)" }} />)}
            </div>
            <button onClick={() => setIdx(i => Math.min(filled.length - 1, i + 1))} disabled={idx >= filled.length - 1} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 4, width: 24, height: 16, cursor: "pointer", fontSize: 10, opacity: idx >= filled.length - 1 ? 0.3 : 1 }}>›</button>
          </div>
        )}

        {/* Bottom buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, padding: "0 4px" }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["FUNC", "DISP", "SET"].map(b => (
              <div key={b} style={{ background: "rgba(0,0,0,0.4)", borderRadius: 3, padding: "2px 5px" }}>
                <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 6, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>{b}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {["▲", "●", "▼"].map(s => (
              <div key={s} style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ margin: 0, fontSize: 7, color: "rgba(255,255,255,0.5)" }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Scrapbook — spiral notebook (IMG_3562) ────────────────────────────────────
function ScrapbookPreview({ photos, captions, onTap, onCaptionChange, title }: {
  photos: (File | null)[]; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void; title: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", display: "flex", position: "relative", minHeight: 340 }}>
      {/* Spiral binding */}
      <div style={{ width: 22, flexShrink: 0, background: "#E0E0E0", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", padding: "8px 0" }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid #999", background: "#fff" }} />
        ))}
      </div>

      {/* Page content */}
      <div style={{ flex: 1, padding: "14px 12px 12px 10px", position: "relative" }}>
        {/* Row 1: two photos with clip + washi tape */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {/* Photo 1 — pink clip */}
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ transform: "rotate(-3deg)", transformOrigin: "top center" }}>
              {/* Clip */}
              <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", fontSize: 16, zIndex: 2 }}>📎</div>
              <div style={{ background: "#fff", padding: "3px 3px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", marginTop: 8 }}>
                <Slot file={photos[0]} onTap={() => onTap(0)} style={{ height: 95 }} />
                <CaptionInput value={captions[0]} onChange={v => onCaptionChange(0, v)} style={{ fontSize: 10 }} />
              </div>
            </div>
          </div>

          {/* Photo 2 — washi tape */}
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ transform: "rotate(2deg)", transformOrigin: "top center" }}>
              {/* Washi tape strip */}
              <div style={{ position: "absolute", top: -4, left: 0, right: 0, height: 10, background: "rgba(255,182,193,0.7)", zIndex: 2, borderRadius: 1 }} />
              <div style={{ background: "#fff", padding: "8px 3px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                <Slot file={photos[1] ?? null} onTap={() => onTap(1)} style={{ height: 95 }} />
                <CaptionInput value={captions[1] ?? ""} onChange={v => onCaptionChange(1, v)} style={{ fontSize: 10 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Handwritten label */}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: PINK, margin: "0 0 8px", paddingLeft: 4, lineHeight: 1 }}>
          {title || "With Love Always ♡"}
        </p>

        {/* Photo 3 — large bottom, cut-out style */}
        <div style={{ transform: "rotate(-1deg)", marginLeft: 4 }}>
          <Slot file={photos[2] ?? null} onTap={() => onTap(2)} style={{ height: 130, borderRadius: 2, boxShadow: "0 3px 12px rgba(0,0,0,0.15)" }} />
        </div>

        {/* Bottom sticker text */}
        <div style={{ position: "absolute", bottom: 10, right: 10, background: PINK, borderRadius: 3, padding: "3px 8px", transform: "rotate(2deg)" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>BLOOMBAY ✦</p>
        </div>
      </div>
    </div>
  );
}

// 9. Portrait + Stack (IMG_3470) ───────────────────────────────────────────────
function PortraitStackPreview({ photos, borderColor, captions, onTap, onCaptionChange, title }: {
  photos: (File | null)[]; borderColor: string; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void; title: string;
}) {
  const stackTilts = [-2, 1.5, -1.2];
  return (
    <div style={{ background: "#F8F3EE", borderRadius: 14, overflow: "visible", padding: "12px 12px 14px" }}>
      {/* Pink bow at top */}
      <p style={{ textAlign: "center", fontSize: 22, margin: "0 0 8px" }}>🎀</p>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* Large portrait left */}
        <div style={{ flex: "0 0 54%" }}>
          <Slot file={photos[0]} onTap={() => onTap(0)} style={{ height: 260, borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }} />
          {/* Handwritten name label */}
          <div style={{ background: "#F5F0E8", padding: "4px 8px", marginTop: 4, display: "inline-block" }}>
            <CaptionInput value={captions[0]} onChange={v => onCaptionChange(0, v)} placeholder="Rhode..♡" style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", width: "auto", minWidth: 80 }} />
          </div>
        </div>

        {/* Polaroid stack right */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, paddingTop: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ transform: `rotate(${stackTilts[i - 1]}deg)`, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
              <div style={{ backgroundColor: borderColor, padding: "5px 5px 22px" }}>
                <Slot file={photos[i] ?? null} onTap={() => onTap(i)} style={{ height: 70 }} />
                <CaptionInput value={captions[i] ?? ""} onChange={v => onCaptionChange(i, v)} style={{ fontSize: 9, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.35)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 10. Moodboard Journal (IMG_3457) ────────────────────────────────────────────
function MoodboardPreview({ photos, borderColor, captions, onTap, onCaptionChange, title }: {
  photos: (File | null)[]; borderColor: string; captions: string[]; onTap: (i: number) => void; onCaptionChange: (i: number, v: string) => void; title: string;
}) {
  return (
    <div style={{ background: "#FAFAF8", borderRadius: 14, overflow: "hidden" }}>
      {/* Top tag bar */}
      <div style={{ padding: "8px 12px 4px", display: "flex", gap: 6 }}>
        {["Outfit inspiration", "Street style", "Island style"].map(t => (
          <div key={t} style={{ background: "#E8E0F8", borderRadius: 10, padding: "2px 8px" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 8, color: "#7B5EA7", fontWeight: 600 }}>{t}</p>
          </div>
        ))}
      </div>

      {/* Main full-width photo */}
      <Slot file={photos[0]} onTap={() => onTap(0)} style={{ height: 180, margin: "0 8px", borderRadius: 4 }} />

      {/* Middle row: two overlapping Polaroids + text */}
      <div style={{ position: "relative", height: 170, margin: "8px 8px 0" }}>
        {/* Polaroid 1 */}
        <div style={{ position: "absolute", top: 8, left: 0, transform: "rotate(-5deg)", zIndex: 2, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))" }}>
          <div style={{ backgroundColor: borderColor, padding: "6px 6px 24px", width: 120 }}>
            <Slot file={photos[1] ?? null} onTap={() => onTap(1)} style={{ height: 100 }} />
            <CaptionInput value={captions[1] ?? ""} onChange={v => onCaptionChange(1, v)} style={{ fontSize: 9 }} />
          </div>
        </div>
        {/* Polaroid 2 */}
        <div style={{ position: "absolute", top: 26, left: 80, transform: "rotate(4deg)", zIndex: 3, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))" }}>
          <div style={{ backgroundColor: borderColor, padding: "6px 6px 24px", width: 110 }}>
            <Slot file={photos[2] ?? null} onTap={() => onTap(2)} style={{ height: 90 }} />
            <CaptionInput value={captions[2] ?? ""} onChange={v => onCaptionChange(2, v)} style={{ fontSize: 9 }} />
          </div>
        </div>

        {/* Text block right side */}
        <div style={{ position: "absolute", right: 0, top: 10, width: 110 }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#5A5A7A", margin: "0 0 2px", lineHeight: 1.2 }}>
            {title || "she is a goddess"}
          </p>
          <CaptionInput value={captions[0]} onChange={v => onCaptionChange(0, v)} placeholder="add lyrics or caption…" style={{ textAlign: "left", fontSize: 11, color: "rgba(0,0,0,0.4)", padding: "4px 0 0" }} />
        </div>
      </div>

      {/* Bottom label */}
      <div style={{ padding: "8px 12px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ background: "#E8E8F4", borderRadius: 4, padding: "3px 8px" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 8, color: "#6060A0", fontWeight: 700, letterSpacing: "0.06em" }}>pretty girl</p>
        </div>
        <div style={{ background: "#E8E8F4", borderRadius: 4, padding: "3px 8px" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 8, color: "#6060A0", fontWeight: 700, letterSpacing: "0.06em" }}>of the beautiful eyes</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SHEET
// ══════════════════════════════════════════════════════════════════════════════

interface Props {
  onClose: () => void;
  onPosted?: () => void;
  context?: "avenue" | "hanger";
  category?: string;
}

export function FashionPostSheet({ onClose, onPosted, context = "avenue", category }: Props) {
  const [template,     setTemplate]     = useState<TemplateId>("standard");
  const [borderColor,  setBorderColor]  = useState("#FFFFFF");
  const [customColor,  setCustomColor]  = useState("#FFFFFF");
  const [photos,       setPhotos]       = useState<(File | null)[]>(Array(10).fill(null));
  const [captions,     setCaptions]     = useState<string[]>(Array(10).fill(""));
  const [title,        setTitle]        = useState("");
  const [globalCaption,setGlobalCaption]= useState("");
  const [uploading,    setUploading]    = useState(false);
  const [done,         setDone]         = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingSlot  = useRef<number>(0);

  const cfg = TEMPLATES.find(t => t.id === template)!;
  const polaroidTemplates: TemplateId[] = ["polaroid_single", "polaroid_grid", "collage", "portrait_stack", "moodboard"];

  function triggerUpload(slotIndex: number) {
    pendingSlot.current = slotIndex;
    fileInputRef.current?.click();
  }

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const slot = pendingSlot.current;
    setPhotos(prev => { const n = [...prev]; n[slot] = file; return n; });
    e.target.value = "";
  }, []);

  function updateCaption(i: number, v: string) {
    setCaptions(prev => { const n = [...prev]; n[i] = v; return n; });
  }

  async function uploadPhoto(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `fashion-posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("avenue-media").upload(path, file, { contentType: file.type });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("avenue-media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handlePost() {
    const filledPhotos = photos.filter(Boolean) as File[];
    if (filledPhotos.length < cfg.minPhotos) {
      setError(`This template needs at least ${cfg.minPhotos} photo${cfg.minPhotos > 1 ? "s" : ""}.`);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const photoUrls = await Promise.all(
        photos.map(f => f ? uploadPhoto(f) : Promise.resolve(null))
      );
      const res = await fetch("/api/avenue/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          category: category ?? "fits",
          template_id: template,
          title: title.trim() || null,
          caption: globalCaption.trim() || null,
          photo_urls: photoUrls.filter(Boolean),
          photo_captions: captions.filter((_, i) => photos[i]),
          border_color: polaroidTemplates.includes(template) ? borderColor : null,
          meta: { template_id: template, border_color: borderColor },
        }),
      });
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Something went wrong");
      setDone(true);
      onPosted?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setUploading(false);
    }
  }

  const INPUT: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1.5px solid #F0EBE4", background: "white",
    fontFamily: "var(--font-jost)", fontSize: 14, color: INK,
    outline: "none", boxSizing: "border-box",
  };

  // ── Done state ──────────────────────────────────────────────────────────────
  if (done) return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: IVORY, borderRadius: "24px 24px 0 0", padding: "40px 24px 64px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>✦</div>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 24, color: INK, marginBottom: 8 }}>Posted.</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", marginBottom: 24 }}>
          {context === "hanger" ? "Your post is live on The Hanger." : "Your post is live on the Avenue."}
        </p>
        <button onClick={onClose} style={{ padding: "14px 32px", background: PINK, color: "white", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Done ✦</button>
      </div>
    </>
  );

  // ── Sheet ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400 }} />

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

      {/* Sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401,
        background: IVORY, borderRadius: "24px 24px 0 0",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        maxHeight: "94dvh", overflowY: "auto",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)" }} />
        </div>

        <div style={{ padding: "0 18px 36px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: INK, margin: 0 }}>
              {context === "hanger" ? "Post a look" : "Post to Avenue"}
            </h2>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "rgba(0,0,0,0.35)", padding: "0 0 0 16px" }}>✕</button>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.4)", margin: "0 0 20px" }}>
            Choose a template ✦
          </p>

          {/* ── Template picker ────────────────────────────────────────────── */}
          <div style={{ overflowX: "auto", display: "flex", gap: 8, marginBottom: 20, paddingBottom: 4 }}>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                style={{
                  flexShrink: 0,
                  padding: "8px 12px",
                  borderRadius: 12,
                  border: template === t.id ? `2px solid ${PINK}` : "1.5px solid rgba(0,0,0,0.1)",
                  background: template === t.id ? `${PINK}12` : "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                  minWidth: 74,
                }}
              >
                <p style={{ margin: 0, fontSize: 20 }}>{t.emoji}</p>
                <p style={{ margin: "3px 0 1px", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: template === t.id ? PINK : INK, letterSpacing: "0.04em" }}>{t.label}</p>
                <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 8, color: "rgba(0,0,0,0.35)", lineHeight: 1.2 }}>{t.description}</p>
              </button>
            ))}
          </div>

          {/* ── Polaroid border color picker ───────────────────────────────── */}
          {polaroidTemplates.includes(template) && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: "0 0 10px" }}>Frame color</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {BORDER_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setBorderColor(c.value)}
                    title={c.label}
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: c.value,
                      border: borderColor === c.value ? `3px solid ${PINK}` : "2px solid rgba(0,0,0,0.15)",
                      cursor: "pointer",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                    }}
                  />
                ))}
                {/* Custom color */}
                <label style={{ position: "relative", width: 28, height: 28, borderRadius: "50%", overflow: "hidden", cursor: "pointer", border: "2px dashed rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14 }}>+</span>
                  <input type="color" value={customColor} onChange={e => { setCustomColor(e.target.value); setBorderColor(e.target.value); }} style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                </label>
              </div>
            </div>
          )}

          {/* ── Template preview ───────────────────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
            {template === "standard" && (
              <StandardPreview photos={photos} borderColor={borderColor} captions={captions} onTap={triggerUpload} />
            )}
            {template === "polaroid_single" && (
              <PolaroidSinglePreview photos={photos} borderColor={borderColor} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} />
            )}
            {template === "polaroid_grid" && (
              <PolaroidGridPreview photos={photos} borderColor={borderColor} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} />
            )}
            {template === "collage" && (
              <CollagePreview photos={photos} borderColor={borderColor} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} />
            )}
            {template === "editorial" && (
              <EditorialPreview photos={photos} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} title={title} />
            )}
            {template === "lookbook" && (
              <LookbookPreview photos={photos} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} title={title} />
            )}
            {template === "camera" && (
              <CameraPreview photos={photos} captions={captions} onTap={triggerUpload} />
            )}
            {template === "scrapbook" && (
              <ScrapbookPreview photos={photos} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} title={title} />
            )}
            {template === "portrait_stack" && (
              <PortraitStackPreview photos={photos} borderColor={borderColor} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} title={title} />
            )}
            {template === "moodboard" && (
              <MoodboardPreview photos={photos} borderColor={borderColor} captions={captions} onTap={triggerUpload} onCaptionChange={updateCaption} title={title} />
            )}
          </div>

          {/* ── Title ──────────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: "0 0 8px" }}>Title</p>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={template === "lookbook" ? "TITLE 01" : template === "moodboard" ? "she is a goddess…" : "Add a title…"}
              maxLength={80}
              style={INPUT}
            />
          </div>

          {/* ── Caption (global, for standard + camera) ────────────────────── */}
          {(template === "standard" || template === "camera") && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: "0 0 8px" }}>Caption</p>
              <textarea
                value={globalCaption}
                onChange={e => setGlobalCaption(e.target.value)}
                placeholder="Write a caption…"
                rows={2}
                maxLength={300}
                style={{ ...INPUT, resize: "none", fontFamily: "var(--font-caveat)", fontSize: 15 }}
              />
            </div>
          )}

          {/* ── Error ──────────────────────────────────────────────────────── */}
          {error && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#e53e3e", margin: "0 0 12px" }}>{error}</p>
          )}

          {/* ── Submit ─────────────────────────────────────────────────────── */}
          <button
            onClick={() => void handlePost()}
            disabled={uploading}
            style={{ width: "100%", padding: "15px 0", background: uploading ? "rgba(255,31,125,0.5)" : PINK, color: "#fff", border: "none", borderRadius: 16, fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, letterSpacing: "0.05em", cursor: uploading ? "not-allowed" : "pointer" }}
          >
            {uploading ? "Posting…" : context === "hanger" ? "Post to Hanger ✦" : "Post to Avenue ✦"}
          </button>
        </div>
      </div>
    </>
  );
}
