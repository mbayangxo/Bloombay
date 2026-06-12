"use client";

import { useState } from "react";
import Link from "next/link";

const PINK   = "#FF1F7D";
const CREAM  = "#FDF8F2";
const DARK   = "#1C1B1C";

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@keyframes confettiFall1 {
  0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
}
@keyframes confettiFall2 {
  0%   { transform: translateY(-10px) rotate(0deg) translateX(0px); opacity: 0.9; }
  100% { transform: translateY(70px) rotate(-280deg) translateX(12px); opacity: 0; }
}
@keyframes confettiFall3 {
  0%   { transform: translateY(-5px) rotate(45deg); opacity: 1; }
  100% { transform: translateY(55px) rotate(-200deg) translateX(-8px); opacity: 0; }
}
@keyframes envelopeLift {
  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
  50%       { transform: translateY(-4px) rotate(-1.5deg); }
}
@keyframes heartPop {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.25); }
}
.env-float { animation: envelopeLift 3.5s ease-in-out infinite; }
.heart-pop { animation: heartPop 1.8s ease-in-out infinite; }
.c1 { animation: confettiFall1 2.2s ease-in 0.1s infinite; }
.c2 { animation: confettiFall2 2.6s ease-in 0.6s infinite; }
.c3 { animation: confettiFall3 2.0s ease-in 1.1s infinite; }
.c4 { animation: confettiFall1 2.8s ease-in 0.3s infinite; }
.c5 { animation: confettiFall2 2.3s ease-in 0.9s infinite; }
.conf-scroll::-webkit-scrollbar { display: none; }
`;

// ── Types ─────────────────────────────────────────────────────────────────────
type CelebCategory = "all" | "birthday" | "win" | "milestone";

interface Celebration {
  id: number;
  type: "birthday" | "win" | "milestone";
  name: string;
  title: string;
  detail: string;
  month: string;
  day: number;
  hearts: number;
  avatarColor: string;
  avatarInitial: string;
  accentColor: string;
  patternBg?: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CELEBRATIONS: Celebration[] = [
  {
    id: 1, type: "birthday", name: "Sami", title: "Sami's Birthday",
    detail: "Dinner at Casa Cruz · 8:00PM",
    month: "MAY", day: 26, hearts: 12,
    avatarColor: "#FF1F7D", avatarInitial: "S",
    accentColor: "#FF1F7D",
  },
  {
    id: 2, type: "win", name: "Teni", title: "Teni's Promotion",
    detail: "Celebrating the new chapter",
    month: "MAY", day: 30, hearts: 8,
    avatarColor: "#E8006A", avatarInitial: "T",
    accentColor: "#A855F7",
    patternBg: "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 8px)",
  },
  {
    id: 3, type: "milestone", name: "Maya", title: "Maya's New Apartment",
    detail: "Housewarming dinner & girl time",
    month: "JUN", day: 2, hearts: 6,
    avatarColor: "#C80060", avatarInitial: "M",
    accentColor: "#F59E0B",
    patternBg: "repeating-linear-gradient(-45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 8px)",
  },
];

const TYPE_ICON: Record<string, string> = {
  birthday: "🎀",
  win: "✨",
  milestone: "🏠",
};

// ── Confetti pieces (decorative) ──────────────────────────────────────────────
function ConfettiPieces() {
  const pieces = [
    { cls: "c1", color: "#FFB3D9", shape: "rect",  top: 12, left: "8%",   size: 7 },
    { cls: "c2", color: "#FF1F7D", shape: "circle",top: 8,  left: "22%",  size: 5 },
    { cls: "c3", color: "#FFF0A0", shape: "rect",  top: 16, left: "38%",  size: 6 },
    { cls: "c4", color: "#C0F0D8", shape: "circle",top: 10, left: "58%",  size: 4 },
    { cls: "c5", color: "#FFD6F0", shape: "rect",  top: 14, left: "75%",  size: 8 },
    { cls: "c1", color: "#A8E6FF", shape: "circle",top: 6,  left: "88%",  size: 5 },
    { cls: "c3", color: "#FF8EC7", shape: "rect",  top: 20, left: "50%",  size: 5 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
      {pieces.map((p, i) => (
        <div key={i} className={p.cls} style={{
          position: "absolute",
          top: p.top,
          left: p.left,
          width: p.size,
          height: p.shape === "rect" ? p.size * 1.6 : p.size,
          background: p.color,
          borderRadius: p.shape === "circle" ? "50%" : 2,
          opacity: 0.85,
        }} />
      ))}
    </div>
  );
}

// ── Wax Seal ─────────────────────────────────────────────────────────────────
function WaxSeal({ size = 42 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #FF1F7D, #c4005a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 3px 12px rgba(255,31,125,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
      position: "relative",
    }}>
      {/* Decorative ring inside */}
      <div style={{
        width: size * 0.72, height: size * 0.72, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: size * 0.24, color: "white", letterSpacing: "0.03em" }}>BB</span>
      </div>
    </div>
  );
}

// ── Envelope hero ─────────────────────────────────────────────────────────────
function EnvelopeHero() {
  return (
    <div style={{ position: "relative", padding: "20px 18px 0", overflow: "hidden" }}>
      <ConfettiPieces />

      {/* Pink ribbon bow — top left */}
      <div style={{ position: "absolute", top: 12, left: 16, zIndex: 3 }}>
        <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
          <ellipse cx="12" cy="20" rx="11" ry="7" fill="#FF1F7D" opacity="0.9" transform="rotate(-25 12 20)"/>
          <ellipse cx="36" cy="20" rx="11" ry="7" fill="#FF1F7D" opacity="0.9" transform="rotate(25 36 20)"/>
          <circle cx="24" cy="20" r="5" fill="#c4005a"/>
          <line x1="24" y1="24" x2="20" y2="40" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="24" y1="24" x2="28" y2="40" stroke="#FF5BAD" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Headline text */}
      <div style={{ paddingLeft: 52, paddingRight: 8, marginBottom: 18 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 600, color: "rgba(0,0,0,0.45)", lineHeight: 1.4 }}>
          We show up for our girls and
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "32px", fontWeight: 700, color: DARK, lineHeight: 1.05, margin: "2px 0" }}>
          celebrate<br />the moments
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "28px", fontWeight: 700, color: PINK, lineHeight: 1 }}>
          that matter.&nbsp;<span style={{ fontSize: 18 }}>🌸</span>
        </p>
      </div>

      {/* Envelope + photo row */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>

        {/* Envelope */}
        <div className="env-float" style={{ flexShrink: 0, width: 160, position: "relative" }}>
          {/* Envelope body */}
          <svg width="160" height="110" viewBox="0 0 160 110" fill="none">
            {/* Body */}
            <rect x="4" y="22" width="152" height="84" rx="8" fill="#FF1F7D"/>
            <rect x="4" y="22" width="152" height="84" rx="8" fill="url(#env_shade)" opacity="0.15"/>
            {/* Flap */}
            <path d="M4 22 L80 68 L156 22 Z" fill="#E8006A"/>
            {/* Flap fold line */}
            <path d="M4 22 L80 68 L156 22" stroke="#c4005a" strokeWidth="1" opacity="0.4"/>
            {/* Bottom triangle */}
            <path d="M4 106 L80 60 L156 106 Z" fill="#c4005a" opacity="0.35"/>
            {/* Wax seal position indicator */}
            <circle cx="80" cy="72" r="16" fill="#c4005a"/>
            <circle cx="80" cy="72" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <text x="80" y="76" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">BB</text>
            <defs>
              <linearGradient id="env_shade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="black"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Photo card + note card stack */}
        <div style={{ flex: 1, position: "relative", height: 110 }}>

          {/* Photo placeholder — women celebrating */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: 110, height: 90,
            background: "linear-gradient(135deg, #2A0A18 0%, #4A1428 100%)",
            borderRadius: 8,
            border: "3px solid white",
            boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
            transform: "rotate(2.5deg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {/* Silhouette graphic */}
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}/>
                  <div style={{ width: 11, height: 24, borderRadius: "6px 6px 0 0", background: "rgba(255,255,255,0.12)" }}/>
                </div>
              ))}
            </div>
            {/* Wine glass icon */}
            <div style={{ position: "absolute", bottom: 6, right: 6 }}>
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <path d="M2 2 Q2 10 7 12 Q12 10 12 2 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
                <line x1="7" y1="12" x2="7" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <line x1="4" y1="16" x2="10" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              </svg>
            </div>
          </div>

          {/* Handwritten note card */}
          <div style={{
            position: "absolute", bottom: 0, left: 0,
            background: "white",
            borderRadius: 6,
            padding: "8px 10px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            transform: "rotate(-2.5deg)",
            maxWidth: 100,
            border: "1px solid rgba(0,0,0,0.06)",
          }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "11px", color: "#555", lineHeight: 1.45 }}>
              Cheers to<br />the memories<br />we&apos;ll never<br />forget
            </p>
            <div className="heart-pop" style={{ marginTop: 4, fontSize: 14 }}>♡</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Invitation Card ────────────────────────────────────────────────────────────
function InvitationCard({ c }: { c: Celebration }) {
  const [hearted, setHearted] = useState(false);

  return (
    <div style={{
      flexShrink: 0,
      width: 148,
      background: c.patternBg
        ? `${c.patternBg}, white`
        : "white",
      borderRadius: "12px 12px 0 0",
      position: "relative",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)",
      overflow: "visible",
    }}>
      {/* Torn bottom edge */}
      <div style={{
        position: "absolute", bottom: -8, left: 0, right: 0, height: 16,
        background: "white",
        clipPath: "polygon(0% 0%, 4% 100%, 8% 20%, 13% 90%, 18% 10%, 23% 80%, 28% 5%, 33% 85%, 38% 15%, 43% 75%, 48% 5%, 53% 80%, 58% 10%, 63% 90%, 68% 20%, 73% 95%, 78% 15%, 83% 85%, 88% 10%, 93% 90%, 98% 15%, 100% 80%, 100% 0%)",
      }} />
      {c.patternBg && (
        <div style={{
          position: "absolute", bottom: -8, left: 0, right: 0, height: 16,
          backgroundImage: c.patternBg,
          clipPath: "polygon(0% 0%, 4% 100%, 8% 20%, 13% 90%, 18% 10%, 23% 80%, 28% 5%, 33% 85%, 38% 15%, 43% 75%, 48% 5%, 53% 80%, 58% 10%, 63% 90%, 68% 20%, 73% 95%, 78% 15%, 83% 85%, 88% 10%, 93% 90%, 98% 15%, 100% 80%, 100% 0%)",
        }} />
      )}

      {/* Paperclip */}
      <div style={{ position: "absolute", top: -10, left: 20, zIndex: 4 }}>
        <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
          <path d="M8 2 Q14 2 14 8 L14 22 Q14 26 8 26 Q2 26 2 22 L2 8 Q2 4 6 4 L6 22 Q6 24 8 24 Q10 24 10 22 L10 8" stroke="#aaa" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      {/* Type icon + date badge */}
      <div style={{ padding: "18px 12px 0 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          background: `${c.accentColor}18`,
          border: `1.5px solid ${c.accentColor}30`,
          borderRadius: 8, padding: "4px 7px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: c.accentColor, letterSpacing: "0.08em" }}>{c.month}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "18px", fontWeight: 900, color: c.accentColor, lineHeight: 1 }}>{c.day}</span>
        </div>
        <span style={{ fontSize: 20, marginTop: 2 }}>{TYPE_ICON[c.type]}</span>
      </div>

      {/* Avatar */}
      <div style={{ padding: "10px 12px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: `linear-gradient(135deg, ${c.avatarColor}, ${c.avatarColor}BB)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid white",
          boxShadow: `0 3px 10px ${c.avatarColor}44`,
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: "white" }}>{c.avatarInitial}</span>
        </div>
      </div>

      {/* Title + detail */}
      <div style={{ padding: "8px 12px 14px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 14, color: DARK, lineHeight: 1.2, marginBottom: 4 }}>{c.title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.45)", lineHeight: 1.4 }}>{c.detail}</p>
      </div>

      {/* Heart count */}
      <div style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "8px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => setHearted(h => !h)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 5 }}
        >
          <span style={{ fontSize: 16, color: hearted ? PINK : "rgba(0,0,0,0.22)" }}>{hearted ? "♥" : "♡"}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(0,0,0,0.35)" }}>{c.hearts + (hearted ? 1 : 0)}</span>
        </button>
        <div style={{
          background: c.accentColor, borderRadius: 999,
          width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </div>
  );
}

// ── Add card ──────────────────────────────────────────────────────────────────
function AddCelebrationCard() {
  return (
    <Link href="/member/happenings/confetti/new" style={{ textDecoration: "none", flexShrink: 0 }}>
      <div style={{
        width: 130, height: "100%", minHeight: 200,
        background: "rgba(255,31,125,0.04)",
        border: "2px dashed rgba(255,31,125,0.25)",
        borderRadius: 12,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 10, padding: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: PINK, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 14px ${PINK}44`,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: PINK, textAlign: "center", lineHeight: 1.3 }}>Plan something special</p>
      </div>
    </Link>
  );
}

// ── Recently Celebrated strip ─────────────────────────────────────────────────
const RECENT = [
  { label: "Nia's 30th", color: "linear-gradient(135deg,#FF1F7D,#c4005a)", initial: "N" },
  { label: "Sara got the job", color: "linear-gradient(135deg,#A855F7,#7C3AED)", initial: "S" },
  { label: "Zara's book launch", color: "linear-gradient(135deg,#F59E0B,#D97706)", initial: "Z" },
  { label: "Good girls", color: "linear-gradient(135deg,#EC4899,#BE185D)", initial: "G" },
  { label: "Girls trip", color: "linear-gradient(135deg,#06B6D4,#0284C7)", initial: "T" },
];

function RecentStrip() {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 18px", marginBottom: 12 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(0,0,0,0.35)" }}>RECENTLY CELEBRATED</p>
        <span style={{ fontSize: 14 }}>🎊</span>
      </div>
      <div className="conf-scroll" style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" as const }}>
        {RECENT.map((r, i) => (
          <div key={i} style={{
            flexShrink: 0, width: 100, height: 80, position: "relative",
            background: r.color,
            borderRight: "2px solid white",
            display: "flex", alignItems: "flex-end",
            padding: "0 0 6px 8px",
            overflow: "hidden",
          }}>
            {/* Silhouette pattern */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white" }} />
            </div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "11px", color: "white", fontWeight: 700, lineHeight: 1.2, position: "relative", zIndex: 1 }}>{r.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function ConfettiPage() {
  const [category, setCategory] = useState<CelebCategory>("all");

  const CATS: { id: CelebCategory; label: string; icon: string }[] = [
    { id: "all",       label: "All Celebrations", icon: "🎉" },
    { id: "birthday",  label: "Birthdays",         icon: "🎀" },
    { id: "win",       label: "Wins",              icon: "✨" },
    { id: "milestone", label: "Milestones",        icon: "🏆" },
  ];

  const filtered = category === "all"
    ? CELEBRATIONS
    : CELEBRATIONS.filter(c => c.type === category);

  return (
    <div style={{ minHeight: "100vh", background: CREAM, paddingBottom: 110 }}>
      <style>{CSS}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        paddingTop: "env(safe-area-inset-top, 0px)",
        background: "rgba(253,248,242,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,31,125,0.1)",
      }}>
        <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/member/happenings" style={{ display: "flex", alignItems: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: DARK }}>Confetti</p>
            <span style={{ fontSize: 16 }}>🎊</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Gift icon */}
            <div style={{ position: "relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="22" x2="12" y2="7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </div>
            {/* Bell with badge */}
            <div style={{ position: "relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid white" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white" }}>3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ paddingTop: "calc(52px + env(safe-area-inset-top, 0px))" }}>

        {/* Envelope hero */}
        <div style={{
          background: "linear-gradient(160deg, #FFF0F5 0%, #FFE8F2 50%, #FDF8F2 100%)",
          borderBottom: "1px solid rgba(255,31,125,0.08)",
          paddingBottom: 24,
        }}>
          <EnvelopeHero />
        </div>

        {/* ── CATEGORY TABS ── */}
        <div style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "0 4px" }}>
          <div className="conf-scroll" style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, padding: "10px 14px" }}>
            {CATS.map(cat => {
              const active = category === cat.id;
              return (
                <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
                  flexShrink: 0, padding: "8px 14px", borderRadius: 999,
                  border: `1.5px solid ${active ? PINK : "rgba(0,0,0,0.1)"}`,
                  background: active ? PINK : "white",
                  color: active ? "white" : "rgba(0,0,0,0.5)",
                  fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
                  letterSpacing: "0.04em", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  marginRight: 8,
                  boxShadow: active ? `0 4px 14px ${PINK}44` : "none",
                  transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: active ? "scale(1.04)" : "scale(1)",
                }}>
                  <span style={{ fontSize: 12 }}>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── UPCOMING ── */}
        <div style={{ padding: "22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 18px", marginBottom: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(0,0,0,0.35)" }}>UPCOMING</p>
            <span style={{ fontSize: 14 }}>✦</span>
          </div>
          <div className="conf-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", padding: "4px 18px 24px", scrollbarWidth: "none" as const, alignItems: "flex-start" }}>
            {filtered.map(c => <InvitationCard key={c.id} c={c} />)}
            <AddCelebrationCard />
          </div>
        </div>

        {/* ── WAXSEAL + TAGLINE ── */}
        <div style={{ margin: "0 18px 24px", background: "white", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, border: "1px solid rgba(255,31,125,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <WaxSeal size={44} />
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: DARK, lineHeight: 1.4 }}>
              Every milestone deserves a moment.
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: PINK, marginTop: 2 }}>celebrate her →</p>
          </div>
        </div>

        {/* ── RECENTLY CELEBRATED ── */}
        <RecentStrip />
      </div>
    </div>
  );
}
