"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const PINK   = "#FF1F7D";
const INK    = "#111111";
const CREAM  = "#fdf4ec";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CommentAuthor {
  display_name: string | null;
  avatar_url: string | null;
  bloom_code: number | null;
}

interface Comment {
  id: string;
  parent_id: string | null;
  body: string;
  blooms: number;
  created_at: string;
  author_id: string;
  profiles: CommentAuthor | null;
  // client-side
  clientBlooms?: number;
  myFlower?: boolean;
  replies?: Comment[];
}

export type PostRef =
  | { fashion_post_id: string }
  | { wall_post_id: string }
  | { avenue_content_id: string };

interface Props {
  postRef: PostRef;
  currentUserId?: string;
  flowerCount?: number;
  myFlower?: boolean;
  onFlowerToggle?: () => void;
  accentColor?: string;
}

// ── Profile bubble with tap → profile / long-press → bloom ────────────────────

function ProfileBubble({ author, size = 30 }: { author: CommentAuthor | null; size?: number }) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const longPressed = useRef(false);
  const initials = (author?.display_name ?? "?").slice(0, 2).toUpperCase();

  function startPress() {
    longPressed.current = false;
    pressTimer.current = setTimeout(() => {
      longPressed.current = true;
      setShowSheet(true);
    }, 500);
  }
  function endPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }

  return (
    <>
      <div
        onMouseDown={startPress} onMouseUp={endPress} onMouseLeave={endPress}
        onTouchStart={startPress} onTouchEnd={endPress}
        style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, #C77DFF)`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 800, color: "#fff", fontFamily: "var(--font-jost)", cursor: "pointer", userSelect: "none" }}
        onClick={() => { if (!longPressed.current && author) { /* navigate to profile */ } }}
      >
        {author?.avatar_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={author.avatar_url} alt={author.display_name ?? "Member"} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          : initials
        }
      </div>

      {/* Long-press action sheet */}
      {showSheet && (
        <>
          <div onClick={() => setShowSheet(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500 }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 501, background: CREAM, borderRadius: "24px 24px 0 0", padding: "20px 20px 40px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, #C77DFF)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "var(--font-jost)" }}>
                {initials}
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 15, color: INK }}>{author?.display_name ?? "Member"}</p>
                {author?.bloom_code && <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 11, color: PINK, fontWeight: 700 }}>#{author.bloom_code}</p>}
              </div>
            </div>
            {[
              { label: "View her apartment →", icon: "🏠", action: "profile" },
              { label: "Send a Bloom request", icon: "🌸", action: "bloom" },
              { label: "Send a chat message", icon: "💬", action: "chat" },
              { label: "Send to mailbox", icon: "📬", action: "mailbox" },
              { label: "Report", icon: "⚑", action: "report", danger: true },
              { label: "Block", icon: "⛔", action: "block", danger: true },
            ].map(item => (
              <button
                key={item.action}
                onClick={() => setShowSheet(false)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: item.danger ? 700 : 500, color: item.danger ? "#e53e3e" : INK, textAlign: "left" }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// ── Single comment row ────────────────────────────────────────────────────────

function CommentRow({
  comment,
  onReply,
  depth = 0,
}: {
  comment: Comment;
  onReply: (id: string, name: string) => void;
  depth?: number;
}) {
  const [blooms, setBlooms]     = useState(comment.clientBlooms ?? comment.blooms);
  const [myFlower, setMyFlower] = useState(comment.myFlower ?? false);
  const name = comment.profiles?.display_name ?? "Member";
  const timeAgo = formatTimeAgo(comment.created_at);

  async function toggleFlower() {
    const res = await fetch("/api/comment-flower", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: comment.id }),
    });
    if (res.ok) {
      const d = await res.json() as { gave: boolean; count: number };
      setMyFlower(d.gave);
      setBlooms(d.count);
    }
  }

  return (
    <div style={{ marginLeft: depth > 0 ? 36 : 0, marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <ProfileBubble author={comment.profiles} size={depth > 0 ? 26 : 32} />
        <div style={{ flex: 1 }}>
          <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 14, padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: INK }}>{name}</span>
              {comment.profiles?.bloom_code && (
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: PINK, fontWeight: 700 }}>#{comment.profiles.bloom_code}</span>
              )}
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(0,0,0,0.35)", marginLeft: "auto" }}>{timeAgo}</span>
            </div>
            <p style={{ margin: 0, fontFamily: "var(--font-jost)", fontSize: 13, color: INK, lineHeight: 1.5 }}>{comment.body}</p>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 5, paddingLeft: 4 }}>
            <button onClick={() => onReply(comment.id, name)} style={{ background: "none", border: "none", fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", cursor: "pointer", padding: 0, fontWeight: 600 }}>
              Reply
            </button>
            <button onClick={toggleFlower} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 3, fontFamily: "var(--font-jost)", fontSize: 11, color: myFlower ? PINK : "rgba(0,0,0,0.4)", cursor: "pointer", padding: 0, fontWeight: 600 }}>
              🌸 {blooms > 0 ? blooms : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.map(reply => (
        <CommentRow key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PostComments({ postRef, currentUserId, flowerCount = 0, myFlower = false, onFlowerToggle, accentColor = PINK }: Props) {
  const [comments, setComments]   = useState<Comment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [text, setText]           = useState("");
  const [replyTo, setReplyTo]     = useState<{ id: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen]           = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const refKey = Object.keys(postRef)[0];
  const refVal = Object.values(postRef)[0];

  const loadComments = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/comments?${refKey}=${refVal}`);
    if (res.ok) {
      const d = await res.json() as { comments: Comment[] };
      setComments(buildThread(d.comments));
    }
    setLoading(false);
  }, [refKey, refVal]);

  useEffect(() => {
    if (open) loadComments();
  }, [open, loadComments]);

  async function submitComment() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text.trim(), parent_id: replyTo?.id ?? null, ...postRef }),
    });
    setText("");
    setReplyTo(null);
    await loadComments();
    setSubmitting(false);
  }

  function startReply(id: string, name: string) {
    setReplyTo({ id, name });
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const total = countComments(comments);

  return (
    <div>
      {/* Flower + comment trigger bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0 6px" }}>
        <button
          onClick={onFlowerToggle}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: myFlower ? PINK : "rgba(0,0,0,0.45)", padding: 0 }}
        >
          🌸 {flowerCount > 0 ? flowerCount : ""}
        </button>
        <button
          onClick={() => setOpen(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.45)", padding: 0 }}
        >
          💬 {total > 0 ? `${total} comment${total !== 1 ? "s" : ""}` : "Comment"}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 8 }}>
          {loading ? (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.35)", margin: "8px 0" }}>Loading…</p>
          ) : comments.length === 0 ? (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.35)", margin: "8px 0 12px" }}>No comments yet. Be the first ✦</p>
          ) : (
            <div style={{ marginBottom: 12 }}>
              {comments.map(c => <CommentRow key={c.id} comment={c} onReply={startReply} />)}
            </div>
          )}

          {/* Input */}
          {currentUserId ? (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                {replyTo && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: accentColor, fontWeight: 700 }}>↩ replying to {replyTo.name}</span>
                    <button onClick={() => setReplyTo(null)} style={{ background: "none", border: "none", fontSize: 11, color: "rgba(0,0,0,0.4)", cursor: "pointer", padding: 0 }}>✕</button>
                  </div>
                )}
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submitComment(); } }}
                  placeholder="Write a comment…"
                  rows={1}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 14, border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontFamily: "var(--font-jost)", fontSize: 13, color: INK, outline: "none", resize: "none", boxSizing: "border-box" }}
                />
              </div>
              <button
                onClick={() => void submitComment()}
                disabled={submitting || !text.trim()}
                style={{ padding: "10px 16px", background: text.trim() ? accentColor : "rgba(0,0,0,0.1)", color: "#fff", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, cursor: text.trim() ? "pointer" : "default", flexShrink: 0, transition: "background 0.15s" }}
              >
                {submitting ? "…" : "Post"}
              </button>
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)" }}>
              <Link href="/auth/signin" style={{ color: accentColor }}>Sign in</Link> to comment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildThread(flat: Comment[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];
  for (const c of flat) map.set(c.id, { ...c, replies: [] });
  for (const c of map.values()) {
    if (c.parent_id) {
      map.get(c.parent_id)?.replies?.push(c);
    } else {
      roots.push(c);
    }
  }
  return roots;
}

function countComments(comments: Comment[]): number {
  return comments.reduce((n, c) => n + 1 + countComments(c.replies ?? []), 0);
}

function formatTimeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
