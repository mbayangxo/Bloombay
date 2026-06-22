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
    // Filled sun with fat alternating rays + 3D highlight sphere
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const rad = a * Math.PI / 180;
        const r1 = 6.8, r2 = r1 + (i%2===0 ? 3.6 : 2.4);
        return <line key={a}
          x1={12 + r1*Math.cos(rad)} y1={12 + r1*Math.sin(rad)}
          x2={12 + r2*Math.cos(rad)} y2={12 + r2*Math.sin(rad)}
          stroke={c} strokeWidth={i%2===0 ? 2.4 : 1.6} strokeLinecap="round"/>;
      })}
      <circle cx="12" cy="12" r="5.4" fill={c}/>
      <ellipse cx="10.2" cy="10" rx="2.2" ry="1.6" fill="white" opacity="0.38" transform="rotate(-20 10.2 10)"/>
    </svg>
  );
  if (slab === "afternoon") return (
    // Filled cloud silhouette with sun peeking behind + highlight
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="17.8" cy="11.5" r="3.5" fill={c} opacity="0.5"/>
      <line x1="17.8" y1="7.2" x2="17.8" y2="5.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
      <line x1="21" y1="8.6" x2="22.2" y2="7.4" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity="0.55"/>
      <line x1="21.5" y1="11.5" x2="23" y2="11.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity="0.55"/>
      <path d="M7 19 H17.5 a4 4 0 0 0 0-8 H17 a5.5 5.5 0 0 0-10.8 1.5 H6 a3.5 3.5 0 0 0 1 7Z"
        fill={c}/>
      <ellipse cx="9.5" cy="14.5" rx="3" ry="1.4" fill="white" opacity="0.22"/>
    </svg>
  );
  if (slab === "evening") return (
    // Filled half-sun on horizon + ray lines
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <line x1="2" y1="17" x2="22" y2="17" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M6 17 A6 6 0 0 1 18 17Z" fill={c}/>
      <ellipse cx="10.5" cy="15" rx="2.5" ry="1.2" fill="white" opacity="0.28"/>
      <line x1="12" y1="3" x2="12" y2="6.2" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="5.2" y1="5.2" x2="7.3" y2="7.3" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <line x1="18.8" y1="5.2" x2="16.7" y2="7.3" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <line x1="2.5" y1="11.5" x2="5.5" y2="11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="18.5" y1="11.5" x2="21.5" y2="11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  // tonight: filled crescent + two diamond stars
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={c}/>
      <ellipse cx="8.5" cy="7.5" rx="2.2" ry="1.4" fill="white" opacity="0.22" transform="rotate(-25 8.5 7.5)"/>
      <path d="M19.5 4.5 L20.1 6.2 L21.8 6.2 L20.4 7.2 L20.9 9 L19.5 8 L18.1 9 L18.6 7.2 L17.2 6.2 L18.9 6.2Z"
        fill={c} opacity="0.85"/>
      <path d="M4.5 16 L5 17.2 L6.2 17.2 L5.2 18 L5.6 19.2 L4.5 18.4 L3.4 19.2 L3.8 18 L2.8 17.2 L4 17.2Z"
        fill={c} opacity="0.6"/>
    </svg>
  );
}

function IconPlans({ c }: SVGProps) {
  // Filled open book — left page slightly lighter, 3D spine, bookmark
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {/* Left page fill */}
      <path d="M12 5 C9.5 5 5 5.8 4 7.5 L4 20 C5 18.5 9.5 18 12 18Z" fill={c}/>
      {/* Right page fill (slightly dimmer) */}
      <path d="M12 5 C14.5 5 19 5.8 20 7.5 L20 20 C19 18.5 14.5 18 12 18Z" fill={c} opacity="0.78"/>
      {/* Spine */}
      <rect x="11" y="5" width="2" height="13" fill={c}/>
      {/* Left highlight */}
      <ellipse cx="8" cy="9.5" rx="2.4" ry="1.4" fill="white" opacity="0.22" transform="rotate(8 8 9.5)"/>
      {/* Right highlight */}
      <ellipse cx="16" cy="9.5" rx="2.4" ry="1.4" fill="white" opacity="0.16" transform="rotate(-8 16 9.5)"/>
      {/* Page lines left */}
      <line x1="5.8" y1="10.5" x2="10.5" y2="10" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <line x1="5.8" y1="13"   x2="10.5" y2="12.6" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <line x1="5.8" y1="15.5" x2="9.5"  y2="15.2" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      {/* Bookmark */}
      <path d="M17 5 L17 10 L15.5 8.8 L14 10 L14 5Z" fill="white" opacity="0.55"/>
    </svg>
  );
}

function IconClubs({ c }: SVGProps) {
  // Filled three-person social club silhouette
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="3.2" fill={c}/>
      <path d="M6.5 21 C6.5 16.2 9 14 12 14 C15 14 17.5 16.2 17.5 21Z" fill={c}/>
      <circle cx="11" cy="6" r="1.3" fill="white" opacity="0.3"/>
      <circle cx="5" cy="8.2" r="2.5" fill={c} opacity="0.72"/>
      <path d="M1 21 C1 17 2.8 14.8 5 14.8 C6.5 14.8 7.8 15.8 8.5 17.8"
        stroke={c} strokeWidth="3.2" fill="none" strokeLinecap="round" opacity="0.72"/>
      <circle cx="19" cy="8.2" r="2.5" fill={c} opacity="0.72"/>
      <path d="M23 21 C23 17 21.2 14.8 19 14.8 C17.5 14.8 16.2 15.8 15.5 17.8"
        stroke={c} strokeWidth="3.2" fill="none" strokeLinecap="round" opacity="0.72"/>
    </svg>
  );
}

function IconAveSign({ c }: SVGProps) {
  // Filled street signs on pole with arrow indicators
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="8.5" x2="12" y2="22" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      <rect x="2" y="3" width="20" height="6" rx="1.5" fill={c}/>
      <rect x="3" y="3.8" width="18" height="2.2" rx="0.8" fill="white" opacity="0.2"/>
      <polyline points="5.5,4.8 3.8,6 5.5,7.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <polyline points="18.5,4.8 20.2,6 18.5,7.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="8" y="10" width="14" height="5" rx="1.2" fill={c} opacity="0.82" transform="rotate(-10 15 12.5)"/>
      <rect x="8.5" y="10.6" width="12" height="2" rx="0.6" fill="white" opacity="0.18" transform="rotate(-10 15 12.5)"/>
      <polyline points="20,11.2 21.6,12.2 20,13.2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="rotate(-10 20.8 12.2)"/>
    </svg>
  );
}

function IconHappenings({ c }: SVGProps) {
  // Filled NYC skyline silhouette with lit windows
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2"  y="11" width="5.5" height="10" fill={c} opacity="0.8"/>
      <rect x="9"  y="5"  width="6"   height="16" fill={c}/>
      <rect x="16.5" y="9" width="5.5" height="12" fill={c} opacity="0.8"/>
      <line x1="12" y1="5" x2="12" y2="2.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="10.5" y="7"   width="1.4" height="1.4" fill="white" opacity="0.55" rx="0.2"/>
      <rect x="12.5" y="7"   width="1.4" height="1.4" fill="white" opacity="0.55" rx="0.2"/>
      <rect x="10.5" y="10"  width="1.4" height="1.4" fill="white" opacity="0.55" rx="0.2"/>
      <rect x="12.5" y="10"  width="1.4" height="1.4" fill="white" opacity="0.55" rx="0.2"/>
      <rect x="3.2"  y="13"  width="1.3" height="1.3" fill="white" opacity="0.45" rx="0.2"/>
      <rect x="5.2"  y="13"  width="1.3" height="1.3" fill="white" opacity="0.45" rx="0.2"/>
      <rect x="17.8" y="11"  width="1.3" height="1.3" fill="white" opacity="0.45" rx="0.2"/>
      <rect x="19.8" y="11"  width="1.3" height="1.3" fill="white" opacity="0.45" rx="0.2"/>
      <line x1="1" y1="21" x2="23" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round"/>
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
  const isDarkPage = pathname.startsWith("/member/avenue")    ||
                     pathname.startsWith("/member/plans")     ||
                     pathname.startsWith("/member/happenings")||
                     pathname.startsWith("/member/clubs")     ||
                     pathname.startsWith("/member/chat")      ||
                     pathname.startsWith("/member/lounge")    ||
                     pathname.startsWith("/member/city")      ||
                     pathname.startsWith("/member/home")      ||
                     pathname.startsWith("/member/messages")  ||
                     pathname.startsWith("/member/notifications") ||
                     pathname.startsWith("/member/pin-drops");
  // hideTopBar hides the ACTION icons only (not the logo)
  const hideTopBarActions = pathname.startsWith("/member/lounge")    ||
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
