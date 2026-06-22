"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const PINK = "#FF1F7D";

interface MediaItem {
  id: string;
  media_type: "photo" | "voice_note";
  public_url: string;
  caption: string | null;
  duration_ms: number | null;
  created_at: string;
}

// ── Voice Note Player ──────────────────────────────────────────────────────────

const BARS = [14, 22, 18, 28, 34, 24, 38, 30, 42, 32, 26, 36, 20, 34, 28];

function VoiceNotePlayer({ item, color }: { item: MediaItem; color: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  function tick() {
    const a = audioRef.current;
    if (!a || a.paused) return;
    setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    rafRef.current = requestAnimationFrame(tick);
  }

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setPlaying(false);
    } else {
      a.play().then(() => {
        setPlaying(true);
        rafRef.current = requestAnimationFrame(tick);
      }).catch(() => {});
    }
  }

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => { setPlaying(false); setProgress(0); };
    a.addEventListener("ended", onEnd);
    return () => { a.removeEventListener("ended", onEnd); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const durationSec = item.duration_ms ? Math.round(item.duration_ms / 1000) : 0;
  const playedBars = Math.round((progress / 100) * BARS.length);

  return (
    <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
      <audio ref={audioRef} src={item.public_url} preload="metadata" />
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
        style={{ background: color, boxShadow: `0 2px 10px ${color}44` }}
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/></svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
        )}
      </button>
      <div className="flex items-end gap-[2px] flex-1">
        {BARS.map((h, i) => (
          <div key={i} className="rounded-full flex-1 transition-all duration-75"
            style={{ height: h * 0.55, background: i < playedBars ? color : `${color}35` }} />
        ))}
      </div>
      <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: "rgba(0,0,0,0.35)" }}>
        {durationSec > 0 ? `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}` : "--"}
      </span>
    </div>
  );
}

// ── Voice Note Recorder ────────────────────────────────────────────────────────

function VoiceNoteRecorder({ clubId, color, onDone }: { clubId: string; color: string; onDone: (item: MediaItem) => void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [uploading, setUploading] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      setRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch {
      alert("Microphone access is required to record a voice note.");
    }
  }

  async function stopAndUpload() {
    const mr = mediaRef.current;
    if (!mr) return;
    const durationMs = Date.now() - startTimeRef.current;
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setSeconds(0);

    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setUploading(true);
      try {
        const supabase = createClient();
        const fileName = `club-media/${clubId}/voice/${Date.now()}.webm`;
        const { error: uploadErr } = await supabase.storage.from("club-media").upload(fileName, blob, { contentType: "audio/webm" });
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from("club-media").getPublicUrl(fileName);
        const res = await fetch(`/api/clubs/${clubId}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ media_type: "voice_note", storage_path: fileName, public_url: publicUrl, duration_ms: durationMs }),
        });
        if (!res.ok) throw new Error("Failed to save");
        const { media } = await res.json();
        onDone(media);
      } catch {
        alert("Failed to upload voice note. Please try again.");
      } finally {
        setUploading(false);
        mr.stream?.getTracks().forEach(t => t.stop());
      }
    };
    mr.stop();
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-3">
      {recording ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#EF4444" }} />
            <span className="text-xs font-bold tabular-nums" style={{ color: "#EF4444" }}>
              {mins}:{String(secs).padStart(2, "0")}
            </span>
          </div>
          <button onClick={stopAndUpload}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
            style={{ background: "#EF4444", color: "white" }}>
            Stop & Save
          </button>
        </>
      ) : uploading ? (
        <span className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>Uploading…</span>
      ) : (
        <button onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
          style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
          Record voice note
        </button>
      )}
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────────

export function ClubMediaSection({
  clubId,
  color,
  isMember,
}: {
  clubId: string;
  color: string;
  isMember: boolean;
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/clubs/${clubId}/media`)
      .then(r => r.json())
      .then(d => setMedia(d.media ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [clubId]);

  const photos = media.filter(m => m.media_type === "photo");
  const voiceNotes = media.filter(m => m.media_type === "voice_note");

  const handlePhotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `club-media/${clubId}/photos/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("club-media").upload(fileName, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("club-media").getPublicUrl(fileName);
      const res = await fetch(`/api/clubs/${clubId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media_type: "photo", storage_path: fileName, public_url: publicUrl }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const { media: item } = await res.json();
      setMedia(prev => [item, ...prev]);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [clubId]);

  function handleVoiceDone(item: MediaItem) {
    setMedia(prev => [item, ...prev]);
    setShowRecorder(false);
  }

  if (loading) return null;
  if (!isMember && media.length === 0) return null;

  return (
    <section style={{ paddingBottom: 28 }}>
      {/* Header */}
      <div style={{ padding: "0 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 2 }}>
            MEMBER MOMENTS
          </p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
            photos & voice notes from the club ♡
          </p>
        </div>
        {isMember && (
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              title="Add photo"
            >
              {uploading ? (
                <div className="w-3 h-3 rounded-full border-2 animate-spin" style={{ borderColor: `${color} transparent transparent transparent` }} />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowRecorder(s => !s)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={showRecorder
                ? { background: color, border: `1px solid ${color}` }
                : { background: `${color}15`, border: `1px solid ${color}30` }
              }
              title="Add voice note"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke={showRecorder ? "white" : color} strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
      </div>

      {/* Voice recorder */}
      {showRecorder && isMember && (
        <div style={{ padding: "0 20px 12px" }}>
          <VoiceNoteRecorder clubId={clubId} color={color} onDone={handleVoiceDone} />
        </div>
      )}

      {/* Voice notes */}
      {voiceNotes.length > 0 && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {voiceNotes.map(item => (
            <VoiceNotePlayer key={item.id} item={item} color={color} />
          ))}
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, padding: "0 20px" }}>
          {photos.map(item => (
            <div key={item.id} style={{ aspectRatio: "1/1", position: "relative", overflow: "hidden", borderRadius: 4 }}>
              <Image src={item.public_url} alt={item.caption ?? "Club photo"} fill style={{ objectFit: "cover" }} sizes="33vw" />
            </div>
          ))}
        </div>
      ) : isMember && (
        <button
          onClick={() => fileRef.current?.click()}
          className="mx-5 flex items-center justify-center gap-2 rounded-2xl py-8 transition-all active:scale-[0.98] w-[calc(100%-40px)]"
          style={{ background: `${color}08`, border: `1.5px dashed ${color}30` }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-xs font-semibold" style={{ color }}>Add the first photo</span>
        </button>
      )}
    </section>
  );
}
