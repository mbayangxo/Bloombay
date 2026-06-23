"use client";

import { useState, useRef, useEffect } from "react";
import { submitToWaitlist } from "../../../lib/supabase";

// ── Design tokens ────────────────────────────────────────────────────────────
const IVORY  = "#FFF5F8";
const PINK   = "#FF1F7D";
const DARK   = "#1A1A1A";
const GRAY   = "#7A7A8A";
const WHITE  = "#FFFFFF";
const CARD_BORDER = "#EBD9DF";
const CHIP_BORDER = "#E8D5DB";
const ICON_BG     = "#FFE8F2";

// ── Screen types ─────────────────────────────────────────────────────────────
type Screen = "phone" | "otp" | "what-do" | "looking-for" | "your-name" | "done";

// ── Data ─────────────────────────────────────────────────────────────────────
const PROFESSIONS = [
  { id: "business",      emoji: "💼", label: "Business & Finance" },
  { id: "creative",      emoji: "🎨", label: "Creative & Design" },
  { id: "tech",          emoji: "💻", label: "Tech & Engineering" },
  { id: "health",        emoji: "🩺", label: "Health & Medicine" },
  { id: "education",     emoji: "📚", label: "Education" },
  { id: "law",           emoji: "⚖️", label: "Law & Policy" },
  { id: "media",         emoji: "🎬", label: "Media & Entertainment" },
  { id: "food",          emoji: "🍽️", label: "Food & Hospitality" },
  { id: "wellness",      emoji: "🌿", label: "Wellness & Fitness" },
  { id: "architecture",  emoji: "🏛️", label: "Architecture & Property" },
  { id: "fashion",       emoji: "✨", label: "Fashion & Beauty" },
  { id: "other",         emoji: "🌸", label: "Something else" },
];

const LOOKING_FOR = [
  { id: "real-friend",   emoji: "🌸", label: "A real friend",    sub: "Someone who actually shows up" },
  { id: "social-circle", emoji: "👯", label: "A social circle",  sub: "Women to do things with" },
  { id: "career",        emoji: "💼", label: "Career growth",    sub: "Women who get what I'm building" },
  { id: "wellness",      emoji: "🧘", label: "Wellness & growth", sub: "People on the same journey" },
  { id: "creative",      emoji: "🎨", label: "Creative collab",  sub: "A muse, a partner, a crew" },
  { id: "community",     emoji: "🌍", label: "Community",         sub: "Belonging beyond your circles" },
];

// ── Shared styles ─────────────────────────────────────────────────────────────
const screen: React.CSSProperties = {
  minHeight: "100dvh",
  background: IVORY,
  display: "flex",
  flexDirection: "column",
  padding: "0 24px",
  fontFamily: "var(--font-jost), sans-serif",
  overflowX: "hidden",
};

const logoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: 20,
  paddingBottom: 8,
  flexShrink: 0,
};

const brandMark: React.CSSProperties = {
  fontFamily: "var(--font-playfair), serif",
  fontStyle: "italic",
  fontWeight: 700,
  fontSize: 18,
  color: DARK,
  letterSpacing: "-0.01em",
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{
      fontFamily: "var(--font-playfair), serif",
      fontStyle: "italic",
      fontWeight: 700,
      fontSize: 36,
      lineHeight: 1.15,
      color: DARK,
      margin: "0 0 8px",
    }}>
      {children}
    </h1>
  );
}

function Pink({ children }: { children: React.ReactNode }) {
  return <span style={{ color: PINK }}>{children}</span>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-playfair), serif",
      fontStyle: "italic",
      fontSize: 14,
      color: GRAY,
      margin: "0 0 28px",
      lineHeight: 1.5,
    }}>
      {children}
    </p>
  );
}

function PinkButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        background: disabled ? "#F0C4D6" : PINK,
        color: WHITE,
        border: "none",
        borderRadius: 100,
        padding: "16px 0",
        fontFamily: "var(--font-jost), sans-serif",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "0.03em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s",
        marginBottom: 12,
      }}
    >
      {children}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        fontFamily: "var(--font-playfair), serif",
        fontStyle: "italic",
        fontSize: 14,
        color: GRAY,
        cursor: "pointer",
        padding: "4px 0",
        display: "block",
        margin: "0 auto",
      }}
    >
      ← back
    </button>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 7,
          height: 7,
          borderRadius: 100,
          background: i === current ? PINK : "#E5C8D0",
          transition: "all 0.25s",
        }} />
      ))}
    </div>
  );
}

// ── Screen 1: Phone entry ─────────────────────────────────────────────────────
function PhoneScreen({ onNext }: { onNext: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!phone.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onNext(phone.trim());
  }

  return (
    <div style={screen}>
      <div style={logoRow}>
        <span style={brandMark}>BloomBay</span>
        <span style={{ fontSize: 20 }}>🔒</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 40 }}>
        <div style={{ marginBottom: 32 }}>
          <Heading>
            {"Let's start "}
            <Pink>here.</Pink>
          </Heading>
          <Sub>Your number. That&apos;s all for now.<br />We&apos;ll never share it.</Sub>
        </div>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GRAY, marginBottom: 8 }}>
          Mobile Number
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          background: WHITE,
          border: `1.5px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: "14px 16px",
          marginBottom: 8,
          gap: 10,
        }}>
          <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🇺🇸</span>
          <span style={{ fontFamily: "var(--font-jost)", fontWeight: 600, color: DARK, fontSize: 15, flexShrink: 0 }}>+1</span>
          <div style={{ width: 1, height: 20, background: CHIP_BORDER, flexShrink: 0 }} />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="(555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: 16,
              color: DARK,
              outline: "none",
              letterSpacing: "0.02em",
            }}
          />
        </div>

        <p style={{
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontSize: 12,
          color: GRAY,
          marginBottom: 28,
          lineHeight: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
        }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          We verify your number to keep BloomBay safe for every woman inside it. We&apos;ll text you a code.
        </p>

        <PinkButton onClick={() => void handleContinue()} disabled={!phone.trim() || loading}>
          {loading ? "Sending code…" : "Continue →"}
        </PinkButton>
      </div>
    </div>
  );
}

// ── Screen 2: OTP ─────────────────────────────────────────────────────────────
function OtpScreen({ phone, onNext, onBack }: { phone: string; onNext: () => void; onBack: () => void }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const full = digits.join("");
  const complete = full.length === 6;

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function handleDigit(idx: number, val: string) {
    if (val.length > 1) {
      // Handle paste of full code
      const clean = val.replace(/\D/g, "").slice(0, 6);
      const next = [...digits];
      clean.split("").forEach((c, i) => { next[i] = c; });
      setDigits(next);
      inputRefs.current[Math.min(clean.length, 5)]?.focus();
      return;
    }
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handleVerify() {
    if (!complete) return;
    if (full === "000000") { setError("Incorrect code. Try again."); return; }
    onNext();
  }

  async function handleResend() {
    setResent(true);
    await new Promise(r => setTimeout(r, 800));
  }

  const displayPhone = phone.length > 6
    ? `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`
    : phone;

  return (
    <div style={screen}>
      <div style={logoRow}>
        <span style={brandMark}>BloomBay</span>
        {/* Chat bubble icon */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `${PINK}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          💬
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 40 }}>
        <div style={{ marginBottom: 32 }}>
          <Heading>
            {"Check your "}
            <Pink>texts.</Pink>
          </Heading>
          <Sub>
            We sent a 6-digit code to<br />
            <span style={{ fontWeight: 600, color: DARK }}>{displayPhone}</span>
          </Sub>
        </div>

        {/* 6 digit boxes */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 44,
                height: 54,
                borderRadius: 14,
                border: `1.5px solid ${d ? PINK : CARD_BORDER}`,
                background: d ? `${PINK}0D` : WHITE,
                textAlign: "center",
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: DARK,
                outline: "none",
                caretColor: PINK,
                transition: "border-color 0.15s, background 0.15s",
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ textAlign: "center", fontFamily: "var(--font-jost)", fontSize: 12, color: "#E53E3E", marginBottom: 12 }}>{error}</p>
        )}

        <p style={{
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontSize: 13,
          color: GRAY,
          textAlign: "center",
          marginBottom: 24,
        }}>
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={() => void handleResend()}
            style={{ background: "none", border: "none", color: PINK, fontFamily: "inherit", fontStyle: "inherit", fontSize: "inherit", fontWeight: 600, cursor: "pointer", padding: 0 }}
          >
            {resent ? "Sent ✓" : "Resend code"}
          </button>
        </p>

        <PinkButton onClick={handleVerify} disabled={!complete}>
          Verify →
        </PinkButton>
        <BackBtn onClick={onBack} />
      </div>
    </div>
  );
}

// ── Screen 3: What do you do ──────────────────────────────────────────────────
function WhatDoScreen({
  chosen,
  onToggle,
  onNext,
  onBack,
}: {
  chosen: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div style={screen}>
      <div style={logoRow}>
        <span style={brandMark}>BloomBay</span>
      </div>

      <ProgressDots total={3} current={0} />

      <Heading>
        {"What do "}
        <br />
        {"you "}
        <Pink>do?</Pink>
      </Heading>
      <Sub>Choose the one that fits best right now. You can always update this.</Sub>

      {/* Chip grid */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        flex: 1,
        alignContent: "flex-start",
        marginBottom: 24,
        overflowY: "auto",
        paddingBottom: 4,
      }}>
        {PROFESSIONS.map((p) => {
          const active = chosen.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggle(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 100,
                border: `1.5px solid ${active ? PINK : CHIP_BORDER}`,
                background: active ? `${PINK}0F` : WHITE,
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? PINK : DARK,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: active ? `0 0 0 3px ${PINK}18` : "0 1px 4px rgba(0,0,0,0.06)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{p.emoji}</span>
              {p.label}
            </button>
          );
        })}
      </div>

      <div style={{ paddingBottom: 24, flexShrink: 0 }}>
        <PinkButton onClick={onNext} disabled={chosen.length === 0}>
          Continue →
        </PinkButton>
        <BackBtn onClick={onBack} />
      </div>
    </div>
  );
}

// ── Screen 4: What are you looking for ───────────────────────────────────────
function LookingForScreen({
  chosen,
  onToggle,
  onNext,
  onBack,
}: {
  chosen: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div style={screen}>
      <div style={logoRow}>
        <span style={brandMark}>BloomBay</span>
      </div>

      <ProgressDots total={3} current={1} />

      <Heading>
        {"What are "}
        <br />
        {"you "}
        <Pink>looking</Pink>
        <br />
        {"for?"}
      </Heading>
      <Sub>Be honest. There&apos;s no wrong answer here.</Sub>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flex: 1,
        overflowY: "auto",
        marginBottom: 24,
      }}>
        {LOOKING_FOR.map((item) => {
          const active = chosen.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 16px",
                borderRadius: 20,
                border: `1.5px solid ${active ? PINK : CARD_BORDER}`,
                background: active ? `${PINK}08` : WHITE,
                boxShadow: active
                  ? `0 0 0 3px ${PINK}15, 0 2px 8px rgba(255,31,125,0.08)`
                  : "0 2px 8px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: active ? `${PINK}18` : ICON_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
                transition: "background 0.15s",
              }}>
                {item.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: 0,
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: active ? PINK : DARK,
                  lineHeight: 1.3,
                }}>
                  {item.label}
                </p>
                <p style={{
                  margin: "2px 0 0",
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: GRAY,
                  lineHeight: 1.3,
                }}>
                  {item.sub}
                </p>
              </div>

              {/* Check */}
              {active && (
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: PINK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ paddingBottom: 24, flexShrink: 0 }}>
        <PinkButton onClick={onNext} disabled={chosen.length === 0}>
          Continue →
        </PinkButton>
        <BackBtn onClick={onBack} />
      </div>
    </div>
  );
}

// ── Screen 5: Your name + email ───────────────────────────────────────────────
function YourNameScreen({
  phone,
  profession,
  goals,
  onDone,
  onBack,
}: {
  phone: string;
  profession: string[];
  goals: string[];
  onDone: () => void;
  onBack: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail]         = useState("");
  const [city, setCity]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function handleSubmit() {
    if (!firstName.trim() || !email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitToWaitlist({
        signup_type: "member",
        first_name: firstName.trim(),
        email: email.trim(),
        phone,
        city: city.trim(),
        reasons: goals,
        interests: profession,
        founding_mother: false,
      });
      onDone();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: `1.5px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: "14px 16px",
    fontFamily: "var(--font-jost), sans-serif",
    fontSize: 15,
    color: DARK,
    background: WHITE,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 12,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-jost)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: GRAY,
    display: "block",
    marginBottom: 6,
  };

  return (
    <div style={screen}>
      <div style={logoRow}>
        <span style={brandMark}>BloomBay</span>
      </div>

      <ProgressDots total={3} current={2} />

      <div style={{ marginBottom: 28 }}>
        <Heading>
          {"Almost "}
          <Pink>there.</Pink>
        </Heading>
        <Sub>Just a couple more things so we know it&apos;s really you.</Sub>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <label>
          <span style={labelStyle}>First Name</span>
          <input
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          <span style={labelStyle}>Email</span>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          <span style={labelStyle}>City</span>
          <input
            type="text"
            placeholder="e.g. New York, London, Lagos"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </label>

        <p style={{
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontSize: 12,
          color: GRAY,
          margin: "10px 0 24px",
          lineHeight: 1.5,
        }}>
          BloomBay is available in select cities first. We&apos;ll notify you the moment we open in yours.
        </p>
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#E53E3E", textAlign: "center", marginBottom: 8 }}>{error}</p>
      )}

      <div style={{ paddingBottom: 24, flexShrink: 0 }}>
        <PinkButton
          onClick={() => void handleSubmit()}
          disabled={!firstName.trim() || !email.trim() || submitting}
        >
          {submitting ? "Joining…" : "Join the Waitlist →"}
        </PinkButton>
        <BackBtn onClick={onBack} />
      </div>
    </div>
  );
}

// ── Screen 6: Done ────────────────────────────────────────────────────────────
function DoneScreen({ firstName, onHome }: { firstName: string; onHome: () => void }) {
  return (
    <div style={{ ...screen, alignItems: "center", justifyContent: "center", textAlign: "center", gap: 0 }}>
      {/* Petal burst */}
      <div style={{ fontSize: 56, marginBottom: 20, lineHeight: 1 }}>🌸</div>

      <h1 style={{
        fontFamily: "var(--font-playfair), serif",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: 30,
        color: DARK,
        margin: "0 0 12px",
        lineHeight: 1.2,
      }}>
        You&apos;re in,{" "}
        <Pink>{firstName || "beautiful"}</Pink>.
      </h1>

      <p style={{
        fontFamily: "var(--font-playfair), serif",
        fontStyle: "italic",
        fontSize: 15,
        color: GRAY,
        margin: "0 0 8px",
        lineHeight: 1.6,
        maxWidth: 280,
      }}>
        We can&apos;t wait to bloom with you. We&apos;ll be in touch when BloomBay opens in your city.
      </p>
      <p style={{
        fontFamily: "var(--font-playfair), serif",
        fontStyle: "italic",
        fontSize: 14,
        color: PINK,
        margin: "0 0 40px",
      }}>
        See you inside. ♥
      </p>

      {/* Social */}
      <div style={{
        background: WHITE,
        border: `1.5px solid ${CARD_BORDER}`,
        borderRadius: 20,
        padding: "16px 24px",
        width: "100%",
        maxWidth: 320,
        marginBottom: 28,
      }}>
        <p style={{ margin: "0 0 10px", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GRAY }}>
          Follow us while you wait
        </p>
        <a
          href="https://instagram.com/welovebloombay"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-jost)",
            fontSize: 14,
            fontWeight: 600,
            color: DARK,
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 18 }}>📸</span>
          @welovebloombay
        </a>
      </div>

      <button
        type="button"
        onClick={onHome}
        style={{
          background: "transparent",
          border: "none",
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontSize: 14,
          color: GRAY,
          cursor: "pointer",
        }}
      >
        ← Back to homepage
      </button>
    </div>
  );
}

// ── Root: MemberOnboarding ────────────────────────────────────────────────────
export function MemberOnboarding({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const [screen, setScreen]       = useState<Screen>("phone");
  const [phone, setPhone]         = useState("");
  const [profession, setProfession] = useState<string[]>([]);
  const [goals, setGoals]         = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");

  const toggle = (arr: string[], setArr: (v: string[]) => void) => (id: string) =>
    setArr(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);

  switch (screen) {
    case "phone":
      return (
        <PhoneScreen
          onNext={(p) => { setPhone(p); setScreen("otp"); }}
        />
      );

    case "otp":
      return (
        <OtpScreen
          phone={phone}
          onNext={() => setScreen("what-do")}
          onBack={() => setScreen("phone")}
        />
      );

    case "what-do":
      return (
        <WhatDoScreen
          chosen={profession}
          onToggle={toggle(profession, setProfession)}
          onNext={() => setScreen("looking-for")}
          onBack={() => setScreen("otp")}
        />
      );

    case "looking-for":
      return (
        <LookingForScreen
          chosen={goals}
          onToggle={toggle(goals, setGoals)}
          onNext={() => setScreen("your-name")}
          onBack={() => setScreen("what-do")}
        />
      );

    case "your-name":
      return (
        <YourNameScreen
          phone={phone}
          profession={profession}
          goals={goals}
          onDone={() => setScreen("done")}
          onBack={() => setScreen("looking-for")}
        />
      );

    case "done":
      return <DoneScreen firstName={firstName} onHome={onHome} />;
  }
}
