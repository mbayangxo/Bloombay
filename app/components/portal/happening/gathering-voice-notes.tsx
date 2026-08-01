"use client";

import { useEffect, useRef, useState } from "react";
import { uploadGatheringVoiceNote } from "@/lib/storage/upload";

const PINK = "#FF1F7D";

type VoiceNote = {
  id: string;
  user_id: string;
  audio_url: string;
  duration_secs: number;
  profiles: { first_name: string | null; full_name: string | null } | null;
};

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Real per-attendee voice notes for a gathering's Plan Room — recorded live
 *  via MediaRecorder, uploaded to Storage, listed from gathering_voice_notes.
 *  No placeholder notes; the list is empty until someone actually records one. */
export function GatheringVoiceNotes({ gatheringId, myUserId }: { gatheringId: string; myUserId: string }) {
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function load() {
    fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/voice-notes`)
      .then(r => r.json())
      .then(d => setNotes(d.notes ?? []))
      .catch(() => {});
  }

  useEffect(() => { load(); }, [gatheringId]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      recorderRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/mp4" });
        setUploading(true);
        try {
          const url = await uploadGatheringVoiceNote(blob, gatheringId, myUserId);
          await fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/voice-notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio_url: url, duration_secs: secs }),
          });
          load();
        } catch {
          setError("Upload failed. Try again.");
        }
        setUploading(false);
      };
      mr.start();
      setSecs(0);
      setRecording(true);
      timerRef.current = setInterval(() => {
        setSecs(s => {
          if (s >= 59) { mr.stop(); if (timerRef.current) clearInterval(timerRef.current); setRecording(false); return 60; }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("Microphone permission denied.");
    }
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    recorderRef.current?.stop();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>VOICE NOTES</p>
        {!recording && !uploading && (
          <button type="button" onClick={() => void start()} className="text-xs font-bold" style={{ color: PINK }}>
            + Leave a note
          </button>
        )}
      </div>

      {recording && (
        <div className="flex items-center gap-2 mb-3 rounded-xl px-3 py-2" style={{ background: "rgba(255,31,125,0.06)" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F1F" }} />
          <span className="text-xs font-bold tabular-nums" style={{ color: "#111" }}>{fmt(secs)} / 1:00</span>
          <button type="button" onClick={stop} className="ml-auto text-xs font-bold" style={{ color: PINK }}>Stop</button>
        </div>
      )}
      {uploading && <p className="text-xs mb-3" style={{ color: "#999" }}>Uploading…</p>}
      {error && <p className="text-xs mb-3" style={{ color: "#C0392B" }}>{error}</p>}

      {notes.length === 0 ? (
        <p className="text-xs" style={{ color: "#bbb" }}>No voice notes yet — be the first.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notes.map(n => (
            <div key={n.id} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: "rgba(0,0,0,0.03)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${PINK}18`, color: PINK, fontSize: 11, fontWeight: 700 }}>
                {(n.profiles?.first_name ?? n.profiles?.full_name ?? "?")[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "#111" }}>
                  {n.profiles?.first_name ?? n.profiles?.full_name ?? "A guest"}
                </p>
                <audio src={n.audio_url} controls style={{ width: "100%", height: 32 }} />
              </div>
              <span className="text-[10px] flex-shrink-0" style={{ color: "#999" }}>{fmt(n.duration_secs)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
