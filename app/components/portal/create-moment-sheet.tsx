"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/browser";

// ── Constants ──────────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const INK   = "#111111";
const IVORY = "#fdf4ec";

// ── Types ──────────────────────────────────────────────────────────────────────
type TemplateId  = "dual_phone" | "city_note" | "standard";
type MomentType  = "place" | "event" | "meetup" | "gem";

interface TemplateConfig {
  id: TemplateId;
  label: string;
  emoji: string;
  description: string;
}

const TEMPLATES: TemplateConfig[] = [
  { id: "dual_phone", label: "Dual Phone",  emoji: "📱", description: "Two phones side by side" },
  { id: "city_note",  label: "City Note",   emoji: "🗒",  description: "Photo + polaroid + notebook" },
  { id: "standard",   label: "Standard",    emoji: "◻",  description: "Single photo & caption"  },
];

const MOMENT_TYPES: { id: MomentType; label: string }[] = [
  { id: "place",  label: "📍 Place"     },
  { id: "event",  label: "🎉 Event"     },
  { id: "meetup", label: "👯 Meetup"    },
  { id: "gem",    label: "💎 Girl Gem"  },
];

// ── Slot: tappable upload area ─────────────────────────────────────────────────
function PhotoSlot({
  file,
  onTap,
  style,
}: {
  file: File | null;
  onTap: () => void;
  style?: React.CSSProperties;
}) {
  const url = file ? URL.createObjectURL(file) : null;
  return (
    <div
      onClick={onTap}
      style={{
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        background: "rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 22, opacity: 0.35 }}>+</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa", letterSpacing: "0.04em" }}>tap to add</span>
        </div>
      )}
    </div>
  );
}

// ── Template Previews ──────────────────────────────────────────────────────────

// 1. Dual Phone — two iPhone frames side by side
function DualPhonePreview({
  photos,
  onTap,
}: {
  photos: [File | null, File | null];
  onTap: (idx: 0 | 1) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, padding: "24px 16px", background: "#F2EDE7", borderRadius: 14 }}>
      {([0, 1] as const).map(i => (
        <div key={i} style={{ position: "relative" }}>
          {/* iPhone frame */}
          <div style={{
            width: 100,
            height: 214,
            borderRadius: 22,
            border: "3px solid #1A1A1A",
            boxShadow: "0 6px 24px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.08)",
            overflow: "hidden",
            background: "#111",
            position: "relative",
          }}>
            {/* Notch */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 42, height: 10, background: "#1A1A1A", borderRadius: "0 0 8px 8px", zIndex: 2 }} />
            <PhotoSlot
              file={photos[i]}
              onTap={() => onTap(i)}
              style={{ width: "100%", height: "100%", borderRadius: 19 }}
            />
          </div>
          {/* Home indicator */}
          <div style={{ width: 32, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.25)", margin: "6px auto 0" }} />
        </div>
      ))}
      {/* Decorative element between phones */}
      <div style={{
        position: "absolute",
        fontSize: 22,
        opacity: 0.7,
        userSelect: "none" as const,
        pointerEvents: "none",
        zIndex: 5,
      }}>🍵</div>
      <div style={{
        position: "absolute",
        bottom: 28,
        left: 0,
        right: 0,
        textAlign: "center" as const,
        fontFamily: "var(--font-caveat)",
        fontSize: 13,
        color: "rgba(0,0,0,0.4)",
        pointerEvents: "none",
      }}>
        who were you with?
      </div>
    </div>
  );
}

// 2. City Note — background photo + tilted polaroid + notebook paper
function CityNotePreview({
  photos,
  onTap,
  noteTitle,
  onNoteTitleChange,
  noteBody,
  onNoteBodyChange,
}: {
  photos: [File | null, File | null];
  onTap: (idx: 0 | 1) => void;
  noteTitle: string;
  onNoteTitleChange: (v: string) => void;
  noteBody: string;
  onNoteBodyChange: (v: string) => void;
}) {
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", position: "relative", aspectRatio: "4/5", background: "#E8DDD0" }}>
      {/* Background photo */}
      <PhotoSlot
        file={photos[0]}
        onTap={() => onTap(0)}
        style={{ position: "absolute", inset: 0, borderRadius: 0 }}
      />

      {/* Tilted Polaroid overlay */}
      <div
        onClick={() => onTap(1)}
        style={{
          position: "absolute",
          top: "8%",
          right: "5%",
          width: 160,
          background: "white",
          borderRadius: 4,
          boxShadow: "0 4px 16px rgba(0,0,0,0.28)",
          transform: "rotate(-8deg)",
          padding: "6px 6px 28px",
          zIndex: 3,
          cursor: "pointer",
        }}
      >
        <PhotoSlot
          file={photos[1]}
          onTap={() => onTap(1)}
          style={{ width: "100%", aspectRatio: "1/1", borderRadius: 2 }}
        />
        <p style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 11,
          color: "rgba(0,0,0,0.45)",
          textAlign: "center" as const,
          marginTop: 6,
          lineHeight: 1,
        }}>tap to add</p>
      </div>

      {/* Crumpled notebook paper overlay */}
      <div style={{
        position: "absolute",
        bottom: "4%",
        left: "4%",
        width: "62%",
        background: "rgba(253,250,244,0.97)",
        borderRadius: 8,
        boxShadow: "2px 4px 12px rgba(0,0,0,0.18)",
        transform: "rotate(3deg)",
        padding: "22px 14px 14px",
        zIndex: 4,
      }}>
        {/* Paper clip SVG */}
        <svg
          width="16" height="26"
          viewBox="0 0 18 28"
          fill="none"
          style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)" }}
        >
          <path
            d="M9 2C6.79 2 5 3.79 5 6v14c0 3.31 2.69 6 6 6s6-2.69 6-6V8h-2v12c0 2.21-1.79 4-4 4s-4-1.79-4-4V6c0-1.1.9-2 2-2s2 .9 2 2v12h2V6c0-2.21-1.79-4-4-4z"
            fill="#999"
          />
        </svg>
        {/* Notebook lines */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ height: 1, background: "rgba(100,140,200,0.2)", marginBottom: 18 }} />
        ))}
        <div style={{ position: "absolute", top: 22, left: 0, right: 0, padding: "0 14px" }}>
          <input
            value={noteTitle}
            onChange={e => onNoteTitleChange(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder="WHERE WE WENT"
            maxLength={30}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              fontSize: 13,
              color: "#2C2417",
              boxSizing: "border-box" as const,
              marginBottom: 8,
            }}
          />
          <textarea
            value={noteBody}
            onChange={e => onNoteBodyChange(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder={"· favorite dish\n· best moment\n· must-try"}
            rows={3}
            maxLength={120}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-caveat)",
              fontSize: 13,
              color: "#555",
              lineHeight: 1.8,
              resize: "none" as const,
              boxSizing: "border-box" as const,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// 3. Standard — simple single photo + caption
function StandardPreview({
  photo,
  onTap,
}: {
  photo: File | null;
  onTap: () => void;
}) {
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/5", background: "#F2EDE7" }}>
      <PhotoSlot
        file={photo}
        onTap={onTap}
        style={{ width: "100%", height: "100%", borderRadius: 14 }}
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function CreateMomentSheet({
  onClose,
  onPosted,
}: {
  onClose: () => void;
  onPosted?: () => void;
}) {
  const [template,      setTemplate]      = useState<TemplateId>("standard");
  const [momentType,    setMomentType]    = useState<MomentType | null>(null);
  const [caption,       setCaption]       = useState("");
  const [locationName,  setLocationName]  = useState("");
  const [taggedFriend,  setTaggedFriend]  = useState("");
  const [noteTitle,     setNoteTitle]     = useState("WHERE WE WENT");
  const [noteBody,      setNoteBody]      = useState("");

  // Photos: up to 2 slots
  const [photos, setPhotos] = useState<[File | null, File | null]>([null, null]);
  const [submitting, setSubmitting] = useState(false);
  const [posted,     setPosted]     = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingSlot, setPendingSlot] = useState<0 | 1>(0);

  function openPicker(slot: 0 | 1) {
    setPendingSlot(slot);
    fileInputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotos(prev => {
      const next: [File | null, File | null] = [prev[0], prev[1]];
      next[pendingSlot] = file;
      return next;
    });
    // Reset input
    e.target.value = "";
  }

  async function handleSubmit() {
    if (!momentType) return;
    setSubmitting(true);
    try {
      const supabase = createClient();

      // Upload photos
      const photoUrls: string[] = [];
      for (const file of photos) {
        if (!file) continue;
        const ext  = file.name.split(".").pop() ?? "jpg";
        const path = `moments/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
        if (!error) {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
          photoUrls.push(urlData.publicUrl);
        }
      }

      await fetch("/api/moments/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id:    template,
          moment_type:    momentType,
          caption,
          location_name:  locationName,
          photo_urls:     photoUrls,
          tagged_friend:  taggedFriend || undefined,
        }),
      });

      setPosted(true);
      onPosted?.();
    } finally {
      setSubmitting(false);
    }
  }

  // ── Posted confirmation ──────────────────────────────────────────────────────
  if (posted) {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} />
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
          background: IVORY, borderRadius: "24px 24px 0 0",
          padding: "40px 24px 64px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>✦</div>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: INK, marginBottom: 8 }}>
            Saved to Memory Box.
          </p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.4)", marginBottom: 24 }}>
            Your moment is captured ✨
          </p>
          <button
            onClick={onClose}
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              border: "none",
              background: PINK,
              color: "white",
              fontFamily: "var(--font-jost)",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: `0 4px 16px ${PINK}55`,
            }}
          >
            Done
          </button>
        </div>
      </>
    );
  }

  // ── Sheet ────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} />

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

      {/* Sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
        background: IVORY, borderRadius: "24px 24px 0 0",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        maxHeight: "94dvh", overflowY: "auto",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>

        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)" }} />
        </div>

        <div style={{ padding: "0 18px 40px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontSize: 22,
              fontWeight: 700,
              color: INK,
              margin: 0,
            }}>
              Create a Moment
            </h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "rgba(0,0,0,0.35)", padding: "0 0 0 16px" }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.4)", margin: "0 0 20px" }}>
            Save this to your memory box ✦
          </p>

          {/* ── Template picker ── */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.4)", marginBottom: 10 }}>
            TEMPLATE
          </p>
          <div style={{ overflowX: "auto", display: "flex", gap: 8, marginBottom: 20, paddingBottom: 4, scrollbarWidth: "none" as const }}>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                style={{
                  flexShrink: 0,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: template === t.id ? `2px solid ${PINK}` : "1.5px solid rgba(0,0,0,0.1)",
                  background: template === t.id ? `${PINK}0F` : "white",
                  cursor: "pointer",
                  textAlign: "center" as const,
                  minWidth: 90,
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{t.emoji}</div>
                <p style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: template === t.id ? PINK : INK,
                  marginBottom: 2,
                }}>
                  {t.label}
                </p>
                <p style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  color: "rgba(0,0,0,0.35)",
                }}>
                  {t.description}
                </p>
              </button>
            ))}
          </div>

          {/* ── Moment type pills ── */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.4)", marginBottom: 10 }}>
            MOMENT TYPE
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 20 }}>
            {MOMENT_TYPES.map(m => (
              <button
                key={m.id}
                onClick={() => setMomentType(m.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: momentType === m.id ? `2px solid ${PINK}` : "1.5px solid rgba(0,0,0,0.12)",
                  background: momentType === m.id ? `${PINK}0F` : "white",
                  fontFamily: "var(--font-jost)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: momentType === m.id ? PINK : INK,
                  cursor: "pointer",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* ── Template preview ── */}
          <div style={{ marginBottom: 20 }}>
            {template === "dual_phone" && (
              <DualPhonePreview
                photos={photos}
                onTap={openPicker}
              />
            )}
            {template === "city_note" && (
              <CityNotePreview
                photos={photos}
                onTap={openPicker}
                noteTitle={noteTitle}
                onNoteTitleChange={setNoteTitle}
                noteBody={noteBody}
                onNoteBodyChange={setNoteBody}
              />
            )}
            {template === "standard" && (
              <StandardPreview
                photo={photos[0]}
                onTap={() => openPicker(0)}
              />
            )}
          </div>

          {/* ── Fields ── */}
          {/* Caption */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>CAPTION</p>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="What was this moment about?"
              maxLength={220}
              rows={2}
              style={{
                width: "100%",
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.1)",
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: "var(--font-caveat)",
                fontSize: 15,
                color: INK,
                resize: "none" as const,
                boxSizing: "border-box" as const,
                outline: "none",
              }}
            />
          </div>

          {/* Location */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>LOCATION</p>
            <input
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              placeholder="e.g. Caviar Kaspia, NYC"
              maxLength={80}
              style={{
                width: "100%",
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.1)",
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: "var(--font-jost)",
                fontSize: 13,
                color: INK,
                boxSizing: "border-box" as const,
                outline: "none",
              }}
            />
          </div>

          {/* Tagged friend */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>TAG A FRIEND <span style={{ fontWeight: 500, opacity: 0.6 }}>(optional)</span></p>
            <input
              value={taggedFriend}
              onChange={e => setTaggedFriend(e.target.value)}
              placeholder="@username or name"
              maxLength={50}
              style={{
                width: "100%",
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.1)",
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: "var(--font-jost)",
                fontSize: 13,
                color: INK,
                boxSizing: "border-box" as const,
                outline: "none",
              }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={() => { void handleSubmit(); }}
            disabled={submitting || !momentType}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 999,
              border: "none",
              background: !momentType ? "rgba(0,0,0,0.1)" : PINK,
              color: !momentType ? "rgba(0,0,0,0.3)" : "white",
              fontFamily: "var(--font-jost)",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.04em",
              cursor: !momentType ? "default" : "pointer",
              boxShadow: momentType ? `0 4px 18px ${PINK}44` : "none",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          >
            {submitting ? "Saving…" : "Save to Memory Box ✦"}
          </button>
        </div>
      </div>
    </>
  );
}
