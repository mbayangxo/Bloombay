"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { BBLogo } from "./bb-logo";
import "@/app/styles/bloom-entrance.css";

const PINK  = "#FF1F7D";

if (typeof document !== "undefined") {
  if (!document.getElementById("bb-nav-style")) {
    const s = document.createElement("style");
    s.id = "bb-nav-style";
    s.textContent = `
      @keyframes pinkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.65;transform:scale(0.88)} }
    `;
    document.head.appendChild(s);
  }
}

interface NavUser { name: string; initial: string; role: string; }

type Slab = "morning" | "afternoon" | "evening" | "tonight";
function getSlab(): Slab {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "tonight";
}
const SLAB_LABEL: Record<Slab, string> = {
  morning: "This Morning", afternoon: "This Afternoon", evening: "This Evening", tonight: "Tonight",
};

type SVGProps = { c: string; w?: number };

function IconTime({ c, w = 2, slab }: SVGProps & { slab: Slab }) {
  if (slab === "morning") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="sunBody" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#FFFDE8"/>
          <stop offset="40%" stopColor="#FFDD00"/>
          <stop offset="100%" stopColor="#FF8800"/>
        </radialGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Soft outer glow */}
      <circle cx="12" cy="12" r="10.5" fill="url(#sunGlow)"/>
      {/* Rays — alternating long/short */}
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const rad = a * Math.PI / 180;
        const r1 = 7, r2 = r1 + (i%2===0 ? 3.8 : 2.4);
        return <line key={a} x1={12+r1*Math.cos(rad)} y1={12+r1*Math.sin(rad)}
          x2={12+r2*Math.cos(rad)} y2={12+r2*Math.sin(rad)}
          stroke={i%2===0 ? "#FFCC00" : "#FF9900"} strokeWidth={i%2===0 ? 2.2 : 1.4} strokeLinecap="round"/>;
      })}
      {/* Sun disc with gradient */}
      <circle cx="12" cy="12" r="5.8" fill="url(#sunBody)"/>
      {/* Limb darkening ring */}
      <circle cx="12" cy="12" r="5.6" stroke="#FF8800" strokeWidth="0.6" fill="none" opacity="0.35"/>
      {/* Specular highlight */}
      <ellipse cx="10" cy="9.8" rx="2.4" ry="1.6" fill="white" opacity="0.55" transform="rotate(-25 10 9.8)"/>
    </svg>
  );
  if (slab === "afternoon") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="cloudMain" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white"/>
          <stop offset="60%" stopColor={c} stopOpacity="0.85"/>
          <stop offset="100%" stopColor={c}/>
        </radialGradient>
        <radialGradient id="cloudShadow" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
      </defs>
      {/* Sun peeks behind upper right */}
      <circle cx="18" cy="9.5" r="3.8" fill="#FFCC00" opacity="0.55"/>
      <line x1="18" y1="4.5" x2="18" y2="3" stroke="#FFAA00" strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
      <line x1="21.8" y1="6.5" x2="23" y2="5.3" stroke="#FFAA00" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      <line x1="22.5" y1="9.5" x2="24" y2="9.5" stroke="#FFAA00" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      {/* Cloud body — 4 overlapping circles for puffy look */}
      <circle cx="7.5" cy="16" r="4" fill={c} opacity="0.92"/>
      <circle cx="11.5" cy="13.5" r="5" fill={c} opacity="0.95"/>
      <circle cx="16" cy="15" r="3.8" fill={c} opacity="0.9"/>
      <circle cx="19.5" cy="16.5" r="2.8" fill={c} opacity="0.85"/>
      {/* Cloud base fill */}
      <rect x="4" y="16" width="18" height="5" fill={c} opacity="0.88"/>
      {/* Top highlight */}
      <ellipse cx="11.5" cy="12" rx="4" ry="1.6" fill="white" opacity="0.35"/>
      {/* Bottom shadow */}
      <ellipse cx="12" cy="20" rx="6" ry="1.2" fill="rgba(0,0,0,0.12)"/>
    </svg>
  );
  if (slab === "evening") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6633" stopOpacity="0.7"/>
          <stop offset="50%" stopColor="#FF3366" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#330066" stopOpacity="0.3"/>
        </linearGradient>
        <radialGradient id="sunSet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEE55"/>
          <stop offset="50%" stopColor="#FF8800"/>
          <stop offset="100%" stopColor="#FF4400"/>
        </radialGradient>
      </defs>
      {/* Sky wash behind */}
      <rect x="0" y="0" width="24" height="24" fill="url(#skyGrad)" rx="2"/>
      {/* Horizon line */}
      <line x1="1" y1="17" x2="23" y2="17" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      {/* Half-sun with gradient */}
      <path d="M6 17 A6 6 0 0 1 18 17Z" fill="url(#sunSet)"/>
      {/* Sun highlight */}
      <ellipse cx="10.5" cy="15.2" rx="2.8" ry="1.2" fill="white" opacity="0.35"/>
      {/* Rays */}
      <line x1="12" y1="3" x2="12" y2="6.5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <line x1="5.4" y1="5.4" x2="7.5" y2="7.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="18.6" y1="5.4" x2="16.5" y2="7.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="2.5" y1="12" x2="5.5" y2="12" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="18.5" y1="12" x2="21.5" y2="12" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      {/* Horizon reflection glow */}
      <ellipse cx="12" cy="17" rx="6" ry="0.7" fill="#FF8800" opacity="0.25"/>
    </svg>
  );
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="moonFace" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#EEF4FF"/>
          <stop offset="45%" stopColor="#C4D4FF"/>
          <stop offset="100%" stopColor="#8898CC"/>
        </radialGradient>
      </defs>
      {/* Moon crescent */}
      <path d="M12 4 A8 8 0 1 0 12 20 A5.5 5.5 0 1 1 12 4Z" fill="url(#moonFace)"/>
      {/* Subtle crater marks */}
      <circle cx="9.2" cy="9" r="1.1" fill="rgba(80,90,150,0.2)"/>
      <circle cx="11" cy="14.5" r="1.4" fill="rgba(80,90,150,0.18)"/>
      <circle cx="7.5" cy="13" r="0.7" fill="rgba(80,90,150,0.15)"/>
      {/* Rim highlight on lit side */}
      <path d="M12 4 A8 8 0 0 1 12 20" stroke="white" strokeWidth="0.6" fill="none" opacity="0.4"/>
      {/* Stars */}
      <path d="M19.5 4.5 L20.1 6.4 L22 6.4 L20.5 7.5 L21.1 9.4 L19.5 8.3 L17.9 9.4 L18.5 7.5 L17 6.4 L18.9 6.4Z"
        fill={c} opacity="0.88"/>
      <circle cx="20.5" cy="14" r="0.9" fill={c} opacity="0.65"/>
      <circle cx="18.5" cy="18" r="0.6" fill={c} opacity="0.45"/>
      <circle cx="3.5" cy="4.5" r="0.7" fill={c} opacity="0.5"/>
    </svg>
  );
}

function IconPlans({ c }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="pageL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c}/>
          <stop offset="100%" stopColor={c} stopOpacity="0.82"/>
        </linearGradient>
        <linearGradient id="pageR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={c} stopOpacity="0.65"/>
        </linearGradient>
      </defs>
      {/* Left page — slight perspective taper */}
      <path d="M12 5.5 C9.5 5.5 5 6.2 3.5 7.8 L3.5 20.5 C5 19.2 9.5 18.5 12 18.5Z" fill="url(#pageL)"/>
      {/* Right page — slightly dimmer */}
      <path d="M12 5.5 C14.5 5.5 19 6.2 20.5 7.8 L20.5 20.5 C19 19.2 14.5 18.5 12 18.5Z" fill="url(#pageR)"/>
      {/* Spine with slight gradient */}
      <rect x="11.2" y="5.5" width="1.6" height="13" fill={c}/>
      {/* Highlights on left page */}
      <ellipse cx="7.8" cy="9.2" rx="2.8" ry="1.4" fill="white" opacity="0.28" transform="rotate(8 7.8 9.2)"/>
      {/* Page text lines left */}
      <line x1="5.5" y1="10.8" x2="10.5" y2="10.3" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.55"/>
      <line x1="5.5" y1="12.8" x2="10.5" y2="12.4" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.45"/>
      <line x1="5.5" y1="14.8" x2="9.5"  y2="14.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
      {/* Page text lines right */}
      <line x1="13.5" y1="10.3" x2="18.5" y2="10.8" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
      <line x1="13.5" y1="12.4" x2="18.5" y2="12.8" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      {/* Ribbon bookmark */}
      <path d="M17.5 5.5 L17.5 11.5 L16 10.2 L14.5 11.5 L14.5 5.5Z" fill="white" opacity="0.6"/>
      {/* Bookmark ribbon gradient */}
      <path d="M17.5 5.5 L17.5 8 L16 6.8 L14.5 8 L14.5 5.5Z" fill="white" opacity="0.2"/>
    </svg>
  );
}

function IconClubs({ c }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {/* Left figure (partial, behind centre) */}
      <circle cx="5.2" cy="7.8" r="2.6" fill={c} opacity="0.68"/>
      <path d="M1.5 21.5 C1.5 17.2 3 15 5.2 15 C6.6 15 8 15.8 8.8 17.6"
        stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.68"/>
      {/* Right figure (partial, behind centre) */}
      <circle cx="18.8" cy="7.8" r="2.6" fill={c} opacity="0.68"/>
      <path d="M22.5 21.5 C22.5 17.2 21 15 18.8 15 C17.4 15 16 15.8 15.2 17.6"
        stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.68"/>
      {/* Centre figure — full detail */}
      <circle cx="12" cy="6.8" r="3.4" fill={c}/>
      {/* Centre figure highlight */}
      <ellipse cx="11" cy="5.8" rx="1.5" ry="1.1" fill="white" opacity="0.32"/>
      <path d="M6.5 21.5 C6.5 16 9 13.5 12 13.5 C15 13.5 17.5 16 17.5 21.5Z" fill={c}/>
      {/* Shoulder highlight */}
      <ellipse cx="10" cy="14.5" rx="2" ry="0.9" fill="white" opacity="0.2"/>
    </svg>
  );
}

function IconAveSign({ c }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="signPost" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c} stopOpacity="0.7"/>
          <stop offset="50%" stopColor={c}/>
          <stop offset="100%" stopColor={c} stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="signFaceTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c}/>
          <stop offset="100%" stopColor={c} stopOpacity="0.82"/>
        </linearGradient>
        <linearGradient id="signFaceBot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="0.88"/>
          <stop offset="100%" stopColor={c} stopOpacity="0.7"/>
        </linearGradient>
      </defs>
      {/* Post */}
      <line x1="12" y1="8.5" x2="12" y2="22.5" stroke="url(#signPost)" strokeWidth="2.4" strokeLinecap="round"/>
      {/* Post foot base */}
      <rect x="10" y="21.5" width="4" height="1.2" rx="0.6" fill={c} opacity="0.5"/>
      {/* Top sign — wide with both arrows */}
      <rect x="2" y="2.5" width="20" height="6.5" rx="1.8" fill="url(#signFaceTop)"/>
      {/* Top sign sheen */}
      <rect x="2.5" y="3" width="19" height="2" rx="0.6" fill="white" opacity="0.18"/>
      <polyline points="5.5,4.8 3.5,5.8 5.5,6.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <polyline points="18.5,4.8 20.5,5.8 18.5,6.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="7" y1="5.8" x2="17" y2="5.8" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
      {/* Lower sign — angled, one arrow */}
      <rect x="7.5" y="10" width="15" height="5.2" rx="1.4" fill="url(#signFaceBot)" transform="rotate(-12 15 12.5)"/>
      {/* Lower sign sheen */}
      <rect x="8" y="10.6" width="13.5" height="1.8" rx="0.5" fill="white" opacity="0.15" transform="rotate(-12 15 12.5)"/>
      <polyline points="20.5,11 22.2,12 20.5,13" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="rotate(-12 21.3 12)"/>
    </svg>
  );
}

function IconHappenings({ c }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="skyCity" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={c} stopOpacity="0.04"/>
        </linearGradient>
      </defs>
      {/* Sky wash */}
      <rect x="0" y="0" width="24" height="24" fill="url(#skyCity)"/>
      {/* Far-left small building */}
      <rect x="0.5" y="14" width="3.5" height="7.5" fill={c} opacity="0.65" rx="0.3"/>
      {/* Left mid building */}
      <rect x="2" y="11" width="5" height="10.5" fill={c} opacity="0.75" rx="0.3"/>
      {/* Centre tower (Empire State ish) */}
      <rect x="8.5" y="4.5" width="7" height="17" fill={c} rx="0.4"/>
      {/* Centre tower setbacks */}
      <rect x="9.5" y="2.5" width="5" height="4" fill={c} rx="0.3"/>
      <rect x="10.5" y="1" width="3" height="3" fill={c} rx="0.2"/>
      {/* Antenna */}
      <line x1="12" y1="1" x2="12" y2="-0.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Right mid building */}
      <rect x="17" y="9" width="5" height="12.5" fill={c} opacity="0.75" rx="0.3"/>
      {/* Far right small building */}
      <rect x="20" y="13" width="3.5" height="8.5" fill={c} opacity="0.65" rx="0.3"/>
      {/* Windows — centre tower */}
      <rect x="10" y="7"  width="1.4" height="1.4" fill="white" opacity="0.65" rx="0.15"/>
      <rect x="12.5" y="7"  width="1.4" height="1.4" fill="white" opacity="0.65" rx="0.15"/>
      <rect x="10" y="10.5" width="1.4" height="1.4" fill="white" opacity="0.55" rx="0.15"/>
      <rect x="12.5" y="10.5" width="1.4" height="1.4" fill="white" opacity="0.55" rx="0.15"/>
      <rect x="10" y="14"   width="1.4" height="1.4" fill="white" opacity="0.5" rx="0.15"/>
      <rect x="12.5" y="14" width="1.4" height="1.4" fill="white" opacity="0.5" rx="0.15"/>
      {/* Windows — side buildings */}
      <rect x="3.2"  y="13.5" width="1.2" height="1.2" fill="white" opacity="0.5" rx="0.12"/>
      <rect x="5.2"  y="13.5" width="1.2" height="1.2" fill="white" opacity="0.5" rx="0.12"/>
      <rect x="3.2"  y="16.5" width="1.2" height="1.2" fill="white" opacity="0.4" rx="0.12"/>
      <rect x="18.3" y="11" width="1.2" height="1.2" fill="white" opacity="0.5" rx="0.12"/>
      <rect x="20.3" y="11" width="1.2" height="1.2" fill="white" opacity="0.5" rx="0.12"/>
      <rect x="18.3" y="14" width="1.2" height="1.2" fill="white" opacity="0.4" rx="0.12"/>
      {/* Highlight sheen on centre tower */}
      <rect x="8.5" y="4.5" width="2.5" height="17" fill="white" opacity="0.07" rx="0.4"/>
      {/* Ground line */}
      <line x1="0.5" y1="21.5" x2="23.5" y2="21.5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ── Top bar icons ─────────────────────────────────────────────────────────────
function IconApt({ c }: SVGProps) {
  // Filled apartment building with windows + door
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="15" rx="1" fill={c} opacity="0.88"/>
      <path d="M2 7.5 L12 2.5 L22 7.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="4" y="7" width="16" height="3.5" rx="0.5" fill="white" opacity="0.16"/>
      <rect x="5.5"  y="11" width="3"   height="2.5" rx="0.4" fill="white" opacity="0.55"/>
      <rect x="10.5" y="11" width="3"   height="2.5" rx="0.4" fill="white" opacity="0.55"/>
      <rect x="15.5" y="11" width="3"   height="2.5" rx="0.4" fill="white" opacity="0.55"/>
      <rect x="5.5"  y="15" width="3"   height="2.5" rx="0.4" fill="white" opacity="0.4"/>
      <rect x="15.5" y="15" width="3"   height="2.5" rx="0.4" fill="white" opacity="0.4"/>
      <rect x="10"   y="17" width="4"   height="4"   rx="0.5" fill="white" opacity="0.6"/>
      <circle cx="13.2" cy="19" r="0.5" fill={c}/>
      <line x1="1.5" y1="21" x2="22.5" y2="21" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconPin({ c }: SVGProps) {
  // Filled teardrop map pin with 3D highlight
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={c}/>
      <circle cx="12" cy="9" r="2.8" fill="white" opacity="0.32"/>
      <circle cx="12" cy="9" r="1.4" fill="white" opacity="0.5"/>
      <ellipse cx="9.8" cy="6.5" rx="1.8" ry="1.2" fill="white" opacity="0.3" transform="rotate(-20 9.8 6.5)"/>
      <ellipse cx="12" cy="22.5" rx="3" ry="0.8" fill={c} opacity="0.2"/>
    </svg>
  );
}
function IconMail({ c }: SVGProps) {
  // Realistic British-style pillar post box with letter slot and envelope
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {/* Post box body — arched top, rounded sides */}
      <path d="M4.5 10 Q4.5 3 12 3 Q19.5 3 19.5 10 L19.5 20 Q19.5 21 18.5 21 L5.5 21 Q4.5 21 4.5 20 Z" fill={c}/>
      {/* 3D dome sheen — top-left arc highlight */}
      <path d="M6 10 Q6 5 12 5 Q16 5 17.5 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" fill="none"/>
      {/* Left-side vertical shine */}
      <path d="M6 10 L6 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.18"/>
      {/* Letter slot — wide horizontal slit */}
      <rect x="6.5" y="10.5" width="11" height="2" rx="1" fill="rgba(0,0,0,0.35)"/>
      <rect x="7" y="10.8" width="10" height="0.8" rx="0.4" fill="rgba(0,0,0,0.25)"/>
      {/* Envelope peeking out of slot */}
      <rect x="9" y="9.5" width="6" height="3.5" rx="0.4" fill="white" opacity="0.9"/>
      <line x1="9" y1="9.5" x2="12" y2="11.5" stroke={c} strokeWidth="0.7" opacity="0.7"/>
      <line x1="15" y1="9.5" x2="12" y2="11.5" stroke={c} strokeWidth="0.7" opacity="0.7"/>
      {/* Wax seal dot on envelope */}
      <circle cx="12" cy="11.5" r="0.9" fill={c} opacity="0.85"/>
      {/* Royal cypher / circular placard in middle of box */}
      <circle cx="12" cy="15.5" r="1.8" fill="rgba(0,0,0,0.2)"/>
      <circle cx="12" cy="15.5" r="1.2" fill="rgba(255,255,255,0.12)"/>
      {/* Keyhole at base */}
      <circle cx="12" cy="19" r="0.6" fill="rgba(0,0,0,0.3)"/>
      <rect x="11.6" y="19" width="0.8" height="0.8" rx="0.1" fill="rgba(0,0,0,0.25)"/>
    </svg>
  );
}
function IconChatBubble({ c }: SVGProps) {
  // Filled dual speech bubbles with message dots
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 13.5 a2 2 0 0 1-2 2 H17 l-2 3.5 v-3.5 H9 a2 2 0 0 1-2-2 V8 a2 2 0 0 1 2-2 h10 a2 2 0 0 1 2 2Z"
        fill={c} opacity="0.5"/>
      <path d="M4 16.5 H14 a2 2 0 0 0 2-2 V9 a2 2 0 0 0-2-2 H4 a2 2 0 0 0-2 2 v5.5 a2 2 0 0 0 2 2Z"
        fill={c}/>
      <rect x="3" y="9.5" width="10" height="2.5" rx="1.2" fill="white" opacity="0.18"/>
      <path d="M6 16.5 L4 21" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="6.5"  cy="13" r="1.05" fill="white" opacity="0.72"/>
      <circle cx="9"    cy="13" r="1.05" fill="white" opacity="0.72"/>
      <circle cx="11.5" cy="13" r="1.05" fill="white" opacity="0.72"/>
    </svg>
  );
}

// ── Open Rose SVG — the left end of the stem ─────────────────────────────────
function OpenRose() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      {/* Outer ring — 5 large open petals */}
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={`o${a}`} cx="20" cy="7" rx="5" ry="12"
          fill="#FF5B8D" opacity="0.55"
          transform={`rotate(${a} 20 20)`} />
      ))}
      {/* Mid ring — 5 petals offset */}
      {[36, 108, 180, 252, 324].map(a => (
        <ellipse key={`m${a}`} cx="20" cy="10" rx="3.8" ry="9"
          fill="#FF1F7D" opacity="0.7"
          transform={`rotate(${a} 20 20)`} />
      ))}
      {/* Inner ring — tighter petals */}
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={`i${a}`} cx="20" cy="13" rx="2.5" ry="6"
          fill="#C80060" opacity="0.88"
          transform={`rotate(${a} 20 20)`} />
      ))}
      {/* Center disk */}
      <circle cx="20" cy="20" r="5.2" fill="#A8004C"/>
      {/* Stamen */}
      <circle cx="20" cy="20" r="3" fill="#FF5FA5" opacity="0.82"/>
      <circle cx="20" cy="20" r="1.4" fill="rgba(255,255,255,0.62)"/>
    </svg>
  );
}

// ── Nav tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { href: "/member/home",       key: "home"       },
  { href: "/member/happenings", key: "happenings" },
  { href: "/member/plans",      key: "plans"      },
  { href: "/member/clubs",      key: "clubs"      },
  { href: "/member/avenue",     key: "avenue"     },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Main component ────────────────────────────────────────────────────────────
export function BottomNav({ user }: { user?: NavUser }) {
  const pathname   = usePathname();
  const slab       = getSlab();
  // Pages with dark/colored backgrounds — use lighter icon colors
  const isDarkPage = pathname.startsWith("/member/avenue") ||
                     pathname.startsWith("/member/happenings");

  function isActive(href: string) {
    if (href === "/member/happenings") return pathname.startsWith("/member/happenings");
    if (href === "/member/avenue")     return pathname.startsWith("/member/avenue");
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderIcon(key: TabKey, active: boolean) {
    const c = active ? PINK : (isDarkPage ? "rgba(255,215,232,0.92)" : "rgba(175,50,98,0.78)");
    const w = active ? 2.2 : 1.7;
    if (key === "home")       return <IconTime       c={c} w={w} slab={slab} />;
    if (key === "happenings") return <IconHappenings c={c} w={w} />;
    if (key === "plans")      return <IconPlans      c={c} w={w} />;
    if (key === "clubs")      return <IconClubs      c={c} />;
    if (key === "avenue")     return <IconAveSign    c={c} w={w} />;
  }

  function tabLabel(key: TabKey): string {
    if (key === "home")       return SLAB_LABEL[slab];
    if (key === "happenings") return "The City";
    if (key === "plans")      return "Plans";
    if (key === "clubs")      return "Clubs";
    if (key === "avenue")     return "Avenue";
    return key;
  }

  // Stem and branch colors — warm rose, adapted to bg
  const stemC   = isDarkPage ? "rgba(255,190,210,0.28)" : "rgba(170,80,110,0.25)";
  const branchC = isDarkPage ? "rgba(255,190,210,0.32)" : "rgba(170,80,110,0.28)";

  function TopTile({ href, label, children, badge }: {
    href: string; label: string; children: React.ReactNode; badge?: "dot" | "number";
  }) {
    const active = pathname.startsWith(href);
    return (
      <Link href={href} aria-label={label} style={{ textDecoration: "none", position: "relative" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 13,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: active ? `${PINK}15` : "transparent",
          border: active ? `1.5px solid ${PINK}28` : "none",
        }}>
          {children}
        </div>
        {badge === "number" && (
          <div style={{
            position: "absolute", top: 1, right: 1,
            width: 16, height: 16, borderRadius: "50%",
            background: PINK, border: "2px solid rgba(253,251,247,0.97)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "7.5px", fontWeight: 900, color: "white", fontFamily: "var(--font-jost)",
            animation: "pinkPulse 2s ease-in-out infinite",
          }}>3</div>
        )}
        {badge === "dot" && (
          <span style={{
            position: "absolute", top: 3, right: 3,
            width: 8, height: 8, borderRadius: "50%",
            background: PINK, border: "1.5px solid rgba(253,251,247,0.97)",
          }} />
        )}
      </Link>
    );
  }

  return (
    <>
      {/* ══════ TOP BAR — pinned to viewport top, never scrolls ══════ */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: isDarkPage
            ? "rgba(26,4,20,0.92)"
            : "rgba(255,240,246,0.95)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: isDarkPage
            ? "1px solid rgba(255,31,125,0.18)"
            : "1px solid rgba(255,31,125,0.10)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 54 }}>
          <Link href="/member/home" aria-label="BloomBay" style={{ textDecoration: "none" }}>
            <BBLogo size={26} pinkColor={PINK} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <TopTile href="/member/apartment" label="Apartment">
              <IconApt c={isDarkPage ? "rgba(255,220,235,0.95)" : PINK} />
            </TopTile>
            <TopTile href="/member/notifications" label="Pin Drops">
              <IconPin c={isDarkPage ? "rgba(255,220,235,0.95)" : PINK} />
            </TopTile>
            <TopTile href="/member/messages" label="Mailbox" badge="number">
              <IconMail c={isDarkPage ? "rgba(255,220,235,0.95)" : PINK} />
            </TopTile>
            <TopTile href="/member/chat" label="Chat" badge="dot">
              <span style={{ animation: "pinkPulse 2s ease-in-out infinite" }}>
                <IconChatBubble c={isDarkPage ? "rgba(255,220,235,0.95)" : PINK} />
              </span>
            </TopTile>
          </div>
        </div>
      </div>

      {/* ══════ ROSE STEM NAVIGATION ══════
          No container. No pill. No background.
          A horizontal rose stem with one open rose at the left end.
          Each destination grows from the stem like a bud.
      */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
          pointerEvents: "none",
        }}
      >
        {/* ─ Organic wavy botanical stem ─ */}
        <svg
          style={{
            position: "absolute",
            left: 46,
            right: 0,
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 9px)",
            width: "calc(100% - 46px)",
            height: 32,
            overflow: "visible",
            pointerEvents: "none",
          }}
          viewBox="0 0 320 32"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={PINK} stopOpacity="0.85"/>
              <stop offset="30%" stopColor={isDarkPage ? "rgba(255,180,210,0.55)" : "rgba(200,80,120,0.45)"}/>
              <stop offset="100%" stopColor={isDarkPage ? "rgba(255,180,210,0.40)" : "rgba(180,60,100,0.35)"}/>
            </linearGradient>
          </defs>
          {/* Main wavy stem — gentler undulation so branches connect cleanly */}
          <path
            d="M0 19 C18 17 36 21 64 18 C92 15 110 19 140 17 C168 15 186 20 214 17 C240 15 258 19 290 17 C305 16 314 17 320 17"
            stroke="url(#stemGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Leaf at ~30% */}
          <path
            d="M88 18 C90 9 100 7 104 13 C100 17 92 19 88 18Z"
            fill={isDarkPage ? "rgba(160,210,140,0.50)" : "rgba(70,130,55,0.42)"}
          />
          {/* Thorn at ~60% */}
          <path
            d="M188 17 C190 11 196 10 194 17Z"
            fill={isDarkPage ? "rgba(160,210,140,0.45)" : "rgba(70,130,55,0.35)"}
          />
          {/* Small leaf at ~80% */}
          <path
            d="M254 17 C256 9 264 8 266 14 C263 16 257 18 254 17Z"
            fill={isDarkPage ? "rgba(160,210,140,0.40)" : "rgba(70,130,55,0.30)"}
          />
          {/* Junction buds where branches meet the stem (approx tab x-positions) */}
          {[32, 96, 160, 224, 289].map((x, i) => (
            <circle key={i} cx={x} cy={17} r="3.2"
              fill={isDarkPage ? "rgba(255,31,125,0.55)" : "rgba(255,31,125,0.45)"}
              stroke={isDarkPage ? "rgba(255,180,210,0.4)" : "rgba(255,255,255,0.6)"}
              strokeWidth="1"/>
          ))}
        </svg>

        {/* ─ Open rose at the left end — center aligned to stem (bottom + 5px = center at 22px from physical bottom) ─ */}
        <div style={{
          position: "absolute",
          left: 8,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 5px)",
          width: 34,
          height: 34,
          zIndex: 2,
          pointerEvents: "none",
        }}>
          <OpenRose />
        </div>

        {/* ─ Nav destinations — grow upward from the stem ─ */}
        <div style={{
          position: "absolute",
          left: 44,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          pointerEvents: "auto",
        }}>
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="bloom-btn-pop"
                style={{
                  flex: 1,
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Label */}
                <span style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "7px",
                  fontWeight: active ? 800 : 500,
                  letterSpacing: "0.05em",
                  color: active ? PINK : (isDarkPage ? "rgba(255,215,232,0.72)" : "rgba(100,30,65,0.58)"),
                  lineHeight: 1,
                  whiteSpace: "nowrap" as const,
                  marginBottom: 3,
                }}>
                  {tabLabel(tab.key).toUpperCase()}
                </span>

                {/* Icon */}
                <div style={{
                  width: 26, height: 26,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 3,
                }}>
                  {renderIcon(tab.key, active)}
                </div>

                {/* Branch — organic curved botanical stalk from icon down to horizontal stem */}
                <svg
                  width="8"
                  height={active ? 18 : 12}
                  viewBox={`0 0 8 ${active ? 18 : 12}`}
                  fill="none"
                  style={{
                    marginBottom: "calc(env(safe-area-inset-bottom, 0px) + 22px)",
                    transition: "height 0.22s ease",
                    overflow: "visible",
                  }}
                >
                  <path
                    d={active
                      ? "M4 0 C2 5 6 11 4 18"
                      : "M4 0 C2.5 4 5.5 8 4 12"}
                    stroke={active ? PINK : branchC}
                    strokeWidth={active ? 2.5 : 1.8}
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function BottomNavSignout({ user }: { user: NavUser }) {
  void user;
  return (
    <form action={logout} className="hidden">
      <button type="submit">Sign out</button>
    </form>
  );
}
