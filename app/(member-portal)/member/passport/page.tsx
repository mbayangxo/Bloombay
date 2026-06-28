"use client";

import { useState, useRef, useEffect, useId } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const PINK = "#FF1F7D";
const INK  = "#111111";

// ─────────────────────────────────────────────────────────────────────────────
// PASSPORT TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Bloom",
    tagline: "Your world, documented.",
    coverGrad: "linear-gradient(160deg,#6B001A 0%,#9B0032 45%,#C4005A 100%)",
    coverTextCol: "rgba(255,210,230,0.95)",
    coverSubCol: "rgba(255,160,200,0.6)",
    pagesBg: "#FEFAF8",
    pagesText: "#1A0808",
    pagesAccent: "#9B0032",
    pagesSubtext: "rgba(120,30,50,0.5)",
    pageBorder: "rgba(155,0,50,0.15)",
    slotBg: "rgba(155,0,50,0.05)",
    slotBorder: "rgba(155,0,50,0.18)",
    headerBg: "linear-gradient(135deg,#6B001A,#C4005A)",
    footerLines: "rgba(155,0,50,0.12)",
    mrz: "rgba(155,0,50,0.1)",
    spineColor: "#7A0025",
  },
  {
    id: "midnight",
    name: "Midnight Rose",
    tagline: "Rare. Intentional. Yours.",
    coverGrad: "linear-gradient(160deg,#08000E 0%,#120018 50%,#1E0028 100%)",
    coverTextCol: "rgba(255,140,200,0.95)",
    coverSubCol: "rgba(200,80,160,0.55)",
    pagesBg: "#0D0015",
    pagesText: "rgba(255,200,235,0.92)",
    pagesAccent: "#FF1F7D",
    pagesSubtext: "rgba(255,130,200,0.45)",
    pageBorder: "rgba(255,31,125,0.18)",
    slotBg: "rgba(255,31,125,0.07)",
    slotBorder: "rgba(255,31,125,0.22)",
    headerBg: "linear-gradient(135deg,#0D0015,#280035)",
    footerLines: "rgba(255,31,125,0.1)",
    mrz: "rgba(255,31,125,0.08)",
    spineColor: "#FF1F7D",
  },
  {
    id: "blush",
    name: "Blush Edition",
    tagline: "Softly powerful.",
    coverGrad: "linear-gradient(160deg,#FFB3D9 0%,#FF7EC4 45%,#FF4DA6 100%)",
    coverTextCol: "rgba(255,255,255,0.97)",
    coverSubCol: "rgba(255,240,250,0.65)",
    pagesBg: "#FFFFFF",
    pagesText: "#111111",
    pagesAccent: "#FF4DA6",
    pagesSubtext: "rgba(0,0,0,0.38)",
    pageBorder: "rgba(255,77,166,0.14)",
    slotBg: "rgba(255,77,166,0.05)",
    slotBorder: "rgba(255,77,166,0.18)",
    headerBg: "linear-gradient(135deg,#FFB3D9,#FF4DA6)",
    footerLines: "rgba(255,77,166,0.1)",
    mrz: "rgba(255,77,166,0.08)",
    spineColor: "#FF7EC4",
  },
  {
    id: "ivory",
    name: "Ivory Luxe",
    tagline: "Quietly exceptional.",
    coverGrad: "linear-gradient(160deg,#F5EDD8 0%,#EDE0C0 50%,#D4C498 100%)",
    coverTextCol: "rgba(70,40,10,0.92)",
    coverSubCol: "rgba(110,70,20,0.5)",
    pagesBg: "#FFFEF9",
    pagesText: "#2A1A00",
    pagesAccent: "#B89040",
    pagesSubtext: "rgba(80,55,10,0.45)",
    pageBorder: "rgba(180,140,60,0.18)",
    slotBg: "rgba(184,144,64,0.05)",
    slotBorder: "rgba(184,144,64,0.2)",
    headerBg: "linear-gradient(135deg,#C4A860,#8B7030)",
    footerLines: "rgba(184,144,64,0.12)",
    mrz: "rgba(184,144,64,0.1)",
    spineColor: "#C4A860",
  },
  {
    id: "garden",
    name: "Garden Party",
    tagline: "In full bloom.",
    coverGrad: "linear-gradient(160deg,#FF1F7D 0%,#FF3A8C 50%,#FF69B4 100%)",
    coverTextCol: "#FFFFFF",
    coverSubCol: "rgba(255,240,248,0.7)",
    pagesBg: "#FFF8FC",
    pagesText: "#111111",
    pagesAccent: "#FF1F7D",
    pagesSubtext: "rgba(0,0,0,0.4)",
    pageBorder: "rgba(255,31,125,0.14)",
    slotBg: "rgba(255,31,125,0.05)",
    slotBorder: "rgba(255,31,125,0.18)",
    headerBg: "linear-gradient(135deg,#FF1F7D,#FF69B4)",
    footerLines: "rgba(255,31,125,0.1)",
    mrz: "rgba(255,31,125,0.08)",
    spineColor: "#FF3A8C",
  },
];

type Template = (typeof TEMPLATES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// REALISTIC FLOWER SVG COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function PinkRose({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}ro`} cx="50%" cy="65%" r="65%">
          <stop offset="0%" stopColor="#FFE0F0" />
          <stop offset="38%" stopColor="#FF69B4" />
          <stop offset="100%" stopColor="#B80048" />
        </radialGradient>
        <radialGradient id={`${uid}ri`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#FFA0D0" />
          <stop offset="100%" stopColor="#900036" />
        </radialGradient>
        <radialGradient id={`${uid}rb`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#CC0050" />
          <stop offset="100%" stopColor="#700028" />
        </radialGradient>
        <linearGradient id={`${uid}st`} x1="48%" y1="0%" x2="52%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 58 C49 68 48 76 50 86 C51 93 50 105 50 105" stroke={`url(#${uid}st)`} strokeWidth="2.6" strokeLinecap="round"/>
      {/* Leaves */}
      <path d="M50 74 C41 68 33 72 35 80 C37 86 47 83 50 74" fill="#2D6A24" />
      <path d="M50 85 C59 79 67 83 65 91 C63 97 54 93 50 85" fill="#2D6A24" />
      {/* Outer 5 petals */}
      {[0,72,144,216,288].map(r => (
        <path key={r}
          d="M0 0 C-9 -3 -15 -16 -13 -26 C-11 -33 -5 -36 0 -36 C5 -36 11 -33 13 -26 C15 -16 9 -3 0 0Z"
          fill={`url(#${uid}ro)`} transform={`translate(50,46) rotate(${r})`} opacity="0.86"/>
      ))}
      {/* Inner 5 petals (rotated 36°) */}
      {[36,108,180,252,324].map(r => (
        <path key={r}
          d="M0 0 C-7 -2 -11 -13 -9 -21 C-8 -27 -4 -30 0 -30 C4 -30 8 -27 9 -21 C11 -13 7 -2 0 0Z"
          fill={`url(#${uid}ri)`} transform={`translate(50,46) rotate(${r})`} opacity="0.92"/>
      ))}
      {/* Bud centre (3 tight petals) */}
      {[0,120,240].map(r => (
        <path key={r}
          d="M0 0 C-3 0 -5 -7 -4 -13 C-3 -17 -1 -19 0 -19 C1 -19 3 -17 4 -13 C5 -7 3 0 0 0Z"
          fill={`url(#${uid}rb)`} transform={`translate(50,46) rotate(${r})`}/>
      ))}
      <circle cx="50" cy="46" r="4.5" fill="#880030"/>
      <circle cx="50" cy="46" r="2" fill="#CC0048"/>
    </svg>
  );
}

function CherryBlossom({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}cp`} cx="50%" cy="65%">
          <stop offset="0%" stopColor="#FFF4F8" />
          <stop offset="35%" stopColor="#FFC8E0" />
          <stop offset="100%" stopColor="#FF88BC" />
        </radialGradient>
        <linearGradient id={`${uid}cbr`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A2A18" />
          <stop offset="100%" stopColor="#3A1A08" />
        </linearGradient>
      </defs>
      {/* Branch */}
      <path d="M20 108 C28 92 36 78 46 62 C50 55 54 48 50 44" stroke={`url(#${uid}cbr)`} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      <path d="M72 108 C66 94 60 82 52 66" stroke={`url(#${uid}cbr)`} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Small side blossom at (70,54) */}
      {[0,72,144,216,288].map(r => (
        <path key={r}
          d="M0 0 C-4 0 -6 -5 -5 -10 C-4 -13 -2 -15 0 -14 C2 -15 4 -13 5 -10 C6 -5 4 0 0 0Z"
          fill={`url(#${uid}cp)`} transform={`translate(70,54) rotate(${r})`} opacity="0.9"/>
      ))}
      <circle cx="70" cy="54" r="3" fill="#FF9CC8"/>
      {[0,72,144,216,288].map(r => (
        <line key={r} x1="70" y1="54"
          x2={70 + 5.5*Math.sin(r*Math.PI/180)} y2={54 - 5.5*Math.cos(r*Math.PI/180)}
          stroke="#FF69B4" strokeWidth="0.7" strokeLinecap="round"/>
      ))}
      {/* Main blossom at (50,40) */}
      {[0,72,144,216,288].map(r => (
        <path key={r}
          d="M0 0 C-6 1 -10 -5 -9 -13 C-8 -18 -4 -21 0 -20 C4 -21 8 -18 9 -13 C10 -5 6 1 0 0Z"
          fill={`url(#${uid}cp)`} transform={`translate(50,40) rotate(${r})`}/>
      ))}
      <circle cx="50" cy="40" r="4" fill="#FFBAD8"/>
      {[0,72,144,216,288].map(r => (
        <line key={r} x1="50" y1="40"
          x2={50 + 8*Math.sin(r*Math.PI/180)} y2={40 - 8*Math.cos(r*Math.PI/180)}
          stroke="#FF69B4" strokeWidth="0.9" strokeLinecap="round"/>
      ))}
    </svg>
  );
}

function PinkTulip({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <linearGradient id={`${uid}tp1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD0E8" />
          <stop offset="50%" stopColor="#FF69B4" />
          <stop offset="100%" stopColor="#CC0058" />
        </linearGradient>
        <linearGradient id={`${uid}tp2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF90C8" />
          <stop offset="100%" stopColor="#AA0045" />
        </linearGradient>
        <linearGradient id={`${uid}tst`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2E7A28" />
          <stop offset="100%" stopColor="#1A4E16" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 75 C50 82 50 90 50 105" stroke={`url(#${uid}tst)`} strokeWidth="2.8" strokeLinecap="round"/>
      {/* Leaves */}
      <path d="M50 85 C44 80 36 77 33 82 C30 88 38 92 50 85" fill="#2A7022" />
      <path d="M50 88 C56 83 64 80 67 85 C70 91 62 95 50 88" fill="#2A7022" />
      {/* Left petal */}
      <path d="M50 75 C44 70 34 60 34 44 C34 32 40 22 46 18 C47 16 48 16 50 18 C42 28 40 40 44 52 C46 60 48 67 50 75Z"
        fill={`url(#${uid}tp1)`}/>
      {/* Right petal */}
      <path d="M50 75 C56 70 66 60 66 44 C66 32 60 22 54 18 C53 16 52 16 50 18 C58 28 60 40 56 52 C54 60 52 67 50 75Z"
        fill={`url(#${uid}tp2)`}/>
      {/* Centre petal (tallest) */}
      <path d="M50 74 C47 66 44 54 44 42 C44 30 47 20 50 14 C53 20 56 30 56 42 C56 54 53 66 50 74Z"
        fill={`url(#${uid}tp1)`}/>
      {/* Highlight on center petal */}
      <path d="M50 74 C49 66 48 54 48 42 C48 30 49 20 50 14 C51 20 52 30 52 42 C52 54 51 66 50 74Z"
        fill="rgba(255,255,255,0.22)"/>
    </svg>
  );
}

function WhitePeony({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}po`} cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FFDCE8" />
          <stop offset="100%" stopColor="#FFB3CE" />
        </radialGradient>
        <radialGradient id={`${uid}pm`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="100%" stopColor="#FFD0E4" />
        </radialGradient>
        <radialGradient id={`${uid}pi`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFEEF4" />
          <stop offset="100%" stopColor="#FFCCE0" />
        </radialGradient>
        <linearGradient id={`${uid}pst`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 62 C49 72 48 82 50 94 C51 100 50 108 50 108" stroke={`url(#${uid}pst)`} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M50 80 C42 74 34 77 36 85 C38 91 47 88 50 80" fill="#2D6B24"/>
      {/* Outer petals (8) */}
      {[0,45,90,135,180,225,270,315].map(r => (
        <path key={r}
          d="M0 0 C-8 -2 -12 -14 -10 -22 C-9 -28 -4 -32 0 -32 C4 -32 9 -28 10 -22 C12 -14 8 -2 0 0Z"
          fill={`url(#${uid}po)`} transform={`translate(50,46) rotate(${r})`} opacity="0.82"/>
      ))}
      {/* Middle petals (8, offset 22.5°) */}
      {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(r => (
        <path key={r}
          d="M0 0 C-6 -1 -9 -11 -8 -18 C-7 -23 -3 -26 0 -26 C3 -26 7 -23 8 -18 C9 -11 6 -1 0 0Z"
          fill={`url(#${uid}pm)`} transform={`translate(50,46) rotate(${r})`} opacity="0.9"/>
      ))}
      {/* Inner petals (6) */}
      {[0,60,120,180,240,300].map(r => (
        <path key={r}
          d="M0 0 C-4 0 -6 -8 -5 -13 C-4 -17 -2 -19 0 -19 C2 -19 4 -17 5 -13 C6 -8 4 0 0 0Z"
          fill={`url(#${uid}pi)`} transform={`translate(50,46) rotate(${r})`} opacity="0.95"/>
      ))}
      {/* Stamens */}
      {[0,40,80,120,160,200,240,280,320].map((r, i) => (
        <line key={i}
          x1="50" y1="46"
          x2={50+8*Math.sin(r*Math.PI/180)} y2={46-8*Math.cos(r*Math.PI/180)}
          stroke="#F0C060" strokeWidth="0.8" strokeLinecap="round"/>
      ))}
      <circle cx="50" cy="46" r="5" fill="#FFF0F5"/>
    </svg>
  );
}

function WildDaisy({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}dp`} cx="50%" cy="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFF0F5" />
          <stop offset="100%" stopColor="#FFD8E8" />
        </radialGradient>
        <radialGradient id={`${uid}dc`} cx="40%" cy="40%">
          <stop offset="0%" stopColor="#FFE060" />
          <stop offset="50%" stopColor="#F0A000" />
          <stop offset="100%" stopColor="#C87800" />
        </radialGradient>
        <linearGradient id={`${uid}dst`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 58 C49 68 49 80 50 92 C51 100 50 107 50 107" stroke={`url(#${uid}dst)`} strokeWidth="2.4" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M50 76 C43 70 35 73 37 81 C39 87 48 83 50 76" fill="#2D6B24"/>
      {/* Long narrow petals (14) */}
      {Array.from({length:14}).map((_,i) => {
        const r = i * (360/14);
        return (
          <path key={i}
            d="M0 0 C-4 -1 -5 -12 -4 -20 C-3 -27 -1 -30 0 -30 C1 -30 3 -27 4 -20 C5 -12 4 -1 0 0Z"
            fill={`url(#${uid}dp)`} transform={`translate(50,44) rotate(${r})`} opacity="0.9"/>
        );
      })}
      {/* Golden centre */}
      <circle cx="50" cy="44" r="10" fill={`url(#${uid}dc)`}/>
      {/* Centre texture dots */}
      {[0,45,90,135,180,225,270,315].map((r,i) => (
        <circle key={i} cx={50+5*Math.sin(r*Math.PI/180)} cy={44-5*Math.cos(r*Math.PI/180)} r="1.2" fill="#C87800" opacity="0.6"/>
      ))}
      <circle cx="50" cy="44" r="3" fill="#E09000"/>
    </svg>
  );
}

function PurpleOrchid({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}op`} cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#EAD0FF" />
          <stop offset="45%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </radialGradient>
        <radialGradient id={`${uid}ol`} cx="50%" cy="55%">
          <stop offset="0%" stopColor="#F8ECFF" />
          <stop offset="50%" stopColor="#D08CF8" />
          <stop offset="100%" stopColor="#8B22FF" />
        </radialGradient>
        <linearGradient id={`${uid}ost`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 68 C50 78 50 90 50 106" stroke={`url(#${uid}ost)`} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Leaves */}
      <path d="M50 82 C41 76 33 80 35 88 C37 94 47 90 50 82" fill="#2D6B24"/>
      {/* Top sepal */}
      <path d="M50 66 C48 58 45 48 46 38 C47 30 49 26 50 26 C51 26 53 30 54 38 C55 48 52 58 50 66Z"
        fill={`url(#${uid}op)`} opacity="0.85"/>
      {/* Left sepal */}
      <path d="M50 66 C43 62 34 58 28 52 C24 46 23 40 26 36 C34 44 40 52 50 66Z"
        fill={`url(#${uid}op)`} opacity="0.85"/>
      {/* Right sepal */}
      <path d="M50 66 C57 62 66 58 72 52 C76 46 77 40 74 36 C66 44 60 52 50 66Z"
        fill={`url(#${uid}op)`} opacity="0.85"/>
      {/* Left petal */}
      <path d="M50 64 C42 60 35 54 33 48 C31 42 34 36 40 36 C44 40 46 50 50 64Z"
        fill={`url(#${uid}ol)`}/>
      {/* Right petal */}
      <path d="M50 64 C58 60 65 54 67 48 C69 42 66 36 60 36 C56 40 54 50 50 64Z"
        fill={`url(#${uid}ol)`}/>
      {/* Labellum (lip) - distinctive orchid feature */}
      <path d="M44 66 C42 70 41 76 44 78 C46 80 50 80 50 80 C50 80 54 80 56 78 C59 76 58 70 56 66 C54 70 52 72 50 72 C48 72 46 70 44 66Z"
        fill="#FF69B4"/>
      {/* Lip detail */}
      <path d="M48 70 C48 72 49 73 50 73 C51 73 52 72 52 70" stroke="#CC0055" strokeWidth="0.8" fill="none"/>
      {/* Column */}
      <circle cx="50" cy="66" r="3" fill="#FFEEFF"/>
      <circle cx="50" cy="66" r="1.5" fill="#A855F7"/>
      {/* Vein lines on petals */}
      <path d="M38 38 C40 45 43 55 50 64" stroke="#7B2FF7" strokeWidth="0.5" opacity="0.4" fill="none"/>
      <path d="M62 38 C60 45 57 55 50 64" stroke="#7B2FF7" strokeWidth="0.5" opacity="0.4" fill="none"/>
    </svg>
  );
}

function BirdOfParadise({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <linearGradient id={`${uid}bsp`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22AA44" />
          <stop offset="100%" stopColor="#006622" />
        </linearGradient>
        <linearGradient id={`${uid}bor`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD000" />
          <stop offset="50%" stopColor="#FF8800" />
          <stop offset="100%" stopColor="#FF5500" />
        </linearGradient>
        <linearGradient id={`${uid}bbl`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2244CC" />
          <stop offset="100%" stopColor="#001188" />
        </linearGradient>
        <linearGradient id={`${uid}bst`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M44 80 C44 88 44 96 44 108" stroke={`url(#${uid}bst)`} strokeWidth="2.8" strokeLinecap="round"/>
      {/* Long leaf */}
      <path d="M44 95 C50 85 62 78 68 72 C62 80 58 88 44 95Z" fill={`url(#${uid}bsp)`}/>
      {/* Spathe (green bract) */}
      <path d="M30 78 C32 70 38 60 46 52 C52 46 56 44 60 44 C62 44 62 46 60 50 C54 56 48 64 46 74 C40 78 36 78 30 78Z"
        fill={`url(#${uid}bsp)`}/>
      {/* Spathe highlight */}
      <path d="M38 76 C40 68 44 58 50 50 C54 44 57 44 58 46 C52 52 46 62 44 72Z"
        fill="rgba(255,255,255,0.15)"/>
      {/* Orange petals */}
      <path d="M46 52 C44 44 40 34 38 26 C42 20 48 16 52 16 C50 22 48 30 46 40 C46 44 46 48 46 52Z"
        fill={`url(#${uid}bor)`}/>
      <path d="M46 52 C48 44 50 36 54 28 C58 22 62 18 64 20 C60 26 56 34 52 44 C50 48 48 50 46 52Z"
        fill={`url(#${uid}bor)`}/>
      <path d="M46 52 C50 46 56 40 62 34 C66 28 68 24 68 26 C66 32 60 40 54 48 C50 52 48 52 46 52Z"
        fill="#FFAA00" opacity="0.8"/>
      {/* Blue tongue */}
      <path d="M46 58 C43 52 40 44 42 38 C44 32 48 30 50 32 C50 38 48 46 46 58Z"
        fill={`url(#${uid}bbl)`}/>
      <path d="M46 58 C48 52 50 44 52 38 C54 32 56 30 56 34 C54 42 50 50 46 58Z"
        fill={`url(#${uid}bbl)`} opacity="0.7"/>
    </svg>
  );
}

function BlushRanunculus({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}ro1`} cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#FFF0F0" />
          <stop offset="40%" stopColor="#FFCCC0" />
          <stop offset="100%" stopColor="#FF9080" />
        </radialGradient>
        <radialGradient id={`${uid}ro2`} cx="50%" cy="55%">
          <stop offset="0%" stopColor="#FFECE8" />
          <stop offset="100%" stopColor="#FF8070" />
        </radialGradient>
        <radialGradient id={`${uid}ro3`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFE0D8" />
          <stop offset="100%" stopColor="#FF6050" />
        </radialGradient>
        <linearGradient id={`${uid}rst`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 64 C49 74 48 84 50 96 C51 103 50 108 50 108" stroke={`url(#${uid}rst)`} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M50 82 C42 76 34 79 36 87 C38 93 47 90 50 82" fill="#2D6B24"/>
      {/* Outermost petals (8) */}
      {[0,45,90,135,180,225,270,315].map(r => (
        <path key={r}
          d="M0 0 C-8 -2 -12 -14 -10 -23 C-8 -29 -4 -32 0 -32 C4 -32 8 -29 10 -23 C12 -14 8 -2 0 0Z"
          fill={`url(#${uid}ro1)`} transform={`translate(50,48) rotate(${r})`} opacity="0.8"/>
      ))}
      {/* 2nd ring (8, offset 22.5°) */}
      {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(r => (
        <path key={r}
          d="M0 0 C-6 -1 -10 -11 -8 -18 C-7 -23 -3 -26 0 -26 C3 -26 7 -23 8 -18 C10 -11 6 -1 0 0Z"
          fill={`url(#${uid}ro2)`} transform={`translate(50,48) rotate(${r})`} opacity="0.87"/>
      ))}
      {/* 3rd ring (6) */}
      {[0,60,120,180,240,300].map(r => (
        <path key={r}
          d="M0 0 C-4 0 -7 -8 -6 -14 C-5 -18 -2 -21 0 -21 C2 -21 5 -18 6 -14 C7 -8 4 0 0 0Z"
          fill={`url(#${uid}ro3)`} transform={`translate(50,48) rotate(${r})`} opacity="0.93"/>
      ))}
      {/* 4th ring (5) */}
      {[0,72,144,216,288].map(r => (
        <path key={r}
          d="M0 0 C-3 0 -5 -6 -4 -10 C-3 -13 -1 -15 0 -15 C1 -15 3 -13 4 -10 C5 -6 3 0 0 0Z"
          fill="#FF9080" transform={`translate(50,48) rotate(${r})`} opacity="0.95"/>
      ))}
      <circle cx="50" cy="48" r="5" fill="#FF7060"/>
      <circle cx="50" cy="48" r="2.5" fill="#CC4030"/>
    </svg>
  );
}

function PinkProtea({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}pb`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#FFE0F0" />
          <stop offset="40%" stopColor="#FF80B8" />
          <stop offset="100%" stopColor="#CC0050" />
        </radialGradient>
        <radialGradient id={`${uid}pc`} cx="40%" cy="40%">
          <stop offset="0%" stopColor="#FFF0F8" />
          <stop offset="50%" stopColor="#FFD0E8" />
          <stop offset="100%" stopColor="#FF80B8" />
        </radialGradient>
        <linearGradient id={`${uid}pst`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path d="M50 66 C49 76 48 86 50 98 C51 105 50 108 50 108" stroke={`url(#${uid}pst)`} strokeWidth="2.8" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M50 84 C42 78 34 81 36 89 C38 95 47 92 50 84" fill="#2D6B24"/>
      {/* Outer pointed bracts (12) */}
      {Array.from({length:12}).map((_,i) => {
        const r = i * 30;
        return (
          <path key={i}
            d="M0 0 C-5 -2 -7 -16 -5 -26 C-4 -32 -1 -36 0 -36 C1 -36 4 -32 5 -26 C7 -16 5 -2 0 0Z"
            fill={`url(#${uid}pb)`} transform={`translate(50,50) rotate(${r})`} opacity="0.82"/>
        );
      })}
      {/* Inner bracts (8) — slightly shorter */}
      {Array.from({length:8}).map((_,i) => {
        const r = i * 45 + 15;
        return (
          <path key={i}
            d="M0 0 C-4 -1 -5 -12 -4 -20 C-3 -25 -1 -27 0 -27 C1 -27 3 -25 4 -20 C5 -12 4 -1 0 0Z"
            fill={`url(#${uid}pb)`} transform={`translate(50,50) rotate(${r})`} opacity="0.9"/>
        );
      })}
      {/* Fluffy centre dome */}
      <circle cx="50" cy="50" r="14" fill={`url(#${uid}pc)`}/>
      {/* Centre hair-like stamens */}
      {Array.from({length:18}).map((_,i) => {
        const r = i * 20;
        const len = 8 + (i % 3) * 2;
        return (
          <line key={i}
            x1="50" y1="50"
            x2={50+len*Math.sin(r*Math.PI/180)} y2={50-len*Math.cos(r*Math.PI/180)}
            stroke="#FF1F7D" strokeWidth="0.7" strokeLinecap="round" opacity="0.7"/>
        );
      })}
      <circle cx="50" cy="50" r="5" fill="#FFD0E8"/>
    </svg>
  );
}

function GoldenMimosa({ size = 72, locked = false }: { size?: number; locked?: boolean }) {
  const uid = useId().replace(/:/g, "_");
  const op = locked ? 0.22 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 112" fill="none" style={{ opacity: op }}>
      <defs>
        <radialGradient id={`${uid}mp`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FFF080" />
          <stop offset="50%" stopColor="#FFD000" />
          <stop offset="100%" stopColor="#E08800" />
        </radialGradient>
        <linearGradient id={`${uid}mbr`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A4010" />
          <stop offset="100%" stopColor="#382808" />
        </linearGradient>
        <linearGradient id={`${uid}mst`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A7030" />
          <stop offset="100%" stopColor="#234A1E" />
        </linearGradient>
      </defs>
      {/* Main stem */}
      <path d="M50 85 C49 92 49 99 50 108" stroke={`url(#${uid}mst)`} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Branch left */}
      <path d="M50 85 C44 78 36 68 30 58" stroke={`url(#${uid}mbr)`} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Branch right */}
      <path d="M50 85 C56 76 64 66 70 54" stroke={`url(#${uid}mbr)`} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Branch centre */}
      <path d="M50 85 C50 76 50 64 50 50" stroke={`url(#${uid}mbr)`} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Sub-branches left */}
      <path d="M36 66 C32 62 28 56 24 50" stroke={`url(#${uid}mbr)`} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M30 58 C26 52 22 48 20 42" stroke={`url(#${uid}mbr)`} strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Sub-branches right */}
      <path d="M64 66 C68 62 72 56 76 50" stroke={`url(#${uid}mbr)`} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M70 54 C74 48 78 44 80 38" stroke={`url(#${uid}mbr)`} strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Feathery leaves along branches */}
      {[[38,70],[32,62],[26,54],[20,46],[50,70],[50,60],[50,52],[62,70],[66,62],[74,52],[78,44]].map(([cx,cy],i) => (
        <g key={i}>
          <ellipse cx={cx-3} cy={cy} rx="4" ry="1.5" fill="#3A7820" transform={`rotate(-20,${cx-3},${cy})`} opacity="0.7"/>
          <ellipse cx={cx+3} cy={cy} rx="4" ry="1.5" fill="#3A7820" transform={`rotate(20,${cx+3},${cy})`} opacity="0.7"/>
        </g>
      ))}
      {/* Golden pom-poms */}
      {[[30,56],[22,46],[20,40],[38,70],[50,50],[50,60],[50,68],[66,62],[76,50],[80,36]].map(([cx,cy],i) => (
        <g key={i}>
          {[0,60,120,180,240,300].map((r,j) => (
            <circle key={j}
              cx={cx + 4.5*Math.sin(r*Math.PI/180)}
              cy={cy - 4.5*Math.cos(r*Math.PI/180)}
              r="2.8" fill={`url(#${uid}mp)`}/>
          ))}
          <circle cx={cx} cy={cy} r="3" fill={`url(#${uid}mp)`}/>
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOWER CATALOGUE
// ─────────────────────────────────────────────────────────────────────────────

type FlowerDef = {
  id: string;
  name: string;
  meaning: string;
  earnedBy: string;
  tier: "free" | "premium";
  Component: React.FC<{ size?: number; locked?: boolean }>;
};

const FLOWER_CATALOGUE: FlowerDef[] = [
  { id: "pink-rose",        name: "Gathering Rose",     meaning: "You showed up.",          earnedBy: "Attend a social gathering",         tier: "free",    Component: PinkRose },
  { id: "cherry-blossom",   name: "Bloom Blossom",      meaning: "You started blooming.",   earnedBy: "Join your first club",              tier: "free",    Component: CherryBlossom },
  { id: "pink-tulip",       name: "Social Tulip",       meaning: "You kept showing up.",     earnedBy: "RSVP to 3 or more events",          tier: "free",    Component: PinkTulip },
  { id: "white-peony",      name: "Connector Peony",    meaning: "You built something real.",earnedBy: "Make a meaningful connection",       tier: "free",    Component: WhitePeony },
  { id: "wild-daisy",       name: "Explorer Daisy",     meaning: "You explored the city.",   earnedBy: "Visit 3 different neighborhoods",   tier: "free",    Component: WildDaisy },
  { id: "purple-orchid",    name: "Moon Orchid",         meaning: "Rare. Like you.",          earnedBy: "Premium — gifted or purchased",      tier: "premium", Component: PurpleOrchid },
  { id: "bird-of-paradise", name: "Paradise Bloom",      meaning: "You are extraordinary.",   earnedBy: "Premium — ultra rare gift",          tier: "premium", Component: BirdOfParadise },
  { id: "blush-ranunculus", name: "Silk Ranunculus",     meaning: "Layered and luminous.",    earnedBy: "Premium — gifted or purchased",      tier: "premium", Component: BlushRanunculus },
  { id: "pink-protea",      name: "Garden Protea",       meaning: "Bold and unforgettable.",  earnedBy: "Premium — gifted or purchased",      tier: "premium", Component: PinkProtea },
  { id: "golden-mimosa",    name: "Golden Mimosa",       meaning: "You light every room.",    earnedBy: "Premium — ultra rare gift",          tier: "premium", Component: GoldenMimosa },
];

// ─────────────────────────────────────────────────────────────────────────────
// PASSPORT COVER MINI (for template picker)
// ─────────────────────────────────────────────────────────────────────────────

function PassportCoverMini({ tpl, active, onClick }: { tpl: Template; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, width: 80, height: 112, borderRadius: 10,
        background: tpl.coverGrad,
        boxShadow: active
          ? `0 0 0 2.5px ${PINK}, 0 8px 24px rgba(0,0,0,0.22)`
          : "0 4px 14px rgba(0,0,0,0.16)",
        border: "none", cursor: "pointer", padding: 0, overflow: "hidden",
        position: "relative", transition: "box-shadow 0.2s ease",
        transform: active ? "scale(1.06)" : "scale(1)",
      }}
    >
      {/* Cover decoration */}
      <div style={{ position: "absolute", top: 8, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "5.5px", letterSpacing: "0.2em", color: tpl.coverTextCol, opacity: 0.75 }}>✦ BLOOMBAY ✦</p>
      </div>
      {/* BB monogram */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-55%)", width: 30, height: 30, borderRadius: "50%", border: `1px solid ${tpl.coverTextCol}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.75 }}>
        <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "11px", color: tpl.coverTextCol }}>BB</span>
      </div>
      <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: "5px", letterSpacing: "0.22em", color: tpl.coverTextCol, opacity: 0.65 }}>BLOOM PASSPORT</p>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSPORT COVER (full size — shown when passport is "closed")
// ─────────────────────────────────────────────────────────────────────────────

function PassportCover({ tpl, onOpen }: { tpl: Template; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      style={{
        width: 200, height: 280, borderRadius: 14, background: tpl.coverGrad,
        boxShadow: "0 20px 56px rgba(0,0,0,0.28), 6px 0 0 rgba(0,0,0,0.08) inset",
        position: "relative", overflow: "hidden", cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {/* Subtle grain */}
      <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", pointerEvents: "none", opacity: 0.6 }} />
      {/* Emboss radial */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />
      {/* Spine edge shadow */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 12, background: "linear-gradient(to right, rgba(0,0,0,0.25), transparent)", pointerEvents: "none" }} />
      {/* Top country line */}
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: "8px", letterSpacing: "0.28em", color: tpl.coverTextCol }}>✦ BLOOMBAY ✦</p>
      </div>
      {/* BB monogram circle */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-58%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1.5px solid ${tpl.coverTextCol}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.85 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "22px", color: tpl.coverTextCol, lineHeight: 1, letterSpacing: "-0.02em" }}>BB</p>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 500, fontSize: "5px", letterSpacing: "0.1em", color: tpl.coverTextCol, opacity: 0.7 }}>✦ ✦</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "13px", color: tpl.coverTextCol, opacity: 0.8, letterSpacing: "-0.01em" }}>{tpl.tagline}</p>
      </div>
      {/* Bottom title */}
      <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "9px", letterSpacing: "0.28em", color: tpl.coverTextCol, opacity: 0.85 }}>BLOOM PASSPORT</p>
      </div>
      {/* Open hint */}
      <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "11px", color: tpl.coverTextCol, opacity: 0.5 }}>tap to open</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEFT PAGE — identity page
// ─────────────────────────────────────────────────────────────────────────────

type ProfileData = { first_name?: string; avatar_url?: string; borough?: string; created_at?: string; id?: string };

function LeftPage({ tpl, profile, onUpload, uploading }: {
  tpl: Template; profile: ProfileData | null;
  onUpload: () => void; uploading: boolean;
}) {
  const memberNumber = profile?.id ? `BB-${profile.id.slice(-6).toUpperCase()}` : "BB-000000";
  const since = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
    : "---";

  return (
    <div style={{
      width: 180, minHeight: 260, background: tpl.pagesBg,
      borderRadius: "12px 0 0 12px", flexShrink: 0,
      padding: "14px 12px 12px", display: "flex", flexDirection: "column", gap: 8,
      borderRight: `1px solid ${tpl.pageBorder}`,
    }}>
      {/* Page header */}
      <div style={{ background: tpl.headerBg, borderRadius: 8, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "7px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.92)" }}>BLOOM PASSPORT</p>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: "6px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>BLOOMBAY</p>
      </div>

      {/* Photo + info row */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        {/* Photo */}
        <div
          onClick={onUpload}
          style={{
            flexShrink: 0, width: 56, height: 68,
            borderRadius: 6, background: tpl.slotBg,
            border: `1.5px solid ${tpl.slotBorder}`,
            overflow: "hidden", cursor: "pointer", position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {uploading ? (
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${tpl.pagesAccent}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}/>
          ) : profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Passport photo" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          ) : (
            <div style={{ textAlign: "center", padding: 4 }}>
              <p style={{ fontSize: "18px", lineHeight: 1 }}>📷</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 700, color: tpl.pagesSubtext, marginTop: 2, lineHeight: 1.3 }}>ADD PHOTO</p>
            </div>
          )}
          {/* Photo edit hint on hover */}
          {profile?.avatar_url && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
            >
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 700, color: "white", letterSpacing: "0.1em" }}>CHANGE</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.18em", color: tpl.pagesSubtext, marginBottom: 1 }}>MEMBER</p>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "11px", color: tpl.pagesText, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {profile?.first_name || "Your Name"}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 600, color: tpl.pagesSubtext, marginTop: 2, letterSpacing: "0.05em" }}>
            {profile?.borough || "New York City"}
          </p>

          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 700, letterSpacing: "0.18em", color: tpl.pagesSubtext }}>MEMBER NO.</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: tpl.pagesAccent, letterSpacing: "0.08em" }}>{memberNumber}</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 700, letterSpacing: "0.18em", color: tpl.pagesSubtext }}>MEMBER SINCE</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: tpl.pagesText, letterSpacing: "0.06em" }}>{since}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: tpl.pageBorder }} />

      {/* Signature line */}
      <div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 700, letterSpacing: "0.18em", color: tpl.pagesSubtext, marginBottom: 3 }}>SIGNATURE</p>
        <div style={{ height: 22, borderBottom: `1px solid ${tpl.pageBorder}`, position: "relative" }}>
          {profile?.first_name && (
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "15px", color: tpl.pagesAccent, position: "absolute", bottom: 2, left: 0, opacity: 0.7 }}>
              {profile.first_name}
            </p>
          )}
        </div>
      </div>

      {/* Decorative seal */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${tpl.pagesAccent}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "7px", color: tpl.pagesAccent }}>BB</span>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.14em", color: tpl.pagesSubtext }}>WHERE YOU BLOOM</p>
      </div>

      {/* MRZ zone (machine readable zone decoration) */}
      <div style={{ marginTop: "auto", borderTop: `1px solid ${tpl.footerLines}`, paddingTop: 5 }}>
        <p style={{ fontFamily: "monospace", fontSize: "4.5px", color: tpl.mrz, letterSpacing: "0.04em", lineHeight: 1.5 }}>
          P&lt;BBY{(profile?.first_name || "MEMBER").toUpperCase().padEnd(9,"&lt;")}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
          {memberNumber.replace("-","")}&lt;{since.replace(" ","")}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RIGHT PAGE — flower garden
// ─────────────────────────────────────────────────────────────────────────────

type EarnedFlower = {
  flowerId: string;
  eventName: string;
  date: string;
  count: number;
};

function RightPage({ tpl, earned }: { tpl: Template; earned: EarnedFlower[] }) {
  const earnedMap = new Map(earned.map(e => [e.flowerId, e]));

  return (
    <div style={{
      width: 180, minHeight: 260, background: tpl.pagesBg,
      borderRadius: "0 12px 12px 0", flexShrink: 0,
      padding: "14px 12px 12px", display: "flex", flexDirection: "column", gap: 8,
    }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "7px", letterSpacing: "0.22em", color: tpl.pagesAccent }}>MY GARDEN</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 600, color: tpl.pagesSubtext }}>{earned.length} / {FLOWER_CATALOGUE.length}</p>
      </div>

      {/* Flower grid — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {FLOWER_CATALOGUE.map(flower => {
          const e = earnedMap.get(flower.id);
          const isEarned = !!e;
          return (
            <div
              key={flower.id}
              style={{
                background: isEarned ? tpl.slotBg : "transparent",
                border: `1px solid ${isEarned ? tpl.slotBorder : tpl.footerLines}`,
                borderRadius: 8, padding: "6px 4px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                position: "relative",
              }}
            >
              <flower.Component size={44} locked={!isEarned}/>
              <p style={{
                fontFamily: "var(--font-jost)", fontSize: "4.5px", fontWeight: 700,
                color: isEarned ? tpl.pagesAccent : tpl.pagesSubtext,
                textAlign: "center", lineHeight: 1.2, letterSpacing: "0.06em",
              }}>
                {isEarned ? (e.eventName.length > 10 ? e.eventName.slice(0,10)+"…" : e.eventName) : "·"}
              </p>
              {isEarned && e.count > 1 && (
                <div style={{ position: "absolute", top: 3, right: 3, width: 12, height: 12, borderRadius: "50%", background: tpl.pagesAccent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 900, color: "white" }}>{e.count}</span>
                </div>
              )}
              {flower.tier === "premium" && !isEarned && (
                <div style={{ position: "absolute", top: 3, right: 3 }}>
                  <span style={{ fontSize: "7px" }}>✦</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: "auto", borderTop: `1px solid ${tpl.footerLines}`, paddingTop: 6 }}>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "7px", color: tpl.pagesSubtext, textAlign: "center" }}>
          Every gathering leaves a bloom.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PETAL TRACKER
// ─────────────────────────────────────────────────────────────────────────────

function PetalTracker({ petals, nextFlower, needed }: { petals: number; nextFlower: string; needed: number }) {
  const pct = Math.min(100, Math.round((petals / needed) * 100));
  return (
    <div style={{ background: "#FFF5F8", borderRadius: 20, padding: "18px 20px", border: "1px solid rgba(255,31,125,0.12)", margin: "0 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 2 }}>YOUR PETALS</p>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "20px", color: PINK, lineHeight: 1 }}>{petals}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.38)", marginBottom: 2 }}>NEXT FLOWER</p>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "11px", color: INK }}>{nextFlower}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.38)" }}>{needed - petals} petals away</p>
        </div>
      </div>
      <div style={{ width: "100%", height: 7, borderRadius: 999, background: "rgba(255,31,125,0.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${PINK}, #FF69B4)`, transition: "width 0.8s ease" }}/>
      </div>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 600, color: "rgba(0,0,0,0.35)", textAlign: "center", marginTop: 6 }}>
        {pct}% of the way to your next bloom
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOWER GALLERY — full catalogue
// ─────────────────────────────────────────────────────────────────────────────

function FlowerGallery({ earned }: { earned: EarnedFlower[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "free" | "premium">("all");
  const earnedMap = new Map(earned.map(e => [e.flowerId, e]));

  const filtered = FLOWER_CATALOGUE.filter(f =>
    activeTab === "all" ? true : f.tier === activeTab
  );

  return (
    <div style={{ padding: "0 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)" }}>FLOWER COLLECTION</p>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "17px", color: INK, lineHeight: 1.1 }}>All blooms</p>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["all","free","premium"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "4px 10px", borderRadius: 999, border: "none", cursor: "pointer",
                fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: "8px", letterSpacing: "0.1em",
                background: activeTab === tab ? PINK : "rgba(255,31,125,0.08)",
                color: activeTab === tab ? "white" : "rgba(0,0,0,0.45)",
                transition: "all 0.15s",
                textTransform: "uppercase",
              }}
            >
              {tab === "premium" ? "✦ Premium" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
        {filtered.map(flower => {
          const e = earnedMap.get(flower.id);
          const isEarned = !!e;
          return (
            <div key={flower.id} style={{
              background: isEarned ? "#FFF5F8" : "#FAFAFA",
              border: `1px solid ${isEarned ? "rgba(255,31,125,0.18)" : "rgba(0,0,0,0.07)"}`,
              borderRadius: 18, padding: "16px 14px",
              display: "flex", gap: 12, alignItems: "center",
              position: "relative", overflow: "hidden",
            }}>
              {/* Premium shimmer */}
              {flower.tier === "premium" && (
                <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg,#FFD700,#FFA000)", padding: "3px 8px 3px 12px", borderRadius: "0 18px 0 12px" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 900, color: "white", letterSpacing: "0.12em" }}>PREMIUM</p>
                </div>
              )}
              <div style={{ flexShrink: 0 }}>
                <flower.Component size={56} locked={!isEarned}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "12px", color: INK, lineHeight: 1.1 }}>{flower.name}</p>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "10px", color: "rgba(0,0,0,0.45)", marginTop: 2, lineHeight: 1.3 }}>{flower.meaning}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: isEarned ? PINK : "rgba(0,0,0,0.3)", marginTop: 4 }}>
                  {isEarned ? `✓ Earned at ${e.eventName}` : flower.earnedBy}
                </p>
                {isEarned && e.count > 1 && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,31,125,0.6)", marginTop: 2 }}>×{e.count}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_EARNED: EarnedFlower[] = [];

export default function PassportPage() {
  const [templateIdx, setTemplateIdx] = useState(0);
  const [view, setView] = useState<"cover" | "open">("cover");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const tpl = TEMPLATES[templateIdx];

  useEffect(() => {
    async function load() {
      try {
        const sb = createClient();
        const { data: { user } } = await sb.auth.getUser();
        if (!user) return;
        const { data } = await sb.from("profiles")
          .select("first_name, avatar_url, borough, created_at, id")
          .eq("id", user.id).single();
        setProfile(data);
        setNameInput(data?.first_name ?? "");
      } catch { /* not authenticated, show empty state */ }
    }
    load();
  }, []);

  async function handleSaveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) { setNameError("Name can't be empty."); return; }
    setSavingName(true); setNameError(null);
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { error: err } = await sb.from("profiles").update({ first_name: trimmed }).eq("id", user.id);
      if (err) throw err;
      setProfile(p => p ? { ...p, first_name: trimmed } : { first_name: trimmed });
      setEditingName(false);
    } catch (e: unknown) {
      setNameError((e as Error).message);
    } finally {
      setSavingName(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { uploadAvatar } = await import("@/lib/storage/upload");
      const publicUrl = await uploadAvatar(file, user.id);
      await sb.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setProfile(p => p ? { ...p, avatar_url: publicUrl } : { avatar_url: publicUrl });
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  const memberNumber = profile?.id ? `BB-${profile.id.slice(-6).toUpperCase()}` : "BB-000000";

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingBottom: 120 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── TOP HEADER ── */}
      <div style={{ background: tpl.coverGrad, padding: "calc(env(safe-area-inset-top,0px) + 18px) 22px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 55%)", pointerEvents: "none" }}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Link href="/member/apartment" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>apartment</span>
          </Link>
          <button
            onClick={() => { setNameInput(profile?.first_name ?? ""); setEditingName(true); }}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "6px 14px", cursor: "pointer" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}>Edit</span>
          </button>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.26em", color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>✦ BLOOMBAY</p>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "32px", color: "white", lineHeight: 1, margin: 0, letterSpacing: "-0.01em" }}>Bloom Passport</h1>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginTop: 4, letterSpacing: "0.02em" }}>{memberNumber}</p>
      </div>

      {/* ── EDIT NAME SHEET ── */}
      {editingName && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.48)", backdropFilter: "blur(4px)" }} onClick={() => setEditingName(false)}/>
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, borderRadius: "24px 24px 0 0", background: "#FEFCF7", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", padding: "0 24px calc(env(safe-area-inset-bottom,0px) + 28px)" }}>
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 8 }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.12)" }}/>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,31,125,0.7)", marginBottom: 2 }}>EDIT PASSPORT</p>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "#111", lineHeight: 1 }}>Update your name.</p>
              </div>
              <button onClick={() => setEditingName(false)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
              </button>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: "#aaa", marginBottom: 6 }}>YOUR NAME</p>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Your first name"
              autoFocus
              style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 16, border: "1.5px solid rgba(255,31,125,0.2)", background: "white", fontFamily: "var(--font-jost)", fontSize: 16, fontWeight: 700, color: "#111", outline: "none" }}
            />
            {nameError && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#E63946", marginTop: 6 }}>{nameError}</p>}
            <button
              onClick={handleSaveName}
              disabled={savingName}
              style={{ width: "100%", marginTop: 14, padding: "15px", borderRadius: 18, border: "none", cursor: savingName ? "default" : "pointer", background: savingName ? "#F0E0E8" : PINK, color: savingName ? "#C8A0B0" : "white", fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 14, letterSpacing: "0.06em" }}
            >
              {savingName ? "Saving…" : "Save Name"}
            </button>
          </div>
        </>
      )}

      {/* ── TEMPLATE PICKER ── */}
      <div style={{ padding: "20px 20px 8px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.38)", marginBottom: 12 }}>CHOOSE YOUR COVER</p>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {TEMPLATES.map((t, i) => (
            <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <PassportCoverMini tpl={t} active={i === templateIdx} onClick={() => setTemplateIdx(i)}/>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: i === templateIdx ? 800 : 600, color: i === templateIdx ? PINK : "rgba(0,0,0,0.4)", letterSpacing: "0.06em" }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PASSPORT VIEW ── */}
      <div style={{ padding: "12px 0 20px" }}>
        {view === "cover" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <PassportCover tpl={tpl} onOpen={() => setView("open")}/>
            <button
              onClick={() => setView("open")}
              style={{
                padding: "10px 28px", borderRadius: 999,
                background: tpl.coverGrad,
                color: "white", border: "none", cursor: "pointer",
                fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "11px", letterSpacing: "0.14em",
                boxShadow: "0 6px 20px rgba(255,31,125,0.28)",
              }}
            >
              OPEN PASSPORT →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {/* Spread */}
            <div style={{ overflowX: "auto", width: "100%", paddingLeft: "max(20px, calc(50% - 185px))", paddingRight: 20 }}>
              <div style={{
                display: "flex", width: 370,
                boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.12)",
                borderRadius: 12,
              }}>
                <LeftPage tpl={tpl} profile={profile} onUpload={() => fileRef.current?.click()} uploading={uploading}/>
                {/* Spine */}
                <div style={{ width: 10, background: tpl.spineColor, flexShrink: 0, boxShadow: "inset -3px 0 6px rgba(0,0,0,0.15), inset 3px 0 6px rgba(0,0,0,0.1)" }}/>
                <RightPage tpl={tpl} earned={MOCK_EARNED}/>
              </div>
            </div>
            <button
              onClick={() => setView("cover")}
              style={{
                padding: "8px 20px", borderRadius: 999, border: "1.5px solid rgba(255,31,125,0.25)",
                background: "transparent", cursor: "pointer",
                fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: "10px", color: PINK, letterSpacing: "0.1em",
              }}
            >
              ← View Cover
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,31,125,0.1)", margin: "4px 20px 20px" }}/>

      {/* ── PETAL TRACKER ── */}
      <PetalTracker petals={12} nextFlower="Connector Peony" needed={25}/>

      {/* ── HOW PETALS WORK ── */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ borderRadius: 18, background: "#FFF5F8", border: "1px solid rgba(255,31,125,0.1)", padding: "16px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)", marginBottom: 10 }}>HOW IT WORKS</p>
          <div style={{ display: "flex", gap: 0, position: "relative" }}>
            {[
              { step: "Moments", desc: "Go to events. Make connections.", icon: "🌸" },
              { step: "Petals",  desc: "Each moment gives you petals.",  icon: "✿" },
              { step: "Flowers", desc: "Petals become beautiful blooms.", icon: "🌺" },
              { step: "Bloom",   desc: "Your passport fills with life.",  icon: "🌷" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                {i < 3 && (
                  <div style={{ position: "absolute", top: 12, left: "50%", width: "100%", height: 1, background: `linear-gradient(to right, ${PINK}40, ${PINK}20)`, pointerEvents: "none" }}/>
                )}
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "white", border: `1.5px solid rgba(255,31,125,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: "13px" }}>{s.icon}</span>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: "8px", color: PINK, letterSpacing: "0.06em" }}>{s.step}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.38)", marginTop: 2, lineHeight: 1.4 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLOWER GALLERY ── */}
      <div style={{ padding: "24px 0 0" }}>
        <FlowerGallery earned={MOCK_EARNED}/>
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={handlePhotoUpload}/>
    </div>
  );
}
