"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const GOLD  = "#D4A853";
const PAPER = "#FEFCF7";

interface ChatMessage {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender_name: string | null;
  sender_initial: string;
  is_me: boolean;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Avatar({ initial, isMe }: { initial: string; isMe: boolean }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: isMe
        ? `linear-gradient(135deg, ${PINK}, #C4005A)`
        : `linear-gradient(135deg, #2D1050, #4A0C28)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: isMe ? `2px solid rgba(255,31,125,0.3)` : "2px solid rgba(255,255,255,0.1)",
      boxShadow: isMe ? "0 2px 8px rgba(255,31,125,0.3)" : "0 2px 8px rgba(0,0,0,0.15)",
    }}>
      <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white" }}>
        {initial}
      </span>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: msg.is_me ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12,
    }}>
      <Avatar initial={msg.sender_initial} isMe={msg.is_me} />
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 3, alignItems: msg.is_me ? "flex-end" : "flex-start" }}>
        {!msg.is_me && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", paddingLeft: 12 }}>
            {msg.sender_name ?? "Founding Mother"}
          </p>
        )}
        <div style={{
          padding: "10px 14px",
          borderRadius: msg.is_me ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: msg.is_me
            ? `linear-gradient(135deg, ${PINK}, #E8006A)`
            : "rgba(255,255,255,0.1)",
          border: msg.is_me ? "none" : "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}>
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: 14, color: msg.is_me ? "white" : "rgba(255,238,220,0.9)",
            lineHeight: 1.5, margin: 0,
          }}>{msg.body}</p>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.25)", paddingLeft: msg.is_me ? 0 : 12, paddingRight: msg.is_me ? 12 : 0 }}>
          {formatTime(msg.created_at)}
        </p>
      </div>
    </div>
  );
}

export default function FoundingChatPage() {
  const [messages,    setMessages]    = useState<ChatMessage[]>([]);
  const [input,       setInput]       = useState("");
  const [sending,     setSending]     = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [userId,      setUserId]      = useState<string | null>(null);
  const [isFounder,   setIsFounder]   = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  const loadMessages = useCallback(async (uid: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("founding_chat_messages")
      .select("id, sender_id, body, created_at, profiles!sender_id(first_name, full_name)")
      .order("created_at", { ascending: false })
      .limit(80);

    const msgs: ChatMessage[] = (data ?? []).map((m: Record<string, unknown>) => {
      const profile = m.profiles as { first_name?: string; full_name?: string } | null;
      const name = profile?.full_name ?? profile?.first_name ?? null;
      return {
        id: m.id as string,
        sender_id: m.sender_id as string,
        body: m.body as string,
        created_at: m.created_at as string,
        sender_name: name,
        sender_initial: (name?.[0] ?? "?").toUpperCase(),
        is_me: (m.sender_id as string) === uid,
      };
    }).reverse();

    setMessages(msgs);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsFounder(false); setLoading(false); return; }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_founding_mother")
        .eq("id", user.id)
        .single();

      const founder = !!(profile as { is_founding_mother?: boolean } | null)?.is_founding_mother;
      setIsFounder(founder);

      if (founder) {
        await loadMessages(user.id);
      }
      setLoading(false);
    })();
  }, [loadMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!userId || !isFounder) return;
    const supabase = createClient();
    const channel = supabase
      .channel("founding_chat")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "founding_chat_messages",
      }, async (payload) => {
        const m = payload.new as { id: string; sender_id: string; body: string; created_at: string };
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, full_name")
          .eq("id", m.sender_id)
          .single();
        const p = profile as { first_name?: string; full_name?: string } | null;
        const name = p?.full_name ?? p?.first_name ?? null;
        const newMsg: ChatMessage = {
          id: m.id, sender_id: m.sender_id, body: m.body, created_at: m.created_at,
          sender_name: name, sender_initial: (name?.[0] ?? "?").toUpperCase(),
          is_me: m.sender_id === userId,
        };
        setMessages(prev => [...prev, newMsg]);
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [userId, isFounder]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    const supabase = createClient();
    await supabase.from("founding_chat_messages").insert({ sender_id: userId, body: text });
    setSending(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${DARK} 0%, #2A0818 55%, #4A0C28 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading…</p>
      </div>
    );
  }

  if (isFounder === false) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${DARK} 0%, #2A0818 55%, #4A0C28 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🌺</div>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: "rgba(255,238,220,0.9)", textAlign: "center", lineHeight: 1.2 }}>Founding Mothers only.</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.6 }}>
          This space is reserved for our 100 founding mothers — the women who built BloomBay from the ground up.
        </p>
        <Link href="/member/lounge" style={{ textDecoration: "none" }}>
          <div style={{ marginTop: 8, background: PINK, borderRadius: 999, padding: "12px 28px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "white" }}>← Back to Lounge</p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${DARK} 0%, #2A0818 55%, #4A0C28 100%)`,
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── Header ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
        paddingBottom: 12,
        paddingLeft: 20, paddingRight: 20,
        background: "linear-gradient(180deg, rgba(28,0,24,0.95) 0%, rgba(28,0,24,0.82) 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <Link href="/member/lounge" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 1L3 6l5 5"/></svg>
        </Link>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: "rgba(255,238,220,0.95)" }}>Founding Mothers</p>
            <div style={{ background: "rgba(212,168,83,0.18)", border: "1px solid rgba(212,168,83,0.4)", borderRadius: 4, padding: "2px 7px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: GOLD, letterSpacing: "0.12em" }}>PRIVATE</p>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>100 founding mothers · NYC</p>
        </div>

        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}33, ${PINK}11)`, border: `1px solid ${PINK}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          🌺
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 80px)",
        paddingBottom: 90,
        paddingLeft: 16, paddingRight: 16,
        overflowY: "auto",
      }}>
        {messages.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 12, opacity: 0.6 }}>
            <div style={{ fontSize: 36 }}>🌸</div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
              Be the first to say hello.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.22)", borderRadius: 999, padding: "6px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.12em" }}>
                  ✦ FOUNDING MOTHERS ONLY ✦
                </p>
              </div>
            </div>
            {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
        paddingTop: 12,
        paddingLeft: 16, paddingRight: 16,
        background: "linear-gradient(0deg, rgba(28,0,24,0.98) 0%, rgba(28,0,24,0.88) 100%)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", gap: 10, alignItems: "flex-end",
      }}>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "10px 16px", minHeight: 44, display: "flex", alignItems: "center" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something…"
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none", resize: "none",
              fontFamily: "var(--font-jost)", fontSize: 14, color: "rgba(255,238,220,0.9)",
              lineHeight: 1.5, overflow: "hidden",
              WebkitAppearance: "none",
            }}
          />
        </div>
        <button
          onClick={() => void handleSend()}
          disabled={!input.trim() || sending}
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer",
            background: input.trim() ? PINK : "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.2s",
            boxShadow: input.trim() ? "0 4px 16px rgba(255,31,125,0.4)" : "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>

      {/* Inject textarea auto-resize */}
      <style>{`
        textarea { field-sizing: content; max-height: 120px; }
        textarea::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>
    </div>
  );
}
