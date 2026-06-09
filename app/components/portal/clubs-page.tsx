"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
const CREAM = "#F6F1EB";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const FEATURED = [
  { id: 1, name: "SUPPER CLUB",    members: "1.2K", desc: "Dinner parties that feel like home.", grad: "linear-gradient(135deg,#c9504a 0%,#7a1c2e 100%)", rot: -2,   href: "/member/clubs/11111111-1111-1111-1111-111111111111" },
  { id: 2, name: "RUN CLUB",       members: "842",  desc: "Move together, every Sunday.",        grad: "linear-gradient(135deg,#e07b39 0%,#8b3a0f 100%)", rot: 1.5,  href: "/member/clubs/55555555-5555-5555-5555-555555555555" },
  { id: 3, name: "MUSEUM GIRLS",   members: "1.6K", desc: "Art, exhibitions, slow afternoons.",  grad: "linear-gradient(135deg,#6b4fa0 0%,#2d1a5e 100%)", rot: -1,   href: "/member/clubs/22222222-2222-2222-2222-222222222222" },
  { id: 4, name: "BOOK GIRLS",     members: "1.1K", desc: "Pages, discussions, hot drinks.",     grad: "linear-gradient(135deg,#3e7c6b 0%,#1a3d31 100%)", rot: 2,    href: "/member/clubs/33333333-3333-3333-3333-333333333333" },
  { id: 5, name: "SOFT LIFE CLUB", members: "723",  desc: "Rest as resistance.",                 grad: "linear-gradient(135deg,#c96b9e 0%,#7a2250 100%)", rot: -1.5, href: "/member/clubs/44444444-4444-4444-4444-444444444444" },
];

const HAPPENINGS = [
  { avatar: "S", color: "#FF1F7D", name: "Sunset Picnic", loc: "Prospect Park", time: "6PM" },
  { avatar: "G", color: "#A855F7", name: "Gallery Night Out", loc: "Chelsea", time: "7PM" },
  { avatar: "P", color: "#0EA5E9", name: "Pilates & Prosecco", loc: "SoHo", time: "11AM" },
  { avatar: "W", color: "#F59E0B", name: "Wine Down Wednesday", loc: "West Village", time: "8PM" },
  { avatar: "M", color: "#4ADE80", name: "Matcha & Mimosas", loc: "Williamsburg", time: "12PM" },
];

const VIBES = ["creative", "wellness", "adventure", "career", "night out", "faith", "fashion", "foodie"];

const NEAR_YOU = [
  { name: "SoHo", clubs: 14, grad: "linear-gradient(135deg,#c9504a,#7a1c2e)" },
  { name: "Williamsburg", clubs: 9, grad: "linear-gradient(135deg,#6b4fa0,#2d1a5e)" },
  { name: "West Village", clubs: 11, grad: "linear-gradient(135deg,#3e7c6b,#1a3d31)" },
  { name: "Prospect Park", clubs: 6, grad: "linear-gradient(135deg,#e07b39,#8b3a0f)" },
  { name: "Astoria", clubs: 8, grad: "linear-gradient(135deg,#c96b9e,#7a2250)" },
];

function Tape({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute",
      top: -10,
      left: "50%",
      transform: "translateX(-50%)",
      width: 48,
      height: 20,
      background: "rgba(255,240,150,0.55)",
      borderRadius: 2,
      zIndex: 2,
      border: "1px solid rgba(255,220,50,0.3)",
      ...style,
    }} />
  );
}

function SafetyPin({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="22" height="42" viewBox="0 0 22 42" fill="none" style={{ opacity: 0.5, ...style }}>
      <path d="M11 2 Q14 8 14 16 L14 38 Q14 41 11 41 Q8 41 8 38 L8 16 Q8 8 11 2Z" fill="none" stroke="#bbb" strokeWidth="1.2"/>
      <circle cx="11" cy="5" r="3" fill="none" stroke="#bbb" strokeWidth="1.2"/>
    </svg>
  );
}

export function ClubsPage() {
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "var(--font-jost)", backgroundImage: PAPER_TEX }}>

      {/* ── HERO ── */}
      <section style={{ background: CREAM, backgroundImage: PAPER_TEX, padding: "20px 20px 36px", position: "relative", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: PINK, letterSpacing: -0.5 }}>BB*</span>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: DARK, letterSpacing: 1 }}>BloomBay*</span>
          <button style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${DARK}22`, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>

        {/* Hero headline + polaroid layout */}
        <div style={{ position: "relative", minHeight: 200 }}>
          {/* Headline */}
          <div style={{ maxWidth: "60%" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 42, fontWeight: 700, lineHeight: 1.08, color: DARK }}>find your</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 42, fontWeight: 700, lineHeight: 1.08, color: PINK }}>girls. ♡</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 42, fontWeight: 700, lineHeight: 1.08, color: DARK }}>find your</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 42, fontWeight: 700, lineHeight: 1.08, color: PINK }}>people. ♡</div>
            <div style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 13, color: DARK, opacity: 0.55, marginTop: 12 }}>
              clubs for every side of you.
            </div>
          </div>

          {/* Polaroid — top right */}
          <div style={{
            position: "absolute", top: -4, right: 0,
            width: 110, background: "white",
            padding: "8px 8px 28px",
            boxShadow: "2px 4px 18px rgba(0,0,0,0.14)",
            transform: "rotate(4deg)",
            zIndex: 3,
          }}>
            <Tape />
            <div style={{
              width: "100%", height: 90,
              background: "linear-gradient(135deg,#d4a5c4 0%,#e8c8b5 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              <svg width="40" height="54" viewBox="0 0 40 54" fill="none">
                <ellipse cx="20" cy="12" rx="9" ry="10" fill="#c9906d" opacity="0.75"/>
                <path d="M8 24 Q10 20 20 20 Q30 20 32 24 L34 50 Q20 54 6 50 Z" fill="#b07856" opacity="0.6"/>
              </svg>
            </div>
            <div style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: DARK, opacity: 0.55, marginTop: 6, textAlign: "center" }}>sunday brunch ♡</div>
          </div>

          {/* Circular badge */}
          <div style={{
            position: "absolute", bottom: -22, right: 8,
            width: 72, height: 72, borderRadius: "50%",
            background: PINK,
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: "rotate(-8deg)", zIndex: 4,
            boxShadow: `0 4px 18px ${PINK}44`,
          }}>
            <span style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "white", textAlign: "center", lineHeight: 1.3, padding: "0 8px" }}>you belong here</span>
          </div>
        </div>

        {/* Handwritten note + safety pin + CTA */}
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SafetyPin />
            <span style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, opacity: 0.65 }}>your new favorite room ♡</span>
          </div>
          <Link href="/clubs/all" style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: DARK, border: `1.5px solid ${DARK}`, borderRadius: 20,
            padding: "6px 12px", textDecoration: "none", whiteSpace: "nowrap",
          }}>
            SEE ALL CLUBS →
          </Link>
        </div>
      </section>

      {/* ── FEATURED CLUBS ── */}
      <section style={{ padding: "32px 0 0" }}>
        <div style={{ padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: DARK, opacity: 0.4 }}>FEATURED CLUBS</div>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: PINK }}>tap to peek inside →</span>
        </div>

        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 28, scrollbarWidth: "none" }}>
          {FEATURED.map((club) => (
            <Link key={club.id} href={club.href} style={{ textDecoration: "none" }}>
              <div style={{
                flexShrink: 0, width: 150, background: "white",
                padding: "8px 8px 20px",
                boxShadow: "2px 4px 18px rgba(0,0,0,0.1)",
                transform: `rotate(${club.rot}deg)`,
                position: "relative",
                backgroundImage: PAPER_TEX,
                cursor: "pointer",
              }}>
                <Tape />
                <div style={{ fontSize: 10, fontWeight: 700, color: DARK, opacity: 0.4, textAlign: "center", marginBottom: 4, letterSpacing: "0.1em" }}>
                  {club.members} members
                </div>
                <div style={{ width: "100%", height: 110, background: club.grad, borderRadius: 2 }} />
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 13, color: DARK, letterSpacing: 0.5 }}>{club.name}</div>
                  <div style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 11, color: DARK, opacity: 0.6, marginTop: 4, lineHeight: 1.4 }}>{club.desc}</div>
                  <div style={{
                    marginTop: 10, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                    color: PINK, display: "flex", alignItems: "center", gap: 3,
                  }}>
                    ENTER →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TODAY'S HAPPENINGS ── */}
      <section style={{ padding: "0 20px 24px" }}>
        <div style={{
          background: "white",
          backgroundImage: PAPER_TEX,
          padding: "18px 16px 16px",
          boxShadow: "2px 4px 14px rgba(0,0,0,0.08)",
          transform: "rotate(-0.8deg)",
          position: "relative",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38, marginBottom: 14 }}>TODAY&apos;S HAPPENINGS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {HAPPENINGS.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: h.color, color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 11, flexShrink: 0,
                }}>
                  {h.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: DARK }}>{h.name}</div>
                  <div style={{ fontSize: 10, color: DARK, opacity: 0.5, fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>{h.loc} · {h.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            marginTop: 14, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            SEE FULL CALENDAR →
          </button>
        </div>
      </section>

      {/* ── NEW HERE + REAL CONNECTIONS ── */}
      <section style={{ padding: "0 20px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* NEW HERE */}
        <div style={{
          background: DARK,
          backgroundImage: PAPER_TEX,
          padding: "16px 14px",
          boxShadow: "2px 4px 14px rgba(0,0,0,0.18)",
          transform: "rotate(1.2deg)",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "white", opacity: 0.38, marginBottom: 12 }}>NEW HERE?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { n: "1.", text: "join 3 clubs ☆" },
              { n: "2.", text: "save 5 places ☆" },
              { n: "3.", text: "attend 1 gathering ✦" },
              { n: "4.", text: "introduce yourself" },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: PINK, flexShrink: 0, lineHeight: 1.3 }}>{step.n}</span>
                <span style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{step.text}</span>
              </div>
            ))}
          </div>
          <button style={{
            marginTop: 14, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            START YOUR JOURNEY →
          </button>
        </div>

        {/* REAL CONNECTIONS photo card */}
        <div style={{
          background: DARK,
          backgroundImage: PAPER_TEX,
          boxShadow: "2px 4px 14px rgba(0,0,0,0.22)",
          transform: "rotate(-1deg)",
          position: "relative",
          overflow: "hidden",
          minHeight: 200,
        }}>
          <Tape style={{ left: "35%" }} />
          <div style={{
            width: "100%", height: "100%", minHeight: 200,
            background: "linear-gradient(160deg,#2d1a1a 0%,#1a1a2d 100%)",
            display: "flex", alignItems: "flex-end", padding: "16px 14px",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0.28 }}>
              {[0, 1].map(i => (
                <svg key={i} width="36" height="68" viewBox="0 0 36 68" fill="rgba(255,255,255,0.6)">
                  <ellipse cx="18" cy="11" rx="9" ry="10"/>
                  <path d="M5 22 Q9 18 18 18 Q27 18 31 22 L33 60 Q18 64 3 60 Z"/>
                </svg>
              ))}
            </div>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "white", lineHeight: 1.35 }}>
                real connections.<br/>real life. ♡
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLUB SPOTLIGHT ── */}
      <section style={{ padding: "0 20px 28px" }}>
        <div style={{
          background: PINK,
          backgroundImage: PAPER_TEX,
          borderRadius: 4,
          padding: "18px",
          boxShadow: `0 4px 24px ${PINK}44`,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>CLUB SPOTLIGHT</div>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: "white", lineHeight: 1.4 }}>
                Museum Girls are going to The Met this weekend ♡
              </div>
              <button style={{
                marginTop: 14,
                background: DARK, color: "white",
                border: "none", borderRadius: 20,
                padding: "8px 18px",
                fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
                cursor: "pointer",
              }}>
                I&apos;M IN
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textAlign: "center", lineHeight: 1.4 }}>MEMBERS<br/>GOING</div>
              <div style={{ display: "flex" }}>
                {["A","M","J","L"].map((letter, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: ["#c9504a","#6b4fa0","#3e7c6b","#e07b39"][i],
                    border: `2px solid ${PINK}`,
                    marginLeft: i > 0 ? -8 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 10, color: "white", flexShrink: 0,
                  }}>
                    {letter}
                  </div>
                ))}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  border: `2px solid ${PINK}`,
                  marginLeft: -8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "white", flexShrink: 0,
                }}>
                  +28
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE BY VIBE ── */}
      <section style={{ padding: "0 20px 28px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38, marginBottom: 14 }}>EXPLORE CLUBS BY VIBE</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {VIBES.map(vibe => (
            <button
              key={vibe}
              onClick={() => setActiveVibe(activeVibe === vibe ? null : vibe)}
              style={{
                padding: "7px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${activeVibe === vibe ? PINK : `${DARK}28`}`,
                background: activeVibe === vibe ? PINK : "rgba(255,255,255,0.7)",
                color: activeVibe === vibe ? "white" : DARK,
                letterSpacing: "0.02em",
                transition: "all 0.15s",
              }}>
              {vibe}
            </button>
          ))}
          <button style={{
            padding: "7px 14px", borderRadius: 20,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            border: `1.5px solid ${DARK}`, background: DARK, color: "white", letterSpacing: "0.04em",
          }}>
            all vibes →
          </button>
        </div>
      </section>

      {/* ── NEAR YOU ── */}
      <section style={{ padding: "0 0 48px" }}>
        <div style={{ padding: "0 20px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38 }}>NEAR YOU</span>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: DARK, opacity: 0.65 }}>📍 SoHo, NYC</span>
        </div>

        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 16, scrollbarWidth: "none" }}>
          {NEAR_YOU.map((n, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 120, background: "white",
              padding: "8px 8px 16px",
              boxShadow: "2px 4px 14px rgba(0,0,0,0.10)",
              transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
              position: "relative",
              backgroundImage: PAPER_TEX,
            }}>
              <Tape />
              <div style={{ width: "100%", height: 80, background: n.grad, borderRadius: 2 }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 13, color: DARK }}>{n.name}</div>
                <div style={{ fontSize: 10, color: DARK, opacity: 0.45, marginTop: 3 }}>{n.clubs} clubs</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
