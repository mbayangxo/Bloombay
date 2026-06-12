"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tape, PushPin, GoldStar, SafetyPin, TornEdge, WashiTape, Polaroid } from "./scrapbook";
import { createClient } from "@/lib/supabase/client";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const BOARD = "#0E0C0A";
const CREAM = "#F6F1EB";
const PAPER = "#FEFDF8";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type RealClub = { id: string; name: string; description: string | null; primary_color: string | null; cover_url: string | null; slug: string | null };
type RealGathering = { id: string; title: string; starts_at: string; venue: string | null; neighborhood: string | null };

const ROTS = [-2, 1.5, -1, 2, -1.5, 0.5, -0.8];
const GRADS = [
  "linear-gradient(145deg,#3D0020 0%,#8B0040 60%,#C80060 100%)",
  "linear-gradient(145deg,#1A0010 0%,#5A0030 60%,#A8004C 100%)",
  "linear-gradient(145deg,#2A0018 0%,#780040 60%,#E8006A 100%)",
  "linear-gradient(145deg,#1C0012 0%,#600035 60%,#B0005A 100%)",
  "linear-gradient(145deg,#380020 0%,#980050 60%,#FF1F7D 100%)",
];

const VIBES = ["creative", "wellness", "adventure", "career", "night out", "faith", "fashion", "foodie"];

const NEAR_YOU = [
  { name: "SoHo",           clubs: 14, grad: "linear-gradient(135deg,#FF85C0,#FFB3D9)" },
  { name: "Williamsburg",   clubs: 9,  grad: "linear-gradient(135deg,#E8006A,#FF5BAD)" },
  { name: "West Village",   clubs: 11, grad: "linear-gradient(135deg,#C80060,#FF1F7D)" },
  { name: "Brooklyn Hts",   clubs: 11, grad: "linear-gradient(135deg,#FF1F7D,#FF85C0)" },
  { name: "Harlem",         clubs: 9,  grad: "linear-gradient(135deg,#A8004C,#E8006A)" },
];

export function ClubsPage() {
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  const [clubs, setClubs] = useState<RealClub[]>([]);
  const [happenings, setHappenings] = useState<RealGathering[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("clubs")
      .select("id, name, description, primary_color, cover_url, slug")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => { if (data) setClubs(data as RealClub[]); });

    const now = new Date().toISOString();
    supabase
      .from("gatherings")
      .select("id, title, starts_at, venue, neighborhood")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(5)
      .then(({ data }) => { if (data) setHappenings(data as RealGathering[]); });
  }, []);

  return (
    <div style={{ background: BOARD, minHeight: "100vh", fontFamily: "var(--font-jost)", paddingBottom: 100 }}>

      {/* ══════════ HERO — bulletin board with headline + polaroid ══════════ */}
      <section style={{ padding: "72px 18px 0", position: "relative" }}>

        {/* Board texture dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        {/* Safety pin top-left decoration */}
        <SafetyPin style={{ position: "absolute", top: 62, left: 24, transform: "rotate(-15deg)", zIndex: 4 }} />

        {/* Gold star decorations */}
        <GoldStar size={18} style={{ position: "absolute", top: 68, right: 28, zIndex: 4 }} />
        <GoldStar size={12} style={{ position: "absolute", top: 200, right: 54, zIndex: 4, opacity: 0.7 }} />

        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: 28, position: "relative", zIndex: 2 }}>

          {/* ── Left: headline paper scrap ── */}
          <div style={{ flex: 1, position: "relative" }}>
            {/* Yellow tape across top */}
            <div style={{ position: "absolute", top: -10, left: 20, zIndex: 5 }}>
              <WashiTape color="yellow" width={72} height={18} rot={-2} />
            </div>

            <div style={{
              background: PAPER,
              backgroundImage: PAPER_TEX,
              backgroundSize: "200px 200px",
              padding: "22px 16px 18px",
              boxShadow: "4px 6px 28px rgba(0,0,0,0.55)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* "SEE ALL CLUBS" pill */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <Link href="/member/clubs" style={{ textDecoration: "none" }}>
                  <div style={{ background: PINK, borderRadius: 20, padding: "6px 14px", boxShadow: "0 2px 8px rgba(255,31,125,0.4)" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "white" }}>SEE ALL CLUBS</p>
                  </div>
                </Link>
              </div>

              {/* Big headline */}
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, lineHeight: 1.0, marginBottom: 10 }}>
                <div style={{ fontSize: "clamp(38px,11vw,50px)", color: DARK }}>Clubs.</div>
              </div>

              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: DARK, opacity: 0.55, marginBottom: 0, lineHeight: 1.4 }}>
                clubs for every side of you.
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 14, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                {[["500+", "clubs"], ["12K+", "members"], ["48", "cities"]].map(([n, l]) => (
                  <div key={l}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, fontWeight: 900, color: PINK, lineHeight: 1 }}>{n}</p>
                    <p style={{ fontSize: 7, fontWeight: 700, color: "rgba(0,0,0,0.35)", letterSpacing: "0.12em", marginTop: 2 }}>{l.toUpperCase()}</p>
                  </div>
                ))}
              </div>

              <TornEdge color={BOARD} height={12} style={{ marginLeft: -16, marginRight: -16, marginBottom: -1 }} />
            </div>
          </div>

          {/* ── Right: polaroid photo + bubble ── */}
          <div style={{ flexShrink: 0, position: "relative", marginTop: 12 }}>
            {/* Push pin on polaroid */}
            <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 6 }}>
              <PushPin color="pink" size={14} />
            </div>

            {/* Polaroid */}
            <div style={{
              background: "white",
              padding: "7px 7px 26px",
              width: 110,
              boxShadow: "4px 8px 24px rgba(0,0,0,0.6)",
              transform: "rotate(3.5deg)",
              position: "relative",
            }}>
              <div style={{
                width: "100%",
                height: 96,
                background: "linear-gradient(145deg,#3D0020,#C80060,#FF5BAD)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 40, opacity: 0.7 }}>🌸</span>
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4, lineHeight: 1.2 }}>
                your new favorite<br/>room ♡
              </p>
            </div>

            {/* "you belong here" bubble */}
            <div style={{
              position: "absolute",
              bottom: -18,
              right: -14,
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${PINK},#FF5BAD)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 16px ${PINK}66`,
              zIndex: 5,
            }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "white", textAlign: "center", lineHeight: 1.3, padding: "0 4px" }}>
                you<br/>belong<br/>here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED CLUBS — polaroid scroll ══════════ */}
      <section style={{ padding: "0 0 4px" }}>
        {/* Section label on board */}
        <div style={{ padding: "4px 18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PINK, boxShadow: `0 0 8px ${PINK}` }} />
            <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)" }}>FEATURED CLUBS</p>
          </div>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,31,125,0.8)" }}>tap to peek inside →</span>
        </div>

        <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingLeft: 18, paddingRight: 18, paddingBottom: 36, scrollbarWidth: "none" as const }}>
          {clubs.length === 0 && (
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.35)", padding: "20px 0" }}>Clubs loading…</p>
          )}
          {clubs.map((club, idx) => {
            const href = club.slug ? `/member/clubs/${club.slug}` : `/member/clubs/${club.id}`;
            const rot = ROTS[idx % ROTS.length];
            const grad = club.primary_color
              ? `linear-gradient(145deg, ${club.primary_color}44 0%, ${club.primary_color} 100%)`
              : GRADS[idx % GRADS.length];
            return (
              <Link key={club.id} href={href} style={{ textDecoration: "none", flexShrink: 0, position: "relative" }}>
                {idx % 2 === 0 ? (
                  <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(-1deg)", zIndex: 5 }}>
                    <WashiTape color={idx === 1 ? "pink" : "yellow"} width={54} height={16} />
                  </div>
                ) : (
                  <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
                    <PushPin color="pink" size={13} />
                  </div>
                )}
                <div style={{
                  width: 140,
                  background: "white",
                  backgroundImage: PAPER_TEX,
                  backgroundSize: "200px 200px",
                  padding: "8px 8px 16px",
                  boxShadow: "3px 6px 22px rgba(0,0,0,0.55)",
                  transform: `rotate(${rot}deg)`,
                  position: "relative",
                  marginTop: Math.abs(rot) > 1.5 ? 8 : 4,
                }}>
                  <div style={{ width: "100%", height: 108, background: grad, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "0 6px 6px", overflow: "hidden", position: "relative" }}>
                    {club.cover_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={club.cover_url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 12, color: DARK, lineHeight: 1.2 }}>{club.name.toUpperCase()}</p>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: DARK, opacity: 0.5, marginTop: 4, lineHeight: 1.4 }}>
                      {club.description ? club.description.slice(0, 60) + (club.description.length > 60 ? "…" : "") : ""}
                    </p>
                    <p style={{ marginTop: 10, fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: PINK }}>JOIN →</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════ TODAY'S HAPPENINGS + NEW HERE ══════════ */}
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
            boxShadow: "3px 5px 22px rgba(0,0,0,0.5)",
            transform: "rotate(-0.8deg)",
            position: "relative",
            overflow: "hidden",
          }}>
            <p style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.22em", color: DARK, opacity: 0.35, marginBottom: 12 }}>UPCOMING</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {happenings.length === 0 && (
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: DARK, opacity: 0.4 }}>Check back soon.</p>
              )}
              {happenings.map((h, i) => {
                const d = new Date(h.starts_at);
                const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                const initial = h.title[0]?.toUpperCase() ?? "✦";
                const avatarColor = [PINK, "#E8006A", "#C80060", "#FF5BAD", "#A8004C"][i % 5];
                return (
                  <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: avatarColor, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                      {initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 10, color: DARK, lineHeight: 1.2 }}>{h.title}</p>
                      <p style={{ fontSize: 9, color: DARK, opacity: 0.45, fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                        {[h.venue || h.neighborhood, timeStr].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button style={{ marginTop: 12, marginBottom: 10, fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              SEE FULL CALENDAR →
            </button>
            <TornEdge color={BOARD} height={14} style={{ marginLeft: -14, marginRight: -14 }} />
          </div>
        </div>

        {/* NEW HERE — bright cream card */}
        <div style={{
          background: "#FFF8F0",
          backgroundImage: PAPER_TEX,
          backgroundSize: "200px 200px",
          padding: "18px 14px",
          boxShadow: "3px 5px 22px rgba(0,0,0,0.5)",
          transform: "rotate(1.2deg)",
          position: "relative",
        }}>
          <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 12 }}>NEW HERE?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { n: "1.", text: "join 3 clubs ☆" },
              { n: "2.", text: "save 5 places ☆" },
              { n: "3.", text: "attend 1 gathering ✦" },
              { n: "4.", text: "introduce yourself" },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: PINK, flexShrink: 0, lineHeight: 1.3 }}>{step.n}</span>
                <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 10, color: DARK, opacity: 0.7, lineHeight: 1.4 }}>{step.text}</span>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 14, fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: PINK, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            START YOUR JOURNEY →
          </button>
        </div>
      </section>

      {/* ══════════ CLUB SPOTLIGHT ══════════ */}
      <section style={{ padding: "0 18px 28px" }}>
        <div style={{ position: "relative" }}>
          {/* Tape on spotlight */}
          <div style={{ position: "absolute", top: -10, left: 24, zIndex: 5 }}>
            <WashiTape color="mint" width={48} height={18} rot={-2} />
          </div>

          <div style={{
            background: PINK,
            backgroundImage: PAPER_TEX,
            backgroundSize: "200px 200px",
            padding: "20px 18px",
            boxShadow: `0 6px 32px ${PINK}55, 3px 5px 20px rgba(0,0,0,0.4)`,
            transform: "rotate(-0.3deg)",
            position: "relative",
          }}>
            {/* Torn top edge */}
            <TornEdge color="transparent" height={8} style={{ position: "absolute", top: 0, left: 0, right: 0, transform: "scaleY(-1)" }} />

            <p style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: 10 }}>CLUB SPOTLIGHT</p>

            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "white", lineHeight: 1.4 }}>
                  Museum Girls are going to The Met this weekend ♡
                </p>
                <button style={{ marginTop: 14, background: DARK, color: "white", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", cursor: "pointer" }}>
                  I&apos;M IN
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 6 }}>
                <p style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textAlign: "center", lineHeight: 1.4 }}>MEMBERS<br />GOING</p>
                {/* Avatar stack */}
                <div style={{ display: "flex" }}>
                  {["A","M","J","L"].map((letter, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: ["#C80060","#A8004C","#E8006A","#FF5BAD"][i], border: `2px solid ${PINK}`, marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, color: "white", flexShrink: 0 }}>
                      {letter}
                    </div>
                  ))}
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: `2px solid ${PINK}`, marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white", flexShrink: 0 }}>+28</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ EXPLORE BY VIBE ══════════ */}
      <section style={{ padding: "0 18px 32px" }}>
        {/* Paper scrap for vibes section */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: -10, right: 20, zIndex: 5 }}>
            <WashiTape color="pink" width={56} height={16} rot={2} />
          </div>

          <div style={{
            background: CREAM,
            backgroundImage: PAPER_TEX,
            backgroundSize: "200px 200px",
            padding: "20px 16px 18px",
            boxShadow: "3px 6px 24px rgba(0,0,0,0.5)",
            transform: "rotate(0.4deg)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: DARK, opacity: 0.5 }}>EXPLORE CLUBS BY VIBE</p>
              <GoldStar size={14} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {VIBES.map(vibe => (
                <button key={vibe} onClick={() => setActiveVibe(activeVibe === vibe ? null : vibe)} style={{
                  padding: "6px 14px", borderRadius: 20,
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                  border: `1.5px solid ${activeVibe === vibe ? PINK : "rgba(255,31,125,0.3)"}`,
                  background: activeVibe === vibe ? PINK : "rgba(255,31,125,0.06)",
                  color: activeVibe === vibe ? "white" : PINK,
                  transition: "all 0.15s",
                }}>
                  {vibe}
                </button>
              ))}
              <button style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${PINK}`, background: PINK, color: "white" }}>
                all vibes →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ NEAR YOU — polaroid neighbourhood cards ══════════ */}
      <section style={{ padding: "0 0 60px" }}>
        <div style={{ padding: "0 18px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, boxShadow: `0 0 8px ${PINK}` }} />
          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)" }}>NEAR YOU</span>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,105,180,0.8)" }}>📍 SoHo, NYC</span>
        </div>

        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingLeft: 18, paddingRight: 18, paddingBottom: 16, scrollbarWidth: "none" as const }}>
          {NEAR_YOU.map((n, i) => {
            const rots = [-2.5, 1.8, -1.2, 2.2, -1.5];
            return (
              <div key={i} style={{ flexShrink: 0, position: "relative" }}>
                {/* Pin on each card */}
                <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
                  <PushPin color="pink" size={11} />
                </div>

                <div style={{
                  width: 106,
                  background: "white",
                  backgroundImage: PAPER_TEX,
                  backgroundSize: "200px 200px",
                  padding: "7px 7px 18px",
                  boxShadow: "3px 6px 20px rgba(0,0,0,0.55)",
                  transform: `rotate(${rots[i]}deg)`,
                  marginTop: 8,
                }}>
                  <div style={{ width: "100%", height: 72, background: n.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.3 }}>{n.name}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 5 }}>{n.name}</p>
                  <p style={{ fontSize: 8, color: "rgba(0,0,0,0.3)", textAlign: "center", marginTop: 2 }}>{n.clubs} clubs</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
