"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/auth/actions";
import { BBLogo } from "./bb-logo";

const PINK  = "#FF1F7D";
const GOLD  = "#D4A853";
const CREAM = "rgba(251,247,241,0.98)";

// Inject keyframes once
if (typeof document !== "undefined") {
  if (!document.getElementById("bb-nav-style")) {
    const s = document.createElement("style");
    s.id = "bb-nav-style";
    s.textContent = `
      @keyframes pinkPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.65;transform:scale(0.88)} }
      @keyframes flowerBloom { 0%{opacity:0;transform:scale(0.15) rotate(-40deg)} 65%{transform:scale(1.18) rotate(8deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
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
  morning: "This Morning", afternoon: "This Afternoon", evening: "This Evening", tonight: "Tonight",
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

// Plans: open notebook with lines
function IconPlans({ c, w = 2 }: SVGProps) {
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

// Introductions: four women together — Sex and the City city girls
function IconIntroductions({ c, w = 2 }: SVGProps) {
  return (
    <svg width="24" height="20" viewBox="0 0 40 22" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="2.5"/>
      <path d="M2.5 8 Q5 7 7.5 8 L9 21 L1 21 Z"/>
      <circle cx="14" cy="4.5" r="2.5"/>
      <path d="M11.5 7.5 Q14 6.5 16.5 7.5 L18 21 L10 21 Z"/>
      <circle cx="26" cy="5" r="2.5"/>
      <path d="M23.5 8 Q26 7 28.5 8 L30 21 L22 21 Z"/>
      <circle cx="35" cy="4.5" r="2.5"/>
      <path d="M32.5 7.5 Q35 6.5 37.5 7.5 L39 21 L31 21 Z"/>
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

// ── Stem-shaped nav bar ───────────────────────────────────────────────────────
function NavStem() {
  return (
    <svg
      viewBox="0 0 360 56"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="bb-stem-shadow" x="-5%" y="-60%" width="110%" height="240%">
          <feDropShadow dx="0" dy="-10" stdDeviation="18" floodColor="rgba(0,0,0,0.09)" floodOpacity="1"/>
          <feDropShadow dx="0" dy="3"   stdDeviation="5"  floodColor={GOLD}             floodOpacity="0.10"/>
        </filter>
      </defs>
      {/* Stem body — rounded pill */}
      <rect x="0" y="2" width="360" height="54" rx="27" fill={CREAM} filter="url(#bb-stem-shadow)"/>
      {/* Gold border */}
      <rect x="1" y="3" width="358" height="52" rx="26" fill="none" stroke={GOLD} strokeWidth="0.9" strokeOpacity="0.32"/>
      {/* Top highlight strip */}
      <rect x="8" y="5" width="344" height="9" rx="4.5" fill="rgba(255,255,255,0.58)"/>
      {/* Subtle valley dots between tabs */}
      {[60, 120, 180, 240, 300].map(x => (
        <circle key={x} cx={x} cy={29} r="1.4" fill={GOLD} opacity="0.22"/>
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
  { href: "/member/home",          key: "home"          },
  { href: "/member/happenings",    key: "happenings"    },
  { href: "/member/plans",         key: "plans"         },
  { href: "/member/clubs",         key: "clubs"         },
  { href: "/member/avenue",        key: "avenue"        },
  { href: "/member/introductions", key: "introductions" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Main component ────────────────────────────────────────────────────────────
export function BottomNav({ user }: { user?: NavUser }) {
  const pathname    = usePathname();
  const slab        = getSlab();
  const isDarkPage  = pathname.startsWith("/member/home") || pathname.startsWith("/member/avenue") || pathname.startsWith("/member/plans") || pathname.startsWith("/member/happenings");
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
    if (href === "/member/happenings") return pathname.startsWith("/member/happenings");
    if (href === "/member/avenue") return pathname.startsWith("/member/avenue");
    if (href === "/member/introductions") return pathname.startsWith("/member/introductions") || pathname.startsWith("/member/girlmate");
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderIcon(key: TabKey, active: boolean) {
    const c = active ? "white" : "rgba(0,0,0,0.36)";
    const w = active ? 2.2 : 1.7;
    if (key === "home")          return <IconTime           c={c} w={w} slab={slab} />;
    if (key === "happenings")    return <IconHappenings     c={c} w={w} />;
    if (key === "plans")         return <IconPlans          c={c} w={w} />;
    if (key === "clubs")         return <IconClubs          c={c} />;
    if (key === "avenue")        return <IconAveSign        c={c} w={w} />;
    if (key === "introductions") return <IconIntroductions  c={c} w={w} />;
  }

  function tabLabel(key: TabKey): string {
    if (key === "home")          return SLAB_LABEL[slab];
    if (key === "happenings")    return "The City";
    if (key === "plans")         return "Plans";
    if (key === "clubs")         return "Clubs";
    if (key === "avenue")        return "The Avenue";
    if (key === "introductions") return "Intros";
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
            animation: "pinkPulse 2s ease-in-out infinite",
            boxShadow: `0 0 0 3px ${PINK}30, 0 0 10px ${PINK}44`,
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
            <TopTile href="/member/lounge" label="Apartment">
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
        </div>
      </div>

      {/* ══════ STEM NAV ══════ */}
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
          height: 56,
          position: "fixed",
          overflow: "visible",
        }}
      >
        {/* SVG stem background */}
        <NavStem />

        {/* Flower indicator — slides along the stem, blooms on active tab */}
        {(() => {
          const activeIndex = Math.max(0, TABS.findIndex(t => isActive(t.href)));
          const tabW = 100 / TABS.length;
          return (
            <div style={{
              position: "absolute",
              top: -34,
              left: `calc(${activeIndex * tabW}% + ${tabW / 2}%)`,
              transform: "translateX(-50%)",
              transition: "left 0.44s cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 4,
              pointerEvents: "none",
            }}>
              {/* key remounts on tab change → replays flowerBloom animation */}
              <div key={activeIndex} style={{ animation: "flowerBloom 0.44s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
                <svg width="30" height="42" viewBox="0 0 30 42" fill="none">
                  {/* Stem line connecting flower to the nav bar */}
                  <line x1="15" y1="24" x2="15" y2="42" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
                  {/* 5 petals */}
                  {[0,1,2,3,4].map(i => {
                    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                    const cx = 15 + Math.cos(angle) * 8;
                    const cy = 13 + Math.sin(angle) * 8;
                    return (
                      <ellipse
                        key={i}
                        cx={cx} cy={cy}
                        rx="4.8" ry="2.9"
                        fill={PINK}
                        opacity="0.9"
                        transform={`rotate(${i * 72},${cx},${cy})`}
                      />
                    );
                  })}
                  {/* Center */}
                  <circle cx="15" cy="13" r="5.8" fill={PINK}/>
                  <circle cx="15" cy="13" r="3.2" fill="white" opacity="0.40"/>
                  <circle cx="15" cy="13" r="1.3" fill="white" opacity="0.72"/>
                </svg>
              </div>
            </div>
          );
        })()}

        {/* Icon + label row */}
        <div style={{
          position: "relative", zIndex: 1,
          height: "100%",
          display: "flex", alignItems: "center",
        }}>
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            const label  = tabLabel(tab.key);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="active:scale-90 transition-transform"
                style={{ flex: 1, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
              >
                {/* Icon — no circle bg, flower above handles active state */}
                <div style={{
                  width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "opacity 0.2s",
                  opacity: active ? 1 : 0.72,
                }}>
                  {renderIcon(tab.key, active)}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: "6.5px",
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
