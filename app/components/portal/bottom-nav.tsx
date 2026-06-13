"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/auth/actions";
import { BBLogo } from "./bb-logo";

const PINK  = "#FF1F7D";
const GOLD  = "#D4A853";
const CREAM = "rgba(251,247,241,0.98)";

// 5-petal flower path for nav (viewBox "0 0 360 84")
// Each petal sits over one tab: x centers at 36, 108, 180, 252, 324
// Center petal (Clubs, x=180) peaks at y=6; outer petals peak at y=12
const BLOOM_PATH =
  "M 18 84 Q 0 84 0 66 L 0 32 " +
  "C 8 20 18 12 36 12 C 54 12 64 20 72 32 " +   // petal 1
  "C 80 20 90 12 108 12 C 126 12 136 20 144 32 " + // petal 2
  "C 152 16 162 6 180 6 C 198 6 208 16 216 32 " +  // petal 3 (center, taller)
  "C 224 20 234 12 252 12 C 270 12 280 20 288 32 " + // petal 4
  "C 296 20 306 12 324 12 C 342 12 352 20 360 32 " + // petal 5
  "L 360 66 Q 360 84 342 84 Z";

// Only the scalloped top edge (for the inner highlight stroke)
const BLOOM_TOP =
  "M 0 32 " +
  "C 8 20 18 12 36 12 C 54 12 64 20 72 32 " +
  "C 80 20 90 12 108 12 C 126 12 136 20 144 32 " +
  "C 152 16 162 6 180 6 C 198 6 208 16 216 32 " +
  "C 224 20 234 12 252 12 C 270 12 280 20 288 32 " +
  "C 296 20 306 12 324 12 C 342 12 352 20 360 32";

// Inject keyframes once
if (typeof document !== "undefined") {
  if (!document.getElementById("bb-nav-style")) {
    const s = document.createElement("style");
    s.id = "bb-nav-style";
    s.textContent = `
      @keyframes pinkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.65;transform:scale(0.88)} }
      @keyframes bloomPop  { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.14)} 100%{transform:scale(1);opacity:1} }
    `;
    document.head.appendChild(s);
  }
}

interface NavUser { name: string; initial: string; role: string; }

// ── Time slab ─────────────────────────────────────────────────────────────────
type Slab = "morning" | "afternoon" | "evening" | "tonight";
function getSlab(): Slab {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "tonight";
}
const SLAB_LABEL: Record<Slab, string> = {
  morning: "Morning", afternoon: "Afternoon", evening: "Evening", tonight: "Tonight",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
type SVGProps = { c: string; w?: number };

function IconTime({ c, w = 2, slab }: SVGProps & { slab: Slab }) {
  if (slab === "morning") return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  );
  if (slab === "afternoon") return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M17 17H7a4 4 0 0 1 0-8h.2A6 6 0 0 1 17 13.5a4 4 0 0 1 0 3.5z"/>
    </svg>
  );
  if (slab === "evening") return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M17 12a5 5 0 1 0-10 0"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
      <line x1="2" y1="17" x2="22" y2="17"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

// Introductions: open book / plans icon (same family as before)
function IconIntroductions({ c, w = 2 }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="8"  x2="15" y2="8"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="12" y2="16"/>
    </svg>
  );
}

// Clubs: facing BB mark
function IconClubs({ c }: SVGProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="3.5" y1="3" x2="3.5" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3.5 3 Q11 3 11 7.5 Q11 12 3.5 12" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M3.5 12 Q12 12 12 16.5 Q12 21 3.5 21" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <line x1="20.5" y1="3" x2="20.5" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M20.5 3 Q13 3 13 7.5 Q13 12 20.5 12" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M20.5 12 Q12 12 12 16.5 Q12 21 20.5 21" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// Avenue: street sign
function IconAveSign({ c, w = 2 }: SVGProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="10" x2="12" y2="22" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <rect x="3" y="3" width="18" height="8" rx="1.5" stroke={c} strokeWidth={w} fill="none"/>
      <line x1="7" y1="5.5" x2="6" y2="9" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="7" y1="5.5" x2="8" y2="9" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="6.5" y1="7.5" x2="7.5" y2="7.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="10" y1="5.5" x2="10" y2="9" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="10" y1="5.5" x2="11.2" y2="7.2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="11.2" y1="7.2" x2="10" y2="9" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="13.5" y1="5.5" x2="13.5" y2="9" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="13.5" y1="5.5" x2="15.5" y2="5.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="13.5" y1="7.2" x2="15" y2="7.2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="13.5" y1="9" x2="15.5" y2="9" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// City: skyline
function IconHappenings({ c, w = 2 }: SVGProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="20" x2="23" y2="20"/>
      <path d="M3 20V9l5-4 5 4v11"/>
      <path d="M16 20v-6h5v6"/>
      <line x1="9" y1="12" x2="11" y2="12"/>
      <line x1="9" y1="16" x2="11" y2="16"/>
    </svg>
  );
}

// ── Flower-shaped nav background (SVG) ────────────────────────────────────────
function NavBloom() {
  return (
    <svg
      viewBox="0 0 360 84"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: -20,       // petals rise 20px above the icon row
        left: 0, right: 0,
        width: "100%",
        height: 84,
        pointerEvents: "none",
        overflow: "visible",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="bb-nav-shadow" x="-8%" y="-30%" width="116%" height="170%">
          <feDropShadow dx="0" dy="8"  stdDeviation="14" floodColor="rgba(0,0,0,0.10)" floodOpacity="1"/>
          <feDropShadow dx="0" dy="3"  stdDeviation="5"  floodColor={GOLD}             floodOpacity="0.13"/>
          <feDropShadow dx="0" dy="-1" stdDeviation="2"  floodColor="rgba(255,255,255,0.6)" floodOpacity="1"/>
        </filter>
        {/* Grain filter applied to the fill rect */}
        <filter id="bb-nav-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended"/>
          <feComposite in="blended" in2="SourceGraphic" operator="in"/>
        </filter>
        <clipPath id="bb-nav-clip">
          <path d={BLOOM_PATH}/>
        </clipPath>
      </defs>

      {/* Main cream fill with drop shadow */}
      <path d={BLOOM_PATH} fill={CREAM} filter="url(#bb-nav-shadow)"/>

      {/* Grain texture clipped to bloom shape */}
      <rect width="360" height="84" fill="rgba(120,80,40,0.018)" filter="url(#bb-nav-grain)" clipPath="url(#bb-nav-clip)"/>

      {/* Gold border along the bloom outline */}
      <path d={BLOOM_PATH} fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.45"/>

      {/* Inner white highlight along the scalloped top */}
      <path d={BLOOM_TOP} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>

      {/* Tiny gold dots at petal valleys (x: 72, 144, 216, 288; y ≈ 30 in viewBox) */}
      {[72, 144, 216, 288].map(x => (
        <circle key={x} cx={x} cy={30} r="1.8" fill={GOLD} opacity="0.35"/>
      ))}
    </svg>
  );
}

// ── Top bar icons ─────────────────────────────────────────────────────────────
function IconApt({ c }: SVGProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="21" x2="22" y2="21"/>
      <path d="M8 21V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v15"/>
      <circle cx="14.5" cy="13" r="0.7" fill={c} stroke="none"/>
    </svg>
  );
}
function IconPin({ c }: SVGProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7.5" r="5" fill={c}/>
      <line x1="12" y1="12.5" x2="12" y2="21" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconMail({ c }: SVGProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function IconChatBubble({ c }: SVGProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

// ── Nav tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { href: "/member/home",   key: "home"   },
  { href: "/member/plans",  key: "plans"  },
  { href: "/member/clubs",  key: "clubs"  },
  { href: "/member/lobby",  key: "avenue" },
  { href: "/member/city",   key: "city"   },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Main component ────────────────────────────────────────────────────────────
export function BottomNav({ user }: { user?: NavUser }) {
  const pathname    = usePathname();
  const slab        = getSlab();
  const isDarkPage  = pathname.startsWith("/member/home") || pathname.startsWith("/member/lobby") || pathname.startsWith("/member/plans") || pathname.startsWith("/member/happenings");
  const [navShrunk, setNavShrunk]   = useState(false);
  const [navTouched, setNavTouched] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y > lastYRef.current + 10) setNavShrunk(true);
      else if (y < lastYRef.current - 6) setNavShrunk(false);
      lastYRef.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    if (href === "/member/city")  return pathname.startsWith("/member/city") || pathname.startsWith("/member/happenings");
    if (href === "/member/lobby") return pathname.startsWith("/member/lobby") || pathname.startsWith("/member/chat");
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderIcon(key: TabKey, active: boolean) {
    const c = active ? "white" : "rgba(0,0,0,0.36)";
    const w = active ? 2.2 : 1.7;
    if (key === "home")   return <IconTime         c={c} w={w} slab={slab} />;
    if (key === "plans")  return <IconIntroductions c={c} w={w} />;
    if (key === "clubs")  return <IconClubs         c={c} />;
    if (key === "avenue") return <IconAveSign       c={c} w={w} />;
    if (key === "city")   return <IconHappenings    c={c} w={w} />;
  }

  function tabLabel(key: TabKey): string {
    if (key === "home")   return SLAB_LABEL[slab];
    if (key === "plans")  return "Plans";
    if (key === "clubs")  return "Clubs";
    if (key === "avenue") return "Avenue";
    if (key === "city")   return "City";
    return key;
  }

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
          transition: "all 0.18s",
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
      {/* ══════ TOP BAR ══════ */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{ background: "transparent", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 54 }}>
          <Link href="/member/home" aria-label="BloomBay" style={{ textDecoration: "none" }}>
            <BBLogo size={26} pinkColor={PINK} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <TopTile href="/member/you" label="Apartment">
              <IconApt c={isDarkPage ? "white" : PINK} />
            </TopTile>
            <TopTile href="/member/city" label="City">
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
        </div>
      </div>

      {/* ══════ BLOOM NAV ══════ */}
      <div
        className="fixed z-50 md:hidden"
        onTouchStart={() => { setNavTouched(true); setNavShrunk(false); }}
        onTouchEnd={() => { setTimeout(() => setNavTouched(false), 600); }}
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
          left: navShrunk && !navTouched ? "50%" : "16px",
          right: navShrunk && !navTouched ? "auto" : "16px",
          transform: navShrunk && !navTouched ? "translateX(-50%) scale(0.68)" : "none",
          transformOrigin: "bottom center",
          transition: "all 0.44s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: navShrunk && !navTouched ? 0.68 : 1,
          // Height for the icon + label row; SVG extends above via top: -20
          height: 60,
          position: "fixed",
        }}
      >
        {/* SVG flower background */}
        <NavBloom />

        {/* Icon + label row */}
        <div style={{
          position: "relative", zIndex: 1,
          height: "100%",
          display: "flex", alignItems: "center",
        }}>
          {TABS.map((tab, i) => {
            const active = isActive(tab.href);
            const label  = tabLabel(tab.key);
            const isCenter = i === 2;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="active:scale-90 transition-transform"
                style={{ flex: 1, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
              >
                {/* Icon bloom */}
                <div style={{
                  width: isCenter ? 42 : 40,
                  height: isCenter ? 42 : 36,
                  borderRadius: active
                    ? "58% 42% 58% 42% / 42% 58% 42% 58%"  // organic petal
                    : "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active
                    ? `linear-gradient(145deg, ${PINK}, #FF5BAD)`
                    : "transparent",
                  boxShadow: active
                    ? `0 5px 18px ${PINK}55, inset 0 1px 0 rgba(255,255,255,0.28)`
                    : "none",
                  transform: active ? "translateY(-6px) scale(1.06)" : "translateY(0) scale(1)",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: active ? "bloomPop 0.38s cubic-bezier(0.34,1.56,0.64,1)" : "none",
                }}>
                  {renderIcon(tab.key, active)}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: "7px",
                  fontWeight: active ? 900 : 600,
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-jost)",
                  color: active ? PINK : `${GOLD}AA`,
                  lineHeight: 1,
                  opacity: navShrunk && !navTouched ? 0 : 1,
                  maxHeight: navShrunk && !navTouched ? 0 : 10,
                  overflow: "hidden",
                  transition: "all 0.2s",
                  textTransform: "uppercase" as const,
                }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function BottomNavSignout({ user }: { user: NavUser }) {
  return (
    <form action={logout} className="hidden">
      <button type="submit">{user.name}</button>
    </form>
  );
}
