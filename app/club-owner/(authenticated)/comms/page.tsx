"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ClubOwnerShell } from "../components/club-owner-shell";

type BroadcastType = "ping" | "photo" | "poll" | "question" | "event_invite";

interface Gathering {
  id: string;
  title: string;
  starts_at: string;
  venue: string | null;
}

interface Broadcast {
  id: string;
  type: BroadcastType;
  title: string | null;
  body: string;
  photo_url: string | null;
  poll_options: { text: string; votes: number }[] | null;
  recipient_count: number;
  sent_at: string;
  poll_responses: number;
  reply_count: number;
  gatherings: { id: string; title: string; starts_at: string } | null;
}

const TYPE_META: Record<BroadcastType, { label: string; icon: string; placeholder: string }> = {
  ping:         { label: "Ping",         icon: "⚡", placeholder: "Something quick for your girls…" },
  photo:        { label: "Photo drop",   icon: "📸", placeholder: "Add a caption…" },
  poll:         { label: "Poll",         icon: "🗳",  placeholder: "Ask your club something…" },
  question:     { label: "Question",     icon: "💬", placeholder: "Open a question to your members…" },
  event_invite: { label: "Event invite", icon: "🎟", placeholder: "Tell them what to expect…" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function ClubMamaBroadcastPage() {
  const [type, setType]               = useState<BroadcastType>("ping");
  const [message, setMessage]         = useState("");
  const [title, setTitle]             = useState("");
  const [photoUrl, setPhotoUrl]       = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [gatheringId, setGatheringId] = useState("");
  const [gatherings, setGatherings]   = useState<Gathering[]>([]);
  const [broadcasts, setBroadcasts]   = useState<Broadcast[]>([]);
  const [clubName, setClubName]       = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const [broadcastRes, gatheringRes, clubRes] = await Promise.all([
        fetch("/api/club-portal/broadcasts"),
        fetch("/api/club-portal/gatherings"),
        fetch("/api/club-portal/my-club"),
      ]);
      if (broadcastRes.ok) {
        const d = await broadcastRes.json();
        setBroadcasts(d.broadcasts ?? []);
        setClubName(d.club?.name ?? "");
      }
      if (gatheringRes.ok) {
        const d = await gatheringRes.json();
        setGatherings(d.upcoming ?? []);
      }
      if (clubRes.ok) {
        const d = await clubRes.json();
        setMemberCount(d.member_count ?? 0);
        if (!clubName) setClubName(d.name ?? "");
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    setError("");
    try {
      const payload: Record<string, unknown> = { type, message, title: title || undefined };
      if (type === "photo") payload.photo_url = photoUrl;
      if (type === "poll") payload.poll_options = pollOptions.filter(Boolean).map((t) => ({ text: t, votes: 0 }));
      if (type === "event_invite") payload.gathering_id = gatheringId;

      const res = await fetch("/api/club-portal/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error);

      const fresh = await fetch("/api/club-portal/broadcasts");
      if (fresh.ok) {
        const d = await fresh.json();
        setBroadcasts(d.broadcasts ?? []);
      }
      setMessage("");
      setTitle("");
      setPhotoUrl("");
      setPollOptions(["", ""]);
      setGatheringId("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  const canSend =
    message.trim().length > 0 &&
    (type !== "poll" || pollOptions.filter(Boolean).length >= 2) &&
    (type !== "event_invite" || gatheringId !== "");

  return (
    <ClubOwnerShell title="Broadcast" backHref="/club-owner/dashboard">
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 1rem 6rem" }}>

        {/* Header */}
        <div style={{ paddingTop: "2rem", paddingBottom: "1.5rem" }}>
          <p style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "#FF1F7D", textTransform: "uppercase", marginBottom: 6 }}>
            {clubName}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "clamp(28px, 6vw, 38px)", color: "#111111", margin: 0, lineHeight: 1.1 }}>
            Talk to your girls.
          </h1>
          <p style={{ fontFamily: "Jost, sans-serif", fontSize: 13, color: "#666", marginTop: 8 }}>
            {memberCount > 0 ? `${memberCount} members will see this.` : "Send a message to all your members."}
          </p>
        </div>

        {/* Type selector */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {(Object.entries(TYPE_META) as [BroadcastType, typeof TYPE_META[BroadcastType]][]).map(([t, meta]) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                fontFamily: "Jost, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "6px 14px",
                border: type === t ? "1.5px solid #FF1F7D" : "1.5px solid #e5e5e5",
                borderRadius: 24,
                background: type === t ? "#FF1F7D" : "transparent",
                color: type === t ? "#fff" : "#666",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>{meta.icon}</span> {meta.label}
            </button>
          ))}
        </div>

        {/* Compose card */}
        <div style={{ background: "#111111", borderRadius: 16, padding: "20px 20px 16px", marginBottom: 24 }}>

          {type === "photo" && (
            <div style={{ marginBottom: 14 }}>
              {photoUrl ? (
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: 10, aspectRatio: "16/9", background: "#1e1e1e" }}>
                  <Image src={photoUrl} alt="Photo drop" fill style={{ objectFit: "cover" }} />
                  <button
                    onClick={() => setPhotoUrl("")}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{ width: "100%", aspectRatio: "16/9", background: "#1e1e1e", border: "1.5px dashed rgba(255,31,125,0.4)", borderRadius: 10, color: "#FF1F7D", fontFamily: "Jost, sans-serif", fontSize: 13, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <span style={{ fontSize: 28 }}>📸</span>
                  <span>Drop a photo</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPhotoUrl(URL.createObjectURL(f));
              }} />
            </div>
          )}

          {type === "event_invite" && (
            <div style={{ marginBottom: 14 }}>
              {gatherings.length === 0 ? (
                <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#888", margin: 0 }}>No upcoming gatherings. Create one first.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {gatherings.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGatheringId(g.id)}
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: gatheringId === g.id ? "1.5px solid #FF1F7D" : "1.5px solid #2a2a2a",
                        background: gatheringId === g.id ? "rgba(255,31,125,0.1)" : "#1a1a1a",
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ fontFamily: "Jost, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{g.title}</p>
                      <p style={{ fontFamily: "Jost, sans-serif", fontSize: 11, color: "#888", margin: "2px 0 0" }}>
                        {formatDate(g.starts_at)}{g.venue ? ` · ${g.venue}` : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {type === "poll" && (
            <div style={{ marginBottom: 14 }}>
              {pollOptions.map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid #FF1F7D", flexShrink: 0 }} />
                  <input
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[i] = e.target.value;
                      setPollOptions(updated);
                    }}
                    placeholder={`Option ${i + 1}`}
                    style={{ flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 12px", color: "#fff", fontFamily: "Jost, sans-serif", fontSize: 13, outline: "none" }}
                  />
                  {pollOptions.length > 2 && (
                    <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18 }}>×</button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button
                  onClick={() => setPollOptions([...pollOptions, ""])}
                  style={{ fontFamily: "Jost, sans-serif", fontSize: 11, color: "#FF1F7D", background: "none", border: "none", cursor: "pointer", padding: "4px 0", letterSpacing: "0.08em" }}
                >
                  + Add option
                </button>
              )}
            </div>
          )}

          {(type === "poll" || type === "question" || type === "event_invite") && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === "poll" ? "Poll question" :
                type === "question" ? "Question heading (optional)" :
                "Message heading (optional)"
              }
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #2a2a2a", padding: "8px 0", color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 16, outline: "none", marginBottom: 12, boxSizing: "border-box" }}
            />
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={TYPE_META[type].placeholder}
            rows={type === "ping" ? 3 : 2}
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none", color: "#fff", fontFamily: "Jost, sans-serif", fontSize: 15, lineHeight: 1.6, boxSizing: "border-box" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTop: "1px solid #1e1e1e", paddingTop: 12 }}>
            <span style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>
              → {memberCount > 0 ? `${memberCount} members` : "all members"}
            </span>
            <button
              onClick={handleSend}
              disabled={!canSend || sending}
              style={{
                fontFamily: "Jost, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: 24,
                border: "none",
                background: canSend && !sending ? "#FF1F7D" : "#2a2a2a",
                color: canSend && !sending ? "#fff" : "#555",
                cursor: canSend && !sending ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {sending ? "Sending…" : sent ? "Sent ✓" : `Send ${TYPE_META[type].icon}`}
            </button>
          </div>
          {error && <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#FF1F7D", marginTop: 8 }}>{error}</p>}
        </div>

        {/* Sent broadcasts list */}
        {loading ? (
          <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#999", textAlign: "center", marginTop: 32 }}>Loading…</p>
        ) : broadcasts.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 18, color: "#999" }}>Nothing sent yet.</p>
            <p style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#bbb", marginTop: 6 }}>Your broadcasts will appear here.</p>
          </div>
        ) : (
          <div>
            <p style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 14 }}>Sent</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {broadcasts.map((b) => (
                <div
                  key={b.id}
                  style={{ background: "#f9f5f0", borderRadius: 12, padding: "14px 16px", borderLeft: "3px solid #FF1F7D" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{TYPE_META[b.type]?.icon ?? "📨"}</span>
                      <span style={{ fontFamily: "Jost, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "#FF1F7D", textTransform: "uppercase" }}>
                        {TYPE_META[b.type]?.label ?? b.type}
                      </span>
                    </div>
                    <span style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#999" }}>{timeAgo(b.sent_at)}</span>
                  </div>

                  {b.title && (
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 15, color: "#111", margin: "0 0 4px" }}>{b.title}</p>
                  )}
                  <p style={{ fontFamily: "Jost, sans-serif", fontSize: 13, color: "#333", margin: 0, lineHeight: 1.5 }}>{b.body}</p>

                  {b.poll_options && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                      {b.poll_options.map((opt, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF1F7D" }} />
                          <span style={{ fontFamily: "Jost, sans-serif", fontSize: 12, color: "#444" }}>{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {b.photo_url && (
                    <div style={{ marginTop: 10, borderRadius: 8, overflow: "hidden", aspectRatio: "16/9", position: "relative", background: "#eee" }}>
                      <Image src={b.photo_url} alt="Broadcast photo" fill style={{ objectFit: "cover" }} />
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                    <span style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#999" }}>{b.recipient_count} members</span>
                    {b.poll_responses > 0 && <span style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#FF1F7D" }}>{b.poll_responses} votes</span>}
                    {b.reply_count > 0 && <span style={{ fontFamily: "Jost, sans-serif", fontSize: 10, color: "#FF1F7D" }}>{b.reply_count} replies</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ClubOwnerShell>
  );
}
