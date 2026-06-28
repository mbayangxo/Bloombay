"use client";

import { useState, useRef, useEffect } from "react";
import type { DayCalendarEvent, DayContent, DayEditorTab } from "@/lib/plans/types";
import { PINK, MONTH_NAMES, DAY_FULL } from "@/lib/plans/constants";
import { StickerKeyboard } from "./sticker-keyboard";

const WAVE_HEIGHTS = [8,14,22,18,10,26,16,8,20,12,26,8,18,24,10,16,22,8,14,18];

export function DayEditorSheet({ dayKey, content, eventsToday = [], onUpdate, onClose }: {
  dayKey: string;
  content: DayContent;
  eventsToday?: DayCalendarEvent[];
  onUpdate: (c: DayContent) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<DayEditorTab>("write");
  const [text, setText] = useState(content.text);
  const [stickers, setStickers] = useState<string[]>(content.stickers);
  const [photos, setPhotos] = useState<string[]>(content.photos);
  const [voiceCount, setVoiceCount] = useState(content.voiceCount);
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef(text);
  const stickersRef = useRef(stickers);
  const photosRef = useRef(photos);
  const voiceRef = useRef(voiceCount);

  const date = new Date(dayKey + "T12:00:00");
  const dayNum    = date.getDate();
  const dayLabel  = DAY_FULL[date.getDay()];
  const monthLabel = MONTH_NAMES[date.getMonth()];
  function save(overrides: Partial<DayContent> = {}) {
    onUpdate({ text: textRef.current, stickers: stickersRef.current, photos: photosRef.current, voiceCount: voiceRef.current, ...overrides });
  }
  function handleText(s: string) { textRef.current = s; setText(s); save({ text: s }); }
  function addSticker(s: string) { const n = [...stickersRef.current, s]; stickersRef.current = n; setStickers(n); save({ stickers: n }); }
  function removeSticker(i: number) { const n = stickersRef.current.filter((_, j) => j !== i); stickersRef.current = n; setStickers(n); save({ stickers: n }); }
  function removePhoto(i: number) { const n = photosRef.current.filter((_, j) => j !== i); photosRef.current = n; setPhotos(n); save({ photos: n }); }

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (recording) t = setInterval(() => setRecSecs(s => s + 1), 1000);
    else setRecSecs(0);
    return () => clearInterval(t);
  }, [recording]);

  function stopRecording() {
    setRecording(false);
    if (recSecs > 0) { const n = voiceRef.current + 1; voiceRef.current = n; setVoiceCount(n); save({ voiceCount: n }); }
  }
  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) { const n = [...photosRef.current, ev.target.result as string]; photosRef.current = n; setPhotos(n); save({ photos: n }); }
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="fixed inset-0 z-[55]" style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[56] rounded-t-[28px] flex flex-col"
        style={{ background: "#FDF8F2", maxHeight: "92vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", paddingBottom: "env(safe-area-inset-bottom,20px)" }}>

        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>

        <div className="px-6 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-start gap-5">
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <svg style={{ position: "absolute", top: 0, left: 0 }} width="72" height="72" viewBox="0 0 72 72">
                <ellipse cx="36" cy="36" rx="31" ry="31" fill="none" stroke={PINK} strokeWidth="2" strokeDasharray="6 2" transform="rotate(-12 36 36)" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 38, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{dayNum}</p>
              </div>
            </div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: PINK, lineHeight: 1 }}>{dayLabel}</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "#888", marginBottom: 6 }}>{monthLabel}</p>
              {eventsToday.length > 0 && eventsToday.map((ev, i) => (
                <p key={i} style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontStyle: "italic", color: ev.color, lineHeight: 1.3, marginBottom: 2 }}>
                  {ev.emoji} {ev.name}<span style={{ fontSize: 13, color: "#aaa" }}> · {ev.time}</span>
                </p>
              ))}
              {stickers.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {stickers.map((s, i) => (
                    <button key={i} onClick={() => removeSticker(i)} style={{ fontSize: 18, padding: "2px 5px", background: "rgba(255,31,125,0.08)", borderRadius: 8, border: "none", cursor: "pointer" }}>{s}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "write" && (
            <textarea value={text} onChange={e => handleText(e.target.value)}
              placeholder="Write about your day, your plans, your thoughts…"
              autoFocus
              style={{
                width: "100%", minHeight: 200, padding: "12px 24px 16px",
                fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#333",
                background: "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.06) 32px)",
                backgroundSize: "100% 32px", backgroundPosition: "0 12px",
                border: "none", outline: "none", resize: "none", lineHeight: "32px",
              }}
            />
          )}

          {tab === "sticker" && <StickerKeyboard onAdd={addSticker} />}

          {tab === "photo" && (
            <div style={{ padding: "16px 20px" }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()}
                className="active:scale-[0.98] transition-transform"
                style={{ width: "100%", height: 100, borderRadius: 20, border: "2px dashed rgba(255,31,125,0.4)", background: "rgba(255,31,125,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>📷</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: PINK, fontWeight: 700 }}>Add from camera roll</p>
              </button>
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removePhoto(i)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "voice" && (
            <div style={{ padding: "28px 20px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3, height: 44, marginBottom: 20 }}>
                {WAVE_HEIGHTS.map((h, i) => (
                  <div key={i} style={{ width: 3, borderRadius: 99, height: recording ? undefined : h, background: recording ? PINK : "rgba(255,31,125,0.22)", animation: recording ? `waveBar ${0.4 + (i % 5) * 0.1}s ease-in-out ${i * 0.05}s infinite alternate` : "none", minHeight: recording ? 6 : h, maxHeight: recording ? 36 : h }} />
                ))}
              </div>
              {recording && <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: PINK, marginBottom: 16 }}>{Math.floor(recSecs/60).toString().padStart(2,"0")}:{(recSecs%60).toString().padStart(2,"0")}</p>}
              <button onClick={() => recording ? stopRecording() : setRecording(true)}
                style={{ width: 80, height: 80, borderRadius: "50%", background: recording ? PINK : "rgba(255,31,125,0.1)", border: `3px solid ${recording ? PINK : "rgba(255,31,125,0.3)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: recording ? "0 0 0 10px rgba(255,31,125,0.1), 0 4px 20px rgba(255,31,125,0.4)" : "none", transition: "all 0.2s" }}>
                {recording ? <div style={{ width: 22, height: 22, borderRadius: 4, background: "white" }} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>}
              </button>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "#aaa", marginTop: 10, textAlign: "center" }}>{recording ? "Tap to stop" : "Tap to record a voice note"}</p>
              {voiceCount > 0 && (
                <div style={{ marginTop: 20, width: "100%" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#aaa", marginBottom: 8 }}>SAVED</p>
                  {Array.from({ length: voiceCount }, (_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#333" }}>Voice note {i + 1}</p>
                        <div style={{ display: "flex", gap: 2, marginTop: 4, alignItems: "center" }}>
                          {[4,8,12,6,10,14,8,4,12,8,6,10,4,14,8,6,12,4,10,6,14,8,4,10].map((h, j) => (
                            <div key={j} style={{ width: 2, height: h, borderRadius: 1, background: "rgba(255,31,125,0.28)" }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", padding: "8px 16px 4px" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {([
              { id: "write" as DayEditorTab, icon: "✍️", label: "Write" },
              { id: "sticker" as DayEditorTab, icon: "🌸", label: "Sticker" },
              { id: "photo" as DayEditorTab, icon: "📷", label: "Photo" },
              { id: "voice" as DayEditorTab, icon: "🎙", label: "Voice" },
            ]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, paddingTop: 7, paddingBottom: 7, borderRadius: 14, background: tab === t.id ? PINK : "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "background 0.15s" }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", color: tab === t.id ? "white" : "rgba(0,0,0,0.35)" }}>{t.label.toUpperCase()}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
