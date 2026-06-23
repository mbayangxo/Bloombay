"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { logout, updateProfileInfo } from "@/lib/auth/actions";
import { AvatarUpload } from "@/app/components/shared/avatar-upload";
import { createClient } from "@/lib/supabase/client";
import { uploadProfilePhoto } from "@/lib/storage/upload";
import type { AuthUser } from "@/lib/auth/get-user";
import { SocialProofSection } from "./social-proof-section";
import { QuestionSheCaries } from "./question-she-carries";
import { FoundingFlower } from "@/app/components/shared/founding-flower";

const PINK = "#FF1F7D";

type Photo = { id: string; url: string };
type TabId = "profile" | "moments" | "world" | "bloomcode" | "bloomlink" | "links" | "settings";
type TemplateId = "id" | "board" | "zine" | "collage" | "dossier" | "beauty_table" | "notebook" | "magazine" | "solo" | "billboard" | "lookbook" | "moodboard" | "polaroid4" | "fridge" | "about_me" | "photo_dir";

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: { url: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
        </svg>
      </button>

      <p style={{ position: "absolute", top: 24, left: 18, fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
        {idx + 1} / {photos.length}
      </p>

      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "min(440px, calc(100vw - 32px))", padding: "0 16px", boxSizing: "border-box" }}
      >
        <div style={{ position: "relative", width: "100%", maxHeight: "72vh", aspectRatio: "1", overflow: "hidden", borderRadius: 14 }}>
          <Image
            src={photos[idx].url}
            alt=""
            fill
            unoptimized
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {photos.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginTop: 22 }} onClick={e => e.stopPropagation()}>
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 999, border: "none", cursor: "pointer", background: i === idx ? PINK : "rgba(255,255,255,0.22)", transition: "all 0.18s" }}
            />
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ─── Template Props ────────────────────────────────────────────────────────────

type TemplateProps = {
  displayName: string;
  initials: string;
  avatarUrl: string | null;
  neighborhood: string;
  occupation: string;
  sign: string;
  vibe: string;
  archetype: string;
  sheIs: string;
  sigTraits: string;
  luckyCharm: string;
  photos: Photo[];
  onAvatarClick: () => void;
};

// ─── Shared template helpers ───────────────────────────────────────────────────
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
function AptPhotoSlot({ url, initials, w, h, radius = 8, rotate = 0, onClick }: { url: string | null; initials: string; w: number; h: number; radius?: number; rotate?: number; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      style={{ background: "none", border: "none", padding: 0, cursor: onClick ? "pointer" : "default",
        transform: `rotate(${rotate}deg)`, flexShrink: 0, width: w, height: h }}>
      <div style={{ width: w, height: h, borderRadius: radius, overflow: "hidden",
        background: "linear-gradient(135deg,#FFD6EA,#FFABD4)",
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {url
          ? <Image src={url} alt="" fill unoptimized style={{ objectFit: "cover" }} />
          : <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: Math.floor(h * 0.35), color: "rgba(255,31,125,0.45)" }}>{initials}</p>}
      </div>
    </button>
  );
}

// ─── 1. The Dossier ───────────────────────────────────────────────────────────
// Inspired by: Orchideia Dossier mockup (IMG_3655) — clipboard, archetype fields, handwritten values.
function TemplateDossier({ displayName, initials, avatarUrl, neighborhood, archetype, sheIs, sigTraits, luckyCharm, sign, onAvatarClick }: TemplateProps) {
  const rows = [
    { label: "NAME",             value: displayName },
    { label: "ARCHETYPE",        value: archetype || "undiscovered" },
    { label: "SHE IS",           value: sheIs || "the girl who moves the room without realising" },
    { label: "SIGNATURE TRAITS", value: sigTraits || "unapologetically herself" },
    { label: "LUCKY CHARM",      value: luckyCharm || "Books by Toni" },
    { label: "SIGN",             value: sign || "—" },
  ];
  return (
    <div style={{ backgroundImage: PAPER_GRAIN, backgroundSize: "200px 200px", backgroundColor: "#FEFCF7", borderRadius: 16, padding: 0, boxShadow: "0 14px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)", overflow: "hidden", position: "relative" }}>
      {/* Top pink bar */}
      <div style={{ height: 28, background: `linear-gradient(90deg,${PINK},#c4005a,${PINK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 900, letterSpacing: "0.3em", color: "rgba(255,255,255,0.85)" }}>BLOOMBAY DOSSIER ✦ {neighborhood || "NEW YORK CITY"}</p>
      </div>
      {/* Clipboard clip */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: -2 }}>
        <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
          <rect x="8" y="2" width="16" height="12" rx="4" stroke="#999" strokeWidth="2.5" fill="none"/>
          <rect x="13" y="0" width="6" height="6" rx="2" fill="#bbb"/>
        </svg>
      </div>
      {/* Body */}
      <div style={{ padding: "8px 22px 22px" }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
          {/* Photo slot — slightly rotated, white border polaroid style */}
          <div style={{ flexShrink: 0, transform: "rotate(-2.5deg)", background: "white", padding: "6px 6px 18px", boxShadow: "0 4px 18px rgba(0,0,0,0.18)" }}>
            <AptPhotoSlot url={avatarUrl} initials={initials} w={72} h={88} radius={2} onClick={onAvatarClick} />
          </div>
          {/* Dossier ID field */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 4 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.18em", color: "rgba(0,0,0,0.35)" }}>BLOOMBAY MEMBER</p>
            <svg width="80" height="22" viewBox="0 0 80 22" fill="none" style={{ display: "block" }}>
              {Array.from({length: 32}).map((_,i)=>(
                <rect key={i} x={i*2.2} y={i%3===0?2:i%7===0?0:4} width={i%4===0?2:1.2} height={i%3===0?20:i%7===0?22:18} fill="#1C1B1C" opacity={0.5+Math.sin(i)*0.3}/>
              ))}
            </svg>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(0,0,0,0.4)" }}>BB · {displayName.slice(0,4).toUpperCase()} · 2026</p>
          </div>
        </div>
        {/* Fields */}
        {rows.map(r => (
          <div key={r.label} style={{ marginBottom: 9, borderBottom: "1px solid rgba(255,31,125,0.12)", paddingBottom: 8 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.18em", color: "rgba(0,0,0,0.32)", marginBottom: 2 }}>{r.label}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, fontWeight: 600, color: "#1C1B1C", lineHeight: 1.3 }}>{r.value}</p>
          </div>
        ))}
        {/* Flower doodle + BloomBay */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="4" fill={PINK}/>
            <ellipse cx="14" cy="6" rx="3" ry="5" fill="rgba(255,31,125,0.3)"/>
            <ellipse cx="14" cy="22" rx="3" ry="5" fill="rgba(255,31,125,0.3)"/>
            <ellipse cx="6" cy="14" rx="5" ry="3" fill="rgba(255,31,125,0.3)"/>
            <ellipse cx="22" cy="14" rx="5" ry="3" fill="rgba(255,31,125,0.3)"/>
          </svg>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: PINK }}>BloomBay</p>
        </div>
      </div>
    </div>
  );
}

// ─── 2. The Beauty Table ──────────────────────────────────────────────────────
// Inspired by: IMG_3566 — pink card with metal clip, photo left, typewriter fields right.
function TemplateBeautyTable({ displayName, initials, avatarUrl, occupation, vibe, sheIs, onAvatarClick }: TemplateProps) {
  const fields = [
    { q: "WHAT SHE DOES", a: occupation || "building something" },
    { q: "HER WORLD",     a: vibe || "she moves different" },
    { q: "SHE IS",        a: sheIs || "the one they talk about" },
  ];
  return (
    <div style={{ backgroundImage: PAPER_GRAIN, backgroundSize: "200px 200px", backgroundColor: "#FF5BAD", borderRadius: 12, overflow: "hidden", boxShadow: "0 12px 40px rgba(255,31,125,0.35), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
      {/* Clip */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 6, paddingBottom: 2 }}>
        <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
          <rect x="6" y="2" width="16" height="11" rx="4" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
          <rect x="11" y="0" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.5)"/>
        </svg>
      </div>
      {/* THE BEAUTY TABLE label */}
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", padding: "0 18px", marginBottom: 10 }}>THE BEAUTY TABLE//</p>
      {/* Two-column body */}
      <div style={{ display: "flex", gap: 14, padding: "0 18px 20px", alignItems: "flex-start" }}>
        {/* Photo */}
        <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 4, border: "1.5px solid rgba(255,255,255,0.3)" }}>
          <AptPhotoSlot url={avatarUrl} initials={initials} w={80} h={96} radius={7} onClick={onAvatarClick} />
        </div>
        {/* Fields */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 12 }}>{displayName}</p>
          {fields.map(f => (
            <div key={f.q} style={{ marginBottom: 10 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 3, marginBottom: 4 }}>{f.q}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1.4, textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 3. The Notebook ─────────────────────────────────────────────────────────
// Inspired by: IMG_3562/3563 — spiral notebook, grid paper, photos clipped in, stickers.
function TemplateNotebook({ displayName, initials, avatarUrl, sheIs, photos, onAvatarClick }: TemplateProps) {
  const slotPhotos = [avatarUrl, photos[0]?.url ?? null, photos[1]?.url ?? null];
  const rotations = [-2, 1.5, -1];
  const positions = [{ top: 20, left: 16 }, { top: 12, right: 16 }, { bottom: 28, left: "50%", transform: "translateX(-50%)" }];
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 36px rgba(0,0,0,0.16)", minHeight: 320 }}>
      {/* Grid paper background */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(100,149,237,0.15) 19px, rgba(100,149,237,0.15) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(100,149,237,0.15) 19px, rgba(100,149,237,0.15) 20px),
          #FEFCF7
        `,
      }}/>
      {/* Red margin line */}
      <div style={{ position: "absolute", left: 44, top: 0, bottom: 0, width: 2, background: "rgba(220,80,80,0.25)" }}/>
      {/* Spiral binding (left side) */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 44, background: "rgba(240,235,230,0.9)", borderRight: "1px solid rgba(0,0,0,0.08)" }}>
        {Array.from({length: 18}).map((_,i)=>(
          <div key={i} style={{ width: 22, height: 14, borderRadius: "50%", border: "2.5px solid #888", margin: "12px auto 0", background: "transparent" }}/>
        ))}
      </div>
      {/* Content area */}
      <div style={{ position: "relative", paddingLeft: 56, paddingRight: 16, paddingTop: 16, paddingBottom: 20, minHeight: 320 }}>
        {/* Name sticky note */}
        <div style={{ background: PINK, borderRadius: 4, padding: "4px 10px", display: "inline-block", transform: "rotate(-1deg)", marginBottom: 12, boxShadow: "2px 2px 6px rgba(0,0,0,0.15)" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, fontWeight: 700, color: "white" }}>{displayName}</p>
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.5)", marginBottom: 14, lineHeight: 1.5 }}>
          {sheIs || "the girl moving in silence ♡"}
        </p>
        {/* Photos row — polaroid style */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          {slotPhotos.map((url, i) => (
            <div key={i} style={{ background: "white", padding: "5px 5px 14px", boxShadow: "0 3px 12px rgba(0,0,0,0.15)", transform: `rotate(${rotations[i]}deg)`, flexShrink: 0 }}>
              <AptPhotoSlot url={url} initials={initials} w={68} h={72} radius={2} onClick={i === 0 ? onAvatarClick : undefined} />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.4)", textAlign: "center", marginTop: 4, lineHeight: 1 }}>
                {["me ✦", "moments", "vibes"][i]}
              </p>
            </div>
          ))}
        </div>
        {/* Pink clip sticker */}
        <div style={{ position: "absolute", top: 12, right: 20 }}>
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <circle cx="10" cy="10" r="7" stroke={PINK} strokeWidth="2" fill="none"/>
            <rect x="9" y="4" width="2" height="14" rx="1" fill={PINK} opacity="0.5"/>
          </svg>
        </div>
        {/* "With Love Always" text */}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginTop: 6 }}>With Love Always ♡</p>
      </div>
    </div>
  );
}

// ─── 4. The Magazine ─────────────────────────────────────────────────────────
// Inspired by: IMG_3559 — magazine cover, name as issue title, barcode, bold type.
function TemplateZineMag({ displayName, initials, avatarUrl, occupation, vibe, onAvatarClick }: TemplateProps) {
  const memberNum = Math.abs(displayName.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 9000) + 1000;
  return (
    <div style={{ backgroundImage: PAPER_GRAIN, backgroundSize: "200px 200px", backgroundColor: "#1A0010", borderRadius: 14, overflow: "hidden", boxShadow: "0 14px 48px rgba(0,0,0,0.35)" }}>
      {/* Top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${PINK}, #FF69B4, ${PINK})` }}/>
      {/* Category + edition */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 18px 6px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)" }}>BLOOMBAY</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: PINK, letterSpacing: "0.12em" }}>✦ BIRTHDAY EDITION</p>
      </div>
      {/* Name as massive cover title */}
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(28px,8vw,38px)", color: "white", lineHeight: 0.95, padding: "0 18px 12px", letterSpacing: "-0.01em", textTransform: "uppercase" as const }}>
        {displayName}
      </p>
      {/* Photo — center stage */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 18px 16px", position: "relative" }}>
        <div style={{ border: "2.5px solid rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden", width: "100%", aspectRatio: "4/5", background: "rgba(255,255,255,0.06)" }}>
          <AptPhotoSlot url={avatarUrl} initials={initials} w={"100%" as unknown as number} h={"100%" as unknown as number} radius={0} onClick={onAvatarClick} />
        </div>
        {/* Occupation badge */}
        <div style={{ position: "absolute", bottom: 24, left: 26, background: PINK, borderRadius: 4, padding: "4px 10px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "white", letterSpacing: "0.08em" }}>{occupation || "MAIN CHARACTER"}</p>
        </div>
      </div>
      {/* Barcode footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "10px 18px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 1.5, marginBottom: 3 }}>
            {Array.from({length: 36}).map((_,i)=>(
              <div key={i} style={{ width: i%3===0?2.5:1.5, height: 18, background: "rgba(255,255,255,0.55)" }}/>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>MEMBER {memberNum} · {vibe || "THAT GIRL"}</p>
        </div>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: PINK, flexShrink: 0 }}>BB.</p>
      </div>
    </div>
  );
}

// ─── 5. The Solo ─────────────────────────────────────────────────────────────
// Inspired by: IMG_3565 — pink stripes, large italic title, two-panel photo + list.
function TemplateSolo({ displayName, initials, avatarUrl, sheIs, sigTraits, vibe, luckyCharm, onAvatarClick }: TemplateProps) {
  const list = [
    sheIs || "soirée nights & fresh air",
    sigTraits || "unbothered, focused, glowing",
    vibe || "she moves at her own pace",
    luckyCharm || "her presence is the main event",
  ].filter(Boolean);
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 40px rgba(255,31,125,0.25)" }}>
      {/* Pink striped header */}
      <div style={{
        padding: "18px 18px 12px",
        background: `repeating-linear-gradient(180deg, #FF8EC7 0px, #FF8EC7 14px, #FF69B4 14px, #FF69B4 28px)`,
        position: "relative",
      }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>BLOOMBAY · HER WORLD</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(28px,8vw,40px)", fontWeight: 900, color: "white", lineHeight: 0.9, textShadow: "0 2px 16px rgba(200,0,80,0.4)" }}>
          {displayName.split(" ")[0]}—<br />{displayName.split(" ").slice(1).join(" ") || "Date"}
        </p>
      </div>
      {/* Two-panel */}
      <div style={{ display: "flex", background: "#FFF0F8" }}>
        {/* Photo panel */}
        <div style={{ flex: 1, background: "#FFE0F0", padding: "12px 10px 12px 14px", position: "relative" }}>
          <AptPhotoSlot url={avatarUrl} initials={initials} w={"100%" as unknown as number} h={140} radius={10} onClick={onAvatarClick} />
          {/* Labels */}
          {["cutie","queen","✦"].map((lbl, i) => (
            <div key={i} style={{ position: "absolute", top: 18 + i*36, right: i%2===0 ? 4 : "auto", left: i%2===1 ? 2 : "auto", background: "rgba(255,255,255,0.88)", borderRadius: 999, padding: "2px 8px", backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#1C1B1C" }}>{lbl}</p>
            </div>
          ))}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 900, letterSpacing: "0.12em", color: "rgba(255,31,125,0.6)", textAlign: "center", marginTop: 6 }}>RICH GIRLS CLUB</p>
        </div>
        {/* List panel */}
        <div style={{ flex: 1, background: "#1C1B1C", padding: "14px 12px 14px 12px" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 10, fontStyle: "italic" }}>Her life:</p>
          {list.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: PINK, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, color: "white" }}>{i+1}</p>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{item}</p>
            </div>
          ))}
          {/* Heart bottom right */}
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <div style={{ display: "inline-flex", width: 28, height: 28, borderRadius: 8, background: PINK, alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="12" viewBox="0 0 24 22" fill="white"><path d="M12 21s-8.5-6-8.5-12.5C3.5 4.5 7 2 12 6c5-4 8.5-1.5 8.5 2.5C20.5 15 12 21 12 21z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 6. The Billboard ────────────────────────────────────────────────────────
// Inspired by: IMG_3652 — editorial two-panel, photo half / bold type half.
function TemplateBillboard({ displayName, initials, avatarUrl, occupation, vibe, sheIs, onAvatarClick }: TemplateProps) {
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.25)", minHeight: 240 }}>
      {/* Top meta bar */}
      <div style={{ background: "#FFF8F0", padding: "5px 16px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(0,0,0,0.35)" }}>BB+ CREATIVE STUDIO</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(0,0,0,0.3)" }}>(2026)</p>
      </div>
      {/* Two-panel */}
      <div style={{ display: "flex", height: 260 }}>
        {/* Left: photo on pink */}
        <div style={{ flex: 1, background: "#FFB3D9", position: "relative", overflow: "hidden" }}>
          <AptPhotoSlot url={avatarUrl} initials={initials} w={"100%" as unknown as number} h={260} radius={0} onClick={onAvatarClick} />
          {/* Subline */}
          <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "white", lineHeight: 1.4, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              {sheIs || "she built different."}
            </p>
          </div>
        </div>
        {/* Right: dark type panel */}
        <div style={{ flex: 1, background: "#0D0820", padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "clamp(24px,6vw,32px)", fontWeight: 900, color: "white", lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase" as const }}>
              {displayName.split(" ").map((w, i) => (
                <span key={i} style={{ display: "block", color: i === 0 ? "white" : PINK }}>{w}</span>
              ))}
            </p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>{occupation || "main character"}</p>
            <div style={{ height: 1, background: `linear-gradient(90deg, ${PINK}, transparent)`, marginBottom: 8 }}/>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)" }}>
              {vibe?.toUpperCase() || "THAT GIRL"} · BLOOMBAY
            </p>
          </div>
        </div>
      </div>
      {/* Bottom ticker */}
      <div style={{ background: PINK, padding: "4px 0", overflow: "hidden" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.16em", color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }}>
          &nbsp;&nbsp;&nbsp;ASI · SE · VERÍA · TU · MARCA · SI · TRABAJÁRAMOS · JUNTOS · ✦ · BLOOMBAY · ✦ · ASI · SE · VERÍA · TU · MARCA
        </p>
      </div>
    </div>
  );
}

// ─── 0. The ID Card (original) ───────────────────────────────────────────────
function TemplateID({ displayName, initials, avatarUrl, neighborhood, occupation, sign, vibe, onAvatarClick }: TemplateProps) {
  return (
    <div style={{ background: "#FEFCF7", borderRadius: 18, padding: 24, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", position: "relative" }}>
      {/* BLOOMBAY MEMBER label top-left */}
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.35)", marginBottom: 12 }}>BLOOMBAY MEMBER</p>

      {/* Paper clip SVG at top-center */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
          <path d="M14 2 C6 2 2 6 2 10 C2 14 6 16 14 16 C22 16 26 14 26 10 C26 6 22 2 14 2" stroke="#999" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Photo slot centered */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <button
          onClick={onAvatarClick}
          style={{ width: 80, height: 100, borderRadius: 8, overflow: "hidden", border: "none", cursor: "pointer", padding: 0, background: "linear-gradient(135deg, #FFD6EA 0%, #FFABD4 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
        >
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" fill unoptimized style={{ objectFit: "cover" }} />
          ) : (
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 36, color: "rgba(255,31,125,0.5)" }}>{initials}</p>
          )}
        </button>
      </div>

      {/* Form-style labeled rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {[
          { label: "NAME", value: displayName },
          { label: "LIVES IN", value: neighborhood || "New York City" },
          { label: "SIGN", value: sign || "—" },
          { label: "VIBE", value: vibe || "—" },
          { label: "OCCUPATION", value: occupation || "—" },
        ].map(row => (
          <div key={row.label} style={{ display: "flex", alignItems: "baseline", gap: 8, borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 8 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.4)", minWidth: 72, textTransform: "uppercase" as const }}>{row.label}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 600, color: "#1C1B1C" }}>{row.value}</p>
          </div>
        ))}
      </div>

      {/* BloomBay italic script signature right-aligned */}
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: PINK, textAlign: "right" as const }}>BloomBay</p>
    </div>
  );
}

// ─── Template: Board ──────────────────────────────────────────────────────────

function TemplateBoard({ displayName, initials, avatarUrl, photos, onAvatarClick }: TemplateProps) {
  const polaroidPhotos = [
    photos[0]?.url || null,
    photos[1]?.url || null,
    photos[2]?.url || null,
    avatarUrl || null,
  ];
  const rotations = [-2.5, 3, -1.5, 2];
  const polaroidLabels = [displayName, "moments", "vibes", "me"];
  const gradients = [
    "linear-gradient(135deg, #FFD6EA, #FFABD4)",
    "linear-gradient(135deg, #FFB3D9, #FF5BAD)",
    "linear-gradient(135deg, #FFF0F8, #FFD6EA)",
    "linear-gradient(135deg, #FFABD4, #FF1F7D)",
  ];

  return (
    <div style={{ background: "#FFF8F0", padding: 20, borderRadius: 16, position: "relative" }}>
      {/* Top-left: bold BB + drawn heart */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 20, fontWeight: 900, color: "#1C1B1C", letterSpacing: "-0.02em" }}>BB</p>
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
          <path d="M9 14 C9 14 1 9 1 4.5 C1 2.5 2.7 1 5 1 C6.8 1 8.2 2 9 3.2 C9.8 2 11.2 1 13 1 C15.3 1 17 2.5 17 4.5 C17 9 9 14 9 14Z" stroke={PINK} strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* 2x2 polaroid grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {polaroidPhotos.map((url, i) => (
          <button
            key={i}
            onClick={i === 3 ? onAvatarClick : undefined}
            style={{ background: "none", border: "none", padding: 0, cursor: i === 3 ? "pointer" : "default", transform: `rotate(${rotations[i]}deg)` }}
          >
            <div style={{ background: "white", padding: 8, boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
              <div style={{ width: "100%", aspectRatio: "1", background: url ? "transparent" : gradients[i], overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {url ? (
                  <Image src={url} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                ) : (
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 28, color: "rgba(255,31,125,0.4)" }}>{initials}</p>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.45)", textAlign: "center" as const, marginTop: 6 }}>{polaroidLabels[i]}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: 16, color: "#555" }}>you bloom here ✦</p>
        {/* Flower SVG doodle */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="4" fill={PINK} />
          <ellipse cx="14" cy="6" rx="3" ry="5" fill="rgba(255,31,125,0.35)" />
          <ellipse cx="14" cy="22" rx="3" ry="5" fill="rgba(255,31,125,0.35)" />
          <ellipse cx="6" cy="14" rx="5" ry="3" fill="rgba(255,31,125,0.35)" />
          <ellipse cx="22" cy="14" rx="5" ry="3" fill="rgba(255,31,125,0.35)" />
          <ellipse cx="8.5" cy="8.5" rx="3" ry="5" transform="rotate(-45 8.5 8.5)" fill="rgba(255,31,125,0.25)" />
        </svg>
      </div>
    </div>
  );
}

// ─── Template: Zine ───────────────────────────────────────────────────────────

function TemplateZine({ displayName, initials, avatarUrl, onAvatarClick }: TemplateProps) {
  const memberNum = Math.abs(displayName.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 9000) + 1000;

  return (
    <div style={{ background: "linear-gradient(160deg, #FF1F7D, #c4005a)", borderRadius: 16, overflow: "hidden", position: "relative" }}>
      {/* Checkerboard strip */}
      <div style={{ width: "100%", height: 16, overflow: "hidden" }}>
        <svg width="100%" height="16">
          <defs>
            <pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="black" />
              <rect x="8" y="8" width="8" height="8" fill="black" />
            </pattern>
          </defs>
          <rect width="100%" height="16" fill="url(#checker)" opacity="0.35" />
        </svg>
      </div>

      <div style={{ padding: "16px 20px 24px" }}>
        {/* Edition label */}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "32px", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 18, textTransform: "uppercase" as const }}>
          # {displayName}<br />EDITION
        </p>

        {/* Center photo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <button
            onClick={onAvatarClick}
            style={{ width: 160, height: 200, border: "3px solid rgba(255,255,255,0.4)", padding: 0, background: "rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" fill unoptimized style={{ objectFit: "cover" }} />
            ) : (
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 64, color: "rgba(255,255,255,0.5)" }}>{initials}</p>
            )}
          </button>
        </div>

        {/* Barcode label */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: 14 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.28em", color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>BLOOMBAY</p>
          <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} style={{ width: i % 3 === 0 ? 3 : 2, height: 18, background: "rgba(255,255,255,0.7)", borderRadius: 0 }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.12em" }}>MEMBER {memberNum}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.12em" }}>EST. 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template: Collage ────────────────────────────────────────────────────────

function TemplateCollage({ displayName, initials, avatarUrl, vibe, photos, onAvatarClick }: TemplateProps) {
  const swatches = ["#FF1F7D", "#FF5BAD", "#FFB3D9", "#FFD6EA", "#FFF0F8"];
  const days = ["M", "T", "W", "Th", "F", "S", "Su"];
  const today = new Date().getDay();
  const dayMap: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
  const activeDayIdx = dayMap[today] ?? 0;

  return (
    <div style={{ background: "#FAFAFA", borderRadius: 16, border: "2px solid #E0E0E0", overflow: "hidden" }}>
      {/* Notebook rings */}
      <div style={{ background: "#F0F0F0", padding: "10px 20px 8px", display: "flex", justifyContent: "space-around", borderBottom: "1px solid #E0E0E0" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid #BDBDBD", background: "white" }} />
        ))}
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, borderBottom: "1px solid #E0E0E0", paddingBottom: 10 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.04em" }}>
            <span style={{ color: "#aaa", fontWeight: 800, letterSpacing: "0.12em", fontSize: "8px" }}>SUBJECT TOPIC:</span>{" "}
            {displayName}
          </p>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: "#aaa", marginRight: 4 }}>DATE:</p>
            {days.map((d, i) => (
              <span key={d} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: i === activeDayIdx ? 900 : 600, color: i === activeDayIdx ? PINK : "#bbb", textDecoration: i === activeDayIdx ? "underline" : "none" }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Main content row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          {/* Left: main polaroid */}
          <button
            onClick={onAvatarClick}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", transform: "rotate(-2deg)", flexShrink: 0 }}
          >
            <div style={{ background: "white", padding: "6px 6px 22px", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
              <div style={{ width: 140, height: 160, background: "linear-gradient(135deg, #FFD6EA 0%, #FFABD4 100%)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                ) : (
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 48, color: "rgba(255,31,125,0.4)" }}>{initials}</p>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.4)", textAlign: "center" as const, marginTop: 4 }}>{displayName}</p>
            </div>
          </button>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {/* Small polaroid */}
            <div style={{ background: "white", padding: "5px 5px 18px", boxShadow: "0 3px 10px rgba(0,0,0,0.12)", transform: "rotate(1.5deg)" }}>
              <div style={{ width: "100%", height: 110, background: "linear-gradient(135deg, #FFB3D9, #FF5BAD)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {photos[0]?.url ? (
                  <Image src={photos[0].url} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                ) : (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>MOMENTS</p>
                )}
              </div>
            </div>

            {/* Product-card rectangle */}
            <div style={{ background: PINK, borderRadius: 8, padding: "10px 12px", flex: 1 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>VIBE</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: 15, color: "white", lineHeight: 1.3 }}>{vibe || "just blooming ✦"}</p>
            </div>
          </div>
        </div>

        {/* Color swatch strip */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14, borderRadius: 6, overflow: "hidden" }}>
          {swatches.map(c => (
            <div key={c} style={{ flex: 1, height: 12, background: c }} />
          ))}
        </div>

        {/* Bottom: envelope + handwritten text */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* CSS envelope shape */}
          <div style={{ position: "relative", width: 32, height: 22, flexShrink: 0 }}>
            <div style={{ width: 32, height: 22, background: PINK, borderRadius: 2 }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: "11px solid #c4005a" }} />
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: 15, color: "#888" }}>
            sent with love from bloombay ✦
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 11. Lookbook ─────────────────────────────────────────────────────────────
// Inspired by: IMG_3660 — full-bleed fashion photo, floating pink label cards.
function TemplateLookbook({ displayName, initials, avatarUrl, occupation, vibe, neighborhood, sign, photos, onAvatarClick }: TemplateProps) {
  const bgUrl = avatarUrl || photos[0]?.url || null;
  const labels = [
    { text: occupation || "main character", x: "8%",  y: "12%" },
    { text: neighborhood || "NYC",          x: "58%", y: "8%"  },
    { text: sign || "Leo ✦",               x: "68%", y: "58%" },
    { text: vibe || "that girl",            x: "6%",  y: "72%" },
  ];
  return (
    <div
      onClick={onAvatarClick}
      style={{ borderRadius: 16, overflow: "hidden", position: "relative", height: 380, cursor: "pointer", boxShadow: "0 14px 48px rgba(0,0,0,0.28)" }}
    >
      {/* Full-bleed image */}
      <div style={{ position: "absolute", inset: 0, background: bgUrl ? "transparent" : `linear-gradient(135deg, #FFD6EA, ${PINK})` }}>
        {bgUrl && <Image src={bgUrl} alt="" fill unoptimized style={{ objectFit: "cover" }} />}
      </div>
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)" }} />
      {/* Floating pink label cards */}
      {labels.map((lbl, i) => (
        <div key={i} style={{ position: "absolute", left: lbl.x, top: lbl.y, background: "rgba(255,31,125,0.92)", backdropFilter: "blur(8px)", borderRadius: 6, padding: "4px 10px", boxShadow: "0 3px 14px rgba(0,0,0,0.35)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.12em", whiteSpace: "nowrap" as const }}>{lbl.text.toUpperCase()}</p>
        </div>
      ))}
      {/* Name at bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 18px 20px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.25em", color: "rgba(255,31,125,0.85)", marginBottom: 5 }}>BLOOMBAY MEMBER</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 30, fontWeight: 900, color: "white", lineHeight: 1, textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}>{displayName}</p>
      </div>
      {/* Top-right tap hint */}
      <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "5px 10px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em" }}>TAP TO CHANGE ↑</p>
      </div>
    </div>
  );
}

// ─── 12. Moodboard ────────────────────────────────────────────────────────────
// Inspired by: IMG_3650 — scattered polaroid collage, "Simple Beauty" script center.
function TemplateMoodboard({ displayName, initials, avatarUrl, vibe, photos, onAvatarClick }: TemplateProps) {
  const items = [
    { url: avatarUrl,         w: 98,  h: 108, top: 16,  left: 4,   rotate: -3.5, label: displayName, isAvatar: true  },
    { url: photos[0]?.url ?? null, w: 82,  h:  92, top:  8,  left: 130,  rotate:  2,   label: "moments",   isAvatar: false },
    { url: photos[1]?.url ?? null, w: 90,  h: 100, top: 148, left: 22,   rotate: -2,   label: "vibes",     isAvatar: false },
    { url: photos[2]?.url ?? null, w: 78,  h:  88, top: 100, left: 216,  rotate:  3.5, label: "life",      isAvatar: false },
    { url: photos[3]?.url ?? null, w: 86,  h:  96, top: 200, left: 130,  rotate: -1,   label: "her world", isAvatar: false },
  ];
  return (
    <div style={{ background: "#FAF6F0", borderRadius: 16, position: "relative", height: 330, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
      {/* Scattered polaroids */}
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.isAvatar ? onAvatarClick : undefined}
          style={{ position: "absolute", top: item.top, left: item.left, transform: `rotate(${item.rotate}deg)`, background: "none", border: "none", padding: 0, cursor: item.isAvatar ? "pointer" : "default", zIndex: i + 1 }}
        >
          <div style={{ background: "white", padding: "5px 5px 16px", boxShadow: "0 4px 18px rgba(0,0,0,0.16)" }}>
            <div style={{ width: item.w, height: item.h, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #FFD6EA, #FFABD4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.url
                ? <Image src={item.url} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                : <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 28, color: "rgba(255,31,125,0.38)" }}>{initials}</p>}
            </div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.38)", textAlign: "center" as const, marginTop: 3 }}>{item.label}</p>
          </div>
        </button>
      ))}
      {/* Central script card */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(1.5deg)", zIndex: 20, background: "white", padding: "10px 14px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", borderRadius: 1 }}>
        <div style={{ width: 108, height: 112, background: "linear-gradient(135deg, #FFF0F8, #FFD6EA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "rgba(255,31,125,0.45)" }}>BloomBay</p>
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: 17, fontWeight: 700, color: "#1C1B1C", textAlign: "center" as const, marginTop: 6, whiteSpace: "nowrap" as const }}>
          {vibe || "Simple Beauty"}
        </p>
      </div>
    </div>
  );
}

// ─── 13. Polaroid 4 ───────────────────────────────────────────────────────────
// Inspired by: IMG_3653 — clean 2×2 grid of thick-bordered Polaroid frames.
function TemplatePolaroid4({ displayName, initials, avatarUrl, vibe, photos, onAvatarClick }: TemplateProps) {
  const slots = [
    { url: avatarUrl,              label: displayName,   isAvatar: true  },
    { url: photos[0]?.url ?? null, label: "moments",     isAvatar: false },
    { url: photos[1]?.url ?? null, label: "her world",   isAvatar: false },
    { url: photos[2]?.url ?? null, label: vibe || "✦",   isAvatar: false },
  ];
  return (
    <div style={{ background: "#F9F7F5", borderRadius: 16, padding: "20px 16px 16px", boxShadow: "0 6px 24px rgba(0,0,0,0.09)" }}>
      {/* Small brand header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontStyle: "italic", fontSize: 16, color: "rgba(0,0,0,0.35)" }}>moments ✦</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)" }}>BLOOMBAY</p>
      </div>
      {/* 2×2 Polaroid grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {slots.map((slot, i) => (
          <button
            key={i}
            onClick={slot.isAvatar ? onAvatarClick : undefined}
            style={{ background: "none", border: "none", padding: 0, cursor: slot.isAvatar ? "pointer" : "default" }}
          >
            <div style={{ background: "white", padding: "8px 8px 24px", boxShadow: "0 5px 18px rgba(0,0,0,0.14)", borderRadius: 2 }}>
              <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #FFD6EA, #FFABD4)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 }}>
                {slot.url
                  ? <Image src={slot.url} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                  : <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 32, color: "rgba(255,31,125,0.4)" }}>{initials}</p>}
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.4)", textAlign: "center" as const, marginTop: 6, lineHeight: 1 }}>{slot.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Template: Fridge ────────────────────────────────────────────────────────

function TemplateFridge({ displayName, initials, avatarUrl, vibe, photos, onAvatarClick, isOwn }: { displayName: string; initials: string; avatarUrl: string | null; vibe: string; photos: Photo[]; onAvatarClick: () => void; isOwn?: boolean }) {
  if (!isOwn && photos.length === 0 && !vibe) return null;
  const handleStyle: React.CSSProperties = { position: "absolute", left: 12, width: 8, height: 60, borderRadius: 4, background: "linear-gradient(180deg, #E8E8E8, #B0B0B0)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)" };
  return (
    <div style={{ height: 340, position: "relative", background: "#C5D8E4", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}>

      {/* ── Freezer compartment (top 36%) ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "36%", borderBottom: "2px solid rgba(0,0,0,0.12)" }}>
        <div style={{ position: "absolute", ...handleStyle, top: "50%", transform: "translateY(-50%)" }} />
        <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "var(--font-jost)", fontSize: "14px", fontWeight: 300, letterSpacing: "0.45em", color: "rgba(255,255,255,0.55)" }}>SMEG</p>

        {/* Photo booth strip */}
        <div style={{ position: "absolute", top: 18, left: 45, width: 44, borderRadius: 4, background: "white", padding: "2px 2px 2px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
          {photos[0] ? (
            <div style={{ height: 30, overflow: "hidden", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0].url} alt="" style={{ width: "100%", height: 30, objectFit: "cover", display: "block" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[0,1,2].map(i => <div key={i} style={{ height: 9, background: "#D0D0D0", borderRadius: 1 }} />)}
            </div>
          )}
        </div>

        {/* Victoria postcard magnet */}
        <div style={{ position: "absolute", top: 14, right: 55, background: "#FFF8F0", borderRadius: 4, padding: "4px 8px", transform: "rotate(3deg)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <div style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, background: "#CC2222", opacity: 0.5, borderRadius: 1 }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#8B4030", letterSpacing: "0.2em" }}>{displayName.toUpperCase().slice(0,8)}</p>
        </div>

        {/* Pink flower sticker */}
        <div style={{ position: "absolute", top: 28, right: 14, opacity: 0.7 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3" fill="#FF85C8"/>
            {[0,60,120,180,240,300].map((a,i) => {
              const rad = a * Math.PI / 180;
              return <ellipse key={i} cx={9 + 5 * Math.cos(rad)} cy={9 + 5 * Math.sin(rad)} rx="2.5" ry="1.5" fill="#FF85C8" transform={`rotate(${a} ${9 + 5 * Math.cos(rad)} ${9 + 5 * Math.sin(rad)})`}/>;
            })}
          </svg>
        </div>
      </div>

      {/* ── Main fridge door (lower 64%) ── */}
      <div style={{ position: "absolute", top: "36%", left: 0, right: 0, bottom: 0 }}>
        <div style={{ position: "absolute", ...handleStyle, top: "30%" }} />

        {/* 1. Calendar magnet */}
        <div style={{ position: "absolute", top: 18, left: 18, width: 80, background: "white", borderRadius: 6, padding: "5px 6px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          <div style={{ height: 14, background: "linear-gradient(90deg,#F87060,#F59E0B)", borderRadius: "4px 4px 0 0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "white" }}>May</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1.5 }}>
            {Array.from({length: 21}).map((_,i) => <div key={i} style={{ width: 6, height: 6, background: "#F0E8E8", borderRadius: 1 }} />)}
          </div>
        </div>

        {/* 2. Yellow notepad sticky */}
        <div style={{ position: "absolute", top: 16, left: 110, transform: "rotate(2deg)", background: "#FFE082", padding: "6px 8px", borderRadius: 3, boxShadow: "0 3px 8px rgba(0,0,0,0.15)", maxWidth: 80 }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#3A2A10", lineHeight: 1.3 }}>{vibe ? vibe.slice(0,30) : "Make people FEEL"}</p>
        </div>

        {/* 3. B&W photo strip */}
        <div style={{ position: "absolute", top: 14, right: 14, width: 70, background: "white", padding: "3px 3px 3px", boxShadow: "0 3px 10px rgba(0,0,0,0.2)", borderRadius: 3 }}>
          {photos[1] ? (
            <div style={{ height: 55, overflow: "hidden", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[1].url} alt="" style={{ width: "100%", height: 55, objectFit: "cover", filter: "grayscale(60%)", display: "block" }} />
            </div>
          ) : (
            <div style={{ height: 55, background: "linear-gradient(135deg, #2A2A2A, #555)" }} />
          )}
        </div>

        {/* 4. Pink heart sticker */}
        <div style={{ position: "absolute", bottom: 40, right: 30 }}>
          <svg width="24" height="22" viewBox="0 0 24 22" fill="#FF1F7D">
            <path d="M12 21 C12 21 1 13 1 6.5 C1 3.5 3.5 1 6.5 1 C8.8 1 10.7 2.3 12 4.2 C13.3 2.3 15.2 1 17.5 1 C20.5 1 23 3.5 23 6.5 C23 13 12 21 12 21Z"/>
          </svg>
        </div>

        {/* 5. Round button magnet */}
        <div style={{ position: "absolute", bottom: 38, left: 55, width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "white" }}>BB</p>
        </div>

        {/* 6. Orange note */}
        <div style={{ position: "absolute", bottom: 30, left: 14, background: "#FF9800", padding: "5px 7px", borderRadius: 3, transform: "rotate(-2deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", maxWidth: 72 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "white", lineHeight: 1.3 }}>SAVE WATER DRINK VEUVE CLICQUOT</p>
        </div>

        {/* 7. Avatar circle */}
        <button
          onClick={onAvatarClick}
          style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", width: 42, height: 42, borderRadius: "50%", overflow: "hidden", cursor: "pointer", border: "2px solid white", boxShadow: "0 3px 10px rgba(0,0,0,0.2)", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 16, fontWeight: 700, color: "white" }}>{initials}</p>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Template: About Me ────────────────────────────────────────────────────────

function TemplateAboutMe({ displayName, occupation, vibe, sheIs, sigTraits, sign, avatarUrl, photos, onAvatarClick }: { displayName: string; occupation: string; vibe: string; sheIs: string; sigTraits: string; sign: string; avatarUrl: string | null; photos: { id: string; url: string }[]; onAvatarClick: () => void }) {
  const bgPhoto = photos[0]?.url ?? null;
  const bullets = [
    displayName || "Your Name",
    occupation || "What she does",
    sign || "Her sign",
    sheIs || "She is…",
    sigTraits || "Her signature trait",
    vibe || "Her vibe",
  ].filter(Boolean);

  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", background: "#E8E5DF", minHeight: 340 }}>
      {/* B&W photo right half */}
      <div style={{ position: "absolute", inset: 0 }}>
        {bgPhoto ? (
          <img src={bgPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.1)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #4A4A4A, #2A2A2A)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={onAvatarClick}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
            ) : (
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 48 }}>+</span>
            )}
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(232,229,223,0.92) 0%, rgba(232,229,223,0.6) 50%, rgba(0,0,0,0) 100%)" }} />
      </div>

      {/* Torn paper card — left side */}
      <div style={{ position: "relative", zIndex: 2, padding: "28px 20px 24px 22px", maxWidth: "62%", minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Paper clip */}
        <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 3, height: 26, background: "linear-gradient(180deg, #C0C0C0, #A0A0A0)", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />

        {/* Torn paper texture card */}
        <div style={{
          background: "#FEFCF7",
          borderRadius: "2px 6px 4px 2px",
          padding: "22px 16px 18px",
          boxShadow: "2px 3px 12px rgba(0,0,0,0.18), -1px -1px 4px rgba(0,0,0,0.06)",
          position: "relative",
          clipPath: "polygon(0% 0%, 96% 0%, 100% 4%, 98% 100%, 4% 98%, 0% 96%)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.22em", color: "rgba(0,0,0,0.3)", marginBottom: 12, textTransform: "uppercase" }}>ABOUT ME</p>
          <div style={{ width: 28, height: 1.5, background: "#6B4EFF", marginBottom: 12 }} />
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column" as const, gap: 6 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "#1C1B1C", letterSpacing: "0.06em", display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ color: "#6B4EFF", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>•</span>
                {b.toUpperCase()}
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", fontStyle: "italic", color: "#6B4EFF", lineHeight: 1.3 }}>
            and still building…
          </p>
        </div>

        {/* Handwritten note below */}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "#6B4EFF", marginTop: 10, paddingLeft: 4, fontStyle: "italic" }}>
          stay tuned for more!
        </p>
      </div>

      {/* Photo upload tap target */}
      {!bgPhoto && (
        <button onClick={onAvatarClick} style={{ position: "absolute", bottom: 14, right: 14, zIndex: 3, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", borderRadius: 12, padding: "6px 12px", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#1C1B1C", letterSpacing: "0.1em" }}>
          + ADD PHOTO
        </button>
      )}
    </div>
  );
}

// ─── 16. Photo Direction ─────────────────────────────────────────────────────
function TemplatePhotoDir({ displayName, occupation, vibe, photos, avatarUrl, onAvatarClick }: TemplateProps) {
  const look1 = photos[0]?.url ?? avatarUrl ?? null;
  const look2 = photos[1]?.url ?? null;
  return (
    <div style={{ background: "#F7F3EE", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
      {/* Season label */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 16px 8px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", color: "#999", textTransform: "uppercase" as const }}>
          SPRING / SUMMER 2025 · PHOTO DIRECTION
        </p>
      </div>
      {/* Two photos */}
      <div style={{ display: "flex", gap: 8, padding: "0 10px", height: 230 }}>
        {/* Look 01 */}
        <div
          onClick={onAvatarClick}
          style={{ flex: 1.15, position: "relative", borderRadius: 6, overflow: "hidden", background: "linear-gradient(135deg,#E8E0D8,#D8D0C8)", cursor: "pointer" }}
        >
          {look1 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={look1} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          )}
          <span style={{ position: "absolute", top: 12, left: 14, fontFamily: "var(--font-caveat)", fontSize: 15, color: "white", fontStyle: "italic", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>Look 01</span>
        </div>
        {/* Look 02 */}
        <div
          onClick={onAvatarClick}
          style={{ flex: 0.85, position: "relative", borderRadius: 6, overflow: "hidden", background: "linear-gradient(135deg,#D0C8C0,#C0B8B0)", cursor: "pointer" }}
        >
          {look2 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={look2} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>+ add photo</p>
            </div>
          )}
          <span style={{ position: "absolute", bottom: 14, right: 12, fontFamily: "var(--font-caveat)", fontSize: 15, color: "white", fontStyle: "italic", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>Look 02</span>
        </div>
      </div>
      {/* Caption row */}
      <div style={{ padding: "14px 16px 18px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.08em", color: "#1A1A1A", textTransform: "uppercase" as const, marginBottom: 5 }}>
            {displayName || "YOUR NAME"}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#888", lineHeight: 1.55, maxWidth: 220 }}>
            {occupation || vibe || "BloomBay Member"}
          </p>
        </div>
        {/* Pagination dots */}
        <div style={{ display: "flex", gap: 5, paddingBottom: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === 0 ? "#1A1A1A" : "#CCC" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Template Picker + Active Template ───────────────────────────────────────

function TemplatePicker({ templateId, setTemplateId }: { templateId: TemplateId; setTemplateId: (id: TemplateId) => void }) {
  const templates: { id: TemplateId; label: string; bg: string; textColor: string }[] = [
    { id: "id",           label: "ID",       bg: "#FEFCF7", textColor: "#888" },
    { id: "board",        label: "BOARD",    bg: "#FFF8F0", textColor: "#555" },
    { id: "zine",         label: "ZINE",     bg: "#FF1F7D", textColor: "white" },
    { id: "collage",      label: "COLLAGE",  bg: "#FAFAFA", textColor: "#888" },
    { id: "dossier",      label: "DOSSIER",  bg: "#FEFCF7", textColor: "#FF1F7D" },
    { id: "beauty_table", label: "BEAUTY",   bg: "#FF5BAD", textColor: "white" },
    { id: "notebook",     label: "NOTEBOOK", bg: "#FEFCF7", textColor: "#555" },
    { id: "magazine",     label: "MAG",      bg: "#1A0010", textColor: "#FF1F7D" },
    { id: "solo",         label: "SOLO",     bg: "#FF8EC7", textColor: "white" },
    { id: "billboard",    label: "BILLBOARD",bg: "#0D0820", textColor: "#FF1F7D" },
    { id: "lookbook",     label: "LOOKBOOK", bg: "#1A1A1A", textColor: "#FF1F7D" },
    { id: "moodboard",    label: "MOOD",     bg: "#FAF6F0", textColor: "#555" },
    { id: "polaroid4",    label: "POLAROID", bg: "#F9F7F5", textColor: "#888" },
    { id: "fridge",       label: "FRIDGE",   bg: "#C5D8E4", textColor: "#555" },
    { id: "about_me",     label: "ABOUT ME",  bg: "#E8E5DF", textColor: "#6B4EFF" },
    { id: "photo_dir",    label: "PHOTO DIR", bg: "#F7F3EE", textColor: "#1A1A1A" },
  ];

  return (
    <div style={{ display: "flex", overflowX: "auto", gap: 10, padding: "16px 18px 12px", scrollbarWidth: "none" as const }}>
      {templates.map(t => (
        <button
          key={t.id}
          onClick={() => setTemplateId(t.id)}
          style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <div style={{ width: 64, height: 80, borderRadius: 10, background: t.bg, border: `2px solid ${templateId === t.id ? PINK : "transparent"}`, boxShadow: templateId === t.id ? `0 0 0 1px ${PINK}` : "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: t.textColor, letterSpacing: "0.12em" }}>{t.label}</p>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: templateId === t.id ? 800 : 600, color: templateId === t.id ? PINK : "rgba(0,0,0,0.35)", letterSpacing: "0.1em" }}>{t.label}</p>
        </button>
      ))}
    </div>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export function ProfilePage({ user, defaultTab }: { user: AuthUser; defaultTab?: TabId }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar_url ?? null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [worldPhotos, setWorldPhotos] = useState<Photo[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadingWorldCount, setUploadingWorldCount] = useState(0);
  const [removing, setRemoving] = useState<string | null>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const [firstName, setFirstName] = useState(user.full_name || user.first_name || "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [neighborhoodEdit, setNeighborhoodEdit] = useState(user.neighborhood || user.borough || "");
  const [bioEdit, setBioEdit] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [emailEdit, setEmailEdit] = useState(user.email ?? "");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>(defaultTab ?? "profile");
  const [bloomCodeCopied, setBloomCodeCopied] = useState(false);
  const [bloomLinkCopied, setBloomLinkCopied] = useState(false);

  // Template state
  const [templateId, setTemplateId] = useState<TemplateId>("id");

  // Profile extra fields
  const [occupation, setOccupation] = useState("");
  const [sign, setSign] = useState("");
  const [vibe, setVibe] = useState("");
  const [archetype, setArchetype] = useState("");
  const [sheIs, setSheIs] = useState("");
  const [sigTraits, setSigTraits] = useState("");
  const [luckyCharm, setLuckyCharm] = useState("");
  const [extraSaved, setExtraSaved] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizeSaved, setCustomizeSaved] = useState(false);
  const [templateAccent, setTemplateAccent] = useState("#FF1F7D");
  const [templateFontKey, setTemplateFontKey] = useState("playfair");
  const [voiceNotes, setVoiceNotes] = useState<{ id: string; url: string; label: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Socials state
  const [socials, setSocials] = useState({ instagram: "", tiktok: "", twitter: "", pinterest: "", spotify: "", website: "" });
  const [showSocials, setShowSocials] = useState(false);
  const [socialsSaved, setSocialsSaved] = useState(false);

  // Notification preferences
  const [notifHappenings, setNotifHappenings] = useState(true);
  const [notifClubs,      setNotifClubs]      = useState(true);
  const [notifMessages,   setNotifMessages]   = useState(true);
  const [notifFlowers,    setNotifFlowers]    = useState(true);
  const [notifReminders,  setNotifReminders]  = useState(false);

  // Contact Us
  const [contactMsg,     setContactMsg]     = useState("");
  const [contactSent,    setContactSent]    = useState(false);
  const [contactBusy,    setContactBusy]    = useState(false);

  // Report a user
  const [reportUser,     setReportUser]     = useState("");
  const [reportReason,   setReportReason]   = useState("");
  const [reportSent,     setReportSent]     = useState(false);

  // Block
  const [blockInput,     setBlockInput]     = useState("");
  const [blockedUsers,   setBlockedUsers]   = useState<string[]>([]);

  // Delete account
  const [deleteConfirm,  setDeleteConfirm]  = useState("");
  const [deleteOpen,     setDeleteOpen]     = useState(false);

  // Character stats
  const [stats, setStats] = useState<{ clubs: number; events: number } | null>(null);

  // Avatar upload ref for template clicks
  const avatarUploadRef = useRef<HTMLDivElement>(null);

  const addInputRef = useRef<HTMLInputElement>(null);
  const addWorldInputRef = useRef<HTMLInputElement>(null);

  // Derived values
  const displayName = user.full_name || user.first_name || user.email?.split("@")[0] || "Member";
  const initials = (user.first_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  const memberNumber = user.id.slice(-4).toUpperCase();
  const bloomCode = `BB-${user.id.slice(0, 4).toUpperCase()}`;
  const username = user.email?.split("@")[0] ?? "member";
  const isFounder = user.role === "founder" || user.role === "admin";

  // Date display: JUNE 2026 style from current date
  const now = new Date();
  const monthNames = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  const monthShortNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  // Member since
  const memberSince = `${monthShortNames[0]} 2026`;

  // All photos for lightbox: avatar first, then gallery
  const allPhotos = [
    ...(avatarUrl ? [{ url: avatarUrl }] : []),
    ...photos.map(p => ({ url: p.url })),
  ];

  // Load data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTemplate = localStorage.getItem("bb_template_id") as TemplateId | null;
    if (savedTemplate) setTemplateId(savedTemplate);

    const savedExtra = localStorage.getItem(`bb_profile_extra_${user.id}`);
    if (savedExtra) {
      try {
        const parsed = JSON.parse(savedExtra);
        setOccupation(parsed.occupation ?? "");
        setSign(parsed.sign ?? "");
        setVibe(parsed.vibe ?? "");
        setArchetype(parsed.archetype ?? "");
        setSheIs(parsed.sheIs ?? "");
        setSigTraits(parsed.sigTraits ?? "");
        setLuckyCharm(parsed.luckyCharm ?? "");
      } catch {}
    }

    const savedSocials = localStorage.getItem(`bb_socials_${user.id}`);
    if (savedSocials) {
      try {
        const parsed = JSON.parse(savedSocials);
        setSocials(prev => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, [user.id]);

  // Load socials from DB (authoritative source, overrides localStorage)
  useEffect(() => {
    createClient()
      .from("profiles")
      .select("instagram, tiktok, twitter, pinterest, spotify, website, show_socials")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setSocials({
          instagram: (data as Record<string, unknown>).instagram as string ?? "",
          tiktok:    (data as Record<string, unknown>).tiktok    as string ?? "",
          twitter:   (data as Record<string, unknown>).twitter   as string ?? "",
          pinterest: (data as Record<string, unknown>).pinterest as string ?? "",
          spotify:   (data as Record<string, unknown>).spotify   as string ?? "",
          website:   (data as Record<string, unknown>).website   as string ?? "",
        });
        setShowSocials(Boolean((data as Record<string, unknown>).show_socials));
      });
  }, [user.id]);

  // Save template to localStorage
  function handleSetTemplate(id: TemplateId) {
    setTemplateId(id);
    if (typeof window !== "undefined") localStorage.setItem("bb_template_id", id);
  }

  useEffect(() => {
    createClient()
      .from("profile_photos")
      .select("id, url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setPhotos(data as Photo[]); });
  }, [user.id]);

  useEffect(() => {
    const sb = createClient();
    Promise.all([
      sb.from("club_memberships").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      sb.from("seat_reservations").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "reserved"),
    ]).then(([clubs, events]) => {
      setStats({ clubs: clubs.count ?? 0, events: events.count ?? 0 });
    });
  }, [user.id]);

  function openLightbox(index: number) {
    setLightboxStart(index);
    setLightboxOpen(true);
  }

  async function handleAddPhotos(files: FileList) {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    setUploadingCount(valid.length);
    const supabase = createClient();
    await Promise.all(valid.map(async (file) => {
      try {
        const url = await uploadProfilePhoto(file, user.id);
        const { data } = await supabase
          .from("profile_photos")
          .insert({ user_id: user.id, url })
          .select("id, url")
          .single();
        if (data) setPhotos(prev => [...prev, data as Photo]);
      } finally {
        setUploadingCount(n => n - 1);
      }
    }));
  }

  async function removePhoto(photo: Photo) {
    setRemoving(photo.id);
    const supabase = createClient();
    try {
      const parts = new URL(photo.url).pathname.split("/profile-photos/");
      if (parts[1]) await supabase.storage.from("profile-photos").remove([parts[1]]);
      await supabase.from("profile_photos").delete().eq("id", photo.id);
    } finally {
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      setRemoving(null);
    }
  }

  async function handleAddWorldPhotos(files: FileList) {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    setUploadingWorldCount(valid.length);
    const supabase = createClient();
    await Promise.all(valid.map(async (file) => {
      try {
        const url = await uploadProfilePhoto(file, user.id);
        const { data } = await supabase
          .from("profile_photos")
          .insert({ user_id: user.id, url })
          .select("id, url")
          .single();
        if (data) setWorldPhotos(prev => [...prev, data as Photo]);
      } finally {
        setUploadingWorldCount(n => n - 1);
      }
    }));
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    const fd = new FormData();
    fd.append("first_name", firstName);
    fd.append("phone", phone);
    fd.append("neighborhood", neighborhoodEdit);
    fd.append("bio", bioEdit);
    const result = await updateProfileInfo(fd);
    setSaving(false);
    setSaveMsg(result.error
      ? { ok: false, text: result.error }
      : { ok: true, text: "Profile updated!" }
    );
  }

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    if (emailEdit.trim() === user.email) {
      setEmailMsg({ ok: false, text: "That is already your email." });
      return;
    }
    setEmailBusy(true);
    setEmailMsg(null);
    const { error } = await createClient().auth.updateUser({ email: emailEdit.trim() });
    setEmailBusy(false);
    setEmailMsg(error
      ? { ok: false, text: error.message }
      : { ok: true, text: "Check your new email for a verification link." }
    );
  }

  function copyToClipboard(text: string, type: "bloomcode" | "bloomlink") {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "bloomcode") {
        setBloomCodeCopied(true);
        setTimeout(() => setBloomCodeCopied(false), 2000);
      } else {
        setBloomLinkCopied(true);
        setTimeout(() => setBloomLinkCopied(false), 2000);
      }
    });
  }

  function handleSaveExtra() {
    if (typeof window !== "undefined") {
      localStorage.setItem(`bb_profile_extra_${user.id}`, JSON.stringify({ occupation, sign, vibe, archetype, sheIs, sigTraits, luckyCharm }));
    }
    setExtraSaved(true);
    setTimeout(() => setExtraSaved(false), 2000);
  }

  async function handleSaveSocials() {
    if (typeof window !== "undefined") {
      localStorage.setItem(`bb_socials_${user.id}`, JSON.stringify(socials));
    }
    await fetch("/api/member/socials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...socials, show_socials: showSocials }),
    });
    setSocialsSaved(true);
    setTimeout(() => setSocialsSaved(false), 2000);
  }

  function handleAvatarClick() {
    // Trigger AvatarUpload click via the hidden button in the polaroid header
    const btn = document.getElementById("avatar-upload-trigger");
    if (btn) btn.click();
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "profile",   label: "Profile" },
    { id: "moments",   label: "Moments" },
    { id: "world",     label: "World" },
    { id: "bloomcode", label: "Bloom Code" },
    { id: "bloomlink", label: "Bloom Link" },
    { id: "links",     label: "Links" },
    { id: "settings",  label: "Settings" },
  ];

  const neighborhood = user.neighborhood || user.borough || "";

  // Portal links based on role
  const portalLinks: { label: string; href: string }[] = [];
  if (user.role === "club_owner" || user.role === "founder") portalLinks.push({ label: "Club Mama Portal", href: "/club-owner/dashboard" });
  if (user.role === "partner") portalLinks.push({ label: "Partner Portal", href: "/partner/dashboard" });
  if (user.role === "curator") portalLinks.push({ label: "Curator Portal", href: "/curator/dashboard" });
  if (user.role === "admin") portalLinks.push({ label: "Admin Portal", href: "/admin/dashboard" });
  if (user.role === "founder") portalLinks.push({ label: "Founder Dashboard", href: "/admin/dashboard" });

  const templateProps: TemplateProps = {
    displayName,
    initials,
    avatarUrl,
    neighborhood,
    occupation,
    sign,
    vibe,
    archetype,
    sheIs,
    sigTraits,
    luckyCharm,
    photos,
    onAvatarClick: handleAvatarClick,
  };

  /* ── render ─────────────────────────────────── */

  return (
    <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)", minHeight: "100vh", paddingBottom: 120 }}>

      {/* ══════════════════════════ PORTFOLIO HEADER ══════════════════════════ */}
      <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 40%, #FFF5EC 80%, #FFF0F8 100%)", padding: "20px 18px 0", position: "relative" }}>

        {/* Top bar: month/year + member number */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,31,125,0.5)" }}>
            {currentMonthYear}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,31,125,0.5)" }}>
            MEMBER #{memberNumber}
          </p>
        </div>

        {/* Main row: text left + polaroid right */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>

          {/* Left: name + location + cards + badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 34, color: "#1C1B1C", lineHeight: 1.1, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayName}.
            </p>

            {isFounder && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, marginBottom: 4 }}>
                <FoundingFlower size={18} />
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#111" }}>
                  FOUNDING MEMBER
                </span>
              </div>
            )}

            {(user.neighborhood || user.borough) ? (
              <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 14, letterSpacing: "0.03em" }}>
                {user.neighborhood}{user.borough ? ` · ${user.borough}` : ""}
              </p>
            ) : (
              <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: 11, color: "rgba(0,0,0,0.3)", marginBottom: 14 }}>
                New York City
              </p>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, background: "white", border: "1px solid rgba(255,31,125,0.1)", borderRadius: 14, padding: "10px 12px", boxShadow: "0 4px 18px rgba(255,31,125,0.08)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.35)", marginBottom: 3 }}>MEMBER SINCE</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#1C1B1C" }}>{memberSince}</p>
              </div>
              <div style={{ flex: 1, background: "rgba(255,31,125,0.06)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 14, padding: "10px 12px", boxShadow: "0 4px 18px rgba(255,31,125,0.08)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,31,125,0.6)", marginBottom: 3 }}>STATUS</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK }}>
                  {isFounder ? "Founding" : (user.verification_status === "verified" ? "Verified" : "Active")}
                </p>
              </div>
            </div>

            {stats !== null && (
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1, background: "white", border: "1px solid rgba(255,31,125,0.1)", borderRadius: 14, padding: "10px 12px", boxShadow: "0 4px 18px rgba(255,31,125,0.08)" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.35)", marginBottom: 3 }}>CLUBS</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#1C1B1C" }}>{stats.clubs}</p>
                </div>
                <div style={{ flex: 1, background: "rgba(255,31,125,0.06)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 14, padding: "10px 12px", boxShadow: "0 4px 18px rgba(255,31,125,0.08)" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,31,125,0.6)", marginBottom: 3 }}>EVENTS</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK }}>{stats.events}</p>
                </div>
              </div>
            )}

            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#1C1B1C", borderRadius: 999, padding: "6px 14px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: "white" }}>
                ✦ {isFounder ? "FOUNDING MEMBER" : "MEMBER"}
              </span>
            </div>
          </div>

          {/* Right: polaroid card with hidden avatar upload trigger */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ background: "white", borderRadius: 16, padding: "8px 8px 18px", boxShadow: "0 6px 24px rgba(255,31,125,0.12)", width: 88, position: "relative" }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, background: "linear-gradient(135deg, #FFD6EA 0%, #FFABD4 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 10, position: "relative" }}>
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                ) : (
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 32, color: "rgba(255,31,125,0.5)" }}>{initials}</p>
                )}
              </div>
              <div id="avatar-upload-trigger-wrapper" style={{ position: "absolute", bottom: 20, right: 4 }} onClick={e => e.stopPropagation()} ref={avatarUploadRef}>
                <AvatarUpload userId={user.id} currentUrl={avatarUrl} initials={initials} size={24} onUpdate={url => setAvatarUrl(url)} />
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.5)", textAlign: "center", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingLeft: 2, paddingRight: 2 }}>
                {displayName}
              </p>
            </div>
          </div>

        </div>

        {/* Template Picker */}
        <TemplatePicker templateId={templateId} setTemplateId={handleSetTemplate} />

        {/* Active Template rendered full-width */}
        <div style={{ padding: "0 0 24px" }}>
          {templateId === "id" && <TemplateID {...templateProps} />}
          {templateId === "board" && <TemplateBoard {...templateProps} />}
          {templateId === "zine" && <TemplateZine {...templateProps} />}
          {templateId === "collage" && <TemplateCollage {...templateProps} />}
          {templateId === "dossier" && <TemplateDossier {...templateProps} />}
          {templateId === "beauty_table" && <TemplateBeautyTable {...templateProps} />}
          {templateId === "notebook" && <TemplateNotebook {...templateProps} />}
          {templateId === "magazine" && <TemplateZineMag {...templateProps} />}
          {templateId === "solo" && <TemplateSolo {...templateProps} />}
          {templateId === "billboard" && <TemplateBillboard {...templateProps} />}
          {templateId === "lookbook"  && <TemplateLookbook  {...templateProps} />}
          {templateId === "moodboard" && <TemplateMoodboard {...templateProps} />}
          {templateId === "polaroid4" && <TemplatePolaroid4 {...templateProps} />}
          {templateId === "fridge" && <TemplateFridge displayName={templateProps.displayName} initials={templateProps.initials} avatarUrl={templateProps.avatarUrl} vibe={templateProps.vibe} photos={templateProps.photos} onAvatarClick={templateProps.onAvatarClick} isOwn={true} />}
          {templateId === "about_me" && <TemplateAboutMe displayName={templateProps.displayName} occupation={templateProps.occupation} vibe={templateProps.vibe} sheIs={templateProps.sheIs} sigTraits={templateProps.sigTraits} sign={templateProps.sign} avatarUrl={templateProps.avatarUrl} photos={templateProps.photos} onAvatarClick={templateProps.onAvatarClick} />}
          {templateId === "photo_dir" && <TemplatePhotoDir {...templateProps} />}
        </div>

      </div>

      {/* ══════════════════════════ CUSTOMIZE YOUR APARTMENT ══════════════════════════ */}
      {(() => {
        const TEMPLATE_FIELDS: Record<string, string[]> = {
          id:           ["occupation", "sign", "vibe"],
          board:        ["photos", "voice"],
          zine:         ["voice"],
          collage:      ["vibe", "photos", "voice"],
          dossier:      ["archetype", "sheIs", "sigTraits", "luckyCharm", "sign"],
          beauty_table: ["occupation", "vibe", "sheIs"],
          notebook:     ["sheIs", "photos", "voice"],
          magazine:     ["occupation", "vibe"],
          solo:         ["sheIs", "sigTraits", "vibe", "luckyCharm"],
          billboard:    ["occupation", "vibe", "sheIs"],
          lookbook:     ["occupation", "vibe", "sign", "photos"],
          moodboard:    ["vibe", "photos", "voice"],
          polaroid4:    ["vibe", "photos"],
          fridge:       ["photos", "vibe", "voice"],
          about_me:     ["occupation", "sign", "vibe", "sheIs", "sigTraits", "photos"],
          photo_dir:    ["occupation", "vibe", "photos"],
        };
        const FIELD_LABELS: Record<string, string> = {
          occupation: "WHAT SHE DOES",
          sign:       "HER SIGN",
          vibe:       "VIBE / TAGLINE",
          archetype:  "ARCHETYPE",
          sheIs:      "SHE IS",
          sigTraits:  "SIGNATURE TRAITS",
          luckyCharm: "LUCKY CHARM",
        };
        const fieldValueMap: Record<string, { value: string; set: (v: string) => void }> = {
          occupation: { value: occupation, set: setOccupation },
          sign:       { value: sign,       set: setSign },
          vibe:       { value: vibe,       set: setVibe },
          archetype:  { value: archetype,  set: setArchetype },
          sheIs:      { value: sheIs,      set: setSheIs },
          sigTraits:  { value: sigTraits,  set: setSigTraits },
          luckyCharm: { value: luckyCharm, set: setLuckyCharm },
        };
        const activeFields = TEMPLATE_FIELDS[templateId] ?? [];
        const textFields = activeFields.filter(f => f !== "photos" && f !== "voice");
        const usesPhotos = activeFields.includes("photos");
        const usesVoice = activeFields.includes("voice");
        const hasFields = usesPhotos || usesVoice || textFields.length > 0;

        return (
          <div style={{ margin: "0 0 0", padding: "0 16px 12px" }}>
            {/* Header row */}
            <button
              onClick={() => setCustomizeOpen(o => !o)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer", padding: "10px 0 8px",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", color: "#FF1F7D" }}>
                ✏ CUSTOMIZE YOUR APARTMENT
              </span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,31,125,0.5)", letterSpacing: "0.06em" }}>
                {customizeOpen ? "▲ CLOSE" : "▼ EDIT"}
              </span>
            </button>

            {customizeOpen && (
              <div style={{
                background: "#FFFBF7",
                border: "1px solid rgba(255,31,125,0.12)",
                borderRadius: 20,
                padding: 16,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {!hasFields && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(0,0,0,0.35)", textAlign: "center", padding: "8px 0" }}>
                    This template has no customizable fields.
                  </p>
                )}

                {/* Color + Font picker */}
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,31,125,0.6)", marginBottom: 8 }}>
                    COLOR &amp; FONT
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 10 }}>
                    {["#FF1F7D","#E8006A","#A855F7","#7C3AED","#F59E0B","#06B6D4","#10B981","#EF4444","#1C1B1C","#4B5563","#C0392B","#2C3E50","#E67E22","#27AE60","#8E44AD"].map(c => (
                      <button
                        key={c}
                        onClick={() => setTemplateAccent(c)}
                        style={{
                          width: 24, height: 24, borderRadius: "50%", background: c, border: "none",
                          cursor: "pointer", flexShrink: 0,
                          boxShadow: templateAccent === c ? `0 0 0 2.5px white, 0 0 0 4px ${c}` : "none",
                          transition: "box-shadow 0.15s",
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={templateAccent}
                      onChange={e => setTemplateAccent(e.target.value)}
                      style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.12)", padding: 0, cursor: "pointer", flexShrink: 0 }}
                      title="Custom color"
                    />
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                    {[
                      { key: "playfair", label: "Playfair",  family: "var(--font-playfair)" },
                      { key: "fraunces", label: "Fraunces",  family: "var(--font-fraunces)" },
                      { key: "jost",     label: "Jost",      family: "var(--font-jost)" },
                      { key: "caveat",   label: "Caveat",    family: "var(--font-caveat)" },
                    ].map(f => (
                      <button
                        key={f.key}
                        onClick={() => setTemplateFontKey(f.key)}
                        style={{
                          padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                          background: templateFontKey === f.key ? "#FF1F7D" : "rgba(255,31,125,0.06)",
                          border: templateFontKey === f.key ? "none" : "1px solid rgba(255,31,125,0.2)",
                          display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 2,
                        }}
                      >
                        <span style={{ fontFamily: f.family, fontSize: 16, color: templateFontKey === f.key ? "white" : "#1C1B1C", lineHeight: 1 }}>Aa</span>
                        <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.1em", color: templateFontKey === f.key ? "white" : "rgba(0,0,0,0.4)" }}>{f.label.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo slots */}
                {usesPhotos && (
                  <div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,31,125,0.6)", marginBottom: 8 }}>
                      PHOTOS
                    </p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const }}>
                      {photos.slice(0, 4).map(ph => (
                        <div key={ph.id} style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", border: "1.5px solid rgba(255,31,125,0.15)", flexShrink: 0, position: "relative" }}>
                          <img src={ph.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                      <button
                        onClick={() => addInputRef.current?.click()}
                        style={{
                          width: 60, height: 60, borderRadius: 10, flexShrink: 0,
                          border: "1.5px dashed rgba(255,31,125,0.35)",
                          background: "rgba(255,31,125,0.04)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", color: "#FF1F7D",
                          fontFamily: "var(--font-jost)", fontSize: 22, fontWeight: 300,
                        }}
                      >+</button>
                    </div>
                  </div>
                )}

                {/* Voice note recorder */}
                {usesVoice && (
                  <div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,31,125,0.6)", marginBottom: 8 }}>
                      VOICE NOTES
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <button
                        onClick={async () => {
                          if (isRecording) {
                            mediaRecorderRef.current?.stop();
                            setIsRecording(false);
                          } else {
                            try {
                              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                              const mr = new MediaRecorder(stream);
                              audioChunksRef.current = [];
                              mr.ondataavailable = e => audioChunksRef.current.push(e.data);
                              mr.onstop = () => {
                                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                                const url = URL.createObjectURL(blob);
                                setVoiceNotes(prev => [...prev, { id: Date.now().toString(), url, label: `Memo ${prev.length + 1}` }]);
                                stream.getTracks().forEach(t => t.stop());
                              };
                              mr.start();
                              mediaRecorderRef.current = mr;
                              setIsRecording(true);
                            } catch {
                              /* mic permission denied */
                            }
                          }
                        }}
                        style={{
                          width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer",
                          background: isRecording ? "#EF4444" : "#FF1F7D",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, transition: "background 0.2s",
                        }}
                      >
                        {isRecording ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="white"><rect x="2" y="2" width="10" height="10" rx="1" /></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><ellipse cx="8" cy="6" rx="3" ry="4" /><path d="M3 8a5 5 0 0 0 10 0" stroke="white" strokeWidth="1.5" fill="none" /><line x1="8" y1="13" x2="8" y2="15" stroke="white" strokeWidth="1.5" /></svg>
                        )}
                      </button>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: isRecording ? "#EF4444" : "rgba(0,0,0,0.5)" }}>
                        {isRecording ? "Recording… tap to stop" : "Tap to record a voice note"}
                      </span>
                    </div>
                    {voiceNotes.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                        {voiceNotes.map(vn => (
                          <div key={vn.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,31,125,0.04)", borderRadius: 10, padding: "7px 10px", border: "1px solid rgba(255,31,125,0.12)" }}>
                            <audio src={vn.url} controls style={{ height: 28, flex: 1, minWidth: 0 }} />
                            <button
                              onClick={() => setVoiceNotes(prev => prev.filter(n => n.id !== vn.id))}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.3)", fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Text fields */}
                {textFields.map(fieldKey => {
                  const entry = fieldValueMap[fieldKey];
                  if (!entry) return null;
                  return (
                    <div key={fieldKey}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,31,125,0.6)", marginBottom: 5 }}>
                        {FIELD_LABELS[fieldKey]}
                      </p>
                      <input
                        value={entry.value}
                        onChange={e => entry.set(e.target.value)}
                        style={{
                          width: "100%", boxSizing: "border-box" as const,
                          padding: "9px 12px",
                          fontFamily: "var(--font-jost)", fontSize: 13, color: "#1C1B1C",
                          background: "white", border: "1px solid rgba(255,31,125,0.18)",
                          borderRadius: 10, outline: "none",
                        }}
                        placeholder={`Enter ${FIELD_LABELS[fieldKey].toLowerCase()}…`}
                      />
                    </div>
                  );
                })}

                {/* Save button */}
                {hasFields && (
                  <button
                    onClick={() => {
                      handleSaveExtra();
                      setCustomizeSaved(true);
                      setTimeout(() => setCustomizeSaved(false), 2000);
                    }}
                    style={{
                      marginTop: 4, padding: "11px 0", borderRadius: 12,
                      background: customizeSaved ? "rgba(255,31,125,0.08)" : "#FF1F7D",
                      border: customizeSaved ? "1.5px solid rgba(255,31,125,0.25)" : "none",
                      cursor: "pointer", width: "100%",
                      fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
                      letterSpacing: "0.14em",
                      color: customizeSaved ? "#FF1F7D" : "white",
                      transition: "all 0.2s",
                    }}
                  >
                    {customizeSaved ? "SAVED ✓" : "SAVE"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ══════════════════════════ TABS ══════════════════════════ */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,240,248,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,31,125,0.08)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, WebkitOverflowScrolling: "touch" as unknown as undefined, paddingLeft: 14, paddingRight: 14 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                padding: "13px 14px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                fontWeight: activeTab === tab.id ? 800 : 600,
                letterSpacing: "0.08em",
                color: activeTab === tab.id ? PINK : "rgba(0,0,0,0.35)",
                borderBottom: activeTab === tab.id ? `2px solid ${PINK}` : "2px solid transparent",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ TAB CONTENT ══════════════════════════ */}
      <div style={{ padding: "20px 18px 0" }}>

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 2 }}>
              YOUR APARTMENT
            </p>

            <div style={cardStyle}>
              <p style={sectionLabel}>ACCOUNT</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <InfoRow label="Role" value={user.role} />
                <InfoRow label="Status" value={user.verification_status ?? "unverified"} pink={user.verification_status === "verified"} />
                <InfoRow label="Bloom Points" value={`${user.bloom_points ?? 0} pts`} pink />
              </div>
            </div>

            {user.bio && (
              <div style={cardStyle}>
                <p style={sectionLabel}>BIO</p>
                <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: 13, color: "#555", lineHeight: 1.65 }}>{user.bio}</p>
              </div>
            )}

            {false && (
              <div style={cardStyle}>
                <p style={sectionLabel}>INTERESTS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                </div>
              </div>
            )}

            <QuestionSheCaries editable />

            {/* Bloom Passport link */}
            <Link href="/member/passport" style={{ textDecoration: "none" }}>
              <div style={{
                background: "linear-gradient(160deg, #6B001A 0%, #9B0032 45%, #C4005A 100%)",
                borderRadius: 16, padding: "16px 18px",
                boxShadow: "0 6px 24px rgba(196,0,90,0.28)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 55%)", pointerEvents: "none" }}/>
                <div style={{ position: "relative" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,200,220,0.75)", marginBottom: 4 }}>✦ BLOOM PASSPORT</p>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "rgba(255,230,242,0.97)", margin: 0, letterSpacing: "-0.01em" }}>Your world, documented.</p>
                </div>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
                  <div style={{ width: 34, height: 44, borderRadius: 5, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "9px", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>BB</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", marginTop: 1 }}>PASS</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </Link>

            {/* My Story link */}
            <Link
              href="/member/my-story"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#FFF8F0",
                  borderRadius: 16,
                  padding: "16px 18px",
                  border: "1px solid rgba(255,31,125,0.12)",
                  boxShadow: "0 2px 10px rgba(255,31,125,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 4 }}>✦ MY STORY</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "#111", margin: 0 }}>Your BloomBay life, as Yande remembers it.</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>

            <SocialProofSection userId={user.id} />
          </div>
        )}

        {/* ─── MOMENTS TAB ─── */}
        {activeTab === "moments" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR MOMENTS
            </p>

            {photos.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {photos.map((photo, i) => (
                  <div key={photo.id} style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "1", background: "rgba(255,31,125,0.05)", border: "1px solid rgba(255,31,125,0.1)" }}>
                    <button
                      onClick={() => openLightbox(avatarUrl ? i + 1 : i)}
                      style={{ width: "100%", height: "100%", border: "none", padding: 0, cursor: "pointer", display: "block", background: "transparent" }}
                    >
                      <Image src={photo.url} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                    </button>
                    <button
                      onClick={() => removePhoto(photo)}
                      disabled={removing === photo.id}
                      style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {removing === photo.id
                        ? <span className="animate-spin" style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid white", borderTopColor: "transparent", display: "inline-block" }} />
                        : <svg width="7" height="7" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" /></svg>
                      }
                    </button>
                  </div>
                ))}

                {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
                  <div key={`up-${i}`} style={{ borderRadius: 16, aspectRatio: "1", background: "rgba(255,31,125,0.08)", border: "1.5px dashed rgba(255,31,125,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="animate-spin" style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #FF1F7D", borderTopColor: "transparent", display: "inline-block" }} />
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && uploadingCount === 0 && (
              <div style={{ ...cardStyle, textAlign: "center", padding: "32px 18px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,31,125,0.5)", marginBottom: 6 }}>No moments yet</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.35)", marginBottom: 16 }}>Upload photos to fill your apartment</p>
              </div>
            )}

            <button
              onClick={() => addInputRef.current?.click()}
              style={{ width: "100%", padding: "14px", borderRadius: 16, border: `1.5px dashed rgba(255,31,125,0.4)`, background: "rgba(255,31,125,0.04)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>ADD MOMENT</span>
            </button>
            <input ref={addInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => { if (e.target.files?.length) handleAddPhotos(e.target.files); e.target.value = ""; }} />
          </div>
        )}

        {/* ─── WORLD TAB ─── */}
        {activeTab === "world" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR WORLD
            </p>

            {worldPhotos.length === 0 && uploadingWorldCount === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "rgba(255,31,125,0.6)", marginBottom: 6 }}>
                  Share your world ✦
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: 24, lineHeight: 1.6 }}>
                  Upload photos that show who you are
                </p>
                <button
                  onClick={() => addWorldInputRef.current?.click()}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "13px 24px", background: PINK, color: "white", borderRadius: 14, border: "none", fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: "0 4px 18px rgba(255,31,125,0.38)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Upload Photos
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {worldPhotos.map(photo => (
                    <div key={photo.id} style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "1", background: "rgba(255,31,125,0.05)", border: "1px solid rgba(255,31,125,0.1)" }}>
                      <Image src={photo.url} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                  {uploadingWorldCount > 0 && Array.from({ length: uploadingWorldCount }).map((_, i) => (
                    <div key={`wup-${i}`} style={{ borderRadius: 16, aspectRatio: "1", background: "rgba(255,31,125,0.08)", border: "1.5px dashed rgba(255,31,125,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="animate-spin" style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #FF1F7D", borderTopColor: "transparent", display: "inline-block" }} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addWorldInputRef.current?.click()}
                  style={{ width: "100%", padding: "14px", borderRadius: 16, border: `1.5px dashed rgba(255,31,125,0.4)`, background: "rgba(255,31,125,0.04)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>ADD MORE</span>
                </button>
              </>
            )}

            <input ref={addWorldInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => { if (e.target.files?.length) handleAddWorldPhotos(e.target.files); e.target.value = ""; }} />
          </div>
        )}

        {/* ─── BLOOM CODE TAB ─── */}
        {activeTab === "bloomcode" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR BLOOM CODE
            </p>

            {isFounder && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 20 }}>
                <FoundingFlower size={36} />
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#111" }}>
                  FOUNDING MEMBER
                </span>
              </div>
            )}

            <div style={{ ...cardStyle, textAlign: "center", padding: "32px 20px" }}>
              <div style={{ background: "linear-gradient(135deg, #FFF0F8 0%, #FFE8F4 100%)", borderRadius: 18, padding: "24px 20px", marginBottom: 20, border: "1px solid rgba(255,31,125,0.15)" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "rgba(255,31,125,0.5)", marginBottom: 8, letterSpacing: "0.1em" }}>
                  your unique code
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 32, fontWeight: 900, color: PINK, letterSpacing: "0.12em" }}>
                  {bloomCode}
                </p>
              </div>

              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: 18, lineHeight: 1.6 }}>
                Share this code to invite friends to Bloombay
              </p>

              <button
                onClick={() => copyToClipboard(bloomCode, "bloomcode")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: bloomCodeCopied ? "#22c55e" : PINK, color: "white", borderRadius: 14, border: "none", fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: `0 4px 18px ${bloomCodeCopied ? "rgba(34,197,94,0.35)" : "rgba(255,31,125,0.38)"}`, transition: "all 0.2s" }}
              >
                {bloomCodeCopied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── BLOOM LINK TAB ─── */}
        {activeTab === "bloomlink" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR BLOOM LINK
            </p>

            <div style={{ ...cardStyle, padding: "28px 20px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 14, letterSpacing: "0.04em" }}>
                Your shareable profile link
              </p>

              <div style={{ background: "linear-gradient(135deg, #FFF0F8 0%, #FFE8F4 100%)", borderRadius: 14, padding: "14px 16px", marginBottom: 18, border: "1px solid rgba(255,31,125,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: "#1C1B1C", flex: 1, wordBreak: "break-all" as const }}>
                  bloombay.com/u/{username}
                </p>
              </div>

              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.35)", marginBottom: 18, lineHeight: 1.6 }}>
                Share this link so others can find and connect with you on Bloombay.
              </p>

              <button
                onClick={() => copyToClipboard(`bloombay.com/u/${username}`, "bloomlink")}
                style={{ width: "100%", padding: "14px", background: bloomLinkCopied ? "#22c55e" : PINK, color: "white", borderRadius: 14, border: "none", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: `0 4px 18px ${bloomLinkCopied ? "rgba(34,197,94,0.35)" : "rgba(255,31,125,0.38)"}`, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {bloomLinkCopied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── LINKS TAB ─── */}
        {activeTab === "links" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 2 }}>
              YOUR LINKS
            </p>

            {([
              {
                key: "instagram" as const,
                label: "Instagram",
                placeholder: "@yourhandle",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ),
              },
              {
                key: "tiktok" as const,
                label: "TikTok",
                placeholder: "@yourhandle",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                ),
              },
              {
                key: "twitter" as const,
                label: "Twitter / X",
                placeholder: "@yourhandle",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 4l16 16M4 20L20 4" />
                  </svg>
                ),
              },
              {
                key: "pinterest" as const,
                label: "Pinterest",
                placeholder: "pinterest.com/you",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.25-.87 3.5-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.1-2.4 3.1-5.24 0-2.16-1.46-3.67-3.55-3.67-2.42 0-3.84 1.81-3.84 3.69 0 .73.28 1.51.63 1.94a.25.25 0 0 1 .06.24c-.06.26-.21.83-.24.94-.04.15-.13.18-.3.11-1.12-.52-1.82-2.16-1.82-3.48 0-2.83 2.06-5.43 5.93-5.43 3.11 0 5.53 2.22 5.53 5.18 0 3.09-1.95 5.57-4.65 5.57-.91 0-1.76-.47-2.05-1.03l-.56 2.08c-.2.78-.75 1.76-1.12 2.36.85.26 1.74.4 2.67.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                ),
              },
              {
                key: "spotify" as const,
                label: "Spotify",
                placeholder: "open.spotify.com/user/…",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 13.5c2.5-1 5.5-.8 8 .5" />
                    <path d="M7 10.8c3-1.3 7-1 10 .7" />
                    <path d="M9 16c2-0.8 4.5-.6 6.5.4" />
                  </svg>
                ),
              },
              {
                key: "website" as const,
                label: "Website",
                placeholder: "https://yoursite.com",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
              },
            ] as { key: keyof typeof socials; label: string; placeholder: string; icon: React.ReactNode }[]).map(platform => (
              <div key={platform.key} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                <div style={{ flexShrink: 0 }}>{platform.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.35)", marginBottom: 6 }}>{platform.label.toUpperCase()}</p>
                  <input
                    type="text"
                    value={socials[platform.key]}
                    onChange={e => setSocials(prev => ({ ...prev, [platform.key]: e.target.value }))}
                    placeholder={platform.placeholder}
                    style={{ ...inputStyle, background: "transparent", border: "none", padding: "0", fontSize: 13, color: "#1C1B1C" }}
                  />
                </div>
              </div>
            ))}

            {/* Show socials publicly toggle */}
            <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "#1C1B1C", marginBottom: 3 }}>Show on my profile</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#999", lineHeight: 1.4 }}>Let other members find you on your socials</p>
              </div>
              <button
                onClick={() => setShowSocials(v => !v)}
                style={{
                  width: 46, height: 26, borderRadius: 999, border: "none", cursor: "pointer",
                  background: showSocials ? PINK : "#E5E5E5",
                  position: "relative", flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 3,
                  left: showSocials ? 23 : 3,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>

            <button
              onClick={handleSaveSocials}
              style={{ ...pinkBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {socialsSaved ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved ✓
                </>
              ) : "Save Links"}
            </button>
          </div>
        )}

        {/* ─── SETTINGS TAB ─── */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 2 }}>
              SETTINGS
            </p>

            {/* Edit profile form */}
            <form onSubmit={handleSaveProfile} style={cardStyle}>
              <p style={sectionLabel}>EDIT PROFILE</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="FIRST NAME">
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    style={inputStyle}
                  />
                </Field>

                <Field label="PHONE">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={inputStyle}
                  />
                </Field>

                <Field label="NEIGHBORHOOD">
                  <input
                    type="text"
                    value={neighborhoodEdit}
                    onChange={e => setNeighborhoodEdit(e.target.value)}
                    placeholder="e.g. Bed-Stuy, Harlem, Astoria"
                    style={inputStyle}
                  />
                </Field>

                <Field label="BIO">
                  <textarea
                    value={bioEdit}
                    onChange={e => setBioEdit(e.target.value)}
                    placeholder="A few words about you…"
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
                  />
                </Field>
              </div>

              {saveMsg && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: saveMsg.ok ? "#22c55e" : "#ef4444", marginTop: 12, fontWeight: 600 }}>
                  {saveMsg.text}
                </p>
              )}

              <button type="submit" disabled={saving} style={{ ...pinkBtn, marginTop: 18, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>

            {/* New-in-Town */}
            <div style={cardStyle}>
              <p style={sectionLabel}>YOUR CITY STATUS</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.45)", marginBottom: 12, lineHeight: 1.5 }}>
                Help us surface the right dinners, clubs, and open seats for where you are in the city.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {([
                  { id: "just_moved",  label: "Just moved here 📍" },
                  { id: "new_6mo",     label: "New (< 6 months) 🌱" },
                  { id: "fresh_start", label: "Fresh start ✨" },
                  { id: "local",       label: "Local 🏙️" },
                  { id: "native",      label: "NYC native 🗽" },
                ] as const).map(opt => {
                  const active = (user as { arrival_status?: string }).arrival_status === opt.id;
                  return (
                    <button key={opt.id}
                      onClick={() => {
                        void import("@/lib/actions/happenings").then(m =>
                          m.updateArrivalStatus(opt.id as "just_moved"|"new_6mo"|"fresh_start"|"local"|"native")
                        );
                      }}
                      style={{
                        padding: "8px 14px", borderRadius: 999, border: "none", cursor: "pointer",
                        background: active ? PINK : "rgba(0,0,0,0.06)",
                        color: active ? "white" : "rgba(0,0,0,0.55)",
                        fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: active ? 800 : 600,
                        transition: "all 0.18s",
                      }}
                    >{opt.label}</button>
                  );
                })}
              </div>
            </div>

            {/* Profile extra fields */}
            <div style={cardStyle}>
              <p style={sectionLabel}>PROFILE EXTRAS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="OCCUPATION">
                  <input
                    type="text"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    placeholder="e.g. Designer, Student, Founder"
                    style={inputStyle}
                  />
                </Field>
                <Field label="ZODIAC SIGN">
                  <input
                    type="text"
                    value={sign}
                    onChange={e => setSign(e.target.value)}
                    placeholder="e.g. Scorpio ♏"
                    style={inputStyle}
                  />
                </Field>
                <Field label="VIBE / TAGLINE">
                  <input
                    type="text"
                    value={vibe}
                    onChange={e => setVibe(e.target.value)}
                    placeholder="e.g. living in full bloom"
                    style={inputStyle}
                  />
                </Field>
                <Field label="ARCHETYPE">
                  <input
                    type="text"
                    value={archetype}
                    onChange={e => setArchetype(e.target.value)}
                    placeholder="e.g. The Visionary, The Creative"
                    style={inputStyle}
                  />
                </Field>
                <Field label="SHE IS">
                  <input
                    type="text"
                    value={sheIs}
                    onChange={e => setSheIs(e.target.value)}
                    placeholder="e.g. the girl who moves the room"
                    style={inputStyle}
                  />
                </Field>
                <Field label="SIGNATURE TRAITS">
                  <input
                    type="text"
                    value={sigTraits}
                    onChange={e => setSigTraits(e.target.value)}
                    placeholder="e.g. unapologetically herself"
                    style={inputStyle}
                  />
                </Field>
                <Field label="LUCKY CHARM">
                  <input
                    type="text"
                    value={luckyCharm}
                    onChange={e => setLuckyCharm(e.target.value)}
                    placeholder="e.g. Books by Toni Morrison"
                    style={inputStyle}
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={handleSaveExtra}
                style={{ ...outlineBtn, marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {extraSaved ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Saved ✓
                  </>
                ) : "Save Extras"}
              </button>
            </div>

            {/* Update email form */}
            <form onSubmit={handleUpdateEmail} style={cardStyle}>
              <p style={sectionLabel}>EMAIL ADDRESS</p>

              <Field label="EMAIL">
                <input
                  type="email"
                  value={emailEdit}
                  onChange={e => setEmailEdit(e.target.value)}
                  style={inputStyle}
                />
              </Field>

              {emailMsg && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: emailMsg.ok ? "#22c55e" : "#ef4444", marginTop: 12, fontWeight: 600 }}>
                  {emailMsg.text}
                </p>
              )}

              <button type="submit" disabled={emailBusy} style={{ ...outlineBtn, marginTop: 16, opacity: emailBusy ? 0.7 : 1 }}>
                {emailBusy ? "Sending…" : "Update Email"}
              </button>
              <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: "10px", color: "#bbb", marginTop: 8, lineHeight: 1.5 }}>
                A verification link will be sent to the new address.
              </p>
            </form>

            {/* Portal switcher */}
            {portalLinks.length > 0 && (
              <div style={cardStyle}>
                <p style={sectionLabel}>YOUR PORTALS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {portalLinks.map(portal => (
                    <Link key={portal.href} href={portal.href} style={{ textDecoration: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", border: "1px solid rgba(255,31,125,0.1)", borderRadius: 14, padding: "14px 16px", boxShadow: "0 2px 8px rgba(255,31,125,0.06)" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 700, color: "#1C1B1C" }}>{portal.label}</p>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── Notification Preferences ── */}
            <div style={cardStyle}>
              <p style={sectionLabel}>NOTIFICATIONS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {([
                  { label: "Happenings near you",   val: notifHappenings, set: setNotifHappenings },
                  { label: "Club activity",           val: notifClubs,      set: setNotifClubs      },
                  { label: "Messages & flowers",      val: notifMessages,   set: setNotifMessages   },
                  { label: "Flowers received",        val: notifFlowers,    set: setNotifFlowers    },
                  { label: "Event reminders",         val: notifReminders,  set: setNotifReminders  },
                ] as { label: string; val: boolean; set: (v: boolean) => void }[]).map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "#555", fontWeight: 500 }}>{item.label}</p>
                    <button
                      onClick={() => item.set(!item.val)}
                      style={{
                        width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
                        background: item.val ? PINK : "rgba(0,0,0,0.12)",
                        position: "relative", transition: "background 0.2s", flexShrink: 0,
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "white",
                        position: "absolute", top: 3,
                        left: item.val ? 21 : 3,
                        transition: "left 0.2s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Contact Us ── */}
            <div style={cardStyle}>
              <p style={sectionLabel}>CONTACT US</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#aaa", marginBottom: 14, lineHeight: 1.5 }}>
                Questions, feedback, or need help? We read every message.
              </p>
              {contactSent ? (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>
                  Message sent ✦ We&apos;ll get back to you within 24 hours.
                </p>
              ) : (
                <>
                  <textarea
                    value={contactMsg}
                    onChange={e => setContactMsg(e.target.value)}
                    placeholder="Tell us what's on your mind…"
                    rows={4}
                    style={{ ...inputStyle, resize: "none", marginBottom: 12 } as React.CSSProperties}
                  />
                  <button
                    onClick={async () => {
                      if (!contactMsg.trim()) return;
                      setContactBusy(true);
                      await new Promise(r => setTimeout(r, 600));
                      setContactBusy(false);
                      setContactSent(true);
                    }}
                    disabled={contactBusy || !contactMsg.trim()}
                    style={{ ...pinkBtn, opacity: contactMsg.trim() ? 1 : 0.5 } as React.CSSProperties}
                  >
                    {contactBusy ? "Sending…" : "Send Message"}
                  </button>
                </>
              )}
            </div>

            {/* ── Report a User ── */}
            <div style={cardStyle}>
              <p style={sectionLabel}>REPORT A USER</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#aaa", marginBottom: 14, lineHeight: 1.5 }}>
                All reports are confidential. We review every one within 24 hours.
              </p>
              {reportSent ? (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>
                  Report received ✦ Thank you for keeping BloomBay safe.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Field label="USERNAME OR NAME">
                    <input
                      type="text"
                      value={reportUser}
                      onChange={e => setReportUser(e.target.value)}
                      placeholder="Who are you reporting?"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="WHAT HAPPENED">
                    <textarea
                      value={reportReason}
                      onChange={e => setReportReason(e.target.value)}
                      placeholder="Describe the situation…"
                      rows={3}
                      style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
                    />
                  </Field>
                  <button
                    onClick={() => { if (reportUser.trim() && reportReason.trim()) setReportSent(true); }}
                    disabled={!reportUser.trim() || !reportReason.trim()}
                    style={{ ...outlineBtn, opacity: (reportUser.trim() && reportReason.trim()) ? 1 : 0.45 } as React.CSSProperties}
                  >
                    Submit Report
                  </button>
                </div>
              )}
            </div>

            {/* ── Block People ── */}
            <div style={cardStyle}>
              <p style={sectionLabel}>BLOCKED USERS</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#aaa", marginBottom: 14, lineHeight: 1.5 }}>
                Blocked women can&apos;t see your profile, message you, or invite you to events.
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  type="text"
                  value={blockInput}
                  onChange={e => setBlockInput(e.target.value)}
                  placeholder="Username to block"
                  style={{ ...inputStyle, flex: 1 } as React.CSSProperties}
                  onKeyDown={e => {
                    if (e.key === "Enter" && blockInput.trim()) {
                      setBlockedUsers(prev => [...prev, blockInput.trim()]);
                      setBlockInput("");
                    }
                  }}
                />
                <button
                  onClick={() => { if (blockInput.trim()) { setBlockedUsers(prev => [...prev, blockInput.trim()]); setBlockInput(""); } }}
                  style={{ ...outlineBtn, flexShrink: 0, padding: "12px 16px" } as React.CSSProperties}
                >
                  Block
                </button>
              </div>
              {blockedUsers.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {blockedUsers.map(u => (
                    <div key={u} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "#555", fontWeight: 500 }}>@{u}</p>
                      <button
                        onClick={() => setBlockedUsers(prev => prev.filter(x => x !== u))}
                        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "11px", color: "#bbb", fontWeight: 600 }}
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {blockedUsers.length === 0 && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#ccc", fontStyle: "italic" }}>No blocked users.</p>
              )}
            </div>

            {/* ── Delete Account ── */}
            <div style={{ ...cardStyle, border: "1.5px solid rgba(239,68,68,0.18)" }}>
              <p style={{ ...sectionLabel, color: "rgba(239,68,68,0.6)" }}>DANGER ZONE</p>
              {!deleteOpen ? (
                <button
                  onClick={() => setDeleteOpen(true)}
                  style={{ ...outlineBtn, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", width: "100%" } as React.CSSProperties}
                >
                  Delete My Account
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "#ef4444", lineHeight: 1.5 }}>
                    This permanently deletes your profile, club memberships, and all data. Type <strong>DELETE</strong> to confirm.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    style={{ ...inputStyle, border: "1.5px solid rgba(239,68,68,0.3)" } as React.CSSProperties}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { setDeleteOpen(false); setDeleteConfirm(""); }}
                      style={{ ...outlineBtn, flex: 1 } as React.CSSProperties}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={deleteConfirm !== "DELETE"}
                      style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", cursor: deleteConfirm === "DELETE" ? "pointer" : "default", background: deleteConfirm === "DELETE" ? "#ef4444" : "rgba(239,68,68,0.1)", color: deleteConfirm === "DELETE" ? "white" : "rgba(239,68,68,0.3)", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700 }}
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sign out */}
            <form action={logout}>
              <button
                type="submit"
                style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "white", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#aaa", cursor: "pointer", boxShadow: "0 2px 10px rgba(255,31,125,0.06)" }}
              >
                Sign Out
              </button>
            </form>

          </div>
        )}

      </div>

      {/* ══════════════════════════ LIGHTBOX ══════════════════════════ */}
      {lightboxOpen && allPhotos.length > 0 && (
        <Lightbox photos={allPhotos} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)} />
      )}

    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#aaa", letterSpacing: "0.12em", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ label, value, pink = false }: { label: string; value: string; pink?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#bbb", fontWeight: 600 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: pink ? "#FF1F7D" : "#555" }}>{value}</p>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid rgba(255,31,125,0.1)",
  borderRadius: 20,
  padding: "20px 18px",
  boxShadow: "0 4px 18px rgba(255,31,125,0.08)",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-jost)",
  fontSize: "8px",
  fontWeight: 800,
  letterSpacing: "0.2em",
  color: "rgba(255,31,125,0.6)",
  marginBottom: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1.5px solid rgba(255,31,125,0.12)",
  fontFamily: "var(--font-jost)",
  fontSize: 14,
  color: "#1C1B1C",
  background: "#FFF5FB",
  outline: "none",
};

const pinkBtn: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#FF1F7D",
  color: "white",
  borderRadius: 14,
  border: "none",
  fontFamily: "var(--font-jost)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  cursor: "pointer",
  boxShadow: "0 4px 18px rgba(255,31,125,0.38)",
};

const outlineBtn: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  background: "transparent",
  color: "#FF1F7D",
  border: "2px solid #FF1F7D",
  borderRadius: 14,
  fontFamily: "var(--font-jost)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  cursor: "pointer",
};
