"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/auth/actions";
import { BBLogo } from "./bb-logo";

const PINK = "#FF0090";

// Inject pulse keyframe once
if (typeof document !== "undefined") {
  if (!document.getElementById("bb-pulse-style")) {
    const s = document.createElement("style");
    s.id = "bb-pulse-style";
    s.textContent = `@keyframes pinkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.65;transform:scale(0.88)} }`;
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

// ── SVG helpers ───────────────────────────────────────────────────────────────
type SVGProps = { c: string; w?: number };

// Time-of-day icon
function IconTime({ c, w = 2, slab }: SVGProps & { slab: Slab }) {
  if (slab === "morning") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  );
  if (slab === "afternoon") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <circle cx="10" cy="10" r="3.5"/>
      <line x1="10" y1="2" x2="10" y2="5"/>
      <line x1="2" y1="10" x2="5" y2="10"/>
      <line x1="4.4" y1="4.4" x2="6.5" y2="6.5"/>
      <line x1="15.6" y1="4.4" x2="13.5" y2="6.5"/>
      <path d="M16 16H8a4 4 0 0 0 0 0" strokeWidth={0}/>
      <path d="M17 17H7a4 4 0 0 1 0-8h.2A6 6 0 0 1 17 13.5a4 4 0 0 1 0 3.5z"/>
    </svg>
  );
  if (slab === "evening") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M17 12a5 5 0 1 0-10 0"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="2" y1="12" x2="4" y2="12"/>
      <line x1="20" y1="12" x2="22" y2="12"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      <line x1="2" y1="17" x2="22" y2="17"/>
    </svg>
  );
  // tonight: crescent moon + star
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      <line x1="19" y1="5" x2="19" y2="5" strokeWidth={3}/>
      <line x1="22" y1="3" x2="22" y2="3" strokeWidth={2.5}/>
    </svg>
  );
}

// Plans: open notebook with lines
function IconPlans({ c, w = 2 }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="8" x2="15" y2="8"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="12" y2="16"/>
    </svg>
  );
}

// Happenings: city skyline
function IconHappenings({ c, w = 2 }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="20" x2="23" y2="20"/>
      <path d="M3 20V9l5-4 5 4v11"/>
      <path d="M16 20v-6h5v6"/>
      <line x1="9" y1="12" x2="11" y2="12"/>
      <line x1="9" y1="16" x2="11" y2="16"/>
    </svg>
  );
}

// Clubs: heraldic shield / crest
function IconClubs({ c, w = 2 }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5 4 9.5 9 11 5-1.5 9-6 9-11V7L12 2z"/>
      <line x1="12" y1="8" x2="12" y2="15" strokeWidth={1.4}/>
      <line x1="8.5" y1="11" x2="15.5" y2="11" strokeWidth={1.4}/>
    </svg>
  );
}

// ── Top bar icon components (bigger, in styled tiles) ─────────────────────────
function IconApt({ c, w = 2 }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="21" x2="22" y2="21"/>
      <path d="M8 21V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v15"/>
      <circle cx="14.5" cy="13" r="0.7" fill={c} stroke="none"/>
    </svg>
  );
}

// Push-pin / clothing pin — circle head + shaft
function IconPin({ c, w = 2 }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7.5" r="5" fill={c}/>
      <line x1="12" y1="12.5" x2="12" y2="21" stroke={c} strokeWidth={w + 0.5} strokeLinecap="round"/>
    </svg>
  );
}

function IconMail({ c }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function IconChatBubble({ c }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function IconLobby({ c, w = 2 }: SVGProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v15"/>
      <path d="M9 21V12h6v9"/>
      <circle cx="14.5" cy="16.5" r="0.5" fill={c}/>
    </svg>
  );
}

// ── Nav tabs config ───────────────────────────────────────────────────────────
const TABS = [
  { href: "/member/home",       key: "home"       },
  { href: "/member/plans",      key: "plans"      },
  { href: "/member/happenings", key: "happenings" },
  { href: "/member/clubs",      key: "clubs"      },
  { href: "/member/lobby",      key: "lobby"      },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Main component ────────────────────────────────────────────────────────────
export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();
  const slab     = getSlab();
  const [navHidden, setNavHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y > lastYRef.current + 14) setNavHidden(true);
      else if (y < lastYRef.current - 8) setNavHidden(false);
      lastYRef.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderTabIcon(key: TabKey, active: boolean) {
    const c = active ? "white" : "rgba(0,0,0,0.42)";
    const w = active ? 2.2 : 1.8;
    if (key === "home")       return <IconTime       c={c} w={w} slab={slab} />;
    if (key === "plans")      return <IconPlans      c={c} w={w} />;
    if (key === "happenings") return <IconHappenings c={c} w={w} />;
    if (key === "clubs")      return <IconClubs      c={c} />;
    if (key === "lobby")      return <IconLobby      c={c} w={w} />;
  }

  function tabLabel(key: TabKey): string {
    if (key === "home") return SLAB_LABEL[slab];
    return { plans: "Plans", happenings: "Happenings", clubs: "Clubs", lobby: "Lobby" }[key] ?? key;
  }

  // Top bar icon tile
  function TopTile({ href, label, children, badge }: {
    href: string; label: string; children: React.ReactNode;
    badge?: "dot" | "number";
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
            background: PINK,
            border: "2px solid rgba(253,251,247,0.97)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "7.5px", fontWeight: 900, color: "white",
            fontFamily: "var(--font-jost)", lineHeight: 1,
          }}>3</div>
        )}
        {badge === "dot" && (
          <span style={{
            position: "absolute", top: 3, right: 3,
            width: 8, height: 8, borderRadius: "50%",
            background: PINK,
            border: "1.5px solid rgba(253,251,247,0.97)",
            boxShadow: `0 1px 4px ${PINK}77`,
          }} />
        )}
      </Link>
    );
  }

  return (
    <>
      {/* ══════════ FIXED MOBILE TOP BAR ══════════ */}
      <div
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(253,251,247,0.97)",
          backdropFilter: "blur(22px) saturate(1.7)",
          WebkitBackdropFilter: "blur(22px) saturate(1.7)",
          boxShadow: "0 1px 14px rgba(0,0,0,0.06)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 54 }}>

          {/* BloomBay logo */}
          <Link href="/member/home" aria-label="BloomBay" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <BBLogo size={26} pinkColor={PINK} />
          </Link>

          {/* ── Top icons: Apt · Pin · Mailbox · Chat ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>

            {/* Apt / Lounge */}
            <TopTile href="/member/lounge" label="My Apt">
              <IconApt c={PINK} />
            </TopTile>

            {/* Pin drop / City */}
            <TopTile href="/member/city" label="Pin Drop">
              <IconPin c={PINK} />
            </TopTile>

            {/* Mailbox */}
            <TopTile href="/member/messages" label="Mailbox" badge="number">
              <IconMail c={PINK} />
            </TopTile>

            {/* Chat — pulse when has dot badge */}
            <TopTile href="/member/chat" label="Chat" badge="dot">
              <span style={{ animation: "pinkPulse 2s ease-in-out infinite" }}>
                <IconChatBubble c={PINK} />
              </span>
            </TopTile>

          </div>
        </div>

      </div>

      {/* ══════════ FLOATING PILL BOTTOM NAV ══════════ */}
      <div
        className="fixed z-50 md:hidden"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
          left: "16px",
          right: "16px",
          transform: navHidden ? "translateY(calc(100% + 28px))" : "translateY(0)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: navHidden ? "none" : "auto",
        }}
      >
        {/* Outer glow ring (decorative) */}
        <div style={{
          position: "absolute", inset: -1,
          borderRadius: 999,
          background: `linear-gradient(135deg, ${PINK}18, rgba(212,168,83,0.12), ${PINK}18)`,
          pointerEvents: "none",
        }} />

        {/* Pill container */}
        <div style={{
          position: "relative",
          background: "rgba(255,252,248,0.95)",
          backdropFilter: "blur(30px) saturate(2)",
          WebkitBackdropFilter: "blur(30px) saturate(2)",
          borderRadius: 999,
          border: "1.5px solid rgba(255,31,125,0.16)",
          padding: "5px 7px",
          boxShadow: [
            "0 12px 40px rgba(0,0,0,0.13)",
            "0 4px 14px rgba(255,31,125,0.1)",
            "inset 0 1.5px 0 rgba(255,255,255,0.95)",
            "inset 0 -1px 0 rgba(0,0,0,0.03)",
          ].join(", "),
          display: "flex",
          alignItems: "center",
        }}>
          {TABS.map(tab => {
            const active = isActive(tab.href);
            const label  = tabLabel(tab.key);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="active:scale-90 transition-transform"
                style={{ flex: 1, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
              >
                {/* Icon pill */}
                <div style={{
                  width: 54, height: 40, borderRadius: 999,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active
                    ? `linear-gradient(145deg, ${PINK}, #FF5BAD)`
                    : "transparent",
                  boxShadow: active
                    ? `0 4px 18px ${PINK}55, inset 0 1px 0 rgba(255,255,255,0.28)`
                    : "none",
                  transition: "all 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}>
                  {renderTabIcon(tab.key, active)}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: "7.5px",
                  fontWeight: active ? 800 : 600,
                  letterSpacing: active ? "0.05em" : "0.03em",
                  fontFamily: "var(--font-jost)",
                  color: active ? PINK : "rgba(0,0,0,0.32)",
                  transition: "all 0.2s",
                  lineHeight: 1,
                }}>
                  {label.toUpperCase()}
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
