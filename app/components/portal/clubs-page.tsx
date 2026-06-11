"use client";

import { useState } from "react";
import Link from "next/link";
import { Tape, PushPin, GoldStar, SafetyPin, TornEdge, WashiTape } from "./scrapbook";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const BOARD = "#0E0C0A";
const CREAM = "#F6F1EB";
const PAPER = "#FEFDF8";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const FEATURED = [
  { id: 1, name: "SUPPER CLUB",    members: "1.2K", desc: "long dinners, new friends, good wine.", grad: "linear-gradient(135deg,#c9504a 0%,#7a1c2e 100%)", rot: -2,   href: "/member/clubs/11111111-1111-1111-1111-111111111111" },
  { id: 2, name: "RUN CLUB",       members: "842",  desc: "saturday runs, coffee, girl talk.",     grad: "linear-gradient(135deg,#e07b39 0%,#8b3a0f 100%)", rot: 1.5,  href: "/member/clubs/55555555-5555-5555-5555-555555555555" },
  { id: 3, name: "MUSEUM GIRLS",   members: "1.6K", desc: "art, culture & pretty exhibits.",       grad: "linear-gradient(135deg,#6b4fa0 0%,#2d1a5e 100%)", rot: -1,   href: "/member/clubs/22222222-2222-2222-2222-222222222222" },
  { id: 4, name: "BOOK GIRLS",     members: "1.1K", desc: "pages, pastries & deep conversations.", grad: "linear-gradient(135deg,#3e7c6b 0%,#1a3d31 100%)", rot: 2,    href: "/member/clubs/33333333-3333-3333-3333-333333333333" },
  { id: 5, name: "SOFT LIFE CLUB", members: "723",  desc: "romance, rituals & soft girl energy.",  grad: "linear-gradient(135deg,#c96b9e 0%,#7a2250 100%)", rot: -1.5, href: "/member/clubs/44444444-4444-4444-4444-444444444444" },
];

const HAPPENINGS = [
  { avatar: "S", color: "#FF1F7D", name: "Sunset Picnic",         loc: "Prospect Park",  time: "6PM"  },
  { avatar: "G", color: "#A855F7", name: "Gallery Night Out",     loc: "Chelsea",        time: "7PM"  },
  { avatar: "P", color: "#0EA5E9", name: "Pilates & Prosecco",    loc: "SoHo",           time: "11AM" },
  { avatar: "W", color: "#F59E0B", name: "Wine Down Wednesday",   loc: "West Village",   time: "8PM"  },
  { avatar: "M", color: "#4ADE80", name: "Matcha & Mimosas",      loc: "Williamsburg",   time: "12PM" },
];

const VIBES = ["creative", "wellness", "adventure", "career", "night out", "faith", "fashion", "foodie"];

const NEAR_YOU = [
  { name: "SoHo",         clubs: 14, pastel: "linear-gradient(135deg,#FFD6E7,#FBBFD0)" },
  { name: "Williamsburg", clubs: 9,  pastel: "linear-gradient(135deg,#E8D5F5,#D4B8ED)" },
  { name: "West Village", clubs: 11, pastel: "linear-gradient(135deg,#C8EDE4,#A8DDCF)" },
  { name: "Prospect Park", clubs: 6, pastel: "linear-gradient(135deg,#FDEAC8,#FAD79A)" },
  { name: "Astoria",      clubs: 8,  pastel: "linear-gradient(135deg,#FFD6EC,#F9BFDE)" },
];

export function ClubsPage() {
  const [activeVibe, setActiveVibe] = useState<string | null>(null);

  return (
    <div style={{
      background: "linear-gradient(160deg, #FFF0F8 0%, #FFF5EC 50%, #FEF0F8 100%)",
      minHeight: "100vh",
      fontFamily: "var(--font-jost)",
      paddingBottom: 100,
    }}>

      {/* ── COMPACT HERO HEADER CARD ── */}
      <section style={{ padding: "68px 18px 20px" }}>
        <div style={{
          background: "linear-gradient(135deg, #1A0010 0%, #3A0026 40%, #CC006B 80%, #FF1F7D 100%)",
          borderRadius: 20,
          padding: "22px 20px 20px",
          boxShadow: "0 8px 36px rgba(255,31,125,0.4), 0 2px 0 rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          {/* Stats row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            {[["500+", "clubs"], ["12K+", "members"], ["48", "cities"]].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, fontWeight: 900, color: "white", lineHeight: 1 }}>{n}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em" }}>{l.toUpperCase()}</p>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 14 }} />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "white", lineHeight: 1.0 }}>
                Clubs.
              </div>
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                find your girls. clubs for every side of you.
              </div>
            </div>
            <Link href="/member/clubs" style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
              color: "#1A0010",
              background: "white",
              borderRadius: 20,
              padding: "9px 16px",
              textDecoration: "none",
              flexShrink: 0,
              boxShadow: "0 2px 0 rgba(0,0,0,0.3)",
            }}>
              browse all →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED CLUBS ── */}
      <section style={{ padding: "8px 0 0" }}>
        <div style={{ padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: PINK }}>FEATURED CLUBS</div>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: PINK }}>tap to peek inside →</span>
        </div>

        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingLeft: 18, paddingRight: 18, paddingBottom: 32, scrollbarWidth: "none" }}>
          {FEATURED.map((club) => (
            <Link key={club.id} href={club.href} style={{ textDecoration: "none" }}>
              <div style={{
                flexShrink: 0,
                width: 148,
                background: "white",
                backgroundImage: PAPER_TEX,
                backgroundSize: "200px 200px",
                padding: "8px 8px 22px",
                boxShadow: "0 2px 16px rgba(255,31,125,0.12), 0 1px 4px rgba(0,0,0,0.06)",
                border: "1.5px solid rgba(255,31,125,0.18)",
                borderRadius: 4,
                position: "relative",
                cursor: "pointer",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: DARK, opacity: 0.35, textAlign: "center", marginBottom: 5, letterSpacing: "0.1em" }}>
                  {club.members} members
                </div>
                <div style={{ width: "100%", height: 110, background: club.grad, borderRadius: 2 }} />
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 13, color: DARK }}>{club.name}</div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: DARK, opacity: 0.55, marginTop: 4, lineHeight: 1.4 }}>{club.desc}</div>
                  <div style={{ marginTop: 10, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: PINK }}>JOIN →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TODAY'S HAPPENINGS + NEW HERE — side by side ── */}
      <section style={{ padding: "0 18px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* TODAY'S HAPPENINGS — paper scrap */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%) rotate(-2deg)", zIndex: 5 }}>
            <WashiTape color="yellow" width={80} height={18} />
          </div>
          <div style={{
            backgroundImage: PAPER_TEX,
            backgroundColor: PAPER,
            backgroundSize: "200px 200px",
            padding: "20px 14px 0",
            boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
            border: "1px solid rgba(0,0,0,0.05)",
            transform: "rotate(-0.8deg)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.35, marginBottom: 12 }}>TODAY&apos;S HAPPENINGS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {HAPPENINGS.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: h.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                    {h.avatar}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: DARK, lineHeight: 1.2 }}>{h.name}</div>
                    <div style={{ fontSize: 9, color: DARK, opacity: 0.45, fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{h.loc} · {h.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 12, marginBottom: 10, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              SEE FULL CALENDAR →
            </button>
            <TornEdge color="#FFF0F8" height={14} style={{ marginLeft: -14, marginRight: -14 }} />
          </div>
        </div>

        {/* NEW HERE — bright cream card */}
        <div style={{
          background: "#FFF8F0",
          backgroundImage: PAPER_TEX,
          backgroundSize: "200px 200px",
          padding: "18px 14px",
          boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
          border: "1px solid rgba(255,31,125,0.12)",
          borderRadius: 4,
          transform: "rotate(1.2deg)",
          position: "relative",
        }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: PINK, marginBottom: 12 }}>NEW HERE?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { n: "1.", text: "join 3 clubs ☆" },
              { n: "2.", text: "save 5 places ☆" },
              { n: "3.", text: "attend 1 gathering ✦" },
              { n: "4.", text: "introduce yourself" },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: PINK, flexShrink: 0, lineHeight: 1.3 }}>{step.n}</span>
                <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: DARK, opacity: 0.7, lineHeight: 1.4 }}>{step.text}</span>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 14, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            START YOUR JOURNEY →
          </button>
        </div>
      </section>

      {/* ── CLUB SPOTLIGHT — full-width pink paper ── */}
      <section style={{ padding: "0 18px 28px" }}>
        <div style={{
          background: PINK,
          backgroundImage: PAPER_TEX,
          backgroundSize: "200px 200px",
          padding: "20px 18px",
          boxShadow: `0 6px 28px ${PINK}55`,
          transform: "rotate(-0.3deg)",
          position: "relative",
          borderRadius: 4,
        }}>
          <div style={{ position: "absolute", top: -10, left: 20, zIndex: 4 }}>
            <WashiTape color="mint" width={48} height={18} rot={-2} />
          </div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: 10 }}>CLUB SPOTLIGHT</div>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 17, color: "white", lineHeight: 1.4 }}>
                Museum Girls are going to The Met this weekend ♡
              </div>
              <button style={{ marginTop: 14, background: DARK, color: "white", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", cursor: "pointer" }}>
                I&apos;M IN
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 6 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textAlign: "center", lineHeight: 1.4 }}>MEMBERS<br />GOING</div>
              <div style={{ display: "flex" }}>
                {["A","M","J","L"].map((letter, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: ["#c9504a","#6b4fa0","#3e7c6b","#e07b39"][i], border: `2px solid ${PINK}`, marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, color: "white", flexShrink: 0 }}>
                    {letter}
                  </div>
                ))}
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: `2px solid ${PINK}`, marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white", flexShrink: 0 }}>+28</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE BY VIBE ── */}
      <section style={{ padding: "0 18px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: PINK }}>EXPLORE CLUBS BY VIBE</div>
          <GoldStar size={14} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {VIBES.map(vibe => (
            <button
              key={vibe}
              onClick={() => setActiveVibe(activeVibe === vibe ? null : vibe)}
              style={{
                padding: "7px 16px", borderRadius: 20,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${activeVibe === vibe ? PINK : "rgba(255,31,125,0.3)"}`,
                background: activeVibe === vibe ? PINK : "rgba(255,31,125,0.05)",
                color: activeVibe === vibe ? "white" : PINK,
                letterSpacing: "0.02em",
                transition: "all 0.15s",
              }}>
              {vibe}
            </button>
          ))}
          <button style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1.5px solid rgba(255,31,125,0.45)", background: "rgba(255,31,125,0.08)", color: PINK, letterSpacing: "0.04em" }}>
            all vibes →
          </button>
        </div>
      </section>

      {/* ── NEAR YOU ── */}
      <section style={{ padding: "0 0 48px" }}>
        <div style={{ padding: "0 18px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: PINK }}>NEAR YOU</span>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: PINK }}>📍 SoHo, NYC</span>
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingLeft: 18, paddingRight: 18, paddingBottom: 16, scrollbarWidth: "none" as const }}>
          {NEAR_YOU.map((n, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 116,
              background: "white",
              border: "1.5px solid rgba(255,31,125,0.14)",
              borderRadius: 10,
              padding: "8px 8px 14px",
              boxShadow: "0 2px 12px rgba(255,31,125,0.08), 0 1px 3px rgba(0,0,0,0.04)",
              position: "relative",
            }}>
              <div style={{ width: "100%", height: 76, background: n.pastel, borderRadius: 6 }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 12, color: DARK }}>{n.name}</div>
                <div style={{ fontSize: 9, color: DARK, opacity: 0.4, marginTop: 2 }}>{n.clubs} clubs</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
