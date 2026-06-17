"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { BBLogo } from "./bb-logo";

const PINK  = "#FF1F7D";
const GOLD  = "#D4A853";

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

function IconPlans({ c, w = 2 }: SVGProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="8"  x2="15" y2="8"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="12" y2="16"/>
    </svg>
  );
}

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

function IconAveSign({ c, w = 2 }: SVGProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="10" x2="12" y2="22" stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <rect x="3" y="3" width="18" height="8" rx="1.5" stroke={c} strokeWidth={w} fill="none"/>
      <line x1="7"   y1="5.5" x2="6"   y2="9"   stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="7"   y1="5.5" x2="8"   y2="9"   stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="6.5" y1="7.5" x2="7.5" y2="7.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="10"  y1="5.5" x2="10"  y2="9"   stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="10"  y1="5.5" x2="11.2" y2="7.2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="11.2" y1="7.2" x2="10" y2="9"   stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

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
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Post */}
      <line x1="12" y1="20" x2="12" y2="15"/>
      {/* Base */}
      <line x1="9" y1="20" x2="15" y2="20"/>
      {/* Mailbox body */}
      <path d="M5 15h14V10a7 7 0 0 0-14 0v5z"/>
      {/* Door/slot */}
      <line x1="5" y1="12" x2="9" y2="12"/>
      {/* Flag up */}
      <polyline points="19,10 19,6 22,6 22,10"/>
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
      <circle cx="20" cy="20" r="3" fill={GOLD} opacity="0.82"/>
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
                     pathname.startsWith("/member/clubs");
  const hideTopBar = pathname.startsWith("/member/lounge")    ||
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
      {/* ══════ TOP BAR ══════ */}
      {!hideTopBar && (
        <div className="fixed top-0 left-0 right-0 z-50 md:hidden"
          style={{ background: "transparent", paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 54 }}>
            <Link href="/member/home" aria-label="BloomBay" style={{ textDecoration: "none" }}>
              <BBLogo size={26} pinkColor={PINK} />
            </Link>
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
          </div>
        </div>
      )}

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

                {/* Branch — connects the icon to the stem below */}
                <div style={{
                  width: active ? 2 : 1.5,
                  height: active ? 15 : 10,
                  background: active ? PINK : branchC,
                  borderRadius: 1,
                  marginBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
                  transition: "height 0.22s ease, background 0.18s, width 0.18s",
                }} />
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
