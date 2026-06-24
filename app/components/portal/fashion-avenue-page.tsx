"use client";

import Link from "next/link";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG       = "#0D0D0D";
const CARD_BG  = "#1A1A1A";
const PINK     = "#E8007A";
const PINK_ALT = "#FF1F7D";
const GOLD     = "#D4A853";
const WHITE    = "#FFFFFF";
const GRAIN    = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23fff' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`;

// ── SVG Icons ──────────────────────────────────────────────────────────────────
function HangersIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left hanger */}
      <path d="M7 20H2l5-6.5c-.5-.3-.8-.9-.8-1.5 0-1.1.9-2 2-2s2 .9 2 2c0 .4-.1.8-.4 1.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M8.2 13.1L2 20" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      {/* Right hanger */}
      <path d="M21 20H26l-5-6.5c.5-.3.8-.9.8-1.5 0-1.1-.9-2-2-2s-2 .9-2 2c0 .4.1.8.4 1.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M19.8 13.1L26 20" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function DressIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4v4M11 4c0 1.7 1.3 3 3 3s3-1.3 3-3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 8l-3 5h3l-2 11h14l-2-11h3l-3-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function GiftTagIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="9" width="14" height="15" rx="2" stroke={color} strokeWidth="1.6" fill="none"/>
      <path d="M11 9c0-2 1.5-3.5 3.5-3.5 2 0 3.5 1.5 3.5 3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M11 9c0-2-1.5-3.5-3.5-3.5S4 7 4 9" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="11" y1="9" x2="11" y2="24" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="4" y1="13" x2="18" y2="13" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function GridIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4"  y="4"  width="8" height="8" rx="2" stroke={color} strokeWidth="1.6" fill="none"/>
      <rect x="16" y="4"  width="8" height="8" rx="2" stroke={color} strokeWidth="1.6" fill="none"/>
      <rect x="4"  y="16" width="8" height="8" rx="2" stroke={color} strokeWidth="1.6" fill="none"/>
      <rect x="16" y="16" width="8" height="8" rx="2" stroke={color} strokeWidth="1.6" fill="none"/>
    </svg>
  );
}

function ArrowRight({ color = WHITE }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

// ── Destination card data ──────────────────────────────────────────────────────
interface Destination {
  key: string;
  label: string;
  accent: string;
  tagline: string;
  href: string | null;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const DESTINATIONS: Destination[] = [
  {
    key: "hanger",
    label: "THE HANGER",
    accent: PINK_ALT,
    tagline: "Swap. Sell. Score.",
    href: "/member/hanger",
    icon: <HangersIcon color={PINK_ALT} />,
  },
  {
    key: "closet",
    label: "THE CLOSET",
    accent: PINK,
    tagline: "Fits. Style. Community.",
    href: "/member/avenue/closet",
    icon: <DressIcon color={PINK} />,
  },
  {
    key: "drops",
    label: "STYLE DROPS",
    accent: GOLD,
    tagline: "Weekly perks. Free.",
    href: "/member/drops",
    icon: <GiftTagIcon color={GOLD} />,
  },
  {
    key: "pinterest",
    label: "PINTEREST BOARD",
    accent: "#888888",
    tagline: "Inspo boards. Soon.",
    href: null,
    icon: <GridIcon color="#888888" />,
    comingSoon: true,
  },
];

// ── Destination card component ─────────────────────────────────────────────────
function DestinationCard({ dest }: { dest: Destination }) {
  const inner = (
    <div style={{
      background: CARD_BG,
      borderRadius: 20,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      opacity: dest.comingSoon ? 0.55 : 1,
      border: `1px solid rgba(255,255,255,0.05)`,
      position: "relative",
      overflow: "hidden",
      minHeight: 120,
    }}>
      {/* Grain overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: GRAIN,
        backgroundSize: "200px 200px",
        pointerEvents: "none",
      }} />
      {/* Icon */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {dest.icon}
      </div>
      {/* Label */}
      <p style={{
        fontFamily: "var(--font-jost)",
        fontSize: 10,
        fontWeight: 800,
        color: dest.comingSoon ? "#888" : WHITE,
        letterSpacing: "0.1em",
        lineHeight: 1.2,
        position: "relative",
        zIndex: 1,
      }}>{dest.label}</p>
      {/* Tagline */}
      <p style={{
        fontFamily: "var(--font-caveat)",
        fontSize: 12,
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.35,
        position: "relative",
        zIndex: 1,
        flex: 1,
      }}>{dest.tagline}</p>
      {/* Arrow or coming soon */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {dest.comingSoon ? (
          <span style={{
            fontFamily: "var(--font-jost)",
            fontSize: 8,
            fontWeight: 800,
            color: "#666",
            letterSpacing: "0.12em",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 99,
            padding: "3px 8px",
          }}>COMING SOON</span>
        ) : (
          <div style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: `${dest.accent}22`,
            border: `1px solid ${dest.accent}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <ArrowRight color={dest.accent} />
          </div>
        )}
      </div>
      {/* Subtle accent glow corner */}
      {!dest.comingSoon && (
        <div style={{
          position: "absolute",
          bottom: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${dest.accent}18, transparent)`,
          pointerEvents: "none",
        }} />
      )}
    </div>
  );

  if (dest.href) {
    return (
      <Link href={dest.href} style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </Link>
    );
  }
  return <div style={{ cursor: "default" }}>{inner}</div>;
}

// ── Main page ──────────────────────────────────────────────────────────────────
export function FashionAvenuePage() {
  return (
    <div style={{
      background: BG,
      minHeight: "100vh",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)",
      position: "relative",
    }}>
      {/* Grain on main bg */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: GRAIN,
        backgroundSize: "200px 200px",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── 1. FIXED TOP BAR ─────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {/* Back arrow — left anchored */}
        <Link
          href="/member/avenue"
          style={{
            position: "absolute",
            left: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        {/* Center wordmark */}
        <p style={{
          fontFamily: "var(--font-jost)",
          fontSize: 13,
          fontWeight: 800,
          color: WHITE,
          letterSpacing: "0.12em",
        }}>FASHION AVE.</p>
      </div>

      {/* ── 2. HEADER SECTION ────────────────────────────────────────────────── */}
      <div style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 62px)",
        paddingLeft: 22,
        paddingRight: 22,
        paddingBottom: 28,
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}>
        {/* Decorative large FASHION text */}
        <div style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "clamp(56px, 18vw, 82px)",
          color: WHITE,
          lineHeight: 0.88,
          letterSpacing: "-0.02em",
          marginLeft: -4,
          marginBottom: 8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "clip",
        }}>
          FASHION
        </div>
        {/* Tagline */}
        <p style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 17,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 16,
          letterSpacing: "0.01em",
        }}>Style. Culture. Curation.</p>
        {/* Gold rule */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, ${GOLD}88, ${GOLD}22, transparent)`,
          marginBottom: 12,
        }} />
        {/* Issue date */}
        <p style={{
          fontFamily: "var(--font-jost)",
          fontSize: 9,
          fontWeight: 800,
          color: `${GOLD}99`,
          letterSpacing: "0.22em",
        }}>JUNE 2026</p>
      </div>

      {/* ── Content wrapper ───────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, paddingLeft: 18, paddingRight: 18 }}>

        {/* ── 3. BLOOMBAY MAGAZINE FEATURE CARD ──────────────────────────────── */}
        <Link href="/member/avenue/magazine" style={{ textDecoration: "none", display: "block", marginBottom: 20 }}>
          <div style={{
            borderRadius: 22,
            overflow: "hidden",
            background: "linear-gradient(145deg, #1A0526 0%, #7B1FA2 100%)",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            {/* Grain overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: GRAIN,
              backgroundSize: "200px 200px",
              pointerEvents: "none",
              zIndex: 1,
            }} />
            {/* Glow blob */}
            <div style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,0,122,0.18), transparent)",
              pointerEvents: "none",
              zIndex: 1,
            }} />

            <div style={{ position: "relative", zIndex: 2, padding: "22px 20px 20px" }}>
              {/* Top label badge */}
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 8,
                  fontWeight: 900,
                  color: GOLD,
                  background: "rgba(0,0,0,0.45)",
                  borderRadius: 99,
                  padding: "4px 12px",
                  letterSpacing: "0.18em",
                  border: `1px solid ${GOLD}33`,
                }}>THIS WEEK&apos;S ISSUE</span>
              </div>

              {/* Large title */}
              <h2 style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: "clamp(36px, 12vw, 52px)",
                color: WHITE,
                lineHeight: 0.95,
                marginBottom: 6,
                letterSpacing: "-0.01em",
              }}>Magazine.</h2>

              {/* Subtitle */}
              <p style={{
                fontFamily: "var(--font-caveat)",
                fontSize: 15,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 20,
              }}>Her stories. Her voice. Her world.</p>

              {/* Divider */}
              <div style={{
                height: 1,
                background: "rgba(255,255,255,0.1)",
                marginBottom: 16,
              }} />

              {/* Latest article preview */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 7,
                    fontWeight: 900,
                    color: PINK,
                    background: `${PINK}22`,
                    borderRadius: 99,
                    padding: "3px 9px",
                    letterSpacing: "0.15em",
                    border: `1px solid ${PINK}33`,
                  }}>STYLE</span>
                  <p style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.05em",
                  }}>LATEST ARTICLE</p>
                </div>
                <p style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: 17,
                  color: WHITE,
                  lineHeight: 1.25,
                  marginBottom: 6,
                }}>The Outfit That Started an Argument</p>
                <p style={{
                  fontFamily: "var(--font-caveat)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.5,
                }}>On dressing for yourself in a world that has opinions about it — and why the pushback is always more telling than the outfit.</p>
              </div>

              {/* Bottom CTA row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{
                  padding: "11px 20px",
                  borderRadius: 50,
                  background: WHITE,
                  fontFamily: "var(--font-jost)",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#0D0D0D",
                  letterSpacing: "0.05em",
                }}>Read Issue →</div>
                <p style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: `${GOLD}AA`,
                  letterSpacing: "0.08em",
                }}>Issue 07 · June 2026</p>
              </div>
            </div>
          </div>
        </Link>

        {/* ── 4. DESTINATIONS GRID ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontFamily: "var(--font-jost)",
            fontSize: 9,
            fontWeight: 800,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.22em",
            marginBottom: 14,
          }}>DESTINATIONS</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            {DESTINATIONS.map(dest => (
              <DestinationCard key={dest.key} dest={dest} />
            ))}
          </div>
        </div>

        {/* ── 5. PITCH THE MAGAZINE CTA ──────────────────────────────────────── */}
        <div style={{
          borderRadius: 20,
          background: CARD_BG,
          border: `1.5px solid ${GOLD}44`,
          padding: "22px 20px",
          position: "relative",
          overflow: "hidden",
          marginBottom: 8,
        }}>
          {/* Grain */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: GRAIN,
            backgroundSize: "200px 200px",
            pointerEvents: "none",
          }} />
          {/* Gold glow */}
          <div style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}12, transparent)`,
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 20,
              color: WHITE,
              marginBottom: 6,
              lineHeight: 1.2,
            }}>Write for BloomBay</p>
            <p style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.55,
              marginBottom: 18,
            }}>Pitch a story, share your voice — every issue features member writing.</p>
            <button style={{
              padding: "12px 22px",
              borderRadius: 50,
              background: `linear-gradient(135deg, ${PINK}, #C4005A)`,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jost)",
              fontSize: 12,
              fontWeight: 800,
              color: WHITE,
              letterSpacing: "0.06em",
              boxShadow: `0 4px 18px ${PINK}44`,
            }}>Submit a Pitch →</button>
          </div>
        </div>

      </div>
    </div>
  );
}
