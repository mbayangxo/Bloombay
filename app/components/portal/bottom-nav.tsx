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
    // Detailed sun with inner glow ring + longer alternating rays
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.8" fill={c} opacity="0.22"/>
      <circle cx="12" cy="12" r="2.6" stroke={c} strokeWidth={w} fill="none"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const len = i % 2 === 0 ? 3 : 2;
        const r1 = 4.2, r2 = r1 + len;
        const rad = (a * Math.PI) / 180;
        return <line key={a}
          x1={12 + r1 * Math.cos(rad)} y1={12 + r1 * Math.sin(rad)}
          x2={12 + r2 * Math.cos(rad)} y2={12 + r2 * Math.sin(rad)}
          stroke={c} strokeWidth={i % 2 === 0 ? w : w * 0.7} strokeLinecap="round"/>;
      })}
    </svg>
  );
  if (slab === "afternoon") return (
    // Detailed cloud: stacked circles + sun peeking behind
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="17.5" cy="11" r="3.2" stroke={c} strokeWidth={w} fill="none" opacity="0.45"/>
      <line x1="17.5" y1="7" x2="17.5" y2="5.5" stroke={c} strokeWidth={w * 0.8} strokeLinecap="round" opacity="0.55"/>
      <line x1="20.6" y1="8.4" x2="21.7" y2="7.3" stroke={c} strokeWidth={w * 0.8} strokeLinecap="round" opacity="0.55"/>
      <line x1="21.5" y1="11" x2="23" y2="11" stroke={c} strokeWidth={w * 0.8} strokeLinecap="round" opacity="0.55"/>
      <path d="M7 18.5h10.5a3.5 3.5 0 0 0 0-7H17a5 5 0 0 0-9.8 1H7a3.5 3.5 0 0 0 0 7Z"
        stroke={c} strokeWidth={w} fill="none" strokeLinejoin="round"/>
    </svg>
  );
  if (slab === "evening") return (
    // Horizon sunset: sun half-set + 3 rays above horizon line
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2 17h20" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <path d="M12 17a6 6 0 0 0 0-6 6 6 0 0 0 0 6" stroke={c} strokeWidth={w} fill="none" strokeLinecap="round"/>
      <line x1="12" y1="3" x2="12" y2="5.5" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="5.5" y1="5.5" x2="7.1" y2="7.1" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="18.5" y1="5.5" x2="16.9" y2="7.1" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="3" y1="11" x2="5.5" y2="11" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <line x1="18.5" y1="11" x2="21" y2="11" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <path d="M5 19.5h14" stroke={c} strokeWidth={w * 0.6} strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
  // tonight: detailed crescent + 3 stars
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 4 L19.5 5.5 L21 6 L19.5 6.5 L19 8 L18.5 6.5 L17 6 L18.5 5.5Z"
        fill={c} opacity="0.8"/>
      <path d="M5.5 16 L5.8 17 L6.8 17 L6 17.6 L6.3 18.6 L5.5 18 L4.7 18.6 L5 17.6 L4.2 17 L5.2 17Z"
        fill={c} opacity="0.5"/>
    </svg>
  );
}

function IconPlans({ c, w = 2 }: SVGProps) {
  // Detailed open book with page curl + bookmark ribbon
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {/* Spine */}
      <line x1="12" y1="4" x2="12" y2="20" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      {/* Left page */}
      <path d="M12 4 C10 4 5 4.5 4 6 L4 19 C5 17.5 9.5 17 12 17Z"
        stroke={c} strokeWidth={w * 0.9} fill="none" strokeLinejoin="round"/>
      {/* Right page */}
      <path d="M12 4 C14 4 19 4.5 20 6 L20 19 C19 17.5 14.5 17 12 17Z"
        stroke={c} strokeWidth={w * 0.9} fill="none" strokeLinejoin="round"/>
      {/* Left page lines */}
      <line x1="6.5" y1="9"  x2="10.5" y2="8.5"  stroke={c} strokeWidth={w * 0.55} strokeLinecap="round" opacity="0.7"/>
      <line x1="6.5" y1="12" x2="10.5" y2="11.5" stroke={c} strokeWidth={w * 0.55} strokeLinecap="round" opacity="0.7"/>
      <line x1="6.5" y1="15" x2="9.5"  y2="14.6" stroke={c} strokeWidth={w * 0.55} strokeLinecap="round" opacity="0.7"/>
      {/* Right page lines */}
      <line x1="13.5" y1="8.5"  x2="17.5" y2="9"  stroke={c} strokeWidth={w * 0.55} strokeLinecap="round" opacity="0.7"/>
      <line x1="13.5" y1="11.5" x2="17.5" y2="12" stroke={c} strokeWidth={w * 0.55} strokeLinecap="round" opacity="0.7"/>
      <line x1="13.5" y1="14.6" x2="16.5" y2="15" stroke={c} strokeWidth={w * 0.55} strokeLinecap="round" opacity="0.7"/>
      {/* Bookmark ribbon on right */}
      <path d="M18 4 L18 9 L16.5 7.8 L15 9 L15 4Z"
        stroke={c} strokeWidth={w * 0.7} fill="none" strokeLinejoin="round"/>
    </svg>
  );
}

function IconClubs({ c }: SVGProps) {
  // Three people silhouette — a social club visual
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {/* Center person */}
      <circle cx="12" cy="6.5" r="2.4" stroke={c} strokeWidth="1.8" fill="none"/>
      <path d="M7.5 19 C7.5 15.5 9.2 13.5 12 13.5 C14.8 13.5 16.5 15.5 16.5 19"
        stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Left person (partial) */}
      <circle cx="5.5" cy="7.5" r="1.9" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M2 19 C2 16 3.5 14.2 5.5 14.2 C7 14.2 8.2 15.2 8.8 16.8"
        stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      {/* Right person (partial) */}
      <circle cx="18.5" cy="7.5" r="1.9" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M22 19 C22 16 20.5 14.2 18.5 14.2 C17 14.2 15.8 15.2 15.2 16.8"
        stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

function IconAveSign({ c, w = 2 }: SVGProps) {
  // Two street signs on a pole — an "avenue" intersection sign
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {/* Pole */}
      <line x1="12" y1="8" x2="12" y2="22" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      {/* Top sign — horizontal, pointing both ways */}
      <rect x="2" y="3" width="20" height="5.5" rx="1.2" stroke={c} strokeWidth={w * 0.9} fill="none"/>
      {/* Arrow left */}
      <polyline points="5,4.5 3.5,5.75 5,7" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Arrow right */}
      <polyline points="19,4.5 20.5,5.75 19,7" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Sign divider line */}
      <line x1="12" y1="3" x2="12" y2="8.5" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      {/* Bottom sign — angled, pointing right-downward */}
      <rect x="10.5" y="10" width="12" height="4.5" rx="1" stroke={c} strokeWidth={w * 0.9} fill="none"
        transform="rotate(12 16.5 12.25)"/>
      {/* Arrow on lower sign */}
      <polyline points="21,11.5 22.4,12.5 21,13.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        transform="rotate(12 21.7 12.5)"/>
    </svg>
  );
}

function IconHappenings({ c, w = 2 }: SVGProps) {
  // NYC skyline: several buildings of different heights with windows
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {/* Ground line */}
      <line x1="1" y1="20" x2="23" y2="20" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      {/* Building 1 — tall center */}
      <rect x="9" y="5" width="6" height="15" stroke={c} strokeWidth={w * 0.9} fill="none" rx="0.3"/>
      {/* Windows center tower */}
      <rect x="10.5" y="7"  width="1.3" height="1.3" fill={c} opacity="0.6" rx="0.2"/>
      <rect x="12.5" y="7"  width="1.3" height="1.3" fill={c} opacity="0.6" rx="0.2"/>
      <rect x="10.5" y="10" width="1.3" height="1.3" fill={c} opacity="0.6" rx="0.2"/>
      <rect x="12.5" y="10" width="1.3" height="1.3" fill={c} opacity="0.6" rx="0.2"/>
      {/* Antenna */}
      <line x1="12" y1="5" x2="12" y2="2.5" stroke={c} strokeWidth={w * 0.8} strokeLinecap="round"/>
      {/* Building 2 — left mid */}
      <rect x="3" y="10" width="5" height="10" stroke={c} strokeWidth={w * 0.85} fill="none" rx="0.3"/>
      <rect x="4.2" y="12" width="1.2" height="1.2" fill={c} opacity="0.5" rx="0.2"/>
      <rect x="6"   y="12" width="1.2" height="1.2" fill={c} opacity="0.5" rx="0.2"/>
      <rect x="4.2" y="15" width="1.2" height="1.2" fill={c} opacity="0.5" rx="0.2"/>
      {/* Building 3 — right mid */}
      <rect x="16" y="9" width="5.5" height="11" stroke={c} strokeWidth={w * 0.85} fill="none" rx="0.3"/>
      <rect x="17.2" y="11" width="1.2" height="1.2" fill={c} opacity="0.5" rx="0.2"/>
      <rect x="19"   y="11" width="1.2" height="1.2" fill={c} opacity="0.5" rx="0.2"/>
      <rect x="17.2" y="14" width="1.2" height="1.2" fill={c} opacity="0.5" rx="0.2"/>
      <rect x="19"   y="14" width="1.2" height="1.2" fill={c} opacity="0.5" rx="0.2"/>
    </svg>
  );
}

// ── Top bar icons ─────────────────────────────────────────────────────────────
function IconApt({ c }: SVGProps) {
  // Apartment building: facade with multiple windows, balcony, door
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      {/* Building facade */}
      <rect x="3" y="5" width="18" height="16" rx="1" stroke={c} strokeWidth="1.7" fill="none"/>
      {/* Roof detail */}
      <path d="M3 7.5 L12 3 L21 7.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Ground line */}
      <line x1="1.5" y1="21" x2="22.5" y2="21" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Windows row 1 */}
      <rect x="5.5"  y="9"  width="3" height="2.5" rx="0.4" stroke={c} strokeWidth="1.2" fill="none"/>
      <rect x="10.5" y="9"  width="3" height="2.5" rx="0.4" stroke={c} strokeWidth="1.2" fill="none"/>
      <rect x="15.5" y="9"  width="3" height="2.5" rx="0.4" stroke={c} strokeWidth="1.2" fill="none"/>
      {/* Windows row 2 */}
      <rect x="5.5"  y="13.5" width="3" height="2.5" rx="0.4" stroke={c} strokeWidth="1.2" fill="none"/>
      <rect x="15.5" y="13.5" width="3" height="2.5" rx="0.4" stroke={c} strokeWidth="1.2" fill="none"/>
      {/* Door */}
      <path d="M10 21 L10 16.5 Q12 15.5 14 16.5 L14 21" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
      {/* Door knob */}
      <circle cx="13.2" cy="18.8" r="0.5" fill={c}/>
    </svg>
  );
}
function IconPin({ c }: SVGProps) {
  // Map pin: teardrop shape with inner ring, shadow dot at base
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      {/* Pin body */}
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/>
      {/* Inner circle */}
      <circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.4" fill="none"/>
      {/* Inner dot */}
      <circle cx="12" cy="9" r="1" fill={c}/>
      {/* Drop shadow suggestion */}
      <ellipse cx="12" cy="22" rx="3" ry="0.8" fill={c} opacity="0.22"/>
    </svg>
  );
}
function IconMail({ c }: SVGProps) {
  // Classic mailbox on post with flag up and mail slot
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      {/* Post */}
      <line x1="12" y1="21" x2="12" y2="16.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Base plate */}
      <line x1="9.5" y1="21" x2="14.5" y2="21" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      {/* Mailbox body — rounded on left end like a classic US mailbox */}
      <path d="M5 16.5 H19 V12.5 A6.5 6.5 0 0 0 5 12.5 Z"
        stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/>
      {/* Top dome */}
      <path d="M5 12.5 A6.5 6.5 0 0 1 19 12.5" stroke={c} strokeWidth="1.5" fill="none"/>
      {/* Mail slot */}
      <line x1="6" y1="14.2" x2="10.5" y2="14.2" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      {/* Flag pole */}
      <line x1="19" y1="16.5" x2="19" y2="11.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      {/* Flag (up) */}
      <path d="M19 11.5 L22 11.5 L22 14 L19 14" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChatBubble({ c }: SVGProps) {
  // Two overlapping speech bubbles — conversation/chat
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      {/* Back bubble */}
      <path d="M22 13a2 2 0 0 1-2 2h-1l-2 3v-3H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2z"
        stroke={c} strokeWidth="1.6" fill="none" strokeLinejoin="round" opacity="0.55"/>
      {/* Front bubble */}
      <path d="M4 16 H14 a2 2 0 0 0 2-2 V9 a2 2 0 0 0-2-2 H4 a2 2 0 0 0-2 2 v5 a2 2 0 0 0 2 2 z"
        stroke={c} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
      {/* Tail */}
      <path d="M6 16 L4 20" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Dots in front bubble */}
      <circle cx="6.5"  cy="12.5" r="0.9" fill={c}/>
      <circle cx="9"    cy="12.5" r="0.9" fill={c}/>
      <circle cx="11.5" cy="12.5" r="0.9" fill={c}/>
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
  const isDarkPage = pathname.startsWith("/member/avenue")    ||
                     pathname.startsWith("/member/plans")     ||
                     pathname.startsWith("/member/happenings")||
                     pathname.startsWith("/member/clubs")     ||
                     pathname.startsWith("/member/chat")      ||
                     pathname.startsWith("/member/lounge")    ||
                     pathname.startsWith("/member/city");
  // hideTopBar hides the ACTION icons only (not the logo)
  const hideTopBarActions = pathname.startsWith("/member/lounge")    ||
                            pathname.startsWith("/member/happenings");

  function isActive(href: string) {
    if (href === "/member/happenings") return pathname.startsWith("/member/happenings");
    if (href === "/member/avenue")     return pathname.startsWith("/member/avenue");
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderIcon(key: TabKey, active: boolean) {
    const c = active ? PINK : (isDarkPage ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)");
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
      {/* ══════ TOP BAR — logo always visible ══════ */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{ background: "transparent", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 54 }}>
          <Link href="/member/home" aria-label="BloomBay" style={{ textDecoration: "none" }}>
            <BBLogo size={26} pinkColor={PINK} />
          </Link>
          {!hideTopBarActions && (
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <TopTile href="/member/apartment" label="Apartment">
                <IconApt c={isDarkPage ? "white" : PINK} />
              </TopTile>
              <TopTile href="/member/notifications" label="Pin Drops">
                <IconPin c={isDarkPage ? "white" : PINK} />
              </TopTile>
              <TopTile href="/member/messages" label="Mailbox" badge="number">
                <IconMail c={isDarkPage ? "white" : PINK} />
              </TopTile>
              <TopTile href="/member/chat" label="Chat" badge="dot">
                <span style={{ animation: "pinkPulse 2s ease-in-out infinite" }}>
                  <IconChatBubble c={isDarkPage ? "white" : PINK} />
                </span>
              </TopTile>
            </div>
          )}
        </div>
      </div>

      {/* ══════ ROSE STEM NAVIGATION ══════
          No container. No pill. No background.
          A horizontal rose stem with one open rose at the left end.
          Each destination grows from the stem like a bud.
      */}
      <div
        className="fixed z-50 md:hidden"
        style={{
          bottom: 0, left: 0, right: 0,
          height: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
          pointerEvents: "none",
          // zero background — the stem IS the navigation
        }}
      >
        {/* ─ Horizontal stem line (runs left-to-right, starts after the rose) ─ */}
        <div style={{
          position: "absolute",
          left: 46,
          right: 0,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 26px)",
          height: 1.5,
          background: `linear-gradient(90deg, ${PINK}60 0%, ${stemC} 22%, ${stemC} 100%)`,
          borderRadius: 1,
        }} />

        {/* ─ Small leaf/thorn on the stem (decorative) ─ */}
        <div style={{
          position: "absolute",
          left: "28%",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 27px)",
          width: 10,
          height: 6,
          pointerEvents: "none",
        }}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M0 6 C2 0 8 0 10 3 C7 5 2 6 0 6Z"
              fill={isDarkPage ? "rgba(180,220,180,0.4)" : "rgba(80,130,70,0.3)"}
            />
          </svg>
        </div>

        {/* ─ Open rose at the left end ─ */}
        <div style={{
          position: "absolute",
          left: 8,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 9px)",
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
                  fontSize: "5.5px",
                  fontWeight: active ? 800 : 500,
                  letterSpacing: "0.05em",
                  color: active ? PINK : (isDarkPage ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.26)"),
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

                {/* Branch — organic curved stem connecting icon to horizontal stem */}
                <svg
                  width="6"
                  height={active ? 18 : 12}
                  viewBox={`0 0 6 ${active ? 18 : 12}`}
                  fill="none"
                  style={{
                    marginBottom: "calc(env(safe-area-inset-bottom, 0px) + 23px)",
                    transition: "height 0.22s ease",
                    overflow: "visible",
                  }}
                >
                  <path
                    d={active
                      ? "M3 0 C1.5 4 4.5 10 3 18"
                      : "M3 0 C2 3 4 8 3 12"}
                    stroke={active ? PINK : branchC}
                    strokeWidth={active ? 2 : 1.5}
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
