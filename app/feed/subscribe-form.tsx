// FILE: app/feed/subscribe-form.tsx
"use client";

import { useState } from "react";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const OBSIDIAN = "#0B0B0B";

export default function FeedSubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feed/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          background: "rgba(13,59,46,0.08)",
          border: `1px solid rgba(201,168,76,0.3)`,
          borderRadius: 4,
        }}
      >
        <span style={{ fontSize: 20 }}>✓</span>
        <div>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 14,
              fontWeight: 600,
              color: FOREST,
            }}
          >
            You&apos;re on the list.
          </p>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "#666", marginTop: 2 }}>
            Weekly intelligence drops every Monday. Check your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", gap: 0, maxWidth: 440 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="your@email.com"
          required
          style={{
            flex: 1,
            padding: "12px 16px",
            border: `1px solid ${status === "error" ? "#8B3A2A" : "rgba(201,168,76,0.35)"}`,
            borderRight: "none",
            borderRadius: "4px 0 0 4px",
            background: "white",
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            color: OBSIDIAN,
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = GOLD;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              status === "error" ? "#8B3A2A" : "rgba(201,168,76,0.35)";
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            padding: "12px 20px",
            background: status === "loading" ? "#a88530" : GOLD,
            color: OBSIDIAN,
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.15s",
          }}
        >
          {status === "loading" ? "Sending…" : "Subscribe →"}
        </button>
      </div>
      {status === "error" && errorMsg && (
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#8B3A2A",
            fontFamily: "var(--font-ui)",
          }}
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
}
