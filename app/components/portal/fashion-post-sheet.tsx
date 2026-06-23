"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/browser";

const PINK   = "#FF1F7D";
const INK    = "#111111";
const IVORY  = "#fdf4ec";

// ── Template definitions ──────────────────────────────────────────────────────

export type TemplateId =
  | "standard"        // single photo / swipeable carousel
  | "polaroid_single" // one Polaroid, slight tilt, big white border
  | "polaroid_grid"   // 2×2 grid of Polaroids, alternating tilts
  | "collage"         // 3 overlapping Polaroids at angles (moodboard)
  | "editorial";      // split editorial panel — photo left, text right

interface TemplateConfig {
  id: TemplateId;
  label: string;
  emoji: string;
  description: string;
  maxPhotos: number;
  minPhotos: number;
}

const TEMPLATES: TemplateConfig[] = [
  { id: "standard",        label: "Standard",       emoji: "◻",   description: "Clean swipeable feed",       maxPhotos: 10, minPhotos: 1 },
  { id: "polaroid_single", label: "Polaroid",        emoji: "📷",  description: "Instant camera frame",       maxPhotos: 1,  minPhotos: 1 },
  { id: "polaroid_grid",   label: "Grid",            emoji: "⊞",   description: "2×2 contact sheet",          maxPhotos: 4,  minPhotos: 2 },
  { id: "collage",         label: "Collage",         emoji: "✦",   description: "Scattered moodboard",        maxPhotos: 3,  minPhotos: 2 },
  { id: "editorial",       label: "Editorial",       emoji: "▨",   description: "Split editorial panel",      maxPhotos: 2,  minPhotos: 1 },
];

const BORDER_COLORS = [
  { label: "Classic",  value: "#FFFFFF" },
  { label: "Ivory",    value: "#FAF5EC" },
  { label: "Black",    value: "#1A1A1A" },
  { label: "Blush",    value: "#FFD6E8" },
  { label: "Hot pink", value: "#FF1F7D" },
  { label: "Sage",     value: "#C8D5C0" },
  { label: "Lavender", value: "#D4C5F0" },
  { label: "Nude",     value: "#E8D5C4" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function PhotoSlot({
  file, index, borderColor, caption, onUpload, onCaptionChange, tilt = 0, width = "100%", height = 200,
}: {
  file?: File; index: number; borderColor: string; caption?: string;
  onUpload: (index: number) => void; onCaptionChange?: (index: number, v: string) => void;
  tilt?: number; width?: number | string; height?: number;
}) {
  const url = file ? URL.createObjectURL(file) : null;

  const frameStyle: React.CSSProperties = {
    backgroundColor: borderColor,
    padding: "10px 10px 32px",
    borderRadius: 2,
    boxShadow: "0 4px 18px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.10)",
    transform: tilt ? `rotate(${tilt}deg)` : undefined,
    display: "inline-block",
    width,
    flexShrink: 0,
  };

  return (
    <div style={frameStyle}>
      <div
        onClick={() => !file && onUpload(index)}
        style={{
          height, background: url ? "none" : "rgba(0,0,0,0.06)",
          borderRadius: 1, overflow: "hidden", cursor: url ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}
      >
        {url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : (
            <div style={{ textAlign: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.3)", marginTop: 4 }}>photo {index + 1}</p>
            </div>
          )
        }
        {url && (
          <button
            onClick={e => { e.stopPropagation(); onUpload(index); }}
            style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        )}
      </div>
      {onCaptionChange && (
        <input
          value={caption ?? ""}
          onChange={e => onCaptionChange(index, e.target.value)}
          placeholder="caption…"
          maxLength={60}
          style={{ marginTop: 6, width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-caveat)", fontSize: 13, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.55)", textAlign: "center", boxSizing: "border-box" }}
        />
      )}
    </div>
  );
}

// ── Template Previews ─────────────────────────────────────────────────────────

function StandardPreview({ files, borderColor }: { files: File[]; borderColor: string }) {
  const [idx, setIdx] = useState(0);
  const file = files[idx];
  const url = file ? URL.createObjectURL(file) : null;
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "#eee", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <div style={{ color: "rgba(0,0,0,0.2)", fontFamily: "var(--font-jost)", fontSize: 12 }}>photo here</div>
      }
      {files.length > 1 && (
        <>
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.75)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>‹</button>
          <button onClick={() => setIdx(i => Math.min(files.length - 1, i + 1))} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.75)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>›</button>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
            {files.map((_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === idx ? "white" : "rgba(255,255,255,0.5)" }} />)}
          </div>
        </>
      )}
    </div>
  );
}

function PolaroidSinglePreview({ files, borderColor, captions }: { files: File[]; borderColor: string; captions: string[] }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px", background: "#f8f3ee", borderRadius: 14 }}>
      <PhotoSlot file={files[0]} index={0} borderColor={borderColor} caption={captions[0]} onUpload={() => {}} tilt={-2} width={220} height={220} />
    </div>
  );
}

function PolaroidGridPreview({ files, borderColor, captions }: { files: File[]; borderColor: string; captions: string[] }) {
  const tilts = [-2.5, 1.5, 2, -1.5];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px", background: "#f8f3ee", borderRadius: 14 }}>
      {[0,1,2,3].map(i => (
        <PhotoSlot key={i} file={files[i]} index={i} borderColor={borderColor} caption={captions[i]} onUpload={() => {}} tilt={tilts[i]} height={130} />
      ))}
    </div>
  );
}

function CollagePreview({ files, borderColor, captions }: { files: File[]; borderColor: string; captions: string[] }) {
  const configs = [
    { tilt: -8,  left: "5%",  top: "10%",  w: 160, h: 160, zIndex: 1 },
    { tilt:  4,  left: "30%", top: "0%",   w: 180, h: 180, zIndex: 3 },
    { tilt: -3,  left: "15%", top: "45%",  w: 155, h: 155, zIndex: 2 },
  ];
  return (
    <div style={{ position: "relative", height: 280, background: "#f8f3ee", borderRadius: 14, overflow: "hidden" }}>
      {configs.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: c.left, top: c.top, zIndex: c.zIndex }}>
          <PhotoSlot file={files[i]} index={i} borderColor={borderColor} caption={captions[i]} onUpload={() => {}} tilt={c.tilt} width={c.w} height={c.h} />
        </div>
      ))}
    </div>
  );
}

function EditorialPreview({ files, borderColor, globalCaption }: { files: File[]; borderColor: string; globalCaption: string }) {
  const url0 = files[0] ? URL.createObjectURL(files[0]) : null;
  const url1 = files[1] ? URL.createObjectURL(files[1]) : null;
  return (
    <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", height: 260 }}>
      <div style={{ flex: "0 0 58%", position: "relative", background: "#ddd" }}>
        {url0
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={url0} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.3)" }}>main photo</p></div>
        }
      </div>
      <div style={{ flex: 1, background: borderColor !== "#FFFFFF" ? borderColor : "#f5f0ea", display: "flex", flexDirection: "column", padding: "16px 12px", justifyContent: "space-between" }}>
        {url1 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url1} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 4, marginBottom: 10, flexShrink: 0 }} />
        )}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.8)" : "#333", lineHeight: 1.5, flex: 1 }}>
          {globalCaption || "your caption…"}
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", color: PINK, marginTop: 8 }}>BLOOMBAY ✦</p>
      </div>
    </div>
  );
}

// ── Main Sheet ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  onPosted?: () => void;
  context?: "avenue" | "hanger";
  category?: string;
}

export function FashionPostSheet({ onClose, onPosted, context = "avenue", category }: Props) {
  const [template, setTemplate] = useState<TemplateId>("standard");
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null, null]);
  const [captions, setCaptions] = useState<string[]>(["", "", "", ""]);
  const [globalCaption, setGlobalCaption] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const cfg = TEMPLATES.find(t => t.id === template)!;
  const filledPhotos = photos.filter(Boolean) as File[];

  const handleFileChange = useCallback((index: number, file: File | null) => {
    setPhotos(prev => { const n = [...prev]; n[index] = file; return n; });
  }, []);

  function triggerUpload(index: number) {
    fileRefs.current[index]?.click();
  }

  async function uploadPhoto(file: File): Promise<string | null> {
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `avenue_posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("avenue-media").upload(path, file, { upsert: true });
      if (error || !data) return null;
      return supabase.storage.from("avenue-media").getPublicUrl(data.path).data.publicUrl;
    } catch {
      return null;
    }
  }

  async function handlePost() {
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
          border_color: template !== "standard" ? borderColor : null,
          meta: { template_id: template, border_color: borderColor },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
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

  if (done) return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: IVORY, borderRadius: "24px 24px 0 0", padding: "40px 24px 64px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>✦</div>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 24, color: INK, marginBottom: 8 }}>Posted.</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", marginBottom: 24 }}>Your post is live on the Avenue.</p>
        <button onClick={onClose} style={{ padding: "14px 32px", background: PINK, color: "white", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Done ✦</button>
      </div>
    </>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }} />

      {/* Hidden file inputs */}
      {[0,1,2,3].map(i => (
        <input
          key={i}
          ref={el => { fileRefs.current[i] = el; }}
          type="file" accept="image/*"
          style={{ display: "none" }}
          onChange={e => handleFileChange(i, e.target.files?.[0] ?? null)}
        />
      ))}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: IVORY, borderRadius: "24px 24px 0 0", maxHeight: "95vh", overflowY: "auto", boxShadow: "0 -12px 48px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>

        <div style={{ padding: "12px 20px 80px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
                {context === "hanger" ? "THE HANGER" : "FASHION AVENUE"}
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: INK, marginTop: 2 }}>New post.</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(0,0,0,0.07)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>

          {/* ── Template Picker ── */}
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 10 }}>TEMPLATE</p>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  style={{
                    flexShrink: 0, padding: "10px 14px", borderRadius: 14, cursor: "pointer",
                    border: `2px solid ${template === t.id ? PINK : "#F0EBE4"}`,
                    background: template === t.id ? "#FFF0F5" : "white",
                    transition: "all 0.15s",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 18, marginBottom: 4, lineHeight: 1 }}>{t.emoji}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: template === t.id ? PINK : INK }}>{t.label}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa", marginTop: 1 }}>{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Polaroid Color Picker (for Polaroid templates) ── */}
          {template !== "standard" && template !== "editorial" && (
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 10 }}>FRAME COLOR</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BORDER_COLORS.map(bc => (
                  <button
                    key={bc.value}
                    onClick={() => setBorderColor(bc.value)}
                    title={bc.label}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: bc.value,
                      border: `3px solid ${borderColor === bc.value ? PINK : "rgba(0,0,0,0.1)"}`,
                      boxShadow: borderColor === bc.value ? `0 0 0 2px ${PINK}44` : "none",
                      cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
                    }}
                  />
                ))}
                {/* Custom color */}
                <label style={{ width: 36, height: 36, borderRadius: "50%", border: "2px dashed #ddd", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}
                  title="Custom color">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <input type="color" defaultValue={borderColor} onChange={e => setBorderColor(e.target.value)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                </label>
              </div>
            </div>
          )}

          {/* ── Template Preview ── */}
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 10 }}>
              PREVIEW <span style={{ fontWeight: 400, color: "#ddd" }}>— tap photo slots to upload</span>
            </p>

            {/* Click-through wrapper that triggers file input */}
            <div onClick={e => {
              const el = e.target as HTMLElement;
              const slot = el.closest("[data-slot]") as HTMLElement | null;
              if (slot) triggerUpload(Number(slot.dataset.slot));
            }}>
              {template === "standard" && (
                <div style={{ position: "relative" }}>
                  <StandardPreview files={filledPhotos} borderColor={borderColor} />
                  {filledPhotos.length === 0 && (
                    <button onClick={() => triggerUpload(0)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.03)", border: "2px dashed #ddd", borderRadius: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#bbb" }}>tap to add photos</p>
                    </button>
                  )}
                  {filledPhotos.length > 0 && filledPhotos.length < 10 && (
                    <button onClick={() => triggerUpload(filledPhotos.length)} style={{ marginTop: 8, width: "100%", padding: "10px", border: "1.5px dashed #ddd", borderRadius: 10, background: "transparent", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa" }}>
                      + Add another photo
                    </button>
                  )}
                </div>
              )}

              {template === "polaroid_single" && (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px 0", background: "#F8F3EE", borderRadius: 14 }}>
                  <div
                    data-slot="0"
                    onClick={() => !photos[0] && triggerUpload(0)}
                    style={{
                      backgroundColor: borderColor, padding: "10px 10px 36px", borderRadius: 2,
                      boxShadow: "0 6px 24px rgba(0,0,0,0.22)", transform: "rotate(-2deg)",
                      cursor: photos[0] ? "default" : "pointer", width: 220,
                    }}
                  >
                    <div style={{ height: 220, background: photos[0] ? "none" : "rgba(0,0,0,0.06)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {photos[0]
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={URL.createObjectURL(photos[0])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 28 }}>📷</p>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.3)", marginTop: 4 }}>tap to upload</p>
                          </div>
                      }
                    </div>
                    <input
                      value={captions[0]}
                      onChange={e => setCaptions(p => { const n=[...p]; n[0]=e.target.value; return n; })}
                      placeholder="write here…"
                      maxLength={50}
                      onClick={e => e.stopPropagation()}
                      style={{ marginTop: 8, width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-caveat)", fontSize: 14, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)", textAlign: "center", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              )}

              {template === "polaroid_grid" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px", background: "#F8F3EE", borderRadius: 14 }}>
                  {[0,1,2,3].map(i => {
                    const tilts = [-2.5, 1.8, 2.2, -1.5];
                    return (
                      <div
                        key={i} data-slot={i}
                        onClick={() => !photos[i] && triggerUpload(i)}
                        style={{ backgroundColor: borderColor, padding: "8px 8px 28px", borderRadius: 2, boxShadow: "0 3px 14px rgba(0,0,0,0.15)", transform: `rotate(${tilts[i]}deg)`, cursor: photos[i] ? "default" : "pointer" }}
                      >
                        <div style={{ height: 110, background: photos[i] ? "none" : "rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {photos[i]
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={URL.createObjectURL(photos[i]!)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.25)" }}>photo {i+1}</p>
                          }
                        </div>
                        <input
                          value={captions[i]}
                          onChange={e => setCaptions(p => { const n=[...p]; n[i]=e.target.value; return n; })}
                          placeholder="…"
                          maxLength={30}
                          onClick={e => e.stopPropagation()}
                          style={{ marginTop: 4, width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-caveat)", fontSize: 11, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.45)", textAlign: "center", boxSizing: "border-box" }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {template === "collage" && (
                <div style={{ position: "relative", height: 290, background: "#F8F3EE", borderRadius: 14, overflow: "visible" }}>
                  {[
                    { i: 0, tilt: -9,  left: "4%",  top: "8%",  w: 158, h: 155 },
                    { i: 1, tilt:  5,  left: "28%", top: "2%",  w: 175, h: 172 },
                    { i: 2, tilt: -4,  left: "14%", top: "46%", w: 162, h: 158 },
                  ].map(({ i, tilt, left, top, w, h }) => (
                    <div
                      key={i} data-slot={i}
                      onClick={() => !photos[i] && triggerUpload(i)}
                      style={{
                        position: "absolute", left, top, zIndex: i === 1 ? 3 : i + 1,
                        backgroundColor: borderColor, padding: "8px 8px 28px", borderRadius: 2,
                        boxShadow: "0 4px 18px rgba(0,0,0,0.2)", transform: `rotate(${tilt}deg)`,
                        cursor: photos[i] ? "default" : "pointer", width: w,
                      }}
                    >
                      <div style={{ height: h, background: photos[i] ? "none" : "rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {photos[i]
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={URL.createObjectURL(photos[i]!)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.3)" }}>photo {i+1}</p>
                        }
                      </div>
                      <input
                        value={captions[i]}
                        onChange={e => setCaptions(p => { const n=[...p]; n[i]=e.target.value; return n; })}
                        placeholder="…"
                        maxLength={40}
                        onClick={e => e.stopPropagation()}
                        style={{ marginTop: 4, width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-caveat)", fontSize: 11, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.45)", textAlign: "center", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {template === "editorial" && (
                <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", height: 270 }}>
                  <div
                    data-slot="0"
                    onClick={() => !photos[0] && triggerUpload(0)}
                    style={{ flex: "0 0 58%", background: photos[0] ? "none" : "#eee", position: "relative", cursor: photos[0] ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {photos[0]
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={URL.createObjectURL(photos[0])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 24 }}>📷</p>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.3)", marginTop: 4 }}>main photo</p>
                        </div>
                    }
                  </div>
                  <div style={{ flex: 1, background: borderColor !== "#FFFFFF" ? borderColor : "#f5f0ea", display: "flex", flexDirection: "column", padding: "14px 12px", gap: 10 }}>
                    <div
                      data-slot="1"
                      onClick={() => !photos[1] && triggerUpload(1)}
                      style={{ flex: "0 0 40%", background: photos[1] ? "none" : "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden", cursor: photos[1] ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {photos[1]
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={URL.createObjectURL(photos[1]!)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "rgba(0,0,0,0.25)" }}>photo 2</p>
                      }
                    </div>
                    <textarea
                      value={globalCaption}
                      onChange={e => setGlobalCaption(e.target.value)}
                      placeholder="your words here…"
                      maxLength={120}
                      onClick={e => e.stopPropagation()}
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "var(--font-caveat)", fontSize: 13, color: borderColor === "#1A1A1A" ? "rgba(255,255,255,0.8)" : "#333", lineHeight: 1.5 }}
                    />
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", color: PINK }}>BLOOMBAY ✦</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Title (optional for avenue posts) ── */}
          {context === "avenue" && (
            <div>
              <label style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 6, display: "block" }}>TITLE <span style={{ fontWeight: 400, color: "#ddd" }}>— optional</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="The outfit, the vibe, the era…" maxLength={80} style={INPUT} />
            </div>
          )}

          {/* ── Global caption ── */}
          {template === "standard" && (
            <div>
              <label style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 6, display: "block" }}>CAPTION</label>
              <textarea
                value={globalCaption}
                onChange={e => setGlobalCaption(e.target.value)}
                placeholder="Tell them about the look…"
                maxLength={300}
                rows={3}
                style={{ ...INPUT, resize: "none", lineHeight: 1.6, fontFamily: "var(--font-jost)" }}
              />
            </div>
          )}

          {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#B71C1C" }}>{error}</p>}

          <button
            onClick={handlePost}
            disabled={uploading || filledPhotos.length < cfg.minPhotos}
            style={{
              width: "100%", padding: "16px",
              background: filledPhotos.length >= cfg.minPhotos ? PINK : "#eee",
              color: filledPhotos.length >= cfg.minPhotos ? "white" : "#bbb",
              border: "none", borderRadius: 14, fontFamily: "var(--font-jost)",
              fontSize: 13, fontWeight: 800, letterSpacing: "0.04em",
              cursor: (!uploading && filledPhotos.length >= cfg.minPhotos) ? "pointer" : "default",
              boxShadow: filledPhotos.length >= cfg.minPhotos ? `0 3px 0 rgba(150,0,55,0.7), 0 6px 20px ${PINK}44` : "none",
              transition: "all 0.2s",
            }}
          >
            {uploading ? "Posting…" : `Post to ${context === "hanger" ? "The Hanger" : "Fashion Avenue"} ✦`}
          </button>

        </div>
      </div>
    </>
  );
}
