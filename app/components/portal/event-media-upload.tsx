"use client";

import { useState, useRef, useCallback } from "react";
import { uploadEventPhoto, uploadEventVoiceNote } from "@/lib/storage/upload";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD  = "#D4A853";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  eventId: string;
  onPhotosChange: (urls: string[]) => void;
  onVoiceNoteChange: (url: string | null) => void;
  existingPhotos?: string[];
  existingVoiceNote?: string | null;
}

type PhotoSlot = { url: string; loading: boolean };

type RecorderState = "idle" | "recording" | "preview" | "uploading" | "done";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(1, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: "spin 0.9s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M12 2 a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Waveform placeholder ──────────────────────────────────────────────────────

function WaveformBars({ color = PINK }: { color?: string }) {
  const heights = [6, 10, 14, 18, 14, 22, 14, 18, 10, 6, 14, 18, 22, 14, 10, 6, 18, 14, 10, 14];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 3, height: h, borderRadius: 2,
          background: color, opacity: 0.6 + (i % 3) * 0.13,
        }} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function EventMediaUpload({
  eventId,
  onPhotosChange,
  onVoiceNoteChange,
  existingPhotos = [],
  existingVoiceNote = null,
}: Props) {
  // ── Photo state ────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState<PhotoSlot[]>(
    existingPhotos.map(url => ({ url, loading: false }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Voice note state ───────────────────────────────────────────────────
  const [recorderState, setRecorderState] = useState<RecorderState>(
    existingVoiceNote ? "done" : "idle"
  );
  const [voiceUrl, setVoiceUrl] = useState<string | null>(existingVoiceNote ?? null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [recordingSecs, setRecordingSecs] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef        = useRef<MediaStream | null>(null);

  // ── Photo handlers ─────────────────────────────────────────────────────

  async function uploadFiles(files: FileList | File[]) {
    const fileArr = Array.from(files);
    const available = 6 - photos.filter(p => !p.loading && p.url).length;
    const toUpload = fileArr.slice(0, available);
    if (toUpload.length === 0) return;

    // Add loading slots
    const loadingSlots: PhotoSlot[] = toUpload.map(() => ({ url: "", loading: true }));
    setPhotos(prev => {
      const filled = prev.filter(p => !p.loading && p.url);
      return [...filled, ...loadingSlots];
    });

    const results = await Promise.allSettled(
      toUpload.map(file => uploadEventPhoto(file, eventId))
    );

    setPhotos(prev => {
      const filled = prev.filter(p => !p.loading && p.url);
      const newUrls: PhotoSlot[] = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
        .map(r => ({ url: r.value, loading: false }));
      const next = [...filled, ...newUrls].slice(0, 6);
      onPhotosChange(next.map(p => p.url));
      return next;
    });
  }

  function removePhoto(idx: number) {
    setPhotos(prev => {
      const next = prev.filter((_, i) => i !== idx);
      onPhotosChange(next.map(p => p.url));
      return next;
    });
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  }, [photos]);

  // ── Voice note handlers ────────────────────────────────────────────────

  async function startRecording() {
    setVoiceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp4" });
        setPreviewBlob(blob);
        const objUrl = URL.createObjectURL(blob);
        if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
        setPreviewObjectUrl(objUrl);
        setRecorderState("preview");
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start();
      setRecordingSecs(0);
      setRecorderState("recording");

      timerRef.current = setInterval(() => {
        setRecordingSecs(s => {
          if (s >= 59) {
            mr.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setVoiceError("Microphone permission denied. Please allow access and try again.");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  }

  function discardRecording() {
    if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    setPreviewBlob(null);
    setPreviewObjectUrl(null);
    setRecordingSecs(0);
    setRecorderState("idle");
  }

  async function uploadVoiceNote() {
    if (!previewBlob) return;
    setRecorderState("uploading");
    try {
      const url = await uploadEventVoiceNote(previewBlob, eventId);
      setVoiceUrl(url);
      onVoiceNoteChange(url);
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
      setPreviewObjectUrl(null);
      setRecorderState("done");
    } catch {
      setVoiceError("Upload failed. Try again.");
      setRecorderState("preview");
    }
  }

  function removeVoiceNote() {
    setVoiceUrl(null);
    onVoiceNoteChange(null);
    setRecorderState("idle");
    discardRecording();
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const filledPhotos = photos.filter(p => p.url || p.loading);
  const canAddMore   = filledPhotos.length < 6;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── PHOTOS ── */}
      <div>
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
          letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 12,
        }}>
          ADD PHOTOS
        </p>

        {/* Drop zone — only shown when slots available */}
        {canAddMore && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              width: "100%", background: isDragging ? `${PINK}0A` : "white",
              border: `2px dashed ${isDragging ? PINK : "rgba(255,31,125,0.3)"}`,
              borderRadius: 14, padding: "18px 14px",
              cursor: "pointer", marginBottom: 12,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.18s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <div>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: PINK, display: "block" }}>
                {isDragging ? "Drop photos here" : "Tap to add photos"}
              </span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)", display: "block", marginTop: 2 }}>
                Up to {6 - filledPhotos.length} more · drag & drop on desktop
              </span>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={e => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ""; }}
        />

        {/* Thumbnail strip */}
        {filledPhotos.length > 0 && (
          <div style={{
            display: "flex", gap: 8, overflowX: "auto",
            paddingBottom: 4,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties}>
            {filledPhotos.map((slot, i) => (
              <div key={i} style={{
                width: 80, height: 80, borderRadius: 12, flexShrink: 0,
                background: slot.loading ? "rgba(0,0,0,0.06)" : "transparent",
                position: "relative", overflow: "hidden",
                border: "1.5px solid rgba(0,0,0,0.08)",
              }}>
                {slot.loading ? (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: PINK }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <img
                      src={slot.url}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      style={{
                        position: "absolute", top: 4, right: 4,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)", border: "none",
                        cursor: "pointer", padding: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {filledPhotos.length >= 6 && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)", marginTop: 8 }}>
            Maximum 6 photos reached.
          </p>
        )}
      </div>

      {/* ── VOICE NOTE ── */}
      <div>
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
          letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 4,
        }}>
          HOST VOICE NOTE
        </p>
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(0,0,0,0.45)",
          marginBottom: 14,
        }}>
          A short voice message from you makes people actually want to come 🎙
        </p>

        {/* Idle: invite to record */}
        {recorderState === "idle" && (
          <button
            onClick={startRecording}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "white", border: `1.5px solid rgba(255,31,125,0.25)`,
              borderRadius: 16, padding: "14px 18px", cursor: "pointer",
              width: "100%", textAlign: "left",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `${PINK}15`, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 700, color: DARK }}>
                Record a voice note
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.4)", marginTop: 2 }}>
                Up to 60 seconds · makes events feel personal
              </p>
            </div>
          </button>
        )}

        {/* Recording */}
        {recorderState === "recording" && (
          <div style={{
            background: "#FFF5F9", border: `1.5px solid ${PINK}33`,
            borderRadius: 16, padding: "18px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "#FF1F1F",
                animation: "pulse 1s ease-in-out infinite",
              }} />
              <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
              <p style={{ fontFamily: "var(--font-jost)", fontVariantNumeric: "tabular-nums", fontSize: "18px", fontWeight: 800, color: DARK }}>
                {formatTime(recordingSecs)}
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.35)" }}>
                / 1:00
              </p>
            </div>

            {/* Mini waveform visual */}
            <WaveformBars color={PINK} />

            <button
              onClick={stopRecording}
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#FF1F1F", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 18px rgba(255,31,31,0.4)",
              }}
            >
              <div style={{ width: 20, height: 20, background: "white", borderRadius: 3 }} />
            </button>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)", letterSpacing: "0.1em" }}>
              TAP TO STOP
            </p>
          </div>
        )}

        {/* Preview recorded audio */}
        {recorderState === "preview" && previewObjectUrl && (
          <div style={{
            background: "white", border: "1.5px solid rgba(0,0,0,0.08)",
            borderRadius: 16, padding: "16px",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              </svg>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: DARK }}>
                Preview your voice note ({formatTime(recordingSecs)})
              </p>
            </div>
            <audio
              src={previewObjectUrl}
              controls
              style={{ width: "100%", height: 40, borderRadius: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={discardRecording}
                style={{
                  flex: 1, background: "white",
                  border: "1.5px solid rgba(0,0,0,0.12)",
                  borderRadius: 999, padding: "11px",
                  cursor: "pointer",
                }}
              >
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "rgba(0,0,0,0.5)" }}>
                  Re-record
                </p>
              </button>
              <button
                onClick={uploadVoiceNote}
                style={{
                  flex: 2, background: PINK, border: "none",
                  borderRadius: 999, padding: "11px",
                  cursor: "pointer", boxShadow: `0 4px 16px ${PINK}44`,
                }}
              >
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>
                  USE THIS NOTE →
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Uploading */}
        {recorderState === "uploading" && (
          <div style={{
            background: "#FFF5F9", border: `1.5px solid ${PINK}33`,
            borderRadius: 16, padding: "24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: PINK,
          }}>
            <Spinner size={28} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(0,0,0,0.5)" }}>
              Uploading voice note…
            </p>
          </div>
        )}

        {/* Done: show audio player */}
        {recorderState === "done" && voiceUrl && (
          <div style={{
            background: "white", border: `1.5px solid ${GOLD}44`,
            borderRadius: 16, padding: "16px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `${GOLD}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={GOLD} stroke={GOLD} strokeWidth="1">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: DARK }}>
                    Host's voice note
                  </p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.4)" }}>
                    Uploaded ✓
                  </p>
                </div>
              </div>
              <button
                onClick={removeVoiceNote}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <WaveformBars color={GOLD} />
            <audio src={voiceUrl} controls style={{ width: "100%", height: 40, borderRadius: 8 }} />
          </div>
        )}

        {voiceError && (
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "11px",
            color: "#C01040", marginTop: 8,
          }}>
            {voiceError}
          </p>
        )}
      </div>
    </div>
  );
}
