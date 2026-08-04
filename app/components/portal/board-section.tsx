"use client";

import { useEffect, useRef, useState } from "react";
import { getBoardPosts, addBoardPost, deleteBoardPost, type BoardPost } from "@/lib/actions/board";

const PINK = "#FF1F7D";

type Composer = "text" | "link" | "photo" | "voice";

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function BoardSection({ userId }: { userId: string }) {
  const [posts, setPosts]   = useState<BoardPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [composer, setComposer] = useState<Composer>("text");
  const [text, setText]     = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBoardPosts(userId).then(p => { setPosts(p); setLoaded(true); }).catch(() => setLoaded(true));
  }, [userId]);

  async function submitTextOrLink() {
    if (!text.trim() && composer === "text") return;
    if (composer === "link" && !linkUrl.trim()) return;
    setPosting(true);
    const { post } = await addBoardPost({
      kind: composer === "link" ? "link" : "text",
      body: text,
      link_url: composer === "link" ? linkUrl : undefined,
    });
    if (post) setPosts(prev => [post, ...prev]);
    setText(""); setLinkUrl("");
    setPosting(false);
  }

  async function handlePhotoFile(file: File) {
    setPosting(true);
    try {
      const { uploadBoardPhoto } = await import("@/lib/storage/upload");
      const url = await uploadBoardPhoto(file, userId);
      const { post } = await addBoardPost({ kind: "photo", image_url: url, body: text });
      if (post) setPosts(prev => [post, ...prev]);
      setText("");
    } catch {
      /* upload failed — silently skip, user can retry */
    }
    setPosting(false);
  }

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = e => audioChunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setPosting(true);
        try {
          const { uploadBoardVoiceNote } = await import("@/lib/storage/upload");
          const url = await uploadBoardVoiceNote(blob, userId);
          const { post } = await addBoardPost({ kind: "voice", voice_url: url });
          if (post) setPosts(prev => [post, ...prev]);
        } catch {
          /* mic/upload failed — silently skip */
        }
        setPosting(false);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch {
      /* mic permission denied */
    }
  }

  async function handleDelete(id: string) {
    setPosts(prev => prev.filter(p => p.id !== id));
    await deleteBoardPost(id);
  }

  const COMPOSER_TABS: { id: Composer; label: string; icon: string }[] = [
    { id: "text",  label: "Note",  icon: "✎" },
    { id: "link",  label: "Link",  icon: "🔗" },
    { id: "photo", label: "Photo", icon: "📷" },
    { id: "voice", label: "Voice", icon: "🎙" },
  ];

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 10 }}>YOUR BOARD</p>

      {/* Composer */}
      <div style={{ background: "white", borderRadius: 18, padding: 14, marginBottom: 18, boxShadow: "0 2px 12px rgba(255,31,125,0.07)" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {COMPOSER_TABS.map(t => (
            <button key={t.id} onClick={() => setComposer(t.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "6px 4px", borderRadius: 10, cursor: "pointer",
              background: composer === t.id ? "rgba(255,31,125,0.08)" : "transparent",
              border: composer === t.id ? `1px solid ${PINK}33` : "1px solid transparent",
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: composer === t.id ? PINK : "rgba(0,0,0,0.4)" }}>{t.label}</span>
            </button>
          ))}
        </div>

        {(composer === "text" || composer === "link") && (
          <>
            {composer === "link" && (
              <input
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://…"
                style={{ width: "100%", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "9px 12px", fontFamily: "var(--font-jost)", fontSize: 12, marginBottom: 8, boxSizing: "border-box" as const, outline: "none" }}
              />
            )}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={composer === "link" ? "Say something about it (optional)" : "Pin a thought to your board…"}
              rows={2}
              style={{ width: "100%", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "9px 12px", fontFamily: "var(--font-jost)", fontSize: 13, resize: "none" as const, boxSizing: "border-box" as const, outline: "none", marginBottom: 8 }}
            />
            <button
              onClick={submitTextOrLink}
              disabled={posting || (composer === "text" ? !text.trim() : !linkUrl.trim())}
              style={{
                width: "100%", padding: "9px", borderRadius: 10, border: "none",
                background: PINK, color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
                letterSpacing: "0.06em", cursor: "pointer", opacity: posting ? 0.6 : 1,
              }}
            >{posting ? "Pinning…" : "Pin to board"}</button>
          </>
        )}

        {composer === "photo" && (
          <>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) void handlePhotoFile(f); e.target.value = ""; }} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={posting}
              style={{
                width: "100%", padding: "10px", borderRadius: 10, border: "1.5px dashed rgba(255,31,125,0.35)",
                background: "rgba(255,31,125,0.04)", color: PINK, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700,
                cursor: "pointer",
              }}
            >{posting ? "Uploading…" : "＋ Add a photo"}</button>
          </>
        )}

        {composer === "voice" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={toggleRecording}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
                background: isRecording ? "#EF4444" : PINK,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              {isRecording ? (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="white"><rect x="2" y="2" width="10" height="10" rx="1" /></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="white"><ellipse cx="8" cy="6" rx="3" ry="4" /><path d="M3 8a5 5 0 0 0 10 0" stroke="white" strokeWidth="1.5" fill="none" /><line x1="8" y1="13" x2="8" y2="15" stroke="white" strokeWidth="1.5" /></svg>
              )}
            </button>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: isRecording ? "#EF4444" : "rgba(0,0,0,0.5)" }}>
              {isRecording ? "Recording… tap to stop" : posting ? "Saving…" : "Tap to record a voice note"}
            </span>
          </div>
        )}
      </div>

      {/* Feed */}
      {!loaded ? (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.35)", textAlign: "center" as const, padding: "20px 0" }}>Loading…</p>
      ) : posts.length === 0 ? (
        <div style={{ background: "rgba(255,31,125,0.04)", border: "1px dashed rgba(255,31,125,0.2)", borderRadius: 16, padding: "28px 16px", textAlign: "center" as const }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#888" }}>Your board is empty</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#bbb", marginTop: 4 }}>Pin a note, a link, a photo, or a voice memo above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {posts.map(p => (
            <div key={p.id} style={{ background: "white", borderRadius: 14, padding: "12px 14px", boxShadow: "0 2px 10px rgba(255,31,125,0.06)", position: "relative" as const }}>
              <button
                onClick={() => handleDelete(p.id)}
                aria-label="Delete"
                style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.2)", fontSize: 14, lineHeight: 1, padding: 4 }}
              >×</button>
              {p.kind === "photo" && p.image_url && (
                <img src={p.image_url} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 10, marginBottom: p.body ? 8 : 0 }} />
              )}
              {p.kind === "voice" && p.voice_url && (
                <audio controls src={p.voice_url} style={{ width: "100%", marginBottom: 4 }} />
              )}
              {p.kind === "link" && p.link_url && (
                <a href={p.link_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK, marginBottom: p.body ? 6 : 2, wordBreak: "break-all" as const }}>
                  🔗 {p.link_url}
                </a>
              )}
              {p.body && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#333", lineHeight: 1.5, paddingRight: 16 }}>{p.body}</p>
              )}
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(0,0,0,0.28)", marginTop: 6 }}>{timeAgo(p.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
