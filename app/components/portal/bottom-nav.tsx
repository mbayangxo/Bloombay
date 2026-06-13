"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/auth/actions";
import { BBLogo } from "./bb-logo";

const PINK = "#FF1F7D";
const GOLD = "#D4A853";
const CREAM = "rgba(250,245,238,0.97)";

// Inject keyframes once
if (typeof document !== "undefined") {
  if (!document.getElementById("bb-nav-style")) {
    const s = document.createElement("style");
    s.id = "bb-nav-style";
    s.textContent = `
      @keyframes pinkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.65;transform:scale(0.88)} }
      @keyframes bloomPop  { 0%{transform:scale(0.7) rotate(-8deg);opacity:0} 60%{transform:scale(1.12) rotate(2deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
      @keyframes petalIn   { 0%{opacity:0;transform:scale(0.4)} 70%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }
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

// ── SVG icons ─────────────────────────────────────────────────────────────────
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
      <line x1="12" y1="2" x2="12" y2="4"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
      <line x1="2" y1="17" x2="22" y2="17"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

// Introductions: two bloom petals coming together
function IconIntroductions({ c, active }: { c: string; active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left petal / person */}
      <circle cx="8" cy="7" r="2.6" stroke={c} strokeWidth="1.8" fill={active ? `${c}22` : "none"}/>
      <path d="M3 19c0-3.3 2.2-5.5 5-5.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Right petal / person */}
      <circle cx="16" cy="7" r="2.6" stroke={c} strokeWidth="1.8" fill={active ? `${c}22` : "none"}/>
      <path d="M21 19c0-3.3-2.2-5.5-5-5.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Bloom dot at center — two people meeting */}
      <circle cx="12" cy="16.5" r="1.4" fill={c}/>
    </svg>
  );
}

// Clubs: BB facing B's
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

// ── Top bar icons ─────────────────────────────────────────────────────────────
function IconApt({ c, w = 2 }: SVGProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="21" x2="22" y2="21"/>
      <path d="M8 21V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v15"/>
      <circle cx="14.5" cy="13" r="0.7" fill={c} stroke="none"/>
    </svg>
  );
}
function IconPin({ c, w = 2 }: SVGProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7.5" r="5" fill={c}/>
      <line x1="12" y1="12.5" x2="12" y2="21" stroke={c} strokeWidth={w + 0.5} strokeLinecap="round"/>
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

// ── Decorative bloom mark (center of nav) ─────────────────────────────────────
function BloomMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
      {/* Outer petals */}
      <ellipse cx="9" cy="4.5" rx="2" ry="3.5" fill={GOLD} opacity="0.5" transform="rotate(0 9 9)"/>
      <ellipse cx="9" cy="4.5" rx="2" ry="3.5" fill={GOLD} opacity="0.5" transform="rotate(72 9 9)"/>
      <ellipse cx="9" cy="4.5" rx="2" ry="3.5" fill={GOLD} opacity="0.5" transform="rotate(144 9 9)"/>
      <ellipse cx="9" cy="4.5" rx="2" ry="3.5" fill={GOLD} opacity="0.5" transform="rotate(216 9 9)"/>
      <ellipse cx="9" cy="4.5" rx="2" ry="3.5" fill={GOLD} opacity="0.5" transform="rotate(288 9 9)"/>
      {/* Center */}
      <circle cx="9" cy="9" r="2.4" fill={GOLD}/>
      <circle cx="9" cy="9" r="1.2" fill="white" opacity="0.8"/>
    </svg>
  );
}

// ── Nav tabs config ───────────────────────────────────────────────────────────
const TABS = [
  { href: "/member/home",   key: "home"          },
  { href: "/member/match",  key: "introductions" },
  { href: "/member/clubs",  key: "clubs"         },
  { href: "/member/lobby",  key: "avenue"        },
  { href: "/member/city",   key: "city"          },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Main component ────────────────────────────────────────────────────────────
export function BottomNav({ user }: { user?: NavUser }) {
  const pathname    = usePathname();
  const slab        = getSlab();
  const isDarkPage  = pathname.startsWith("/member/home") || pathname.startsWith("/member/lobby") || pathname.startsWith("/member/plans") || pathname.startsWith("/member/happenings");
  const [navShrunk, setNavShrunk]   = useState(false);
  const [navTouched, setNavTouched] = useState(false);
  const lastYRef    = useRef(0);

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
    if (href === "/member/match") return pathname.startsWith("/member/match") || pathname.startsWith("/member/girlmate");
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderTabIcon(key: TabKey, active: boolean) {
    const c = active ? "white" : "rgba(0,0,0,0.38)";
    const w = active ? 2.2 : 1.7;
    if (key === "home")          return <IconTime          c={c} w={w} slab={slab} />;
    if (key === "introductions") return <IconIntroductions c={c} active={active} />;
    if (key === "clubs")         return <IconClubs         c={c} />;
    if (key === "avenue")        return <IconAveSign       c={c} w={w} />;
    if (key === "city")          return <IconHappenings    c={c} w={w} />;
  }

  function tabLabel(key: TabKey): string {
    if (key === "home")          return SLAB_LABEL[slab];
    if (key === "introductions") return "Meet";
    if (key === "clubs")         return "Clubs";
    if (key === "avenue")        return "Avenue";
    if (key === "city")          return "City";
    return key;
  }

  // Top bar icon tile
  function TopTile({ href, label, children, badge }: {
    href: string; label: string; children: React.ReactNode; badge?: "dot" | "number";
  }) {
    const active = pathname.startsWith(href);
    return (
      <Link href={href} aria-label={label} style={{ textDecoration: "none", position: "relative" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 13,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: active ? `linear-gradient(145deg, ${PINK}18, ${PINK}0D)` : "transparent",
          border: active ? `1.5px solid ${PINK}30` : "none",
          boxShadow: active ? `0 2px 10px ${PINK}1A` : "none",
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
            fontSize: "7.5px", fontWeight: 900, color: "white",
            fontFamily: "var(--font-jost)", lineHeight: 1,
          }}>3</div>
        )}
        {badge === "dot" && (
          <span style={{
            position: "absolute", top: 3, right: 3,
            width: 8, height: 8, borderRadius: "50%",
            background: PINK, border: "1.5px solid rgba(253,251,247,0.97)",
            boxShadow: `0 1px 4px ${PINK}77`,
          }} />
        )}
      </Link>
    );
  }

  return (
    <>
      {/* ══════════ FIXED MOBILE TOP BAR ══════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{ background: "transparent", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 54 }}>
          <Link href="/member/home" aria-label="BloomBay" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <BBLogo size={26} pinkColor={PINK} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <TopTile href="/member/you" label="Apartment">
              <IconApt c={isDarkPage ? "white" : PINK} />
            </TopTile>
            <TopTile href="/member/city" label="Pin Drop">
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

      {/* ══════════ BLOOMBAY SIGNATURE BOTTOM NAV ══════════ */}
      <div
        className="fixed z-50 md:hidden"
        onTouchStart={() => { setNavTouched(true); setNavShrunk(false); }}
        onTouchEnd={() => { setTimeout(() => setNavTouched(false), 600); }}
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          left: navShrunk && !navTouched ? "50%" : "18px",
          right: navShrunk && !navTouched ? "auto" : "18px",
          transform: navShrunk && !navTouched ? "translateX(-50%) scale(0.7)" : "none",
          transformOrigin: "bottom center",
          transition: "all 0.44s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: navShrunk && !navTouched ? 0.7 : 1,
        }}
      >
        {/* ── Outer rose-gold glow ring ── */}
        <div style={{
          position: "absolute", inset: -2, borderRadius: 999,
          background: `linear-gradient(135deg, ${GOLD}30, ${PINK}20, ${GOLD}30)`,
          pointerEvents: "none",
        }} />

        {/* ── Bloom mark at top center ── */}
        <BloomMark />

        {/* ── Main pill ── */}
        <div style={{
          position: "relative",
          background: CREAM,
          backdropFilter: "blur(28px) saturate(1.8)",
          WebkitBackdropFilter: "blur(28px) saturate(1.8)",
          borderRadius: 999,
          border: `1.5px solid ${GOLD}40`,
          padding: "6px 8px 6px",
          boxShadow: [
            "0 14px 44px rgba(0,0,0,0.12)",
            `0 4px 16px ${GOLD}18`,
            `0 0px 0px 1px ${GOLD}18`,
            "inset 0 1.5px 0 rgba(255,255,255,0.9)",
            "inset 0 -1px 0 rgba(0,0,0,0.03)",
          ].join(", "),
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}>
          {/* Grain texture overlay */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 999, pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' fill='%23000' filter='url(%23n)' opacity='0.018'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
            opacity: 0.6,
          }} />

          {TABS.map((tab, i) => {
            const active = isActive(tab.href);
            const label  = tabLabel(tab.key);
            const isCenter = i === 2; // Clubs at center
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="active:scale-90 transition-transform"
                style={{ flex: 1, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative", zIndex: 1 }}
              >
                {/* Icon container — petal shape when active */}
                <div style={{
                  width: isCenter ? 44 : 46,
                  height: isCenter ? 44 : 38,
                  borderRadius: active
                    ? "60% 40% 60% 40% / 40% 60% 40% 60%"  // organic petal shape
                    : 999,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active
                    ? `linear-gradient(145deg, ${PINK}, #FF5BAD)`
                    : "transparent",
                  boxShadow: active
                    ? `0 5px 20px ${PINK}55, inset 0 1px 0 rgba(255,255,255,0.3)`
                    : "none",
                  transform: active ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: active ? "bloomPop 0.35s cubic-bezier(0.34,1.56,0.64,1)" : "none",
                }}>
                  {renderTabIcon(tab.key, active)}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: "7px",
                  fontWeight: active ? 900 : 600,
                  letterSpacing: active ? "0.07em" : "0.04em",
                  fontFamily: "var(--font-jost)",
                  color: active ? PINK : `${GOLD}99`,
                  transition: "all 0.2s",
                  lineHeight: 1,
                  opacity: navShrunk && !navTouched ? 0 : 1,
                  maxHeight: navShrunk && !navTouched ? 0 : 10,
                  overflow: "hidden",
                  textTransform: "uppercase",
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
