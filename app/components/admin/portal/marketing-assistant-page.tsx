"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
  ts: Date;
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "6px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(255,31,125,0.4)",
            display: "inline-block",
            animation: `bb-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bb-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function formatTs(ts: Date) {
  return ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function MarketingAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch opening message on mount
  useEffect(() => {
    let cancelled = false;
    async function initChat() {
      setLoading(true);
      try {
        const res = await fetch("/api/founder/marketing-assistant", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: "", session_id: undefined }),
        });
        if (cancelled) return;
        const data = await res.json() as { reply: string; session_id: string };
        setSessionId(data.session_id);
        if (data.reply) {
          setMessages([{ role: "assistant", content: data.reply, ts: new Date() }]);
        }
      } catch {
        // silently fail on init — UI will show empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    initChat();
    return () => { cancelled = true; };
  }, []);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/founder/marketing-assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, session_id: sessionId }),
      });
      const data = await res.json() as { reply: string; session_id: string };
      if (data.session_id && !sessionId) setSessionId(data.session_id);
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, ts: new Date() }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong — please try again.", ts: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 760, margin: "0 auto" }}>
      {/* Header */}
      <div>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "#FF1F7D",
            textTransform: "uppercase",
            margin: "0 0 8px",
          }}
        >
          ✦ BRAND INTELLIGENCE
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: 24,
            fontWeight: 400,
            color: "#111",
            margin: "0 0 6px",
          }}
        >
          Your marketing mind. Ask her anything.
        </h2>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 12,
            color: "#888",
            margin: 0,
          }}
        >
          Yande interviews you to understand your brand. The more you share, the better she gets.
        </p>
      </div>

      {/* Chat card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(255,31,125,0.1)",
          boxShadow: "0 4px 20px rgba(255,31,125,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Messages */}
        <div
          style={{
            padding: 20,
            overflowY: "auto",
            maxHeight: "55vh",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flexGrow: 1,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                gap: 4,
              }}
            >
              {msg.role === "assistant" && (
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    color: "rgba(255,31,125,0.6)",
                  }}
                >
                  YANDE ✦
                </span>
              )}
              <div
                style={{
                  maxWidth: "80%",
                  padding: msg.role === "assistant" ? "14px 16px" : "12px 16px",
                  borderRadius:
                    msg.role === "assistant"
                      ? "4px 18px 18px 18px"
                      : "18px 18px 4px 18px",
                  background: msg.role === "assistant" ? "#FFF8F0" : "#FF1F7D",
                  color: msg.role === "assistant" ? "#111" : "#fff",
                  fontFamily:
                    msg.role === "assistant"
                      ? "'Playfair Display', serif"
                      : "'Jost', sans-serif",
                  fontStyle: msg.role === "assistant" ? "italic" : "normal",
                  fontSize: msg.role === "assistant" ? 13.5 : 13,
                  fontWeight: msg.role === "user" ? 600 : 400,
                  lineHeight: msg.role === "assistant" ? 1.6 : 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </div>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 9,
                  color: "#ccc",
                }}
              >
                {formatTs(msg.ts)}
              </span>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "rgba(255,31,125,0.6)",
                }}
              >
                YANDE ✦
              </span>
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "4px 18px 18px 18px",
                  background: "#FFF8F0",
                }}
              >
                <LoadingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            borderTop: "1px solid rgba(255,31,125,0.08)",
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            padding: "12px 16px",
            background: "#fff",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            placeholder="Share your thoughts…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "'Jost', sans-serif",
              fontSize: 13,
              color: "#111",
              background: "transparent",
              lineHeight: 1.5,
              maxHeight: "4.5em",
              overflowY: "auto",
              paddingTop: 4,
              paddingBottom: 4,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: loading || !input.trim() ? "rgba(255,31,125,0.3)" : "#FF1F7D",
              border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
